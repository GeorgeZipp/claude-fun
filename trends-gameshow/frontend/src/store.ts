import { create } from 'zustand';
import type { GameState, Team, Round, CompareResult, ScreenType, ViewMode } from './types';

const TEAM_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#F59E0B', // Yellow
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

const generateId = () => Math.random().toString(36).substr(2, 9);

interface GameStore extends GameState {
  // Team actions
  addTeam: () => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  adjustScore: (id: string, delta: number) => void;
  resetAllScores: () => void;

  // Round actions
  addRound: (round: Omit<Round, 'id'>) => void;
  updateRound: (id: string, updates: Partial<Round>) => void;
  deleteRound: (id: string) => void;
  setCurrentRound: (index: number) => void;
  nextRound: () => void;
  previousRound: () => void;

  // Screen actions
  setDisplayScreen: (screen: ScreenType) => void;
  setViewMode: (mode: ViewMode) => void;

  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerSeconds: (seconds: number) => void;
  setTimerVisible: (visible: boolean) => void;
  tick: () => void;

  // Submission actions
  setSubmission: (teamId: string, phrase: string, position: 'before' | 'after') => void;
  clearSubmissions: () => void;

  // Results actions
  addResult: (result: CompareResult) => void;
  updateResult: (teamId: string, updates: Partial<CompareResult>) => void;
  deleteResult: (teamId: string) => void;
  clearResults: () => void;
  applyResultsToScores: () => void;

  // Wager actions
  setWager: (teamId: string, amount: number) => void;
  clearWagers: () => void;

  // Bonus actions
  setBonusTerm: (term: string) => void;
  setBonusVisible: (visible: boolean) => void;
  setBonusMultiplier: (multiplier: number) => void;

  // Config actions
  setApiConfig: (config: Partial<GameState['apiConfig']>) => void;
  setDisplayConfig: (config: Partial<GameState['displayConfig']>) => void;
  setSettings: (settings: Partial<GameState['settings']>) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  teams: [
    { id: generateId(), name: 'Team Blue', score: 0, color: TEAM_COLORS[0], active: true },
    { id: generateId(), name: 'Team Red', score: 0, color: TEAM_COLORS[1], active: true },
  ],
  rounds: [],
  currentRoundIndex: 0,
  displayScreen: 'welcome',
  viewMode: 'split',
  timer: {
    seconds: 60,
    running: false,
    visible: true,
  },
  submissions: {},
  compareResults: [],
  wagers: {},
  bonusConfig: {
    term: '',
    visible: false,
    multiplier: 2,
  },
  apiConfig: {
    defaultDateRange: 'past_12_months',
    defaultRegion: 'US',
    cacheEnabled: true,
  },
  displayConfig: {
    showGraph: true,
    showBars: true,
    animationSpeed: 1,
  },
  settings: {
    showTeamScores: true,
  },

  // Team actions
  addTeam: () => set((state) => {
    if (state.teams.length >= 8) return state;
    const usedColors = state.teams.map(t => t.color);
    const availableColor = TEAM_COLORS.find(c => !usedColors.includes(c)) || TEAM_COLORS[state.teams.length % TEAM_COLORS.length];
    return {
      teams: [
        ...state.teams,
        {
          id: generateId(),
          name: `Team ${state.teams.length + 1}`,
          score: 0,
          color: availableColor,
          active: true,
        },
      ],
    };
  }),

  updateTeam: (id, updates) => set((state) => ({
    teams: state.teams.map(team =>
      team.id === id ? { ...team, ...updates } : team
    ),
  })),

  deleteTeam: (id) => set((state) => {
    if (state.teams.length <= 2) return state;
    return {
      teams: state.teams.filter(team => team.id !== id),
    };
  }),

  adjustScore: (id, delta) => set((state) => ({
    teams: state.teams.map(team =>
      team.id === id ? { ...team, score: Math.max(0, team.score + delta) } : team
    ),
  })),

  resetAllScores: () => set((state) => ({
    teams: state.teams.map(team => ({ ...team, score: 0 })),
  })),

  // Round actions
  addRound: (round) => set((state) => ({
    rounds: [...state.rounds, { ...round, id: generateId() }],
  })),

