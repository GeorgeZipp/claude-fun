import { motion } from 'framer-motion';
import { useGameStore } from '../../store';
import { Star, Sparkles } from 'lucide-react';

export default function BonusScreen() {
  const { bonusConfig } = useGameStore();

  return (
    <div className="h-full w-full gradient-pink-orange flex items-center justify-center text-white overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Star className="w-8 h-8 text-yellow-300" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{
            scale: { duration: 0.5, type: 'spring' },
            rotate: { duration: 0.5, delay: 0.5, repeat: Infinity, repeatDelay: 1 },
          }}
          className="mb-8"
        >
          <Sparkles className="w-32 h-32 mx-auto text-yellow-300" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-8xl font-bold mb-6"
        >
          BONUS ROUND!
        </motion.h1>

        {bonusConfig.visible && bonusConfig.term && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="glass rounded-3xl p-12 inline-block"
          >
            <div className="text-3xl mb-4">Bonus Term:</div>
            <div className="text-6xl font-bold">{bonusConfig.term}</div>
            {bonusConfig.multiplier > 1 && (
              <div className="text-4xl mt-6 text-yellow-300">
                {bonusConfig.multiplier}x Points!
              </div>
            )}
          </motion.div>
        )}

        {!bonusConfig.visible && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-4xl"
          >
            Get ready for bonus points!
          </motion.p>
        )}
      </div>
    </div>
  );
}
