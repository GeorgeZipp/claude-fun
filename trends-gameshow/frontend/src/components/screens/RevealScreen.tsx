import { motion } from 'framer-motion';
import { useGameStore } from '../../store';
import { Calendar, Globe } from 'lucide-react';

export default function RevealScreen() {
  const { rounds, currentRoundIndex, timer } = useGameStore();
  const currentRound = rounds[currentRoundIndex];

  if (!currentRound) {
    return (
      <div className="h-full w-full bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-2xl font-medium">No round selected</div>
      </div>
    );
  }

  const dateRangeLabels: Record<string, string> = {
    past_hour: 'Past Hour',
    past_day: 'Past Day',
    past_7_days: 'Past 7 Days',
    past_30_days: 'Past 30 Days',
    past_90_days: 'Past 90 Days',
    past_12_months: 'Past 12 Months',
    past_5_years: 'Past 5 Years',
  };

  const getTypeBadge = () => {
    if (currentRound.type === 'naming') return 'NAMING';
    if (currentRound.type === 'bonus') return `BONUS x${currentRound.multiplier}`;
    if (currentRound.type === 'wager') return 'WAGER';
    return null;
  };

  const badge = getTypeBadge();

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="text-sm font-medium text-gray-500 mb-3">
          Round {currentRoundIndex + 1} of {rounds.length}
        </div>
        {badge && (
          <div className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {badge}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-12 max-w-4xl mx-auto text-center shadow-sm"
      >
        <h1 className="text-7xl font-bold text-gray-900 mb-6">{currentRound.term}</h1>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {dateRangeLabels[currentRound.dateRange.preset] || 'Custom'}
          </span>
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {currentRound.region === 'US' ? 'United States' : currentRound.region || 'Worldwide'}
          </span>
        </div>
      </motion.div>

      {timer.visible && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className={`mt-8 text-5xl font-bold ${
            timer.seconds <= 10 && timer.running
              ? 'text-red-600 animate-pulse'
              : 'text-gray-900'
          }`}
        >
          {Math.floor(timer.seconds / 60)}:{(timer.seconds % 60).toString().padStart(2, '0')}
        </motion.div>
      )}
    </div>
  );
}
