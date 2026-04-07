import { useAppStore } from '../store';
import { 
  Cpu, 
  Plus, 
  Trash2, 
  Play,
  Pause,
  RefreshCw,
  Activity,
  MemoryStick,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Agent } from '../types';
import { formatDistanceToNow } from 'date-fns';

// Agent status indicator
function AgentStatusIndicator({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; pulse: boolean }> = {
    active: { color: 'bg-green-500', pulse: true },
    idle: { color: 'bg-gray-500', pulse: false },
    waiting: { color: 'bg-yellow-500', pulse: true },
    completed: { color: 'bg-blue-500', pulse: false },
    failed: { color: 'bg-red-500', pulse: false },
  };
  
  const config = statusConfig[status] || statusConfig.idle;
  
  return (
    <span 
      className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? 'pulse-green' : ''}`}
    />
  );
}

// Agent card
function AgentCard({ agent }: { agent: Agent }) {
  const killAgent = async (agentId: string) => {
    try {
      await fetch(`/api/agents/${agentId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to kill agent:', error);
    }
  };
  
  const progress = agent.progress || 0;
  
  return (
    <div className={`agent-card ${agent.status === 'active' ? 'agent-active' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AgentStatusIndicator status={agent.status} />
          <span className="font-medium">{agent.name || agent.agent_id}</span>
        </div>
        <span className="text-xs text-gray-500 uppercase">{agent.status}</span>
      </div>
      
      {/* Current task */}
      {agent.current_task && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Tâche en cours:</div>
          <div className="text-sm truncate">{agent.current_task}</div>
        </div>
      )}
      
      {/* Progress bar */}
      {agent.status === 'active' && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        <div className="bg-dark-700 rounded p-2 text-center">
          <Activity className="w-4 h-4 mx-auto mb-1 text-gray-400" />
          <div className="text-gray-500">Complétées</div>
          <div className="font-semibold">{agent.tasks_completed}</div>
        </div>
        <div className="bg-dark-700 rounded p-2 text-center">
          <MemoryStick className="w-4 h-4 mx-auto mb-1 text-gray-400" />
          <div className="text-gray-500">Mémoire</div>
          <div className="font-semibold">{agent.memory_usage || 0} MB</div>
        </div>
        <div className="bg-dark-700 rounded p-2 text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-gray-400" />
          <div className="text-gray-500">Actif depuis</div>
          <div className="font-semibold text-xs">
            {formatDistanceToNow(new Date(agent.started_at), { addSuffix: false })}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => killAgent(agent.agent_id)}
          className="btn btn-ghost text-red-400 flex-1 flex items-center justify-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default function AgentPanel() {
  const { agents, spawnAgent, fetchAgents } = useAppStore();
  
  // Add killAgent to store if needed
  const killAgent = async (agentId: string) => {
    try {
      await fetch(`/api/agents/${agentId}`, { method: 'DELETE' });
      fetchAgents();
    } catch (error) {
      console.error('Failed to kill agent:', error);
    }
  };
  
  const handleSpawnAgent = async () => {
    await spawnAgent();
  };
  
  const activeAgents = agents.filter(a => a.status === 'active');
  const idleAgents = agents.filter(a => a.status === 'idle');
  const completedAgents = agents.filter(a => a.status === 'completed');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sous-Agents</h2>
          <p className="text-sm text-gray-500">
            {activeAgents.length} actif(s) sur {agents.length}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchAgents()}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSpawnAgent}
            className="btn btn-primary flex items-center gap-2"
            disabled={agents.length >= 8}
          >
            <Plus className="w-4 h-4" />
            Spawn Agent
          </button>
        </div>
      </div>
      
      {/* Overall stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-dark-800 rounded-lg p-3 text-center">
          <Cpu className="w-5 h-5 mx-auto mb-1 text-primary-400" />
          <div className="text-2xl font-bold">{agents.length}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 text-center">
          <Activity className="w-5 h-5 mx-auto mb-1 text-green-400" />
          <div className="text-2xl font-bold text-green-400">{activeAgents.length}</div>
          <div className="text-xs text-gray-500">Actifs</div>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 text-center">
          <Pause className="w-5 h-5 mx-auto mb-1 text-gray-400" />
          <div className="text-2xl font-bold">{idleAgents.length}</div>
          <div className="text-xs text-gray-500">Inactifs</div>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 text-center">
          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <div className="text-2xl font-bold text-blue-400">
            {agents.reduce((sum, a) => sum + a.tasks_completed, 0)}
          </div>
          <div className="text-xs text-gray-500">Terminées</div>
        </div>
      </div>
      
      {/* Agent list */}
      <div className="grid grid-cols-2 gap-4">
        {agents.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <Cpu className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun agent actif</p>
            <p className="text-sm">Spawn un agent pour commencer</p>
          </div>
        ) : (
          agents.map((agent) => (
            <AgentCard key={agent.agent_id} agent={agent} />
          ))
        )}
      </div>
    </div>
  );
}
