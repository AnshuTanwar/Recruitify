import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Check } from 'lucide-react';

const FileUpload = ({ 
  onFileSelect, 
  accept = "*/*",
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = "",
  placeholder = "Drop files here or click to browse"
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      error: validateFile(file),
      uploaded: false
    }));

    if (multiple) {
      setFiles(prev => [...prev, ...newFiles]);
    } else {
      setFiles(newFiles);
    }

    // Simulate upload process
    newFiles.forEach(fileObj => {
      if (!fileObj.error) {
        setTimeout(() => {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, uploaded: true } : f
          ));
          onFileSelect?.(fileObj.file);
        }, 1000 + Math.random() * 2000);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-teal-400 bg-teal-50/10 scale-105' 
            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <motion.div
          className="space-y-4"
          animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-white mb-2">
              {placeholder}
            </p>
            <p className="text-sm text-white/60">
              Maximum file size: {formatFileSize(maxSize)}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {files.map((fileObj) => (
              <motion.div
                key={fileObj.id}
                className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex-shrink-0">
                  {fileObj.error ? (
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  ) : fileObj.uploaded ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <File className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-white/60">
                    {formatFileSize(fileObj.file.size)}
                  </p>
                  {fileObj.error && (
                    <p className="text-xs text-red-400 mt-1">
                      {fileObj.error}
                    </p>
                  )}
                </div>

                {/* Upload Progress */}
                {!fileObj.error && !fileObj.uploaded && (
                  <div className="flex-shrink-0">
                    <motion.div
                      className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                )}

                {/* Remove Button */}
                <motion.button
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileObj.id);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white/60 hover:text-white" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
