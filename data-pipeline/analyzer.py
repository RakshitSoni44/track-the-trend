# Day 2: NLP & Structuring
# Goal: Clean scraped text and apply sentiment analysis using VADER and Pandas.

import re
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# We import the scraper function we wrote on Day 1!
from scraper import scrape_niche_trends

def clean_text(text):
    """
    Uses Regex to remove special characters, numbers, and extra whitespace.
    This helps the NLP model focus strictly on the words.
    """
    # Remove special characters and numbers (keeps only letters and spaces)
    text = re.sub(r'[^A-Za-z\s]', '', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def analyze_trends():
    """
    Fetches raw data, cleans it, scores the sentiment, and structures it into a DataFrame.
    """
    print("--- Step 1: Fetching Live Data ---")
    # Call the function from scraper.py
    raw_headlines = scrape_niche_trends()
    
    if not raw_headlines:
        print("No data found. Exiting.")
        return

    print("\n--- Step 2: Initializing NLP Model ---")
    # Initialize the VADER sentiment analyzer
    analyzer = SentimentIntensityAnalyzer()
    
    # We will store our processed data in this list before converting to a DataFrame
    processed_data = []

    print("--- Step 3: Cleaning and Scoring Data ---")
    for headline in raw_headlines:
        # Clean the text
        cleaned = clean_text(headline)
        
        # Get the sentiment scores. 
        # VADER returns a dictionary like: {'neg': 0.0, 'neu': 0.5, 'pos': 0.5, 'compound': 0.8}
        # The 'compound' score is a normalized metric from -1 (most extreme negative) to +1 (most extreme positive).
        sentiment = analyzer.polarity_scores(cleaned)
        compound_score = sentiment['compound']
        
        # Categorize the score for easier filtering later on our React Dashboard
        if compound_score >= 0.05:
            label = "Positive"
        elif compound_score <= -0.05:
            label = "Negative"
        else:
            label = "Neutral"

        # Append as a dictionary (perfect for Pandas and MongoDB later)
        processed_data.append({
            "original_text": headline,
            "cleaned_text": cleaned,
            "sentiment_score": compound_score,
            "sentiment_label": label
        })

    print("\n--- Step 4: Structuring with Pandas ---")
    # Convert the list of dictionaries into a Pandas DataFrame
    df = pd.DataFrame(processed_data)
    
    # Print the first 10 rows to verify our work!
    print("\n[Preview of Analyzed Trends]")
    # pd.set_option allows us to see wider columns in the terminal
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', 1000)
    print(df[['sentiment_label', 'sentiment_score', 'original_text']].head(10))
    
    return df

if __name__ == "__main__":
    analyze_trends()