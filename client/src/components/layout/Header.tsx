import { useGameStore } from '../../stores/index.js';

export const Header = () => {
  const { currentPlayer, isConnected, gameStats } = useGameStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Palavras MMO</h1>
            <div className="ml-4 flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {currentPlayer && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{currentPlayer.nickname}</div>
                <div className="text-sm text-gray-500">Score: {currentPlayer.score}</div>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: currentPlayer.color }}
              >
                {currentPlayer.nickname.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {gameStats && (
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Words: {gameStats.foundWords}/{gameStats.totalWords}
              </div>
              <div className="text-sm text-gray-500">
                Players: {gameStats.activePlayers}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};