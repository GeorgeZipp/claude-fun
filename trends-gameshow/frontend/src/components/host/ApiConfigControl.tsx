import { useState } from 'react';
import { useGameStore } from '../../store';
import { trendsApi } from '../../api';
import { Server, Trash2 } from 'lucide-react';
import type { DateRangePreset } from '../../types';

export default function ApiConfigControl() {
  const { apiConfig, setApiConfig } = useGameStore();
  const [cacheSize, setCacheSize] = useState(0);

  const loadCacheStatus = async () => {
    try {
      const status = await trendsApi.getCacheStatus();
      setCacheSize(status.cacheSize);
    } catch (err) {
      console.error('Failed to load cache status:', err);
    }
  };

  const handleClearCache = async () => {
    if (confirm('Clear all cached Google Trends data?')) {
      try {
        await trendsApi.clearCache();
        setCacheSize(0);
        alert('Cache cleared successfully');
      } catch (err) {
        alert('Failed to clear cache');
      }
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Server className="w-5 h-5" />
        Google Trends API
      </h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium block mb-1">Default Date Range</label>
          <select
            value={apiConfig.defaultDateRange}
            onChange={(e) => setApiConfig({ defaultDateRange: e.target.value as DateRangePreset })}
            className="input w-full text-sm"
          >
            <option value="past_hour">Past Hour</option>
            <option value="past_day">Past Day</option>
            <option value="past_7_days">Past 7 Days</option>
            <option value="past_30_days">Past 30 Days</option>
            <option value="past_90_days">Past 90 Days</option>
            <option value="past_12_months">Past 12 Months</option>
            <option value="past_5_years">Past 5 Years</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Default Region</label>
          <select
            value={apiConfig.defaultRegion}
            onChange={(e) => setApiConfig({ defaultRegion: e.target.value })}
            className="input w-full text-sm"
          >
            <option value="">Worldwide</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="IN">India</option>
            <option value="BR">Brazil</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-gray-600">Cache: {cacheSize} queries</div>
          <div className="flex gap-2">
            <button onClick={loadCacheStatus} className="btn btn-sm bg-gray-200 text-xs">
              Refresh
            </button>
            <button onClick={handleClearCache} className="btn btn-sm bg-red-500 text-white flex items-center gap-1 text-xs">
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
