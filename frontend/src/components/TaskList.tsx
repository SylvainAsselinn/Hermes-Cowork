import { useAppStore } from '../store';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Pause,
  AlertCircle,
  Loader,
  MoreVertical,
  Play,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { formatDistanceToNow } from 'date-fns';

// Status icon
function StatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-gray-400" />;
    case 'in_progress':
      return <Loader className="w-4 h-4 text-blue-400 animate-spin" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-400" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4 text-gray-400" />;
    case 'paused':
      return <Pause className="w-4 h-4 text-yellow-400" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-400" />;
  }
}

// Status badge
function StatusBadge({ status }: { status: TaskStatus }) {
  const colors: Record<TaskStatus, string> = {
    pending: 'bg-gray-800 text-gray-400',
    in_progress: 'bg-blue-900/50 text-blue-400',
    completed: 'bg-green-900/50 text-green-400',
    failed: 'bg-red-900/50 text-red-400',
    cancelled: 'bg-gray-800 text-gray-500',
    paused: 'bg-yellow-900/50 text-yellow-400',
  };
  
  const labels: Record<TaskStatus, string> = {
    pending: 'En attente',
    in_progress: 'En cours',
    completed: 'Terminée',
    failed: 'Échouée',
    cancelled: 'Annulée',
    paused: 'En pause',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

// Priority badge
function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    low: 'text-gray-400',
    medium: 'text-blue-400',
    high: 'text-orange-400',
    urgent: 'text-red-400',
  };
  
  return (
    <span className={`text-xs ${colors[priority] || 'text-gray-400'}`}>
      {priority.toUpperCase()}
    </span>
  );
}

// Progress bar
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function TaskList() {
  const { tasks, loadingTasks, createTask, updateTask, deleteTask, selectedFiles } = useAppStore();
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    await createTask({
      title: newTaskTitle,
      input_files: selectedFiles,
      priority: 'medium',
    });
    
    setNewTaskTitle('');
    setShowNewTask(false);
  };
  
  const handleStartTask = async (taskId: number) => {
    await updateTask(taskId, { status: 'in_progress' as TaskStatus });
  };
  
  const handlePauseTask = async (taskId: number) => {
    await updateTask(taskId, { status: 'paused' as TaskStatus });
  };
  
  const handleCancelTask = async (taskId: number) => {
    await updateTask(taskId, { status: 'cancelled' as TaskStatus });
  };
  
  if (loadingTasks) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tâches</h2>
        <button
          onClick={() => setShowNewTask(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle tâche
        </button>
      </div>
      
      {/* New task form */}
      {showNewTask && (
        <div className="card animate-fade-in">
          <h3 className="font-medium mb-3">Nouvelle tâche</h3>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Titre de la tâche..."
            className="input w-full mb-3"
            autoFocus
          />
          {selectedFiles.length > 0 && (
            <div className="text-sm text-gray-400 mb-3">
              {selectedFiles.length} fichier(s) sélectionné(s)
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleCreateTask} className="btn btn-primary">
              Créer
            </button>
            <button onClick={() => setShowNewTask(false)} className="btn btn-secondary">
              Annuler
            </button>
          </div>
        </div>
      )}
      
      {/* Task list */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucune tâche</p>
            <p className="text-sm">Créez une nouvelle tâche pour commencer</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id}
              className="card card-hover"
            >
              {/* Main row */}
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              >
                <StatusIcon status={task.status} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{task.title}</span>
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  
                  {/* Progress */}
                  {task.status === 'in_progress' && (
                    <div className="flex items-center gap-2">
                      <ProgressBar progress={task.progress} />
                      <span className="text-xs text-gray-500">{task.progress}%</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                </div>
                
                <button className="p-1 hover:bg-dark-700 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              {/* Expanded details */}
              {expandedTask === task.id && (
                <div className="mt-4 pt-4 border-t border-dark-700 animate-fade-in">
                  {task.description && (
                    <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                  )}
                  
                  {task.input_files && task.input_files.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Fichiers en entrée:</div>
                      <div className="text-sm text-gray-300">
                        {task.input_files.join(', ')}
                      </div>
                    </div>
                  )}
                  
                  {task.result && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Résultat:</div>
                      <div className="bg-dark-800 rounded p-2 text-sm font-mono">
                        {task.result}
                      </div>
                    </div>
                  )}
                  
                  {task.error_message && (
                    <div className="mb-3">
                      <div className="text-xs text-red-400 mb-1">Erreur:</div>
                      <div className="bg-red-900/20 rounded p-2 text-sm text-red-400">
                        {task.error_message}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleStartTask(task.id)}
                        className="btn btn-primary flex items-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                        Démarrer
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => handlePauseTask(task.id)}
                        className="btn btn-secondary flex items-center gap-1"
                      >
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="btn btn-ghost text-red-400 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
