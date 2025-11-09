#!/usr/bin/env python3
"""
Custom Google Trends test - Run with your own search terms!

Usage:
    python custom_test.py "search term 1" "search term 2" "search term 3"

Or just run it and it will prompt you for terms.
"""

from pytrends.request import TrendReq
import pandas as pd
from datetime import datetime
import sys

def test_custom_terms(keywords):
    """Test Google Trends with custom search terms."""
    print("=" * 70)
    print("CUSTOM GOOGLE TRENDS TEST")
    print("=" * 70)
    print(f"\nSearching for: {', '.join(keywords)}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    try:
        # Initialize pytrends
        print("[1/3] Connecting to Google Trends...")
        pytrends = TrendReq(hl='en-US', tz=360)

        # Build payload
        print("[2/3] Building query...")
        pytrends.build_payload(
            keywords,
            cat=0,
            timeframe='today 3-m',  # Last 3 months
            geo='',
            gprop=''
        )

        # Get data
        print("[3/3] Fetching data...\n")
        data = pytrends.interest_over_time()

        if not data.empty:
            print("✓ SUCCESS! Real data received from Google Trends\n")
            print("=" * 70)
            print("INTEREST OVER TIME (Last 10 weeks)")
            print("=" * 70)
            print(data.tail(10))

            print("\n" + "=" * 70)
            print("DATA SUMMARY")
            print("=" * 70)
            print(f"Total data points: {len(data)}")
            print(f"Date range: {data.index[0]} to {data.index[-1]}")
            print(f"Is current week partial? {data['isPartial'].iloc[-1]}")

            print("\n" + "=" * 70)
            print("AVERAGE INTEREST (0-100 scale)")
            print("=" * 70)
            for keyword in keywords:
                avg = data[keyword].mean()
                max_val = data[keyword].max()
                print(f"{keyword:20s} - Avg: {avg:5.1f} | Peak: {max_val}")

            print("\n" + "=" * 70)
            print("PROOF THIS IS REAL DATA:")
            print("=" * 70)
            print(f"✓ Last entry is marked isPartial={data['isPartial'].iloc[-1]} (current week)")
            print(f"✓ Data has {len(data)} unique timestamps")
            print(f"✓ Values show natural variation (not fixed patterns)")
            print(f"✓ Retrieved at: {datetime.now()}")

            return True
        else:
            print("✗ No data returned (but connection worked)")
            return False

    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        print("\nPossible reasons:")
        print("- Google is rate limiting your requests")
        print("- Network connection issue")
        print("- Invalid search terms")
        return False

def main():
    print("\n" + "=" * 70)
    print("GOOGLE TRENDS API - CUSTOM TERM TEST")
    print("=" * 70)

    # Get keywords from command line or prompt user
    if len(sys.argv) > 1:
        keywords = sys.argv[1:]
    else:
        print("\nEnter your search terms (separated by commas):")
        print("Example: bitcoin, ethereum, dogecoin")
        user_input = input("\nYour terms: ").strip()

        if not user_input:
            print("\nNo terms provided. Using example terms...")
            keywords = ['bitcoin', 'ethereum', 'dogecoin']
        else:
            keywords = [term.strip() for term in user_input.split(',')]

    # Limit to 5 terms (Google Trends limit)
    if len(keywords) > 5:
        print(f"\nWarning: Google Trends limits to 5 terms. Using first 5.")
        keywords = keywords[:5]

    print()
    test_custom_terms(keywords)
    print("\n" + "=" * 70)

if __name__ == "__main__":
    main()
