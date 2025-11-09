import { useGameStore } from '../../store';
import { Star } from 'lucide-react';

export default function BonusControl() {
  const { bonusConfig, setBonusTerm, setBonusVisible, setBonusMultiplier } = useGameStore();

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Bonus Round
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium block mb-1">Bonus Term</label>
          <input
            type="text"
            value={bonusConfig.term}
            onChange={(e) => setBonusTerm(e.target.value)}
            placeholder="Enter bonus term..."
            className="input w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Multiplier</label>
          <input
            type="number"
            value={bonusConfig.multiplier}
            onChange={(e) => setBonusMultiplier(parseInt(e.target.value) || 1)}
            min="1"
            max="10"
            className="input w-full"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bonusConfig.visible}
            onChange={(e) => setBonusVisible(e.target.checked)}
          />
          <span className="text-sm">Show on Display</span>
        </label>
      </div>
    </div>
  );
}
