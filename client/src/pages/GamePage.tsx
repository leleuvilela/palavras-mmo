import { useEffect } from 'react';
import { useSocket } from '../hooks/index.js';
import { useGameStore } from '../stores/index.js';
import { Header } from '../components/index.js';

export const GamePage = () => {
  const { isConnected } = useSocket();
  const { currentPlayer, setLoading } = useGameStore();

  useEffect(() => {
    setLoading(!isConnected);
  }, [isConnected, setLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to server...</p>
          </div>
        ) : !currentPlayer ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Game</h2>
            <p className="text-gray-600">Enter your nickname to start playing</p>
            {/* Nickname input form will be added here */}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Game board will be added here */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Game Board</h3>
                <p className="text-gray-500">Word search board will appear here</p>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {/* Sidebar with ranking and stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Player Ranking</h3>
                <p className="text-gray-500">Rankings will appear here</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};