import { motion } from 'framer-motion';
import { useGameStore } from '../../store';
import { Trophy, Medal } from 'lucide-react';

export default function ScoreboardScreen() {
  const { teams } = useGameStore();
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const getMedalIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="w-8 h-8 text-yellow-300" />;
    if (rank === 1) return <Medal className="w-8 h-8 text-gray-300" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-orange-300" />;
    return null;
  };

  return (
    <div className="h-full w-full gradient-pink-orange flex flex-col items-center justify-center text-white p-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <Trophy className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-6xl font-bold">SCOREBOARD</h1>
        <p className="text-2xl mt-2 opacity-90">Current Standings</p>
      </motion.div>

      <div className="space-y-4 w-full max-w-3xl">
        {sortedTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="glass rounded-2xl p-6 flex items-center gap-6"
          >
            <div className="text-5xl font-bold w-16 text-center">#{index + 1}</div>

            <div className="flex items-center gap-4 flex-1">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: team.color }} />
              <span className="text-3xl font-bold">{team.name}</span>
            </div>

            {getMedalIcon(index)}

            <div className="text-5xl font-bold">{team.score}</div>
          </motion.div>
        ))}
      </div>

      {sortedTeams.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-3xl font-bold"
        >
          🏆 {sortedTeams[0].name} leads! 🏆
        </motion.div>
      )}
    </div>
  );
}
