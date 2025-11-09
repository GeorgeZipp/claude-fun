import { useState } from 'react';
import { useGameStore } from '../../store';
import { trendsApi } from '../../api';
import { Download, Loader2, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function ResultsControl() {
  const {
    teams,
    rounds,
    currentRoundIndex,
    submissions,
    compareResults,
    addResult,
    deleteResult,
    clearResults,
    applyResultsToScores,
    displayConfig,
    setDisplayConfig,
  } = useGameStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntries, setManualEntries] = useState<Record<string, { phrase: string; points: string }>>({});

  const currentRound = rounds[currentRoundIndex];

  const handleFetchResults = async () => {
    if (!currentRound) {
      setError('No round selected');
      return;
    }

    const activeTeams = teams.filter(t => t.active);
    const phrases: string[] = [];

    // Build phrases array
    if (currentRound.type === 'naming') {
      // For naming rounds, use team submissions combined with base term
      // Each team can choose their own position (before or after)
      activeTeams.forEach(team => {
        const submission = submissions[team.id];
        if (submission && submission.phrase) {
          const position = submission.position || 'after';
          // Position determines order: before means "submission term", after means "term submission"
          const phrase = position === 'before'
            ? `${submission.phrase} ${currentRound.term}`
            : `${currentRound.term} ${submission.phrase}`;
          phrases.push(phrase);
        }
      });
    } else {
      // For standard rounds, just use the term
      phrases.push(currentRound.term);
    }

    if (phrases.length === 0) {
      setError('No phrases to search for');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await trendsApi.compare({
        phrases,
        dateRange: currentRound.dateRange,
        region: currentRound.region,
      });

      // Clear existing results
      clearResults();

      // Add results for each team
      if (currentRound.type === 'naming') {
        activeTeams.forEach((team, index) => {
          const trendsData = response.results[index];
          if (trendsData) {
            addResult({
              teamId: team.id,
              teamName: team.name,
              teamColor: team.color,
              phrase: submissions[team.id]?.phrase || '',
              points: trendsData.relativeScore,
              trendsData,
              source: 'api',
            });
          }
        });
      } else {
        // For standard rounds, award points to highest score
        const trendsData = response.results[0];
        if (trendsData) {
          // Award points to all teams (could be customized)
          activeTeams.forEach(team => {
            addResult({
              teamId: team.id,
              teamName: team.name,
              teamColor: team.color,
              phrase: currentRound.term,
              points: trendsData.relativeScore,
              trendsData,
              source: 'api',
            });
          });
        }
      }

      setSuccess('Results fetched successfully!' + (response.cached ? ' (from cache)' : ''));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntryToggle = () => {
    setShowManualEntry(!showManualEntry);
    if (!showManualEntry) {
      // Initialize empty entries for all active teams
      const activeTeams = teams.filter(t => t.active);
      const entries: Record<string, { phrase: string; points: string }> = {};
      activeTeams.forEach(team => {
        entries[team.id] = { phrase: '', points: '0' };
      });
      setManualEntries(entries);
    }
  };

  const handleManualEntryChange = (teamId: string, field: 'phrase' | 'points', value: string) => {
    setManualEntries(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [field]: value
      }
    }));
  };

  const handleManualSubmit = () => {
    clearResults();
    const activeTeams = teams.filter(t => t.active);

    activeTeams.forEach(team => {
      const entry = manualEntries[team.id];
      if (entry && entry.phrase) {
        addResult({
          teamId: team.id,
          teamName: team.name,
          teamColor: team.color,
          phrase: entry.phrase,
          points: parseInt(entry.points) || 0,
          source: 'manual',
        });
      }
    });

    setSuccess('Manual results added!');
    setShowManualEntry(false);
  };

  const handleApplyScores = () => {
    if (confirm('Apply these results to team scores?')) {
      applyResultsToScores();
      setSuccess('Scores updated!');
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3">Results Manager</h2>

      {/* Fetch Button */}
      <button
        onClick={handleFetchResults}
        disabled={loading || !currentRound}
        className="btn btn-primary w-full mb-3 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {loading ? 'Fetching...' : 'Fetch from Google Trends'}
      </button>

      {/* Status */}
      {error && <div className="p-2 bg-red-100 text-red-700 rounded mb-3 text-sm">{error}</div>}
      {success && <div className="p-2 bg-green-100 text-green-700 rounded mb-3 text-sm">{success}</div>}

      {/* Results List */}
      {compareResults.length > 0 && (
        <>
          <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
            {compareResults.map((result) => (
              <div key={result.teamId} className="p-2 bg-gray-50 rounded border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: result.teamColor }} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{result.teamName}</div>
                      <div className="text-xs text-gray-600">{result.phrase}</div>
                      <div className="text-xs font-bold text-blue-600">{result.points} pts</div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteResult(result.teamId)}
                    className="btn btn-sm bg-red-500 text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={displayConfig.showGraph}
                onChange={(e) => setDisplayConfig({ showGraph: e.target.checked })}
              />
              Show Graph on Display
            </label>

            <button
              onClick={handleApplyScores}
              className="btn btn-success w-full flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Apply Points to Scores
            </button>
          </div>
        </>
      )}

      {/* Manual Entry */}
      <div className="mt-3 pt-3 border-t">
        {!showManualEntry ? (
          <button
            onClick={handleManualEntryToggle}
            className="btn bg-gray-200 w-full flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Enter Manually Instead
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold">Manual Entry</h3>
              <button
                onClick={() => setShowManualEntry(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-3">
              {teams.filter(t => t.active).map(team => (
                <div key={team.id} className="p-3 bg-gray-50 rounded border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                    <span className="text-sm font-medium">{team.name}</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Phrase</label>
                      <input
                        type="text"
                        value={manualEntries[team.id]?.phrase || ''}
                        onChange={(e) => handleManualEntryChange(team.id, 'phrase', e.target.value)}
                        placeholder="Enter phrase..."
                        className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Points (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={manualEntries[team.id]?.points || '0'}
                        onChange={(e) => handleManualEntryChange(team.id, 'points', e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleManualSubmit}
              className="btn btn-success w-full flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Manual Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
