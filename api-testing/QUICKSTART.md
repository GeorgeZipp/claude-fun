# Quick Start Guide

## Local Machine Setup (Recommended)

### Python (5 minutes)

```bash
# 1. Navigate to Python folder
cd api-testing/python

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the demo (works even if blocked)
python demo_with_mock.py

# 4. Try the full test
python test_pytrends.py
```

### Node.js (5 minutes)

```bash
# 1. Navigate to Node.js folder
cd api-testing/nodejs

# 2. Install dependencies
npm install

# 3. Run the test
npm test
```

## What if it doesn't work?

### Getting 403 Errors?
- Google is blocking your IP/environment
- Try from a different network
- Use a VPN
- Or use the mock demo: `python demo_with_mock.py`

### DNS/Network Errors?
- Your environment may not have internet access
- Try from your local machine
- Or use commercial APIs (see `ALTERNATIVES.md`)

## Production Use

**Don't use these unofficial APIs in production!**

Instead, use:
1. **SerpAPI** - Most affordable commercial option ($50/month)
2. **Glimpse API** - Best reliability for enterprise
3. **Official Google Trends API** - Apply for alpha access

See `ALTERNATIVES.md` for detailed comparison.

## Quick Examples

### Python - Get Interest Over Time

```python
from pytrends.request import TrendReq
import pandas as pd

pytrends = TrendReq(hl='en-US', tz=360)
pytrends.build_payload(['Python', 'JavaScript'], timeframe='today 12-m')
df = pytrends.interest_over_time()
print(df.tail())
```

### Node.js - Get Interest Over Time

```javascript
import googleTrends from 'google-trends-api';

const data = await googleTrends.interestOverTime({
  keyword: ['Python', 'JavaScript'],
  startTime: new Date(Date.now() - (365 * 24 * 60 * 60 * 1000))
});

console.log(JSON.parse(data));
```

## Files in this Repository

```
api-testing/
├── README.md              # Main documentation
├── ALTERNATIVES.md        # Commercial & alternative APIs
├── QUICKSTART.md         # This file
├── python/
│   ├── requirements.txt   # Python dependencies
│   ├── test_pytrends.py  # Full test suite
│   └── demo_with_mock.py # Demo with fallback
└── nodejs/
    ├── package.json       # Node dependencies
    └── test_trends.js    # Test suite
```

## Need Help?

1. Check `README.md` for detailed documentation
2. Check `ALTERNATIVES.md` for other API options
3. Visit the library documentation:
   - PyTrends: https://github.com/GeneralMills/pytrends
   - google-trends-api: https://github.com/pat310/google-trends-api
