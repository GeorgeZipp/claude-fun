import { useGameStore } from '../../store';
import type { ScreenType } from '../../types';
import { Home, Eye, Users, BarChart3, Trophy, Star } from 'lucide-react';

export default function ScreenControl() {
  const { displayScreen, setDisplayScreen } = useGameStore();

  const screens: { type: ScreenType; label: string; icon: any; color: string }[] = [
    { type: 'welcome', label: 'Welcome', icon: Home, color: 'bg-blue-500' },
    { type: 'reveal', label: 'Reveal', icon: Eye, color: 'bg-purple-500' },
    { type: 'naming', label: 'Naming', icon: Users, color: 'bg-green-500' },
    { type: 'compare', label: 'Compare', icon: BarChart3, color: 'bg-orange-500' },
    { type: 'scoreboard', label: 'Scoreboard', icon: Trophy, color: 'bg-yellow-500' },
    { type: 'bonus', label: 'Bonus', icon: Star, color: 'bg-pink-500' },
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3">Screen Control</h2>
      <div className="grid grid-cols-3 gap-2">
        {screens.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => setDisplayScreen(type)}
            className={`btn ${displayScreen === type ? color + ' text-white' : 'bg-gray-200 text-gray-700'} flex flex-col items-center gap-1 py-3`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
