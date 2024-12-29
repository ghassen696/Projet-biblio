from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from bson import ObjectId

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client['Biblio']
collection = db['IHEC_Biblio']

class LibraryResourcesAPI(APIView):
    def get(self, request):
        query = {}
        titre = request.GET.get('titre')
        auteur = request.GET.get('auteur')
        isbn_a = request.GET.get('isbn_a')
        item_class = request.GET.get('item_class')
        editeur = request.GET.get('editeur')
        date_edition = request.GET.get('date_edition')  # New filter
        sort = request.GET.get('sort')

        # Apply filters
        if titre:
            query['Titre'] = {'$regex': titre, '$options': 'i'}
        if auteur:
            query['Auteur'] = {'$regex': auteur, '$options': 'i'}
        if isbn_a:
            query['ISBN-A'] = {'$regex': isbn_a, '$options': 'i'}
        if item_class:
            query['Item class'] = {'$regex': item_class, '$options': 'i'}
        if editeur:
            query['Editeur'] = {'$regex': editeur, '$options': 'i'}
        if date_edition:
            try:
                query['Date edition'] = int(date_edition)  # Ensure year is an integer
            except ValueError:
                return Response({"error": "Invalid format for date_edition, expected a year."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch resources
        resources = collection.find(query)

        # Sorting
        if sort == 'asc':
            resources = resources.sort('D.CREATION', 1)  # Adjust for nested field
        elif sort == 'desc':
            resources = resources.sort('D.CREATION', -1)

        # Pagination
        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 12))
            if page < 1 or page_size < 1:
                raise ValueError
        except ValueError:
            return Response({"error": "Invalid page or page_size parameter."}, status=status.HTTP_400_BAD_REQUEST)

        start = (page - 1) * page_size
        end = start + page_size

        resources_list = list(resources)
        for resource in resources_list:
            resource['_id'] = str(resource['_id'])  # Convert ObjectId to string
            if 'Code barre' not in resource:
                resource['Code barre'] = None

        # Handle edge case where pagination goes beyond available results
        paginated_resources = resources_list[start:end]
        if not paginated_resources:
            return Response({"error": "No resources found for the requested page."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "count": len(resources_list),
            "page": page,
            "page_size": page_size,
            "results": paginated_resources
        })



class LibraryResourceDetailAPI(APIView):
    def get(self, request, pk):
        try:
            # Search for the resource by ITEMID instead of _id
            resource = collection.find_one({"ITEMID": int(pk)})  # Assuming ITEMID is an integer
            if resource:
                # Convert _id to string to return in the response
                resource['_id'] = str(resource['_id'])
                return Response(resource, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Resource not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
