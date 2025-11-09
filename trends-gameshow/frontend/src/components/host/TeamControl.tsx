import { useGameStore } from '../../store';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

export default function TeamControl() {
  const { teams, addTeam, updateTeam, deleteTeam, adjustScore, resetAllScores } = useGameStore();

  const handleResetScores = () => {
    if (confirm('Reset all team scores to 0?')) {
      resetAllScores();
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Teams</h2>
        <button onClick={handleResetScores} className="btn btn-sm bg-red-500 text-white flex items-center gap-1">
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      <div className="space-y-3 mb-3 max-h-96 overflow-y-auto">
        {teams.map((team) => (
          <div key={team.id} className="p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
              <input
                type="text"
                value={team.name}
                onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                className="input flex-1 text-sm font-medium"
              />
              <button
                onClick={() => deleteTeam(team.id)}
                disabled={teams.length <= 2}
                className="btn btn-sm btn-danger"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={team.score}
                onChange={(e) => updateTeam(team.id, { score: Math.max(0, parseInt(e.target.value) || 0) })}
                className="input w-20 text-center font-bold"
                min="0"
              />
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => adjustScore(team.id, -10)} className="btn btn-sm bg-red-100 text-red-600 px-2">-10</button>
                <button onClick={() => adjustScore(team.id, -1)} className="btn btn-sm bg-red-50 text-red-600 px-2">-1</button>
                <button onClick={() => adjustScore(team.id, 1)} className="btn btn-sm bg-green-50 text-green-600 px-2">+1</button>
                <button onClick={() => adjustScore(team.id, 5)} className="btn btn-sm bg-green-100 text-green-600 px-2">+5</button>
                <button onClick={() => adjustScore(team.id, 10)} className="btn btn-sm bg-green-100 text-green-600 px-2">+10</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addTeam}
        disabled={teams.length >= 8}
        className="btn btn-primary w-full flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Team
      </button>
    </div>
  );
}
