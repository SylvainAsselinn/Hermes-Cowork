import { useEffect, useState } from 'react';
import { useAppStore } from './store';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import TaskList from './components/TaskList';
import AgentPanel from './components/AgentPanel';
import ChatPanel from './components/ChatPanel';
import StatusBar from './components/StatusBar';
import Header from './components/Header';
import QuickActions from './components/QuickActions';
import FilePreview from './components/FilePreview';

function App() {
 const { 
 fetchTasks, 
 fetchDirectory, 
 fetchAgents, 
 fetchChatHistory, 
 fetchStats,
 connectWebSocket,
 activeTab,
 sidebarOpen,
 } = useAppStore();
 
 const [previewFile, setPreviewFile] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    fetchTasks();
    fetchDirectory();
    fetchAgents();
    fetchChatHistory();
    fetchStats();
    
    // Connect WebSocket
    connectWebSocket();
    
    // Refresh intervals
    const statsInterval = setInterval(fetchStats, 10000);
    const agentsInterval = setInterval(fetchAgents, 5000);
    
    return () => {
      clearInterval(statsInterval);
      clearInterval(agentsInterval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-dark-950 text-white overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && <Sidebar />}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Main area */}
        <div className="flex-1 flex overflow-hidden">
{/* Left panel - File explorer */}
 <div className="w-80 border-r border-dark-700 flex flex-col overflow-hidden">
 <FileExplorer onFileOpen={setPreviewFile} />
          </div>
          
          {/* Center panel - Tasks/Agents */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab content */}
            <div className="flex-1 overflow-auto p-4">
              {activeTab === 'files' && <TaskList />}
              {activeTab === 'agents' && <AgentPanel />}
            </div>
          </div>
          
          {/* Right panel - Chat */}
          <div className="w-96 border-l border-dark-700 flex flex-col overflow-hidden">
            <ChatPanel />
          </div>
        </div>
        
        {/* Quick actions bar */}
        <QuickActions />
        
{/* Status bar */}
 <StatusBar />
 </div>
 
 {/* File Preview Modal */}
 <FilePreview path={previewFile} onClose={() => setPreviewFile(null)} />
 </div>
 );
}

export default App;
