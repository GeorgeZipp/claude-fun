import { useGameStore } from '../../store';
import type { ScreenType } from '../../types';
import { Home, Eye, Users, BarChart3, Trophy, Star } from 'lucide-react';

export default function ScreenControl() {
  const { displayScreen, setDisplayScreen } = useGameStore();

  const screens: { type: ScreenType; label: string; icon: any }[] = [
    { type: 'welcome', label: 'Welcome', icon: Home },
    { type: 'reveal', label: 'Reveal', icon: Eye },
    { type: 'naming', label: 'Naming', icon: Users },
    { type: 'compare', label: 'Compare', icon: BarChart3 },
    { type: 'scoreboard', label: 'Scoreboard', icon: Trophy },
    { type: 'bonus', label: 'Bonus', icon: Star },
  ];

  return (
    <div className="card">
      <h2 className="section-header">Screen</h2>
      <div className="grid grid-cols-3 gap-2">
        {screens.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => setDisplayScreen(type)}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-all ${
              displayScreen === type
                ? 'bg-gray-900 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
