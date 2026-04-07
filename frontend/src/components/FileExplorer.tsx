import { useAppStore } from '../store';
import { 
 Folder, 
 File, 
 ChevronRight, 
 ChevronDown,
 FileText,
 FileImage,
 FileSpreadsheet,
 FileCode,
 FileArchive,
 MoreVertical,
 RefreshCw,
 ArrowUp,
 Home
} from 'lucide-react';
import { useState } from 'react';
import { FileInfo } from '../types';

// File icon based on extension
function FileIcon({ extension }: { extension: string }) {
 const ext = extension.toLowerCase();
 
 if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(ext)) {
 return <FileImage className="w-5 h-5 text-blue-400" />;
 }
 if (['.xlsx', '.xls', '.csv'].includes(ext)) {
 return <FileSpreadsheet className="w-5 h-5 text-green-400" />;
 }
 if (['.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.c', '.go', '.rs'].includes(ext)) {
 return <FileCode className="w-5 h-5 text-purple-400" />;
 }
 if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) {
 return <FileArchive className="w-5 h-5 text-yellow-400" />;
 }
 if (['.pdf', '.doc', '.docx', '.txt', '.md'].includes(ext)) {
 return <FileText className="w-5 h-5 text-orange-400" />;
 }
 
 return <File className="w-5 h-5 text-gray-400" />;
}

interface FileExplorerProps {
 onFileOpen?: (path: string) => void;
}

export default function FileExplorer({ onFileOpen }: FileExplorerProps) {
  const { 
    directoryListing, 
    currentDirectory, 
    fetchDirectory, 
    selectedFiles,
    selectFile,
  } = useAppStore();
  
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  
  // Quick access paths
  const quickAccess = [
    { name: 'Bureau', path: '/mnt/c/Users/Sylvain/Desktop' },
    { name: 'Documents', path: '/mnt/c/Users/Sylvain/Documents' },
    { name: 'Downloads', path: '/mnt/c/Users/Sylvain/Downloads' },
    { name: 'Home', path: '/home/sylvain' },
  ];
  
  const handleNavigate = (path: string) => {
    fetchDirectory(path);
  };
  
  const handleGoUp = () => {
    if (directoryListing?.parent) {
      fetchDirectory(directoryListing.parent);
    }
  };
  
  const handleRefresh = () => {
    fetchDirectory(currentDirectory);
  };
  
  if (!directoryListing) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-dark-700">
        <h2 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <Folder className="w-4 h-4" />
          Explorateur
        </h2>
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-1 mb-2">
          <button
            onClick={handleGoUp}
            className="p-1.5 hover:bg-dark-700 rounded transition-colors"
            title="Dossier parent"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-dark-700 rounded transition-colors"
            title="Actualiser"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        {/* Current path */}
        <div className="text-xs text-gray-500 truncate bg-dark-800 rounded px-2 py-1">
          {currentDirectory}
        </div>
      </div>
      
      {/* Quick access */}
      <div className="px-2 py-2 border-b border-dark-700">
        <div className="text-xs text-gray-500 mb-1 px-1">Accès rapide</div>
        <div className="flex flex-wrap gap-1">
          {quickAccess.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                currentDirectory === item.path
                  ? 'bg-primary-600/30 text-primary-400'
                  : 'hover:bg-dark-700 text-gray-400'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* File list */}
      <div className="flex-1 overflow-auto p-2">
        {/* Directories */}
        {directoryListing.directories.map((dir: FileInfo) => (
          <div
            key={dir.path}
            className={`file-item ${selectedFiles.includes(dir.path) ? 'bg-primary-600/20' : ''}`}
            onClick={() => handleNavigate(dir.path)}
            onContextMenu={(e) => {
              e.preventDefault();
              selectFile(dir.path);
            }}
          >
            <Folder className="w-5 h-5 text-yellow-400" />
            <span className="flex-1 truncate text-sm">{dir.name}</span>
            <span className="text-xs text-gray-500">{dir.size_human}</span>
          </div>
        ))}
        
        {/* Files */}
        {directoryListing.files.map((file: FileInfo) => (
          <div
            key={file.path}
            className={`file-item ${selectedFiles.includes(file.path) ? 'bg-primary-600/20' : ''}`}
onClick={() => selectFile(file.path)}
 onDoubleClick={() => onFileOpen?.(file.path)}
          >
            <FileIcon extension={file.extension} />
            <span className="flex-1 truncate text-sm">{file.name}</span>
            <span className="text-xs text-gray-500">{file.size_human}</span>
          </div>
        ))}
        
        {/* Empty state */}
        {directoryListing.directories.length === 0 && directoryListing.files.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Folder className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Dossier vide</p>
          </div>
        )}
      </div>
      
      {/* Footer stats */}
      <div className="p-2 border-t border-dark-700 text-xs text-gray-500">
        {directoryListing.total_files} fichiers • {directoryListing.total_directories} dossiers • {directoryListing.total_size_human}
      </div>
    </div>
  );
}
