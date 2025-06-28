import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  X, 
  Check,
  Brain,
  Loader2,
  Sparkles,
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { StudyMaterial } from '../../types';
import { simulateAIProcessing, analyzeFileContent } from '../../utils/aiSimulation';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  aiProcessing?: boolean;
  error?: string;
}

export default function FileUpload() {
  const { state, dispatch } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload PDF, DOC, TXT, or image files.';
    }

    return null;
  };

  const handleFiles = async (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert('Some files could not be uploaded:\n' + errors.join('\n'));
    }

    if (validFiles.length === 0) return;

    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      id: uuidv4(),
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    // Process each file
    for (const uploadedFile of newUploadedFiles) {
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadedFiles(prev => 
            prev.map(f => f.id === uploadedFile.id ? { ...f, progress } : f)
          );
        }

        // Mark as processing
        setUploadedFiles(prev => 
          prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'processing', aiProcessing: true } : f)
        );

        // Extract file content
        const content = await analyzeFileContent(uploadedFile.file);

        // Create study material
        const studyMaterial: StudyMaterial = {
          id: uuidv4(),
          title: uploadedFile.file.name.replace(/\.[^/.]+$/, ''),
          type: getFileType(uploadedFile.file),
          size: uploadedFile.file.size,
          uploadedAt: new Date(),
          uploadedBy: state.user?.id || 'demo-user',
          content,
          processingStatus: 'processing'
        };

        // Add to state
        dispatch({ type: 'ADD_STUDY_MATERIAL', payload: studyMaterial });

        // Simulate AI processing
        try {
          const aiResults = await simulateAIProcessing(studyMaterial, content);
          
          dispatch({
            type: 'UPDATE_STUDY_MATERIAL',
            payload: {
              id: studyMaterial.id,
              updates: {
                summary: aiResults.summary,
                questions: aiResults.questions,
                tags: aiResults.tags,
                processingStatus: 'completed'
              }
            }
          });

          setUploadedFiles(prev => 
            prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'completed', aiProcessing: false } : f)
          );
        } catch (error) {
          dispatch({
            type: 'UPDATE_STUDY_MATERIAL',
            payload: {
              id: studyMaterial.id,
              updates: { processingStatus: 'error' }
            }
          });

          setUploadedFiles(prev => 
            prev.map(f => f.id === uploadedFile.id ? { 
              ...f, 
              status: 'error', 
              aiProcessing: false,
              error: 'AI processing failed. Please try again.'
            } : f)
          );
        }
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(f => f.id === uploadedFile.id ? { 
            ...f, 
            status: 'error', 
            error: 'Upload failed. Please try again.'
          } : f)
        );
      }
    }
  };

  const getFileType = (file: File): StudyMaterial['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.includes('pdf')) return 'pdf';
    if (file.type.includes('document') || file.type.includes('msword')) return 'doc';
    return 'txt';
  };

  const getFileIcon = (type: StudyMaterial['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'doc':
        return <File className="w-8 h-8 text-blue-500" />;
      case 'image':
        return <Image className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const viewMaterial = (material: StudyMaterial) => {
    setSelectedMaterial(material);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Study Materials</h1>
        <p className="text-gray-600">Upload your documents and let AI generate summaries and questions</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
          dragActive 
            ? 'border-purple-400 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-300 hover:bg-purple-25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              y: dragActive ? -10 : 0,
              scale: dragActive ? 1.1 : 1
            }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4"
          >
            <Upload className="w-8 h-8 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Drop your files here, or <span className="text-purple-600">browse</span>
          </h3>
          <p className="text-gray-500 mb-6">
            Support for PDF, DOC, TXT, and image files up to 10MB
          </p>
          
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium cursor-pointer hover:shadow-lg transition-shadow"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Files
          </motion.label>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          />
        </div>
      </motion.div>

      {/* Processing Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Files</h2>
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile) => (
                <motion.div
                  key={uploadedFile.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200"
                >
                  {getFileIcon(getFileType(uploadedFile.file))}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{uploadedFile.file.name}</h3>
                      <div className="flex items-center space-x-2">
                        {uploadedFile.aiProcessing && (
                          <div className="flex items-center space-x-1 text-purple-600">
                            <Brain className="w-4 h-4" />
                            <Sparkles className="w-4 h-4 animate-pulse" />
                          </div>
                        )}
                        {uploadedFile.status === 'completed' && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                        {uploadedFile.status === 'processing' && (
                          <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                        )}
                        {uploadedFile.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <button
                          onClick={() => removeFile(uploadedFile.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          uploadedFile.status === 'error' 
                            ? 'bg-red-500' 
                            : 'bg-gradient-to-r from-purple-500 to-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadedFile.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </span>
                      <span className={`${
                        uploadedFile.status === 'error' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {uploadedFile.status === 'uploading' && 'Uploading...'}
                        {uploadedFile.status === 'processing' && 'AI Processing...'}
                        {uploadedFile.status === 'completed' && 'Complete'}
                        {uploadedFile.status === 'error' && (uploadedFile.error || 'Error')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Study Materials List */}
      {state.studyMaterials.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Study Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.studyMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  {getFileIcon(material.type)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{material.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatFileSize(material.size)}
                    </p>
                    
                    {material.tags && material.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {material.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs">
                        {material.processingStatus === 'completed' && material.summary && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Check className="w-3 h-3" />
                            <span>AI Processed</span>
                          </div>
                        )}
                        {material.processingStatus === 'processing' && (
                          <div className="flex items-center space-x-1 text-purple-600">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Processing</span>
                          </div>
                        )}
                        {material.processingStatus === 'error' && (
                          <div className="flex items-center space-x-1 text-red-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>Error</span>
                          </div>
                        )}
                      </div>
                      
                      {material.summary && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => viewMaterial(material)}
                          className="p-1 hover:bg-purple-50 rounded text-purple-600"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Material Details Modal */}
      <AnimatePresence>
        {selectedMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMaterial(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getFileIcon(selectedMaterial.type)}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedMaterial.title}</h2>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedMaterial.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {selectedMaterial.tags && selectedMaterial.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMaterial.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedMaterial.summary && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Summary</h3>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                    <p className="text-gray-700 leading-relaxed">{selectedMaterial.summary}</p>
                  </div>
                </div>
              )}

              {selectedMaterial.questions && selectedMaterial.questions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Practice Questions</h3>
                  <div className="space-y-4">
                    {selectedMaterial.questions.map((question, index) => (
                      <div key={question.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Q{index + 1}: {question.question}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            question.difficulty === 'easy' 
                              ? 'bg-green-100 text-green-700'
                              : question.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {question.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm"><strong>Answer:</strong> {question.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}