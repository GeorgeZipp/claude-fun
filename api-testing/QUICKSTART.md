# Quick Start Guide

## Local Machine Setup (Recommended)

### Python (5 minutes)

```bash
# 1. Navigate to Python folder
cd api-testing/python

# 2. Install dependencies
pip install -r requirements.txt

# 3. Test with your own terms (recommended to prove it works!)
python custom_test.py

# Or run the full test suite
python test_pytrends.py
```

### Node.js (5 minutes)

```bash
# 1. Navigate to Node.js folder
cd api-testing/nodejs

# 2. Install dependencies
npm install

# 3. Test with your own terms (recommended to prove it works!)
node custom_test.js

# Or run the full test suite
npm test
```

## What if it doesn't work?

### Getting 403 Errors?
- Google is blocking your IP/environment
- Try from a different network
- Use a VPN
- Or use commercial APIs (see `ALTERNATIVES.md`)

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

### Test with Your Own Terms (Easiest Way!)

**Python:**
```bash
cd api-testing/python
python custom_test.py "your term" "another term"
```

**Node.js:**
```bash
cd api-testing/nodejs
node custom_test.js "your term" "another term"
```

You can also run it without arguments and it will prompt you to enter terms interactively!

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
│   ├── custom_test.py    # Test with your own terms
│   └── test_pytrends.py  # Full test suite
└── nodejs/
    ├── package.json       # Node dependencies
    ├── custom_test.js     # Test with your own terms
    └── test_trends.js    # Full test suite
```

## Need Help?

1. Check `README.md` for detailed documentation
2. Check `ALTERNATIVES.md` for other API options
3. Visit the library documentation:
   - PyTrends: https://github.com/GeneralMills/pytrends
   - google-trends-api: https://github.com/pat310/google-trends-api