  updateRound: (id, updates) => set((state) => ({
    rounds: state.rounds.map(round =>
      round.id === id ? { ...round, ...updates } : round
    ),
  })),

  deleteRound: (id) => set((state) => {
    const newRounds = state.rounds.filter(round => round.id !== id);
    const currentIndex = state.currentRoundIndex;
    const newIndex = currentIndex >= newRounds.length ? Math.max(0, newRounds.length - 1) : currentIndex;
    return {
      rounds: newRounds,
      currentRoundIndex: newIndex,
    };
  }),

  setCurrentRound: (index) => set({ currentRoundIndex: index }),

  nextRound: () => set((state) => ({
    currentRoundIndex: Math.min(state.currentRoundIndex + 1, state.rounds.length - 1),
  })),

  previousRound: () => set((state) => ({
    currentRoundIndex: Math.max(state.currentRoundIndex - 1, 0),
  })),

  // Screen actions
  setDisplayScreen: (screen) => set({ displayScreen: screen }),

  setViewMode: (mode) => set({ viewMode: mode }),

  // Timer actions
  startTimer: () => set((state) => ({ timer: { ...state.timer, running: true } })),

  pauseTimer: () => set((state) => ({ timer: { ...state.timer, running: false } })),

  resetTimer: () => set((state) => ({ timer: { ...state.timer, running: false } })),

  setTimerSeconds: (seconds) => set((state) => ({
    timer: { ...state.timer, seconds, running: false },
  })),

  setTimerVisible: (visible) => set((state) => ({
    timer: { ...state.timer, visible },
  })),

  tick: () => set((state) => {
    if (!state.timer.running || state.timer.seconds <= 0) return state;
    const newSeconds = state.timer.seconds - 1;
    return {
      timer: {
        ...state.timer,
        seconds: newSeconds,
        running: newSeconds > 0,
      },
    };
  }),

  // Submission actions
  setSubmission: (teamId, phrase, position) => set((state) => ({
    submissions: { ...state.submissions, [teamId]: { phrase, position } },
  })),

  clearSubmissions: () => set({ submissions: {} }),

  // Results actions
  addResult: (result) => set((state) => ({
    compareResults: [...state.compareResults, result],
  })),

  updateResult: (teamId, updates) => set((state) => ({
    compareResults: state.compareResults.map(result =>
      result.teamId === teamId ? { ...result, ...updates } : result
    ),
  })),

  deleteResult: (teamId) => set((state) => ({
    compareResults: state.compareResults.filter(result => result.teamId !== teamId),
  })),

  clearResults: () => set({ compareResults: [] }),

  applyResultsToScores: () => set((state) => {
    const newTeams = state.teams.map(team => {
      const result = state.compareResults.find(r => r.teamId === team.id);
      if (!result) return team;

      let pointsToAdd = result.points;

      // Apply multiplier from current round
      const currentRound = state.rounds[state.currentRoundIndex];
      if (currentRound?.multiplier) {
        pointsToAdd *= currentRound.multiplier;
      }

      // Apply wager logic if applicable
      if (result.wager !== undefined) {
        if (result.won) {
          pointsToAdd += result.wager;
        } else {
          pointsToAdd = -result.wager;
        }
      }

      return {
        ...team,
        score: Math.max(0, team.score + pointsToAdd),
      };
    });

    return { teams: newTeams };
  }),

  // Wager actions
  setWager: (teamId, amount) => set((state) => ({
    wagers: { ...state.wagers, [teamId]: amount },
  })),

  clearWagers: () => set({ wagers: {} }),

  // Bonus actions
  setBonusTerm: (term) => set((state) => ({
    bonusConfig: { ...state.bonusConfig, term },
  })),

  setBonusVisible: (visible) => set((state) => ({
    bonusConfig: { ...state.bonusConfig, visible },
  })),

  setBonusMultiplier: (multiplier) => set((state) => ({
    bonusConfig: { ...state.bonusConfig, multiplier },
  })),

  // Config actions
  setApiConfig: (config) => set((state) => ({
    apiConfig: { ...state.apiConfig, ...config },
  })),

  setDisplayConfig: (config) => set((state) => ({
    displayConfig: { ...state.displayConfig, ...config },
  })),

  setSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings },
  })),
}));
