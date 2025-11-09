import { useGameStore } from '../store';
import { Monitor, Tv, Maximize2 } from 'lucide-react';
import ScreenControl from './host/ScreenControl';
import TimerControl from './host/TimerControl';
import RoundControl from './host/RoundControl';
import TeamControl from './host/TeamControl';
import SubmissionsControl from './host/SubmissionsControl';
import ResultsControl from './host/ResultsControl';
import WagerControl from './host/WagerControl';
import BonusControl from './host/BonusControl';
import ApiConfigControl from './host/ApiConfigControl';

export default function HostPanel() {
  const { viewMode, setViewMode, displayScreen } = useGameStore();

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Host Control</h1>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setViewMode('split')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'split'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Split View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('host-only')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'host-only'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Host Only"
              >
                <Tv className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('display-only')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'display-only'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Display Only"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Sections */}
      <div className="p-4 space-y-3">
        <ScreenControl />
        <TimerControl />
        <RoundControl />
        <TeamControl />

        {/* Conditional sections based on screen */}
        {displayScreen === 'naming' && <SubmissionsControl />}
        {displayScreen === 'compare' && <ResultsControl />}
        {displayScreen === 'wager' && <WagerControl />}
        {displayScreen === 'bonus' && <BonusControl />}

        <ApiConfigControl />
      </div>
    </div>
  );
}
