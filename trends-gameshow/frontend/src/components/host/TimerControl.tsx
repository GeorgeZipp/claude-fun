import { useGameStore } from '../../store';
import { Play, Pause, RotateCcw, Eye, EyeOff, Clock } from 'lucide-react';

export default function TimerControl() {
  const { timer, startTimer, pauseTimer, resetTimer, setTimerSeconds, setTimerVisible } = useGameStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const setPreset = (seconds: number) => {
    setTimerSeconds(seconds);
  };

  const setCustomTime = () => {
    const input = prompt('Enter time in seconds:');
    if (input && !isNaN(parseInt(input))) {
      setTimerSeconds(parseInt(input));
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Timer Control
      </h2>

      {/* Display */}
      <div className={`text-4xl font-bold text-center mb-4 p-4 rounded-lg ${
        timer.seconds <= 10 && timer.running ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-800'
      }`}>
        {formatTime(timer.seconds)}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={startTimer}
          disabled={timer.running || timer.seconds === 0}
          className="btn btn-success flex-1 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start
        </button>
        <button
          onClick={pauseTimer}
          disabled={!timer.running}
          className="btn btn-warning flex-1 flex items-center justify-center gap-2"
        >
          <Pause className="w-4 h-4" />
          Pause
        </button>
        <button
          onClick={resetTimer}
          className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Presets */}
      <div className="flex gap-2 mb-3">
        <button onClick={() => setPreset(30)} className="btn bg-gray-200 flex-1 text-sm">30s</button>
        <button onClick={() => setPreset(60)} className="btn bg-gray-200 flex-1 text-sm">60s</button>
        <button onClick={() => setPreset(90)} className="btn bg-gray-200 flex-1 text-sm">90s</button>
        <button onClick={setCustomTime} className="btn bg-gray-200 flex-1 text-sm">Custom</button>
      </div>

      {/* Visibility */}
      <button
        onClick={() => setTimerVisible(!timer.visible)}
        className={`btn w-full flex items-center justify-center gap-2 ${timer.visible ? 'btn-primary' : 'bg-gray-300'}`}
      >
        {timer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        {timer.visible ? 'Visible on Display' : 'Hidden on Display'}
      </button>
    </div>
  );
}
