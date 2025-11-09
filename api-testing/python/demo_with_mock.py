#!/usr/bin/env python3
"""
Demo of Google Trends API with fallback to mock data.
This demonstrates the API structure even when Google blocks requests.
"""

from pytrends.request import TrendReq
import pandas as pd
from datetime import datetime, timedelta
import random

def create_mock_interest_over_time():
    """Create mock interest over time data."""
    dates = pd.date_range(end=datetime.now(), periods=52, freq='W')
    data = {
        'Python': [random.randint(60, 100) for _ in range(52)],
        'JavaScript': [random.randint(50, 95) for _ in range(52)],
        'Rust': [random.randint(30, 70) for _ in range(52)],
        'isPartial': [False] * 52
    }
    df = pd.DataFrame(data, index=dates)
    return df

def create_mock_interest_by_region():
    """Create mock interest by region data."""
    countries = ['United States', 'India', 'United Kingdom', 'Germany', 'Canada',
                 'France', 'Brazil', 'Japan', 'Australia', 'Netherlands']
    data = {
        'artificial intelligence': [random.randint(50, 100) for _ in range(len(countries))]
    }
    df = pd.DataFrame(data, index=countries)
    return df

def test_with_fallback():
    """Test with real API and fallback to mock data if blocked."""
    print("=" * 60)
    print("Google Trends API Demo (with mock fallback)")
    print("=" * 60)

    # Try real API first
    try:
        print("\n[1] Attempting to connect to Google Trends...")
        pytrends = TrendReq(hl='en-US', tz=360)
        pytrends.build_payload(['Python', 'JavaScript', 'Rust'],
                              timeframe='today 12-m')

        interest_df = pytrends.interest_over_time()

        if not interest_df.empty:
            print("✓ Successfully connected to Google Trends!\n")
            print("Interest over time (last 5 weeks):")
            print(interest_df.tail())
            return True
        else:
            raise Exception("Empty response")

    except Exception as e:
        print(f"✗ Could not connect to Google Trends: {e}")
        print("\n[2] Using mock data for demonstration...\n")

        # Show mock data
        print("Mock Interest Over Time Data:")
        mock_df = create_mock_interest_over_time()
        print(mock_df.tail())
        print(f"\nData shape: {mock_df.shape}")

        print("\n" + "=" * 60)
        print("Mock Interest By Region Data:")
        region_df = create_mock_interest_by_region()
        print(region_df.sort_values(by='artificial intelligence', ascending=False))

        print("\n" + "=" * 60)
        print("\nAPI Structure Example:")
        print("-" * 60)
        print("""
When the API works, you can use it like this:

from pytrends.request import TrendReq

# Initialize
pytrends = TrendReq(hl='en-US', tz=360)

# Build payload
pytrends.build_payload(
    ['Python', 'JavaScript'],
    timeframe='today 12-m',
    geo='US'
)

# Get data
interest_over_time = pytrends.interest_over_time()
interest_by_region = pytrends.interest_by_region()
related_queries = pytrends.related_queries()
trending = pytrends.trending_searches(pn='united_states')

# Data comes back as pandas DataFrames
print(interest_over_time.head())
        """)

        return False

if __name__ == "__main__":
    success = test_with_fallback()

    print("\n" + "=" * 60)
    print("NOTES")
    print("=" * 60)
    print("""
    If Google Trends is blocking requests:

    1. Environment may be restricted (cloud/sandbox)
    2. Google may be rate limiting your IP
    3. Try from your local machine instead

    Alternatives:
    - SerpAPI (paid): https://serpapi.com/google-trends-api
    - Glimpse API (paid): https://glimpse.info/
    - Apply for official Google Trends API (alpha)
    - Run from local machine with different IP
    """)
