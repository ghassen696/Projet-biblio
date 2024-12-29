import csv
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client['IHEC_Biblio']  # Replace with your MongoDB database name
collection = db['Ressources']  # The collection name in MongoDB

# Function to replace dots in field names
def clean_keys(document):
    # Replace dots in keys with underscores (or another character you prefer)
    return {key.replace('.', '_'): value for key, value in document.items()}

# Read the CSV file and insert data into MongoDB
with open('Cleaned_Ressources_IHEC.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Clean the keys before inserting into MongoDB
        clean_row = clean_keys(row)
        collection.insert_one(clean_row)

print("Data import successful!")
