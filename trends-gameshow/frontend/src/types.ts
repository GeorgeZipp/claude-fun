export type ScreenType = 'welcome' | 'reveal' | 'naming' | 'wager' | 'compare' | 'scoreboard' | 'bonus';
export type ViewMode = 'split' | 'host-only' | 'display-only';
export type RoundType = 'standard' | 'naming' | 'bonus' | 'wager';
export type DateRangePreset = 'past_hour' | 'past_day' | 'past_7_days' | 'past_30_days' | 'past_90_days' | 'past_12_months' | 'past_5_years' | 'custom';

export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
  active: boolean;
  wager?: number;
}

export interface DateRange {
  start?: Date;
  end?: Date;
  preset: DateRangePreset;
}

export interface Round {
  id: string;
  term: string;
  type: RoundType;
  multiplier: number;
  wagerEnabled: boolean;
  wagerRange: { min: number; max: number };
  dateRange: DateRange;
  region: string;
  autoFetch: boolean;
  namingPosition?: 'before' | 'after'; // Where team submissions go relative to the base term
}

export interface TrendsDataPoint {
  date: string;
  value: number;
}

export interface TrendsData {
  phrase: string;
  averageInterest: number;
  peakInterest: number;
  peakDate: string;
  relativeScore: number;
  dataPoints: TrendsDataPoint[];
}

export interface CompareResult {
  teamId: string;
  teamName: string;
  teamColor: string;
  phrase: string;
  points: number;
  wager?: number;
  won?: boolean;
  trendsData?: TrendsData;
  source: 'api' | 'manual';
}

export interface TimerState {
  seconds: number;
  running: boolean;
  visible: boolean;
}

export interface GameState {
  teams: Team[];
  rounds: Round[];
  currentRoundIndex: number;
  displayScreen: ScreenType;
  viewMode: ViewMode;
  timer: TimerState;
  submissions: Record<string, string>;
  compareResults: CompareResult[];
  wagers: Record<string, number>;
  bonusConfig: {
    term: string;
    visible: boolean;
    multiplier: number;
  };
  apiConfig: {
    defaultDateRange: DateRangePreset;
    defaultRegion: string;
    cacheEnabled: boolean;
  };
  displayConfig: {
    showGraph: boolean;
    showBars: boolean;
    animationSpeed: number;
  };
  settings: {
    showTeamScores: boolean;
  };
}
