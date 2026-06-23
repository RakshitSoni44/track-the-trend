# Day 1: Data Extraction with Playwright
# Goal: Scrape the top 30 trending tech/startup discussions from Hacker News.

# We use sync_playwright to write synchronous, easy-to-read code. 
# (As opposed to async, which is faster but more complex for a Day 1 project).
from playwright.sync_api import sync_playwright

def scrape_niche_trends():
    """
    Launches a headless browser, navigates to Hacker News, 
    and extracts the titles of trending discussions.
    """
    
    # 1. Start the Playwright context manager. This ensures resources are cleaned up
    #    automatically when the block finishes, preventing memory leaks.
    with sync_playwright() as p:
        
        print("Launching browser...")
        # Launch Chromium. 'headless=True' means it runs invisibly in the background.
        # Set headless=False if you want to visually see it open the window to debug.
        browser = p.chromium.launch(headless=True)
        
        # Open a fresh tab/page
        page = browser.new_page()
        
        print("Navigating to target niche site...")
        # Navigate to our target URL. Playwright automatically waits for the network to idle.
        page.goto("https://news.ycombinator.com/")
        
        # 2. THE EXTRACTION LOGIC
        # We need to find the CSS selector for the text we want. 
        # By inspecting Hacker News, we see titles are in elements with the class 'titleline' 
        # and specifically inside the <a> tags within them.
        
        # page.locator() finds all elements matching the CSS selector.
        title_elements = page.locator('.titleline > a')
        
        # Count how many we found
        count = title_elements.count()
        print(f"Successfully found {count} trending topics. Extracting text...\n")
        
        raw_data = []
        
        # 3. LOOP AND STORE
        for i in range(count):
            # Grab the text from each specific element
            text = title_elements.nth(i).inner_text()
            raw_data.append(text)
            
            # Print to terminal to verify our milestone for Day 1!
            print(f"{i + 1}. {text}")
            
        print("\nScraping complete. Closing browser.")
        browser.close()
        
        # Return the data list so we can use it in Day 2 for Sentiment Analysis
        return raw_data

# Standard Python boilerplate to ensure this script runs when executed directly
if __name__ == "__main__":
    scrape_niche_trends()