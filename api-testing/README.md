# Google Trends API Testing

This folder contains working implementations of Google Trends APIs for both Python and Node.js.

## Overview

Google does not provide an official public API for Google Trends data (except for a limited alpha program). These implementations use popular unofficial libraries that scrape Google Trends data:

- **Python**: [pytrends](https://github.com/GeneralMills/pytrends) - The most popular Python library
- **Node.js**: [google-trends-api](https://github.com/pat310/google-trends-api) - Popular Node.js library

## Features

Both implementations can retrieve:
- Interest over time for keywords
- Interest by geographic region
- Related queries
- Trending searches (daily/real-time)

## Python Setup

### Prerequisites
- Python 3.7+
- pip

### Installation

```bash
cd api-testing/python
pip install -r requirements.txt
```

### Run Tests

**Quick test with your own search terms:**
```bash
# Interactive mode (prompts for terms)
python custom_test.py

# Or pass terms directly
python custom_test.py "bitcoin" "ethereum" "dogecoin"
```

**Full test suite:**
```bash
python test_pytrends.py
```

### Python API Examples

```python
from pytrends.request import TrendReq

# Initialize
pytrends = TrendReq(hl='en-US', tz=360)

# Build payload for keywords
pytrends.build_payload(['Python', 'JavaScript'], timeframe='today 12-m')

# Get interest over time
interest_df = pytrends.interest_over_time()

# Get interest by region
region_df = pytrends.interest_by_region()

# Get related queries
related = pytrends.related_queries()

# Get trending searches
trending = pytrends.trending_searches(pn='united_states')
```

## Node.js Setup

### Prerequisites
- Node.js 14+
- npm

### Installation

```bash
cd api-testing/nodejs
npm install
```

### Run Tests

**Quick test with your own search terms:**
```bash
# Interactive mode (prompts for terms)
node custom_test.js

# Or pass terms directly
node custom_test.js "bitcoin" "ethereum" "dogecoin"
```

**Full test suite:**
```bash
npm test
# or
node test_trends.js
```

### Node.js API Examples

```javascript
import googleTrends from 'google-trends-api';

// Interest over time
const interestData = await googleTrends.interestOverTime({
  keyword: ['Python', 'JavaScript'],
  startTime: new Date(Date.now() - (365 * 24 * 60 * 60 * 1000))
});

// Interest by region
const regionData = await googleTrends.interestByRegion({
  keyword: 'artificial intelligence',
  resolution: 'COUNTRY'
});

// Related queries
const relatedData = await googleTrends.relatedQueries({
  keyword: 'ChatGPT'
});

// Daily trends
const dailyData = await googleTrends.dailyTrends({
  geo: 'US'
});

// Real-time trends
const realtimeData = await googleTrends.realTimeTrends({
  geo: 'US',
  category: 'all'
});
```

## Important Notes

### ⚠️ Environment Restrictions

**These APIs may not work in all environments:**
- Cloud/sandbox environments are often blocked by Google (403 errors)
- DNS resolution may fail in restricted environments
- **Recommended**: Run from your local machine for best results
- See `ALTERNATIVES.md` for commercial API options that work everywhere

### Rate Limiting
- Both APIs are unofficial and scrape Google Trends
- Google may rate limit or block excessive requests
- Add delays between requests (2-3 seconds recommended)
- The test scripts include built-in delays

### Reliability
- These libraries may break when Google changes their backend
- Not recommended for production use without proper error handling
- Consider commercial alternatives (Glimpse API, SerpAPI) for production
- **See `ALTERNATIVES.md` for detailed comparison of options**

### Official Google Trends API
- Google announced an official Trends API (alpha) in July 2025
- Currently limited to select testers
- Requires application for early access
- More info: https://developers.google.com/search/blog/2025/07/trends-api

## Working in Restricted Environments

If the APIs are blocked in your environment:

1. **Use from local machine**: Download and run locally
2. **Use commercial APIs**: See `ALTERNATIVES.md` for production-ready options
3. **Apply for official API**: Google Trends API (alpha) access

## Troubleshooting

### Python Issues
- **429 Error**: You're being rate limited. Add delays between requests.
- **Import Error**: Make sure pytrends is installed: `pip install pytrends`
- **Empty Data**: Try different keywords or time ranges

### Node.js Issues
- **429 Error**: Rate limited. Increase delays between requests.
- **Parse Error**: API response format may have changed
- **Module Error**: Ensure you're using Node.js 14+ with ES modules support

## Data Available

### Interest Over Time
Historical search interest data for keywords over time periods

### Interest by Region
Geographic distribution of search interest by country/region

### Related Queries
- **Top**: Most popular related queries
- **Rising**: Queries with biggest increase in search frequency

### Trending Searches
- **Daily Trends**: Trending searches for the day
- **Real-time Trends**: Currently trending topics

## License

These test implementations are provided as-is for educational purposes.

## Resources

- [PyTrends Documentation](https://pypi.org/project/pytrends/)
- [google-trends-api GitHub](https://github.com/pat310/google-trends-api)
- [Google Trends](https://trends.google.com/)
