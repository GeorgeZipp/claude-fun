#!/usr/bin/env node
/**
 * Test Google Trends API using google-trends-api library for Node.js.
 * This is an unofficial API that scrapes Google Trends data.
 */

import googleTrends from 'google-trends-api';

// Test results tracker
const results = [];

/**
 * Test interest over time for keywords
 */
async function testInterestOverTime() {
  console.log("=".repeat(60));
  console.log("Testing Interest Over Time");
  console.log("=".repeat(60));

  try {
    const response = await googleTrends.interestOverTime({
      keyword: ['Python', 'JavaScript', 'Rust'],
      startTime: new Date(Date.now() - (365 * 24 * 60 * 60 * 1000)), // 1 year ago
      granularTimeResolution: true
    });

    const data = JSON.parse(response);

    if (data && data.default && data.default.timelineData) {
      console.log(`\nReceived ${data.default.timelineData.length} data points`);
      console.log("\nLast 5 entries:");
      data.default.timelineData.slice(-5).forEach(point => {
        console.log(`${point.formattedTime}: ${JSON.stringify(point.value)}`);
      });
      return true;
    } else {
      console.log("No data returned");
      return false;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

/**
 * Test interest by region
 */
async function testInterestByRegion() {
  console.log("\n" + "=".repeat(60));
  console.log("Testing Interest By Region");
  console.log("=".repeat(60));

  try {
    const response = await googleTrends.interestByRegion({
      keyword: 'artificial intelligence',
      startTime: new Date(Date.now() - (365 * 24 * 60 * 60 * 1000)),
      resolution: 'COUNTRY'
    });

    const data = JSON.parse(response);

    if (data && data.default && data.default.geoMapData) {
      console.log(`\nReceived data for ${data.default.geoMapData.length} regions`);
      console.log("\nTop 10 regions by interest:");

      // Sort by value and show top 10
      const sorted = data.default.geoMapData
        .sort((a, b) => b.value[0] - a.value[0])
        .slice(0, 10);

      sorted.forEach((region, index) => {
        console.log(`${index + 1}. ${region.geoName}: ${region.value[0]}`);
      });
      return true;
    } else {
      console.log("No data returned");
      return false;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

/**
 * Test related queries
 */
async function testRelatedQueries() {
  console.log("\n" + "=".repeat(60));
  console.log("Testing Related Queries");
  console.log("=".repeat(60));

  try {
    const response = await googleTrends.relatedQueries({
      keyword: 'ChatGPT',
      startTime: new Date(Date.now() - (90 * 24 * 60 * 60 * 1000)) // 3 months ago
    });

    const data = JSON.parse(response);

    if (data && data.default) {
      console.log("\nRelated queries for 'ChatGPT':");

      if (data.default.rankedList) {
        data.default.rankedList.forEach(list => {
          console.log(`\n${list.rankedKeyword[0].type === 'TOP' ? 'Top' : 'Rising'} queries:`);
          list.rankedKeyword.slice(0, 10).forEach((item, index) => {
            const value = item.value || item.formattedValue || 'N/A';
            console.log(`${index + 1}. ${item.query} (${value})`);
          });
        });
      }
      return true;
    } else {
      console.log("No data returned");
      return false;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

/**
 * Test daily trending searches
 */
async function testDailyTrends() {
  console.log("\n" + "=".repeat(60));
  console.log("Testing Daily Trends (USA)");
  console.log("=".repeat(60));

  try {
    const response = await googleTrends.dailyTrends({
      geo: 'US'
    });

    const data = JSON.parse(response);

    if (data && data.default && data.default.trendingSearchesDays) {
      console.log("\nCurrent trending searches in USA:");

      const trends = data.default.trendingSearchesDays[0].trendingSearches;
      trends.slice(0, 20).forEach((trend, index) => {
        console.log(`${index + 1}. ${trend.title.query} (${trend.formattedTraffic})`);
      });
      return true;
    } else {
      console.log("No data returned");
      return false;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

/**
 * Test real-time trends
 */
async function testRealTimeTrends() {
  console.log("\n" + "=".repeat(60));
  console.log("Testing Real-time Trends (USA)");
  console.log("=".repeat(60));

  try {
    const response = await googleTrends.realTimeTrends({
      geo: 'US',
      category: 'all'
    });

    const data = JSON.parse(response);

    if (data && data.storySummaries && data.storySummaries.trendingStories) {
      console.log("\nReal-time trending stories:");

      const stories = data.storySummaries.trendingStories;
      stories.slice(0, 10).forEach((story, index) => {
        console.log(`${index + 1}. ${story.title} (${story.entityNames.join(', ')})`);
      });
      return true;
    } else {
      console.log("No data returned");
      return false;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("Google Trends API Test using google-trends-api (Node.js)");
  console.log(`Test started at: ${new Date().toISOString()}\n`);

  // Run tests sequentially to avoid rate limiting
  console.log("Running tests (with delays to avoid rate limiting)...\n");

  results.push({ name: "Interest Over Time", success: await testInterestOverTime() });
  await sleep(2000);

  results.push({ name: "Interest By Region", success: await testInterestByRegion() });
  await sleep(2000);

  results.push({ name: "Related Queries", success: await testRelatedQueries() });
  await sleep(2000);

  results.push({ name: "Daily Trends", success: await testDailyTrends() });
  await sleep(2000);

  results.push({ name: "Real-time Trends", success: await testRealTimeTrends() });

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));

  results.forEach(result => {
    const status = result.success ? "✓ PASSED" : "✗ FAILED";
    console.log(`${result.name}: ${status}`);
  });

  const passed = results.filter(r => r.success).length;
  console.log(`\nTotal: ${passed}/${results.length} tests passed`);
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the tests
runTests().catch(console.error);
