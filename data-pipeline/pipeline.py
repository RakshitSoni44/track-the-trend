# Day 4: Pipeline Consolidation
# Goal: Create a master orchestrator for our ETL (Extract, Transform, Load) process.

import time

# Import our custom modules
from analyzer import analyze_trends
from database import upload_to_mongodb

def run_etl_pipeline():
    """
    The master function that orchestrates the entire data pipeline.
    """
    print("========================================")
    print("🚀 STARTING MICRO-NICHE ETL PIPELINE 🚀")
    print("========================================\n")
    
    start_time = time.time()

    try:
        # STEP 1 & 2: EXTRACT & TRANSFORM
        print(">>> STEP 1 & 2: Extracting and Analyzing Data...")
        # analyze_trends() implicitly calls our Playwright scraper, 
        # cleans the text, runs VADER, and returns a Pandas DataFrame.
        trends_df = analyze_trends()
        
        if trends_df.empty:
            print("⚠️ No data was extracted. Aborting pipeline.")
            return

        # STEP 3: LOAD
        print("\n>>> STEP 3: Loading Data to MongoDB...")
        # Pass the DataFrame to our database module
        upload_to_mongodb(trends_df)

    except Exception as e:
        print(f"\n❌ PIPELINE FAILED: A critical error occurred:\n{e}")
        
    finally:
        # Calculate execution time
        end_time = time.time()
        elapsed_time = round(end_time - start_time, 2)
        print("\n========================================")
        print(f"✅ PIPELINE COMPLETED IN {elapsed_time} SECONDS.")
        print("========================================")

if __name__ == "__main__":
    # This ensures the pipeline only runs if we specifically execute this file.
    run_etl_pipeline()