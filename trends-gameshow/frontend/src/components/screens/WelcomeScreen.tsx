import { motion } from 'framer-motion';
import { useGameStore } from '../../store';
import { TrendingUp } from 'lucide-react';

export default function WelcomeScreen() {
  const { teams } = useGameStore();
  const activeTeams = teams.filter(t => t.active);

  return (
    <div className="h-full w-full gradient-blue-purple flex items-center justify-center">
      <div className="text-center text-white px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TrendingUp className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-7xl font-bold mb-4">Google Trends</h1>
          <h2 className="text-5xl font-bold mb-12">Game Show</h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 max-w-4xl mx-auto mt-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {activeTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-3"
                style={{ backgroundColor: team.color }}
              />
              <h3 className="text-2xl font-bold">{team.name}</h3>
              <p className="text-4xl font-bold mt-2">{team.score}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-2xl mt-12 opacity-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          When you're ready, click faster
        </motion.p>
      </div>
    </div>
  );
}
