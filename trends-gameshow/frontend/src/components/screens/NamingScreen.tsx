import { motion } from 'framer-motion';
import { useGameStore } from '../../store';

export default function NamingScreen() {
  const { teams, submissions, rounds, currentRoundIndex, timer } = useGameStore();
  const activeTeams = teams.filter(t => t.active);
  const currentRound = rounds[currentRoundIndex];

  return (
    <div className="h-full w-full gradient-green-blue flex flex-col items-center justify-center text-white p-12">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold mb-2">Round {currentRoundIndex + 1} - Team Naming</h2>
        {currentRound && (
          <div className="text-2xl">
            Current Term: <span className="font-bold">{currentRound.term}</span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-2 gap-6 max-w-5xl w-full">
        {activeTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="glass rounded-2xl p-8 border-4"
            style={{ borderColor: team.color }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: team.color }} />
              <h3 className="text-2xl font-bold">{team.name}</h3>
            </div>

            <div className="bg-white/10 rounded-lg p-6 min-h-[100px] flex items-center justify-center">
              {submissions[team.id] ? (
                <p className="text-3xl font-bold">{submissions[team.id]}</p>
              ) : (
                <p className="text-xl opacity-60 italic">Thinking...</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

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
