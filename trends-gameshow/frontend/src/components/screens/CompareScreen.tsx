import { motion } from 'framer-motion';
import { useGameStore } from '../../store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CompareScreen() {
  const { compareResults, displayConfig } = useGameStore();

  if (compareResults.length === 0) {
    return (
      <div className="h-full w-full gradient-blue-purple flex items-center justify-center text-white">
        <div className="text-4xl font-bold">No results to display</div>
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
    <div className="h-full w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-white">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-2">Results</h1>
          {sortedResults[0].trendsData && (
            <p className="text-xl opacity-90">Google Trends Data</p>
          )}
        </motion.div>

        {/* Bar Chart */}
        {displayConfig.showBars && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-5xl mb-12"
          >
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Relative Search Interest</h2>
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
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="font-bold text-lg">{result.teamName}</span>
                            {result.phrase && (
                              <span className="ml-2 text-sm opacity-75">"{result.phrase}"</span>
                            )}
                          </div>
                          <div className="text-2xl font-bold">{result.points} pts</div>
                        </div>

                        <div className="bg-white/20 rounded-full h-8 overflow-hidden">
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
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>

                        {result.trendsData && (
                          <div className="text-xs opacity-75 mt-1">
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
            transition={{ delay: 0.8 }}
            className="w-full max-w-6xl"
          >
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Trend Over Time</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.8)"
                    tick={{ fill: 'white', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.8)"
                    tick={{ fill: 'white', fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
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
                        strokeWidth={3}
                        dot={{ fill: result.teamColor, r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1000}
                        animationBegin={1000}
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
          transition={{ delay: 1.5 }}
          className="mt-8 text-sm opacity-75"
        >
          {sortedResults[0].source === 'api' ? '📊 Powered by Google Trends' : '✏️ Manual Entry'}
        </motion.div>
      </div>
    </div>
  );
}
