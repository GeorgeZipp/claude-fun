import { useGameStore } from '../../store';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar, Globe } from 'lucide-react';
import type { Round, DateRangePreset } from '../../types';

export default function RoundControl() {
  const {
    rounds,
    currentRoundIndex,
    setCurrentRound,
    nextRound,
    previousRound,
    addRound,
    updateRound,
    deleteRound,
    apiConfig,
  } = useGameStore();

  const currentRound = rounds[currentRoundIndex];

  const handleAddRound = () => {
    const term = prompt('Enter search term:');
    if (!term) return;

    const typeStr = prompt('Round type:\n1. Standard\n2. Naming\n3. Bonus\n4. Wager\n\nEnter number (1-4):', '1');
    const typeNum = parseInt(typeStr || '1');

    let type: Round['type'] = 'standard';
    let multiplier = 1;
    let wagerEnabled = false;
    let wagerRange = { min: 10, max: 100 };

    switch (typeNum) {
      case 2:
        type = 'naming';
        break;
      case 3:
        type = 'bonus';
        const multStr = prompt('Enter point multiplier:', '2');
        multiplier = parseInt(multStr || '2');
        break;
      case 4:
        type = 'wager';
        wagerEnabled = true;
        const minStr = prompt('Minimum wager:', '10');
        const maxStr = prompt('Maximum wager:', '200');
        wagerRange = { min: parseInt(minStr || '10'), max: parseInt(maxStr || '200') };
        break;
    }

    addRound({
      term,
      type,
      multiplier,
      wagerEnabled,
      wagerRange,
      dateRange: { preset: apiConfig.defaultDateRange },
      region: apiConfig.defaultRegion,
      autoFetch: true,
    });
  };

  const getTypeBadge = (round: Round) => {
    if (round.type === 'naming') return <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">NAMING</span>;
    if (round.type === 'bonus') return <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded">BONUS x{round.multiplier}</span>;
    if (round.type === 'wager') return <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">WAGER</span>;
    return null;
  };

  const dateRangeLabels: Record<DateRangePreset, string> = {
    past_hour: 'Past Hour',
    past_day: 'Past Day',
    past_7_days: 'Past 7 Days',
    past_30_days: 'Past 30 Days',
    past_90_days: 'Past 90 Days',
    past_12_months: 'Past 12 Months',
    past_5_years: 'Past 5 Years',
    custom: 'Custom',
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3">Round Control</h2>

      {/* Navigation */}
      {rounds.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={previousRound}
            disabled={currentRoundIndex === 0}
            className="btn btn-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 text-center">
            <div className="font-bold text-xl">Round {currentRoundIndex + 1} / {rounds.length}</div>
            {currentRound && (
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                <div className="font-medium">{currentRound.term} {getTypeBadge(currentRound)}</div>
                <div className="flex items-center justify-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {dateRangeLabels[currentRound.dateRange.preset]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {currentRound.region}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={nextRound}
            disabled={currentRoundIndex >= rounds.length - 1}
            className="btn btn-secondary"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Round List */}
      <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
        {rounds.map((round, index) => (
          <div
            key={round.id}
            className={`p-2 rounded-lg border-2 ${index === currentRoundIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-sm flex items-center gap-2">
                  Round {index + 1}: {round.term}
                  {getTypeBadge(round)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {dateRangeLabels[round.dateRange.preset]} • {round.region}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentRound(index)}
                  className="btn bg-blue-500 text-white text-xs px-2 py-1"
                >
                  Go
                </button>
                <button
                  onClick={() => deleteRound(round.id)}
                  className="btn bg-red-500 text-white text-xs px-2 py-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Round */}
      <button
        onClick={handleAddRound}
        className="btn btn-primary w-full flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Round
      </button>
    </div>
  );
}
