import { useAppStore } from '../store';
import { 
  FolderOpen, 
  Cpu, 
  MessageSquare, 
  Settings, 
  LayoutDashboard,
  ChevronLeft,
  FileText,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, stats, fetchStats } = useAppStore();
  
  const navItems = [
    { id: 'files' as const, label: 'Fichiers', icon: FolderOpen },
    { id: 'agents' as const, label: 'Agents', icon: Cpu },
  ];
  
  return (
    <div className="w-64 bg-dark-900 border-r border-dark-700 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Hermes Cowork</h1>
            <p className="text-xs text-gray-500">Dashboard v1.0</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-1 ${
              activeTab === item.id
                ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-500'
                : 'text-gray-400 hover:bg-dark-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Quick Stats */}
      <div className="p-4 border-t border-dark-700">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-dark-800 rounded-lg p-2">
            <div className="text-gray-500">Tâches</div>
            <div className="font-semibold text-white">{stats?.tasks_total || 0}</div>
          </div>
          <div className="bg-dark-800 rounded-lg p-2">
            <div className="text-gray-500">Actifs</div>
            <div className="font-semibold text-primary-400">{stats?.agents_active || 0}</div>
          </div>
          <div className="bg-dark-800 rounded-lg p-2">
            <div className="text-gray-500">En cours</div>
            <div className="font-semibold text-yellow-400">{stats?.tasks_in_progress || 0}</div>
          </div>
          <div className="bg-dark-800 rounded-lg p-2">
            <div className="text-gray-500">Terminées</div>
            <div className="font-semibold text-green-400">{stats?.tasks_completed || 0}</div>
          </div>
        </div>
      </div>
      
      {/* User */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
            S
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">Sylvain</div>
            <div className="text-xs text-gray-500">{stats?.uptime || '0h 0m'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
