#!/usr/bin/env python3
"""
Test Google Trends API using pytrends library.
This is an unofficial API that scrapes Google Trends data.
"""

from pytrends.request import TrendReq
import pandas as pd
from datetime import datetime

def test_interest_over_time():
    """Test getting interest over time for keywords."""
    print("=" * 60)
    print("Testing Interest Over Time")
    print("=" * 60)

    # Create pytrends object
    # hl = host language, tz = timezone offset
    pytrends = TrendReq(hl='en-US', tz=360)

    # Build payload with keywords
    keywords = ["Python", "JavaScript", "Rust"]
    pytrends.build_payload(keywords, cat=0, timeframe='today 12-m', geo='', gprop='')

    # Get interest over time
    interest_over_time_df = pytrends.interest_over_time()

    if not interest_over_time_df.empty:
        print("\nInterest over time (last 5 entries):")
        print(interest_over_time_df.tail())
        print(f"\nData shape: {interest_over_time_df.shape}")
        return True
    else:
        print("No data returned")
        return False

def test_interest_by_region():
    """Test getting interest by geographic region."""
    print("\n" + "=" * 60)
    print("Testing Interest By Region")
    print("=" * 60)

    pytrends = TrendReq(hl='en-US', tz=360)
    pytrends.build_payload(["artificial intelligence"], timeframe='today 12-m')

    # Get interest by region
    region_df = pytrends.interest_by_region(resolution='COUNTRY', inc_low_vol=True, inc_geo_code=False)

    if not region_df.empty:
        print("\nTop 10 regions by interest:")
        print(region_df.sort_values(by='artificial intelligence', ascending=False).head(10))
        return True
    else:
        print("No data returned")
        return False

def test_related_queries():
    """Test getting related queries."""
    print("\n" + "=" * 60)
    print("Testing Related Queries")
    print("=" * 60)

    pytrends = TrendReq(hl='en-US', tz=360)
    pytrends.build_payload(["ChatGPT"], timeframe='today 3-m')

    # Get related queries
    related_queries = pytrends.related_queries()

    if related_queries:
        print("\nRelated queries for 'ChatGPT':")
        if 'ChatGPT' in related_queries:
            print("\nTop rising queries:")
            print(related_queries['ChatGPT']['rising'])
            print("\nTop queries:")
            print(related_queries['ChatGPT']['top'])
        return True
    else:
        print("No data returned")
        return False

def test_trending_searches():
    """Test getting trending searches."""
    print("\n" + "=" * 60)
    print("Testing Trending Searches (USA)")
    print("=" * 60)

    pytrends = TrendReq(hl='en-US', tz=360)

    # Get trending searches for USA
    trending_df = pytrends.trending_searches(pn='united_states')

    if not trending_df.empty:
        print("\nCurrent trending searches in USA:")
        print(trending_df.head(20))
        return True
    else:
        print("No data returned")
        return False

if __name__ == "__main__":
    print("Google Trends API Test using pytrends")
    print(f"Test started at: {datetime.now()}")
    print()

    results = []

    try:
        results.append(("Interest Over Time", test_interest_over_time()))
    except Exception as e:
        print(f"Error in Interest Over Time: {e}")
        results.append(("Interest Over Time", False))

    try:
        results.append(("Interest By Region", test_interest_by_region()))
    except Exception as e:
        print(f"Error in Interest By Region: {e}")
        results.append(("Interest By Region", False))

    try:
        results.append(("Related Queries", test_related_queries()))
    except Exception as e:
        print(f"Error in Related Queries: {e}")
        results.append(("Related Queries", False))

    try:
        results.append(("Trending Searches", test_trending_searches()))
    except Exception as e:
        print(f"Error in Trending Searches: {e}")
        results.append(("Trending Searches", False))

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for test_name, success in results:
        status = "✓ PASSED" if success else "✗ FAILED"
        print(f"{test_name}: {status}")

    total = len(results)
    passed = sum(1 for _, success in results if success)
    print(f"\nTotal: {passed}/{total} tests passed")
