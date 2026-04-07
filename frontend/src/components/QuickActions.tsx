import { useAppStore } from '../store';
import { 
  FileSpreadsheet, 
  Presentation, 
  FileText, 
  Mail, 
  Globe,
  FilePlus,
  FolderPlus
} from 'lucide-react';

interface QuickButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

function QuickButton({ icon, label, onClick, color }: QuickButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors border border-dark-700 hover:border-${color}-500`}
    >
      <span className={`text-${color}-400`}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function QuickActions() {
  const { selectedFiles } = useAppStore();
  
  const handleNewDocument = () => {
    // TODO: Open modal for new document
    console.log('New document');
  };
  
  const handleNewExcel = () => {
    // TODO: Open modal for Excel creation
    console.log('New Excel');
  };
  
  const handleNewPowerPoint = () => {
    // TODO: Open modal for PowerPoint creation
    console.log('New PowerPoint');
  };
  
  const handleNewPDF = () => {
    // TODO: Open modal for PDF creation
    console.log('New PDF');
  };
  
  const handleSendEmail = () => {
    // TODO: Open email composer
    console.log('Send email');
  };
  
  const handleWebSearch = () => {
    // TODO: Open web search modal
    console.log('Web search');
  };
  
  return (
    <div className="px-4 py-3 border-t border-dark-700 bg-dark-900">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-gray-500 mr-2">Actions rapides:</span>
        
        <QuickButton
          icon={<FilePlus className="w-4 h-4" />}
          label="Nouveau doc"
          onClick={handleNewDocument}
          color="blue"
        />
        
        <QuickButton
          icon={<FileSpreadsheet className="w-4 h-4" />}
          label="Excel"
          onClick={handleNewExcel}
          color="green"
        />
        
        <QuickButton
          icon={<Presentation className="w-4 h-4" />}
          label="PowerPoint"
          onClick={handleNewPowerPoint}
          color="orange"
        />
        
        <QuickButton
          icon={<FileText className="w-4 h-4" />}
          label="PDF"
          onClick={handleNewPDF}
          color="red"
        />
        
        <QuickButton
          icon={<Mail className="w-4 h-4" />}
          label="Email"
          onClick={handleSendEmail}
          color="purple"
        />
        
        <QuickButton
          icon={<Globe className="w-4 h-4" />}
          label="Web"
          onClick={handleWebSearch}
          color="cyan"
        />
        
        {selectedFiles.length > 0 && (
          <div className="ml-4 text-xs text-gray-500 bg-dark-800 px-2 py-1 rounded">
            {selectedFiles.length} fichier(s) sélectionné(s)
          </div>
        )}
      </div>
    </div>
  );
}
