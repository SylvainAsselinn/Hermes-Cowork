import { useState, useEffect } from 'react';
import { X, FileText, FileImage, FileCode, Download, ExternalLink, Loader2, Save, Edit3 } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';

interface FilePreviewProps {
  path: string | null;
  onClose: () => void;
}

export default function FilePreview({ path, onClose }: FilePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!path) return;
    
    setLoading(true);
    setError(null);
    setPreviewData(null);
    setIsEditing(false);
    setHasChanges(false);

    const fetchPreview = async () => {
      try {
        const response = await fetch(`/api/files/preview?path=${encodeURIComponent(path)}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || 'Failed to load preview');
        }

        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          setPreviewData(data);
          if (data.type === 'text') {
            setEditContent(data.content);
          }
        } else {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPreviewData({ 
            type: 'binary', 
            url, 
            contentType,
            filename: path.split('/').pop() 
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [path]);

  const handleSave = async () => {
    if (!path || !hasChanges) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/files/write?path=${encodeURIComponent(path)}&content=${encodeURIComponent(editContent)}&overwrite=true`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to save file');
      }
      
      setHasChanges(false);
      setPreviewData((prev: any) => ({ ...prev, content: editContent }));
      setIsEditing(false);
    } catch (err: any) {
      setError('Erreur de sauvegarde: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditChange = (value: string) => {
    setEditContent(value);
    setHasChanges(value !== previewData?.content);
  };

  if (!path) return null;

  const filename = path.split('/').pop() || path;
  const extension = filename.includes('.') ? '.' + filename.split('.').pop()?.toLowerCase() : '';

const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(extension);
const isPdf = extension === '.pdf';
const isEditable = previewData?.type === 'text';

  const getLanguage = () => {
    const langMap: Record<string, string> = {
      '.py': 'python', '.js': 'javascript', '.ts': 'typescript',
      '.jsx': 'jsx', '.tsx': 'tsx', '.java': 'java',
      '.cpp': 'cpp', '.c': 'c', '.go': 'go', '.rs': 'rust',
      '.rb': 'ruby', '.php': 'php', '.html': 'html', '.css': 'css',
      '.json': 'json', '.yaml': 'yaml', '.yml': 'yaml', '.xml': 'xml',
      '.sh': 'bash', '.sql': 'sql', '.md': 'markdown', '.txt': 'text'
    };
    return langMap[extension] || 'text';
  };

  const getHighlightClass = () => {
    const lang = getLanguage();
    if (Prism.languages[lang]) {
      return `language-${lang}`;
    }
    return 'language-text';
  };

  const highlightedCode = isEditing 
    ? editContent 
    : (previewData?.content || '');

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-dark-800 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-dark-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-dark-900">
          <div className="flex items-center gap-3">
{isImage ? <FileImage className="w-5 h-5 text-blue-400" /> :
 isPdf ? <FileText className="w-5 h-5 text-red-400" /> :
 isEditable ? <FileCode className="w-5 h-5 text-purple-400" /> :
 <FileText className="w-5 h-5 text-orange-400" />}
            <h3 className="font-medium truncate max-w-xl text-white">{filename}</h3>
            {hasChanges && <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-0.5 rounded">Modifie</span>}
          </div>
          <div className="flex items-center gap-2">
            {isEditable && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-dark-700 rounded transition-colors text-gray-400 hover:text-white"
                title="Editer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className={`p-2 rounded transition-colors flex items-center gap-1 ${
                  hasChanges ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-dark-700 text-gray-500'
                }`}
                title="Sauvegarder"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
            )}
            <a
              href={`/api/files/preview?path=${encodeURIComponent(path)}`}
              download={filename}
              className="p-2 hover:bg-dark-700 rounded transition-colors text-gray-400 hover:text-white"
              title="Telecharger"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-600/50 rounded transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-dark-950">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full text-red-400">
              <X className="w-12 h-12 mb-2" />
              <p>{error}</p>
            </div>
          )}

          {/* Text/Code Preview with Syntax Highlighting */}
          {isEditable && previewData?.content && !isEditing && (
            <div className="bg-dark-900 rounded-lg overflow-hidden border border-dark-700">
              <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-dark-700">
                <span className="text-xs text-gray-400 uppercase">{getLanguage()}</span>
                <span className="text-xs text-gray-500">{previewData.content.split('\n').length} lignes</span>
              </div>
              <pre className="p-4 overflow-auto max-h-[60vh] text-sm font-mono leading-relaxed">
                <code className={getHighlightClass()} dangerouslySetInnerHTML={{
                  __html: Prism.highlight(previewData.content, Prism.languages[getLanguage()] || Prism.languages.text, getLanguage())
                }} />
              </pre>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <div className="bg-dark-900 rounded-lg overflow-hidden border border-dark-700">
              <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-dark-700">
                <span className="text-xs text-gray-400 uppercase">Edition: {getLanguage()}</span>
                <button 
                  onClick={() => { setIsEditing(false); setEditContent(previewData.content); setHasChanges(false); }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Annuler
                </button>
              </div>
              <textarea
                value={editContent}
                onChange={(e) => handleEditChange(e.target.value)}
                className="w-full h-[60vh] p-4 bg-dark-950 text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                spellCheck={false}
              />
            </div>
          )}

          {/* Image Preview */}
          {isImage && previewData?.url && (
            <div className="flex items-center justify-center h-full">
              <img
                src={previewData.url}
                alt={filename}
                className="max-w-full max-h-[70vh] object-contain rounded shadow-lg"
              />
            </div>
          )}

{/* PDF Preview */}
{isPdf && previewData?.url && (
 <iframe
 src={previewData.url}
 className="w-full h-[70vh] rounded border border-dark-700"
 title={filename}
 />
 )}

{/* Office Files - Docx */}
{previewData?.type === 'docx' && (
 <div className="bg-dark-900 rounded-lg overflow-hidden border border-dark-700">
 <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-dark-700">
 <span className="text-xs text-gray-400">Word Document - {previewData.total_paragraphs} paragraphs, {previewData.total_tables} tables</span>
 </div>
 <div className="p-4 max-h-[60vh] overflow-auto">
 {previewData.paragraphs?.length > 0 && (
 <div className="mb-4">
 <h4 className="text-sm font-medium text-gray-400 mb-2">Contenu</h4>
 {previewData.paragraphs.slice(0, 50).map((p: string, i: number) => (
 <p key={i} className="text-gray-200 mb-2">{p}</p>
 ))}
 {previewData.paragraphs.length > 50 && (
 <p className="text-gray-500 text-sm">... et {previewData.paragraphs.length - 50} autres paragraphes</p>
 )}
 </div>
 )}
 {previewData.tables?.length > 0 && (
 <div className="mt-4">
 <h4 className="text-sm font-medium text-gray-400 mb-2">Tableaux</h4>
 {previewData.tables.slice(0, 5).map((table: string[][], ti: number) => (
 <div key={ti} className="mb-4 overflow-x-auto">
 <table className="min-w-full border border-dark-600">
 <tbody>
 {table.slice(0, 20).map((row, ri) => (
 <tr key={ri} className={ri === 0 ? 'bg-dark-800' : ''}>
 {row.map((cell, ci) => (
 <td key={ci} className="px-3 py-2 border border-dark-600 text-sm text-gray-300">{cell}</td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 )}

{/* Office Files - Xlsx */}
{previewData?.type === 'xlsx' && (
 <div className="bg-dark-900 rounded-lg overflow-hidden border border-dark-700">
 <div className="flex items-center gap-2 px-4 py-2 bg-dark-800 border-b border-dark-700 overflow-x-auto">
 {previewData.sheet_names?.map((name: string, i: number) => (
 <button key={name} className={`text-xs px-3 py-1 rounded ${i === 0 ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-400 hover:text-white'}`}>
 {name}
 </button>
 ))}
 </div>
 <div className="p-4 overflow-auto max-h-[60vh]">
 {Object.entries(previewData.sheets || {}).slice(0, 1).map(([sheetName, rows]: [string, any]) => (
 <div key={sheetName} className="overflow-x-auto">
 <table className="min-w-full border border-dark-600">
 <tbody>
 {rows.slice(0, 50).map((row: string[], ri: number) => (
 <tr key={ri} className={ri === 0 ? 'bg-dark-800 font-medium' : ''}>
 {row.map((cell: string, ci: number) => (
 <td key={ci} className="px-3 py-1.5 border border-dark-600 text-sm text-gray-300 whitespace-nowrap">{cell}</td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 {rows.length > 50 && (
 <p className="text-gray-500 text-sm mt-2">... et {rows.length - 50} autres lignes</p>
 )}
 </div>
 ))}
 </div>
 </div>
)}

{/* Office Files - Pptx */}
{previewData?.type === 'pptx' && (
 <div className="bg-dark-900 rounded-lg overflow-hidden border border-dark-700">
 <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-dark-700">
 <span className="text-xs text-gray-400">PowerPoint - {previewData.total_slides} slides</span>
 </div>
 <div className="p-4 max-h-[60vh] overflow-auto space-y-4">
 {previewData.slides?.map((slide: any) => (
 <div key={slide.slide_number} className="border border-dark-600 rounded-lg p-4">
 <div className="text-xs text-primary-400 mb-2">Slide {slide.slide_number}</div>
 {slide.shapes?.map((shape: any, si: number) => (
 <div key={si}>
 {shape.type === 'text' && <p className="text-gray-200">{shape.content}</p>}
 </div>
 ))}
 </div>
 ))}
 </div>
 </div>
)}

{/* Generic binary file */}
{!isImage && !isPdf && !isEditable && !['docx', 'xlsx', 'pptx'].includes(previewData?.type) && previewData?.type === 'binary' && (
 <div className="flex flex-col items-center justify-center h-full text-gray-400">
 <FileText className="w-16 h-16 mb-4" />
 <p className="text-lg mb-2">Apercu non disponible</p>
 <p className="text-sm">{filename}</p>
 <a
 href={previewData.url}
 download={filename}
 className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded transition-colors flex items-center gap-2"
 >
 <Download className="w-4 h-4" />
 Telecharger le fichier
 </a>
 </div>
 )}
        </div>
      </div>
    </div>
  );
}
