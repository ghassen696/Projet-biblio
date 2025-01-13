from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
from pydantic import BaseModel, ValidationError
from typing import List
import csv
import io
# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client['Biblio']
collection = db['IHEC_Biblio']
reservations_collection = db['UserReservations']
users_collection = db['users']  # Replace with your collection name


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

from datetime import datetime

class AddReservationAPI(APIView):
    def post(self, request, ITEMID):
        try:
            user_id = request.data.get("user_id")
            start_datetime = request.data.get("start_datetime")
            end_datetime = request.data.get("end_datetime")

            # Validate inputs
            if not user_id or not start_datetime or not end_datetime:
                return Response({"error": "All fields are required (user_id, start_datetime, end_datetime)."}, 
                                status=status.HTTP_400_BAD_REQUEST)

            start_datetime = datetime.fromisoformat(start_datetime)
            end_datetime = datetime.fromisoformat(end_datetime)

            if start_datetime >= end_datetime:
                return Response({"error": "start_datetime must be before end_datetime."}, 
                                status=status.HTTP_400_BAD_REQUEST)

            # Check for reservation conflicts
            conflict = reservations_collection.find_one({
                "ITEMID": ITEMID,
                "status": "reserved",
                "$or": [
                    {"start_datetime": {"$lt": end_datetime, "$gte": start_datetime}},
                    {"end_datetime": {"$gt": start_datetime, "$lte": end_datetime}},
                    {"start_datetime": {"$lte": start_datetime}, "end_datetime": {"$gte": end_datetime}}
                ]
            })

            if conflict:
                return Response({"error": "The resource is already reserved during this time."}, 
                                status=status.HTTP_409_CONFLICT)

            # Create reservation
            reservation = {
                "user_id": user_id,
                "ITEMID": ITEMID,
                "start_datetime": start_datetime,
                "end_datetime": end_datetime,
                "status": "reserved"
            }
            result = reservations_collection.insert_one(reservation)

            return Response({"message": "Reservation created successfully.", "id": str(result.inserted_id)}, 
                            status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from typing import Optional

# Pydantic model for validation (adjust the fields as per your schema)
class ResourceModel(BaseModel):
    BIBID: str
    ITEMID: str
    Code_barre: Optional[str] = None
    D_CREATION: Optional[str] = None
    D_MODIF: Optional[str] = None
    Cote: Optional[str] = None
    Inventaire: Optional[str] = None
    Titre: Optional[str] = None
    Auteur: Optional[str] = None
    Staff_Note: Optional[str] = None
    ISBN_A: Optional[str] = None
    Item_class: Optional[str] = None
    Nb_Page: Optional[str] = None
    Date_edition: Optional[str] = None
    Editeur: Optional[str] = None
    Prix: Optional[str] = None

class AddResourcesBulk(APIView):
    def post(self, request):
        # Check if file is part of request
        if 'file' not in request.FILES:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        csv_file = request.FILES['file']
        
        # Parse CSV file content
        try:
            csv_content = csv_file.read().decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(csv_content))
            resources = list(csv_reader)
            print(f"CSV Parsed Content: {resources}")  # Log parsed content for debugging
        except Exception as e:
            return Response({"error": f"CSV parsing error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and process resources
        valid_resources = []
        errors = []

        for i, resource in enumerate(resources):
            # Use Pydantic's validation to handle optional fields
            try:
                # Replace empty fields with None, so Pydantic can handle them correctly
                cleaned_resource = {k: (v if v != '' else None) for k, v in resource.items()}
                valid_resource = ResourceModel(**cleaned_resource).dict()
                valid_resources.append(valid_resource)
            except ValidationError as e:
                errors.append({"row": i + 1, "error": e.errors()})
        
        if errors:
            print(f"Validation Errors: {errors}")  # Log errors for debugging

        # Insert valid resources into the database
        if valid_resources:
            try:
                result = collection.insert_many(valid_resources)
                print(f"Insert Result: {result.inserted_ids}")  # Log inserted IDs for debugging
            except Exception as e:
                return Response({"error": f"Database insertion failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {
                "message": "Bulk upload completed.",
                "success": len(valid_resources),
                "errors": errors,
            },
            status=status.HTTP_201_CREATED,
        )

class UsersAPI(APIView):
    def get(self, request):
        query = {}
        name = request.GET.get('name')
    

        # Apply search filter
        if name:
            query['name'] = {'$regex': name, '$options': 'i'}

        # Fetch users with projection for name, email, and role
        users = users_collection.find(query, {'name': 1, 'email': 1, 'role': 1, '_id': 1})

        # Pagination
        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 10))
            if page < 1 or page_size < 1:
                raise ValueError
        except ValueError:
            return Response({"error": "Invalid page or page_size parameter."}, status=status.HTTP_400_BAD_REQUEST)

        start = (page - 1) * page_size
        end = start + page_size

        users_list = list(users)
        for user in users_list:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string

        # Handle edge case where pagination goes beyond available results
        paginated_users = users_list[start:end]
        if not paginated_users:
            return Response({"error": "No users found for the requested page."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "count": len(users_list),
            "page": page,
            "page_size": page_size,
            "results": paginated_users
        })
