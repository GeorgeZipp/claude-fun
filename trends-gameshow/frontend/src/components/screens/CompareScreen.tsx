import { motion } from 'framer-motion';
import { useGameStore } from '../../store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CompareScreen() {
  const { compareResults, displayConfig } = useGameStore();

  if (compareResults.length === 0) {
    return (
      <div className="h-full w-full bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-medium text-gray-500">No results to display</div>
      </div>
    );
  }

  // Sort results by points (descending)
  const sortedResults = [...compareResults].sort((a, b) => b.points - a.points);
  const maxPoints = Math.max(...sortedResults.map(r => r.points));

  // Prepare data for graph
  const hasGraphData = sortedResults.some(r => r.trendsData?.dataPoints);
  let graphData: any[] = [];

  if (hasGraphData) {
    // Get all unique dates
    const allDates = new Set<string>();
    sortedResults.forEach(result => {
      result.trendsData?.dataPoints.forEach(point => {
        allDates.add(point.date);
      });
    });

    // Create combined dataset
    graphData = Array.from(allDates).sort().map(date => {
      const dataPoint: any = { date };
      sortedResults.forEach(result => {
        if (result.trendsData?.dataPoints) {
          const point = result.trendsData.dataPoints.find(p => p.date === date);
          dataPoint[result.teamName] = point?.value || 0;
        }
      });
      return dataPoint;
    });
  }

  return (
    <div className="h-full w-full bg-gray-50 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Results</h1>
          {sortedResults[0].trendsData && (
            <p className="text-sm text-gray-600">Google Trends Data</p>
          )}
        </motion.div>

        {/* Bar Chart */}
        {displayConfig.showBars && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-5xl mb-8"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Relative Search Interest</h2>
              <div className="space-y-4">
                {sortedResults.map((result, index) => (
                  <motion.div
                    key={result.teamId}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: result.teamColor }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-base text-gray-900">{result.teamName}</span>
                            {result.phrase && (
                              <span className="ml-2 text-sm text-gray-600">"{result.phrase}"</span>
                            )}
                          </div>
                          <div className="text-xl font-bold text-gray-900">{result.points} pts</div>
                        </div>

                        <div className="bg-gray-100 rounded-full h-6 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: result.teamColor,
                              width: maxPoints > 0 ? `${(result.points / maxPoints) * 100}%` : '0%',
                            }}
                            initial={{ width: 0 }}
                            animate={{
                              width: maxPoints > 0 ? `${(result.points / maxPoints) * 100}%` : '0%',
                            }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>

                        {result.trendsData && (
                          <div className="text-xs text-gray-600 mt-1.5">
                            Avg: {result.trendsData.averageInterest} | Peak: {result.trendsData.peakInterest}
                            {result.trendsData.peakDate && ` on ${result.trendsData.peakDate}`}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Line Graph */}
        {displayConfig.showGraph && hasGraphData && graphData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-6xl"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Trend Over Time</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#111827',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  {sortedResults.map((result) => (
                    result.trendsData?.dataPoints && (
                      <Line
                        key={result.teamId}
                        type="monotone"
                        dataKey={result.teamName}
                        stroke={result.teamColor}
                        strokeWidth={2.5}
                        dot={{ fill: result.teamColor, r: 3 }}
                        activeDot={{ r: 5 }}
                        animationDuration={800}
                        animationBegin={600}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Source */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-xs text-gray-500"
        >
          {sortedResults[0].source === 'api' ? 'Powered by Google Trends' : 'Manual Entry'}
        </motion.div>
      </div>
    </div>
  );
}
