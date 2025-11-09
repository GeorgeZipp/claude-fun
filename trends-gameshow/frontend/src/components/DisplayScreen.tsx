import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store';
import WelcomeScreen from './screens/WelcomeScreen';
import RevealScreen from './screens/RevealScreen';
import NamingScreen from './screens/NamingScreen';
import CompareScreen from './screens/CompareScreen';
import ScoreboardScreen from './screens/ScoreboardScreen';
import BonusScreen from './screens/BonusScreen';

export default function DisplayScreen() {
  const { displayScreen } = useGameStore();

  const screens = {
    welcome: <WelcomeScreen />,
    reveal: <RevealScreen />,
    naming: <NamingScreen />,
    wager: <NamingScreen />, // Reuse naming screen for wager
    compare: <CompareScreen />,
    scoreboard: <ScoreboardScreen />,
    bonus: <BonusScreen />,
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          {screens[displayScreen]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
