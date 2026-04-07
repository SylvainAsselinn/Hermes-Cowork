import { useAppStore } from '../store';
import { 
  Wifi, 
  WifiOff, 
  Cpu, 
  HardDrive, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function StatusBar() {
  const { wsConnected, stats, agents } = useAppStore();
  
  // Calculate status
  const hasErrors = stats?.tasks_failed && stats.tasks_failed > 0;
  const activeAgents = agents.filter(a => a.status === 'active').length;
  
  return (
    <div className="h-8 bg-dark-900 border-t border-dark-700 flex items-center justify-between px-4 text-xs">
      {/* Left - Connection & Status */}
      <div className="flex items-center gap-4">
        {/* WebSocket */}
        <div className="flex items-center gap-1.5">
          {wsConnected ? (
            <>
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-gray-400">WS OK</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-red-400" />
              <span className="text-red-400">WS OFF</span>
            </>
          )}
        </div>
        
        {/* Agents */}
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-primary-400" />
          <span className="text-gray-400">{activeAgents} agent{activeAgents !== 1 ? 's' : ''}</span>
        </div>
        
        {/* Storage */}
        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3 h-3 text-gray-500" />
          <span className="text-gray-400">{stats?.storage_used || '0 GB'}</span>
        </div>
        
        {/* Errors */}
        {hasErrors && (
          <div className="flex items-center gap-1.5 text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>{stats?.tasks_failed} erreur(s)</span>
          </div>
        )}
      </div>
      
      {/* Center - Branding */}
      <div className="flex items-center gap-2 text-gray-600">
        <span className="font-medium">Hermes Cowork</span>
        <span>•</span>
        <span>v1.0</span>
      </div>
      
      {/* Right - Uptime */}
      <div className="flex items-center gap-4 text-gray-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>{stats?.uptime || '0h 0m'}</span>
        </div>
        
        <div className="text-gray-600">
          {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
