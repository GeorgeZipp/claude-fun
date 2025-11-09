import express from 'express';
import cors from 'cors';
import googleTrends from 'google-trends-api';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory cache for trends data
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Helper to generate cache key
function getCacheKey(params) {
  return JSON.stringify(params);
}

// Helper to check cache
function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

// API Routes

/**
 * POST /api/trends/compare
 * Body: {
 *   phrases: string[],
 *   dateRange: { start: Date, end: Date, preset: string },
 *   region: string
 * }
 */
app.post('/api/trends/compare', async (req, res) => {
  try {
    const { phrases, dateRange, region = 'US' } = req.body;

    if (!phrases || !Array.isArray(phrases) || phrases.length === 0) {
      return res.status(400).json({ error: 'Phrases array is required' });
    }

    if (phrases.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 phrases allowed' });
    }

    // Check cache
    const cacheKey = getCacheKey({ phrases, dateRange, region });
    const cached = getFromCache(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Calculate start time based on preset or custom range
    let startTime;
    if (dateRange?.preset) {
      const now = new Date();
      switch (dateRange.preset) {
        case 'past_hour':
          startTime = new Date(now - 60 * 60 * 1000);
          break;
        case 'past_day':
          startTime = new Date(now - 24 * 60 * 60 * 1000);
          break;
        case 'past_7_days':
          startTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'past_30_days':
          startTime = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'past_90_days':
          startTime = new Date(now - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'past_12_months':
          startTime = new Date(now - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'past_5_years':
          startTime = new Date(now - 5 * 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = new Date(now - 365 * 24 * 60 * 60 * 1000); // Default 12 months
      }
    } else if (dateRange?.start) {
      startTime = new Date(dateRange.start);
    } else {
      startTime = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // Default 12 months
    }

    // Fetch data from Google Trends
    const response = await googleTrends.interestOverTime({
      keyword: phrases,
      startTime,
      geo: region,
      granularTimeResolution: true
    });

    const data = JSON.parse(response);

    if (!data || !data.default || !data.default.timelineData) {
      return res.status(404).json({ error: 'No data found for these search terms' });
    }

    // Process the data
    const timelineData = data.default.timelineData;

    // Calculate results for each phrase
    const results = phrases.map((phrase, index) => {
      const values = timelineData.map(point => point.value[index] || 0);
      const averageInterest = values.reduce((a, b) => a + b, 0) / values.length;
      const peakInterest = Math.max(...values);
      const peakIndex = values.indexOf(peakInterest);
      const peakDate = timelineData[peakIndex]?.formattedTime || '';

      return {
        phrase,
        averageInterest: Math.round(averageInterest),
        peakInterest,
        peakDate,
        dataPoints: timelineData.map(point => ({
          date: point.formattedTime,
          value: point.value[index] || 0
        }))
      };
    });

    // Calculate relative scores (normalize to 0-100 scale)
    const maxAverage = Math.max(...results.map(r => r.averageInterest));
    results.forEach(result => {
      result.relativeScore = maxAverage > 0
        ? Math.round((result.averageInterest / maxAverage) * 100)
        : 0;
    });

    const responseData = {
      results,
      region,
      dateRange: {
        start: startTime.toISOString(),
        end: new Date().toISOString(),
        preset: dateRange?.preset
      },
      fetchedAt: new Date().toISOString(),
      source: 'api'
    };

    // Cache the results
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching trends data:', error);
    res.status(500).json({
      error: 'Failed to fetch trends data',
      message: error.message,
      details: 'The Google Trends API may be unavailable. Try manual entry or retry later.'
    });
  }
});

/**
 * GET /api/trends/cache/status
 */
app.get('/api/trends/cache/status', (req, res) => {
  res.json({
    cacheSize: cache.size,
    entries: Array.from(cache.keys()).map(key => {
      const entry = cache.get(key);
      return {
        params: JSON.parse(key),
        fetchedAt: new Date(entry.timestamp).toISOString(),
        age: Math.round((Date.now() - entry.timestamp) / 1000) + 's'
      };
    })
  });
});

/**
 * POST /api/trends/cache/clear
 */
app.post('/api/trends/cache/clear', (req, res) => {
  const size = cache.size;
  cache.clear();
  res.json({ message: `Cleared ${size} cached entries` });
});

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cacheSize: cache.size
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Trends GameShow API running on http://localhost:${PORT}`);
  console.log(`📊 Google Trends integration: Ready`);
  console.log(`💾 Cache: Enabled (TTL: ${CACHE_TTL / 1000 / 60} minutes)`);
});
