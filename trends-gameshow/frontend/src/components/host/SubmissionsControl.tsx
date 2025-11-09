import { useGameStore } from '../../store';
import { Trash2 } from 'lucide-react';

export default function SubmissionsControl() {
  const { teams, submissions, setSubmission, clearSubmissions } = useGameStore();
  const activeTeams = teams.filter(t => t.active);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Team Submissions</h2>
        <button onClick={clearSubmissions} className="btn btn-sm bg-red-500 text-white flex items-center gap-1">
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        {activeTeams.map((team) => (
          <div key={team.id} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
            <span className="text-sm font-medium w-24">{team.name}:</span>
            <input
              type="text"
              value={submissions[team.id] || ''}
              onChange={(e) => setSubmission(team.id, e.target.value)}
              placeholder="Enter phrase..."
              className="input flex-1 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
