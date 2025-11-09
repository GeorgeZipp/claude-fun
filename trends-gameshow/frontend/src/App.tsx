import { useEffect } from 'react';
import { useGameStore } from './store';
import HostPanel from './components/HostPanel';
import DisplayScreen from './components/DisplayScreen';

function App() {
  const { viewMode, timer, tick } = useGameStore();

  // Timer tick
  useEffect(() => {
    if (!timer.running) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.running, tick]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100">
      {viewMode === 'split' && (
        <div className="flex h-full">
          <div className="w-1/3 h-full overflow-y-auto border-r-4 border-gray-300">
            <HostPanel />
          </div>
          <div className="flex-1 h-full">
            <DisplayScreen />
          </div>
        </div>
      )}

      {viewMode === 'host-only' && (
        <div className="h-full overflow-y-auto">
          <HostPanel />
        </div>
      )}

      {viewMode === 'display-only' && (
        <div className="h-full">
          <DisplayScreen />
        </div>
      )}
    </div>
  );
}

export default App;
