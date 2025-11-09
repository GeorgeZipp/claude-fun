import { motion } from 'framer-motion';
import { useGameStore } from '../../store';
import { TrendingUp } from 'lucide-react';

export default function WelcomeScreen() {
  const { teams } = useGameStore();
  const activeTeams = teams.filter(t => t.active);

  return (
    <div className="h-full w-full bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center max-w-5xl w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">Google Trends</h1>
          <h2 className="text-3xl font-medium text-gray-600">Game Show</h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {activeTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-3"
                style={{ backgroundColor: team.color }}
              />
              <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{team.score}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-lg text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Ready to play
        </motion.p>
      </div>
    </div>
  );
}
