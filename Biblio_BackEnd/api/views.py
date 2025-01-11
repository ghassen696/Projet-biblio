from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
from rest_framework.response import Response
from rest_framework import status
# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client['Biblio']
collection = db['IHEC_Biblio']
reservations_collection = db['UserReservations']


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
            
class UpdateResourceAPI(APIView):
    def put(self, request, pk):
        try:
            # Find resource by ITEMID
            resource = collection.find_one({"ITEMID": int(pk)})
            if not resource:
                return Response({"error": "Resource not found"}, status=status.HTTP_404_NOT_FOUND)

            update_data = request.data

            # Remove the _id field from the update data to avoid modifying the immutable field
            if '_id' in update_data:
                del update_data['_id']

            # Update the resource in the collection
            collection.update_one({"ITEMID": int(pk)}, {"$set": update_data})
            
            return Response({"message": "Resource updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class GetReservationsAPI(APIView):
    def get(self, request, pk):
        try:
            # Search for the resource by ITEMID instead of _id
            resource= reservations_collection.find_one({"ITEMID": int(pk)})  # Assuming ITEMID is an integer
            if resource:
                resource['_id'] = str(resource['_id'])
                return Response(resource, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Resource not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReservationsAPI(APIView):
    def get(self, request, ITEMID):
        # Ensure ITEMID is passed correctly as a path parameter
        query = {"ITEMID": int(ITEMID)}
        
        # Extract filters from query parameters
        user_id = request.GET.get('user_id')
        start_datetime = request.GET.get('start_datetime')
        end_datetime = request.GET.get('end_datetime')
        sort = request.GET.get('sort', 'asc')
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))

        # Apply filters for user_id
        if user_id:
            query['user_id'] = {'$regex': user_id, '$options': 'i'}

        # Apply date range filters if provided
        if start_datetime:
            try:
                # Parse start_datetime into a datetime object
                start_datetime = datetime.strptime(start_datetime, '%Y-%m-%d')
                
                # Set the time to midnight (00:00:00) for the exact date comparison
                start_datetime = start_datetime.replace(hour=0, minute=0, second=0, microsecond=0)
                
                # Calculate the end of the day (11:59:59) to use it in the query
                end_datetime = start_datetime + timedelta(days=1)  # Next day
                
                # Adjust query to match only the exact date range for start_datetime
                query['start_datetime'] = {'$gte': start_datetime, '$lt': end_datetime}
    
            except ValueError:
                return Response({"error": "Invalid datetime format. Expected YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Sorting by start_datetime
        if sort == 'asc':
            reservations_cursor = reservations_collection.find(query).sort("start_datetime", 1)
        elif sort == 'desc':
            reservations_cursor = reservations_collection.find(query).sort("start_datetime", -1)
        else:
            # Default sorting (ascending by start_datetime)
            reservations_cursor = reservations_collection.find(query).sort("start_datetime", 1)

        # Pagination logic
        skip = (page - 1) * page_size
        reservations_cursor = reservations_cursor.skip(skip).limit(page_size)

        # Convert cursor to list
        reservations_list = list(reservations_cursor)

        # Convert ObjectId to string for all items in the list
        for reservation in reservations_list:
            reservation['_id'] = str(reservation['_id'])

        # If no results were found, return a 404 error
        if not reservations_list:
            return Response({"error": "No reservations found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "count": reservations_collection.count_documents(query),
            "page": page,
            "page_size": page_size,
            "results": reservations_list
        })
class add_resource(APIView):
    def post(self, request):
        # Extract the data from the request
        resource_data = request.data

        try:
            # Insert the new resource into the MongoDB collection
            result = collection.insert_one(resource_data)
            return Response({"message": "Resource added successfully", "id": str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)