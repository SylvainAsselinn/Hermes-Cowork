"""
Hermes Cowork - File Manager
Handles all file system operations with safety checks
"""
import os
import shutil
import mimetypes
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any
import hashlib
import json

# Base directories - Windows paths via WSL
BASE_DIRS = {
    "desktop": "/mnt/c/Users/Sylvain/Desktop",
    "documents": "/mnt/c/Users/Sylvain/Documents",
    "downloads": "/mnt/c/Users/Sylvain/Downloads",
    "pictures": "/mnt/c/Users/Sylvain/Pictures",
    "home": "/home/sylvain",
}


class FileManager:
    """Secure file manager with deletion protection"""
    
    FORBIDDEN_PATHS = [
        "/etc/passwd",
        "/etc/shadow",
        "/root",
        "/boot",
        "/proc",
        "/sys",
    ]
    
    PROTECTED_FILES = [
        "conf.txt",
    ]
    
    def __init__(self, base_dir: str = "desktop"):
        self.base_dir = BASE_DIRS.get(base_dir, BASE_DIRS["desktop"])
        self.trash_dir = os.path.expanduser("~/.hermes/cowork/data/trash")
        os.makedirs(self.trash_dir, exist_ok=True)
    
    def _is_safe_path(self, path: str) -> bool:
        """Check if path is safe to access"""
        abs_path = os.path.abspath(path)
        
        # Check forbidden paths
        for forbidden in self.FORBIDDEN_PATHS:
            if abs_path.startswith(forbidden):
                return False
        
        # Check protected files
        for protected in self.PROTECTED_FILES:
            if abs_path.endswith(protected):
                return False
        
        return True
    
    def _is_windows_path(self, path: str) -> bool:
        """Check if path is in Windows filesystem"""
        return path.startswith("/mnt/c/") or path.startswith("/mnt/d/")
    
    def _get_size_human(self, size: int) -> str:
        """Convert bytes to human readable"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} PB"
    
    def get_file_info(self, path: str) -> Dict[str, Any]:
        """Get detailed file information"""
        try:
            abs_path = os.path.abspath(path)
            if not os.path.exists(abs_path):
                return {"error": "File not found"}
            
            stat = os.stat(abs_path)
            
            # Get extension and mime type
            _, ext = os.path.splitext(abs_path)
            mime_type, _ = mimetypes.guess_type(abs_path)
            
            return {
                "path": abs_path,
                "name": os.path.basename(abs_path),
                "extension": ext.lower(),
                "size": stat.st_size,
                "size_human": self._get_size_human(stat.st_size),
                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "created": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                "is_directory": os.path.isdir(abs_path),
                "is_file": os.path.isfile(abs_path),
                "permissions": oct(stat.st_mode)[-3:],
                "mime_type": mime_type,
            }
        except Exception as e:
            return {"error": str(e)}
    
    def list_directory(self, path: str = None) -> Dict[str, Any]:
        """List directory contents with details"""
        if path is None:
            path = self.base_dir
        
        try:
            abs_path = os.path.abspath(path)
            if not os.path.exists(abs_path):
                return {"error": "Directory not found", "path": path}
            
            if not os.path.isdir(abs_path):
                return {"error": "Not a directory", "path": path}
            
            files = []
            directories = []
            total_size = 0
            
            for item in os.listdir(abs_path):
                item_path = os.path.join(abs_path, item)
                info = self.get_file_info(item_path)
                
                if "error" not in info:
                    if info["is_directory"]:
                        directories.append(info)
                    else:
                        files.append(info)
                        total_size += info["size"]
            
            # Sort: directories first, then files (by name)
            directories.sort(key=lambda x: x["name"].lower())
            files.sort(key=lambda x: x["name"].lower())
            
            return {
                "path": abs_path,
                "parent": str(Path(abs_path).parent) if abs_path != "/" else None,
                "files": files,
                "directories": directories,
                "total_files": len(files),
                "total_directories": len(directories),
                "total_size": total_size,
                "total_size_human": self._get_size_human(total_size),
            }
        except PermissionError:
            return {"error": "Permission denied", "path": path}
        except Exception as e:
            return {"error": str(e), "path": path}
    
    def read_file(self, path: str, limit: int = 1000) -> Dict[str, Any]:
        """Read file content safely"""
        try:
            abs_path = os.path.abspath(path)
            
            if not self._is_safe_path(abs_path):
                return {"error": "Access to this path is forbidden"}
            
            if not os.path.exists(abs_path):
                return {"error": "File not found"}
            
            if os.path.isdir(abs_path):
                return {"error": "Cannot read a directory"}
            
            # Check file size (limit to 10MB for reading)
            size = os.path.getsize(abs_path)
            if size > 10 * 1024 * 1024:
                return {"error": f"File too large ({self._get_size_human(size)}). Use limit parameter."}
            
            # Try to read as text
            try:
                with open(abs_path, 'r', encoding='utf-8') as f:
                    lines = []
                    for i, line in enumerate(f):
                        if i >= limit:
                            lines.append(f"... (truncated, {i} lines shown)")
                            break
                        lines.append(line.rstrip('\n'))
                    return {
                        "success": True,
                        "path": abs_path,
                        "content": '\n'.join(lines),
                        "lines": len(lines),
                        "size": size,
                        "size_human": self._get_size_human(size),
                    }
            except UnicodeDecodeError:
                # Binary file
                return {
                    "success": True,
                    "path": abs_path,
                    "content": "[Binary file - cannot display as text]",
                    "binary": True,
                    "size": size,
                    "size_human": self._get_size_human(size),
                }
        except Exception as e:
            return {"error": str(e)}
    
    def write_file(self, path: str, content: str, overwrite: bool = False) -> Dict[str, Any]:
        """Write content to file"""
        try:
            abs_path = os.path.abspath(path)
            
            if not self._is_safe_path(abs_path):
                return {"error": "Access to this path is forbidden"}
            
            # Check if file exists
            if os.path.exists(abs_path) and not overwrite:
                return {"error": "File already exists. Use overwrite=True."}
            
            # Create parent directories
            os.makedirs(os.path.dirname(abs_path), exist_ok=True)
            
            # Write file
            with open(abs_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return {
                "success": True,
                "path": abs_path,
                "size": len(content.encode('utf-8')),
                "message": "File written successfully",
            }
        except Exception as e:
            return {"error": str(e)}
    
    def delete_check(self, paths: List[str]) -> Dict[str, Any]:
        """Check what would be deleted (before confirmation)"""
        total_size = 0
        file_count = 0
        dir_count = 0
        items = []
        
        for path in paths:
            abs_path = os.path.abspath(path)
            
            if not self._is_safe_path(abs_path):
                return {
                    "error": f"Cannot delete protected path: {path}",
                    "protected": True,
                }
            
            # Check for protected files
            for protected in self.PROTECTED_FILES:
                if abs_path.endswith(protected):
                    return {
                        "error": f"Cannot delete protected file: {protected}",
                        "protected": True,
                    }
            
            if os.path.isfile(abs_path):
                size = os.path.getsize(abs_path)
                total_size += size
                file_count += 1
                items.append({"path": abs_path, "type": "file", "size": size})
            elif os.path.isdir(abs_path):
                for root, dirs, files in os.walk(abs_path):
                    for f in files:
                        try:
                            size = os.path.getsize(os.path.join(root, f))
                            total_size += size
                            file_count += 1
                        except:
                            pass
                    dir_count += len(dirs) + 1
                items.append({"path": abs_path, "type": "directory"})
        
        return {
            "paths": paths,
            "items": items,
            "total_size": total_size,
            "total_size_human": self._get_size_human(total_size),
            "file_count": file_count,
            "directory_count": dir_count,
            "requires_confirmation": True,
        }
    
    def delete_files(self, paths: List[str], backup: bool = True) -> Dict[str, Any]:
        """Delete files with optional backup to trash"""
        deleted = []
        errors = []
        
        for path in paths:
            try:
                abs_path = os.path.abspath(path)
                
                if not self._is_safe_path(abs_path):
                    errors.append({"path": path, "error": "Forbidden path"})
                    continue
                
                # Check protected files
                for protected in self.PROTECTED_FILES:
                    if abs_path.endswith(protected):
                        errors.append({"path": path, "error": f"Protected file: {protected}"})
                        continue
                
                # Backup before delete
                if backup and os.path.exists(abs_path):
                    backup_name = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{os.path.basename(abs_path)}"
                    backup_path = os.path.join(self.trash_dir, backup_name)
                    try:
                        if os.path.isfile(abs_path):
                            shutil.copy2(abs_path, backup_path)
                        elif os.path.isdir(abs_path):
                            shutil.copytree(abs_path, backup_path)
                    except Exception as e:
                        errors.append({"path": path, "error": f"Backup failed: {e}"})
                        continue
                
                # Delete
                if os.path.isfile(abs_path):
                    os.remove(abs_path)
                    deleted.append({"path": path, "type": "file"})
                elif os.path.isdir(abs_path):
                    shutil.rmtree(abs_path)
                    deleted.append({"path": path, "type": "directory"})
                else:
                    errors.append({"path": path, "error": "Not found"})
            except Exception as e:
                errors.append({"path": path, "error": str(e)})
        
        return {
            "success": len(errors) == 0,
            "deleted": deleted,
            "errors": errors,
            "deleted_count": len(deleted),
            "error_count": len(errors),
        }
    
    def copy_file(self, source: str, destination: str) -> Dict[str, Any]:
        """Copy file or directory"""
        try:
            src_abs = os.path.abspath(source)
            dst_abs = os.path.abspath(destination)
            
            if not os.path.exists(src_abs):
                return {"error": "Source not found"}
            
            # Create destination parent
            os.makedirs(os.path.dirname(dst_abs), exist_ok=True)
            
            if os.path.isfile(src_abs):
                shutil.copy2(src_abs, dst_abs)
            else:
                shutil.copytree(src_abs, dst_abs)
            
            return {
                "success": True,
                "source": src_abs,
                "destination": dst_abs,
                "message": "Copied successfully",
            }
        except Exception as e:
            return {"error": str(e)}
    
    def move_file(self, source: str, destination: str) -> Dict[str, Any]:
        """Move file or directory"""
        try:
            src_abs = os.path.abspath(source)
            dst_abs = os.path.abspath(destination)
            
            if not os.path.exists(src_abs):
                return {"error": "Source not found"}
            
            # Create destination parent
            os.makedirs(os.path.dirname(dst_abs), exist_ok=True)
            
            shutil.move(src_abs, dst_abs)
            
            return {
                "success": True,
                "source": src_abs,
                "destination": dst_abs,
                "message": "Moved successfully",
            }
        except Exception as e:
            return {"error": str(e)}
    
    def search_files(self, pattern: str, directory: str = None, file_type: str = None) -> Dict[str, Any]:
        """Search for files matching pattern"""
        if directory is None:
            directory = self.base_dir
        
        results = []
        
        try:
            abs_dir = os.path.abspath(directory)
            pattern_lower = pattern.lower()
            
            for root, dirs, files in os.walk(abs_dir):
                # Limit search depth
                depth = root[len(abs_dir):].count(os.sep)
                if depth > 10:
                    continue
                
                for f in files:
                    if pattern_lower in f.lower():
                        full_path = os.path.join(root, f)
                        info = self.get_file_info(full_path)
                        
                        # Filter by type if specified
                        if file_type:
                            if file_type.lower() not in info.get("extension", "").lower():
                                continue
                        
                        if "error" not in info:
                            results.append(info)
            
            return {
                "success": True,
                "pattern": pattern,
                "directory": abs_dir,
                "results": results,
                "count": len(results),
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_quick_access_dirs(self) -> List[Dict[str, str]]:
        """Get quick access directories"""
        dirs = []
        for name, path in BASE_DIRS.items():
            if os.path.exists(path):
                dirs.append({"name": name.capitalize(), "path": path})
        return dirs


# Singleton instance
file_manager = FileManager()
