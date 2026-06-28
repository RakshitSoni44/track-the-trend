# Day 3: Cloud Database Integration
# Goal: Connect to MongoDB Atlas and push our Pandas DataFrame to the cloud.

import os
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne
import pandas as pd

# We import the function from Day 2 to generate fresh data
from analyzer import analyze_trends

def upload_to_mongodb(df):
    """
    Connects to MongoDB Atlas and uploads the Pandas DataFrame.
    """
    # 1. Load Environment Variables from the .env file
    # This prevents your password from being hardcoded in the script.
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI")

    if not mongo_uri:
        print("Error: MONGO_URI not found. Did you create the .env file?")
        return

    try:
        # 2. Establish the Database Connection
        print("Connecting to MongoDB Atlas...")
        client = MongoClient(mongo_uri)
        
        # Test the connection
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")

        # 3. Select Database and Collection
        # If these don't exist, MongoDB will create them automatically!
        db = client["trend_tracker_db"]       # The database name
        collection = db["daily_trends"]   # The table/collection name

        # 4. Transform Pandas DataFrame into a list of Dictionaries
        # MongoDB stores data as BSON/JSON, which is exactly what a Python Dict is.
        # 'records' orientation turns each row into a dictionary.
        records = df.to_dict(orient="records")

        # 5. Insert Data (UPDATED TO PREVENT DUPLICATES)
        print(f"Preparing to process {len(records)} records...")
        
        # Create a list of "Upsert" operations
        operations = []
        for record in records:
            # Safely grab the text (handling your previous 'original_text' modification)
            text_key = "original_text" if "original_text" in record else "text"
            
            operations.append(
                UpdateOne(
                    {text_key: record[text_key]}, # The unique identifier to look for
                    {"$set": record},             # The data to update/insert
                    upsert=True                   # Insert it if it doesn't exist!
                )
            )
            
        # Execute all operations at once (highly efficient)
        result = collection.bulk_write(operations)
        
        print(f"Success! Inserted {result.upserted_count} new trends and updated {result.modified_count} existing ones.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Always close the connection when done
        client.close()
        print("Database connection closed.")

if __name__ == "__main__":
    # Run the pipeline sequentially!
    print("--- Starting Pipeline ---")
    
    # 1. Scrape & Analyze (from Day 2)
    trends_df = analyze_trends()
    
    # 2. Upload to MongoDB (Day 3)
    if not trends_df.empty:
        upload_to_mongodb(trends_df)
    else:
        print("No data extracted, skipping database upload.")