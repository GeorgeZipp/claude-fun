import { useState } from 'react';
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
    <div className="bg-white min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tv className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Host Control Panel</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('split')}
              className={`btn btn-sm ${viewMode === 'split' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
              title="Split View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('host-only')}
              className={`btn btn-sm ${viewMode === 'host-only' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
              title="Host Only"
            >
              <Tv className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('display-only')}
              className={`btn btn-sm ${viewMode === 'display-only' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
              title="Display Only"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Sections */}
      <div className="p-4 space-y-4">
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
