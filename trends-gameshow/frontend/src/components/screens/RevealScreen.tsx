import { motion } from 'framer-motion';
import { useGameStore } from '../../store';
import { Calendar, Globe } from 'lucide-react';

export default function RevealScreen() {
  const { rounds, currentRoundIndex, timer } = useGameStore();
  const currentRound = rounds[currentRoundIndex];

  if (!currentRound) {
    return (
      <div className="h-full w-full gradient-orange-red flex items-center justify-center">
        <div className="text-white text-4xl font-bold">No round selected</div>
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
    if (currentRound.type === 'naming') return 'NAMING ROUND';
    if (currentRound.type === 'bonus') return `BONUS ROUND x${currentRound.multiplier}`;
    if (currentRound.type === 'wager') return 'WAGER ROUND';
    return null;
  };

  const badge = getTypeBadge();

  return (
    <div className="h-full w-full gradient-orange-red flex flex-col items-center justify-center text-white p-12">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <div className="text-2xl mb-2">Round {currentRoundIndex + 1} of {rounds.length}</div>
        {badge && (
          <div className="inline-block bg-white/20 backdrop-blur px-6 py-2 rounded-full text-xl font-bold mb-6">
            {badge}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass rounded-3xl p-12 max-w-4xl mx-auto text-center"
      >
        <h1 className="text-8xl font-bold mb-8">{currentRound.term}</h1>

        <div className="flex items-center justify-center gap-8 text-lg opacity-90">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {dateRangeLabels[currentRound.dateRange.preset] || 'Custom'}
          </span>
          <span className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {currentRound.region === 'US' ? 'United States' : currentRound.region || 'Worldwide'}
          </span>
        </div>
      </motion.div>

      {timer.visible && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className={`mt-12 text-6xl font-bold ${timer.seconds <= 10 && timer.running ? 'text-red-300 animate-pulse' : ''}`}
        >
          {Math.floor(timer.seconds / 60)}:{(timer.seconds % 60).toString().padStart(2, '0')}
        </motion.div>
      )}
    </div>
  );
}
