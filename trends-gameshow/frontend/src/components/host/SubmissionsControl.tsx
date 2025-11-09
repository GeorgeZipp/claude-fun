import { useGameStore } from '../../store';
import { Trash2 } from 'lucide-react';

export default function SubmissionsControl() {
  const { teams, submissions, setSubmission, clearSubmissions } = useGameStore();
  const activeTeams = teams.filter(t => t.active);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-header">Team Submissions</h2>
        <button onClick={clearSubmissions} className="btn btn-sm btn-danger flex items-center gap-1">
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {activeTeams.map((team) => {
          const submission = submissions[team.id];
          const phrase = submission?.phrase || '';
          const position = submission?.position || 'after';

          return (
            <div key={team.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                <span className="text-sm font-semibold text-gray-900">{team.name}</span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => setSubmission(team.id, e.target.value, position)}
                  placeholder="Enter phrase..."
                  className="input w-full text-sm"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setSubmission(team.id, phrase, 'after')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      position === 'after'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    After
                  </button>
                  <button
                    onClick={() => setSubmission(team.id, phrase, 'before')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      position === 'before'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Before
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
