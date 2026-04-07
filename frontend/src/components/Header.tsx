import { useAppStore } from '../store';
import { 
  Menu, 
  Bell, 
  Settings, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Search
} from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { wsConnected, sidebarOpen, setSidebarOpen, fetchTasks, fetchDirectory } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleRefresh = () => {
    fetchTasks();
    fetchDirectory();
  };
  
  return (
    <header className="h-14 bg-dark-900 border-b border-dark-700 flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher fichiers, tâches..."
            className="w-80 bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>
      
      {/* Center - Status */}
      <div className="flex items-center gap-2">
        {wsConnected ? (
          <div className="flex items-center gap-1.5 text-green-400 text-sm">
            <Wifi className="w-4 h-4" />
            <span>Connecté</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-red-400 text-sm">
            <WifiOff className="w-4 h-4" />
            <span>Déconnecté</span>
          </div>
        )}
      </div>
      
      {/* Right section */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        
        <button className="p-2 hover:bg-dark-800 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
