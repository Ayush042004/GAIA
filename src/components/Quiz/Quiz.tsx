import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Upload, 
  FileText, 
  Image, 
  Plus, 
  Clock, 
  Target,
  Trophy,
  Play,
  Settings,
  X,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  Download,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Quiz as QuizType, QuizQuestion, StudyMaterial } from '../../types';
import { generateQuizFromSyllabus, analyzeFileContent } from '../../utils/aiSimulation';
import { format } from 'date-fns';

interface UploadedSyllabus {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export default function Quiz() {
  const { state, dispatch } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [uploadedSyllabi, setUploadedSyllabi] = useState<UploadedSyllabus[]>([]);
  const [dragActive, setDragActive] = useState(false);
  
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    questionCount: 10,
    difficulty: 'mixed' as 'mixed' | 'easy' | 'medium' | 'hard',
    timeLimit: 30,
    syllabusFile: null as File | null
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload PDF, image, or text files.';
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

    const newUploadedSyllabi: UploadedSyllabus[] = validFiles.map(file => ({
      id: uuidv4(),
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadedSyllabi(prev => [...prev, ...newUploadedSyllabi]);

    // Process each file
    for (const uploadedSyllabus of newUploadedSyllabi) {
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadedSyllabi(prev => 
            prev.map(s => s.id === uploadedSyllabus.id ? { ...s, progress } : s)
          );
        }

        // Mark as processing
        setUploadedSyllabi(prev => 
          prev.map(s => s.id === uploadedSyllabus.id ? { ...s, status: 'processing' } : s)
        );

        // Extract content and generate quiz
        const content = await analyzeFileContent(uploadedSyllabus.file);
        const quizData = await generateQuizFromSyllabus(content, uploadedSyllabus.file.name);

        // Create quiz
        const quiz: QuizType = {
          id: uuidv4(),
          title: quizData.title,
          description: quizData.description,
          questions: quizData.questions,
          createdAt: new Date(),
          createdBy: state.user?.id || 'demo-user',
          timeLimit: 30,
          totalQuestions: quizData.questions.length,
          difficulty: 'mixed',
          isActive: true
        };

        dispatch({ type: 'ADD_QUIZ', payload: quiz });

        setUploadedSyllabi(prev => 
          prev.map(s => s.id === uploadedSyllabus.id ? { ...s, status: 'completed' } : s)
        );
      } catch (error) {
        setUploadedSyllabi(prev => 
          prev.map(s => s.id === uploadedSyllabus.id ? { 
            ...s, 
            status: 'error',
            error: 'Failed to process syllabus. Please try again.'
          } : s)
        );
      }
    }
  };

  const handleCreateQuiz = async () => {
    if (!newQuiz.syllabusFile) {
      alert('Please upload a syllabus file first.');
      return;
    }

    try {
      const content = await analyzeFileContent(newQuiz.syllabusFile);
      const quizData = await generateQuizFromSyllabus(
        content, 
        newQuiz.syllabusFile.name,
        newQuiz.questionCount,
        newQuiz.difficulty
      );

      const quiz: QuizType = {
        id: uuidv4(),
        title: newQuiz.title || quizData.title,
        description: newQuiz.description || quizData.description,
        questions: quizData.questions,
        createdAt: new Date(),
        createdBy: state.user?.id || 'demo-user',
        timeLimit: newQuiz.timeLimit,
        totalQuestions: quizData.questions.length,
        difficulty: newQuiz.difficulty,
        isActive: true
      };

      dispatch({ type: 'ADD_QUIZ', payload: quiz });
      setShowCreateModal(false);
      resetNewQuiz();
    } catch (error) {
      alert('Failed to create quiz. Please try again.');
    }
  };

  const resetNewQuiz = () => {
    setNewQuiz({
      title: '',
      description: '',
      questionCount: 10,
      difficulty: 'mixed',
      timeLimit: 30,
      syllabusFile: null
    });
  };

  const startQuiz = (quiz: QuizType) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizStartTime(new Date());
    setShowQuizModal(true);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    if (!selectedQuiz || !quizStartTime) return;

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - quizStartTime.getTime()) / 1000);
    
    let score = 0;
    let totalPoints = 0;

    selectedQuiz.questions.forEach(question => {
      totalPoints += question.points;
      const selectedAnswer = selectedAnswers[question.id];
      if (selectedAnswer === question.correctAnswer) {
        score += question.points;
      }
    });

    const attempt = {
      id: uuidv4(),
      quizId: selectedQuiz.id,
      userId: state.user?.id || 'demo-user',
      answers: Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      })),
      score,
      totalPoints,
      startedAt: quizStartTime,
      completedAt: endTime,
      timeSpent
    };

    dispatch({ type: 'ADD_QUIZ_ATTEMPT', payload: attempt });
    setShowQuizModal(false);
    setSelectedQuiz(null);
    
    alert(`Quiz completed! Score: ${score}/${totalPoints} (${Math.round((score/totalPoints) * 100)}%)`);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (file.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-green-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-purple-600 bg-purple-100';
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Quiz Generator</h1>
          <p className="text-gray-600 dark:text-gray-300">Upload your syllabus and generate custom quizzes with AI</p>
        </div>

        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
        >
          <Plus className="w-5 h-5" />
          <span>Create Quiz</span>
        </motion.button>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
          dragActive 
            ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 hover:bg-purple-25 dark:hover:bg-purple-900/10'
        } bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm`}
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
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Drop your syllabus here, or <span className="text-purple-600">browse</span>
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Support for PDF, images, and text files up to 10MB
          </p>
          
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            htmlFor="syllabus-upload"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium cursor-pointer hover:shadow-lg transition-shadow"
          >
            <Brain className="w-4 h-4 mr-2" />
            Select Syllabus
          </motion.label>
          <input
            id="syllabus-upload"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            accept=".pdf,.jpg,.jpeg,.png,.gif,.txt"
          />
        </div>
      </motion.div>

      {/* Processing Files */}
      <AnimatePresence>
        {uploadedSyllabi.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Processing Syllabi</h2>
            <div className="space-y-4">
              {uploadedSyllabi.map((syllabus) => (
                <motion.div
                  key={syllabus.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  {getFileIcon(syllabus.file)}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{syllabus.file.name}</h3>
                      <div className="flex items-center space-x-2">
                        {syllabus.status === 'processing' && (
                          <div className="flex items-center space-x-1 text-purple-600">
                            <Brain className="w-4 h-4" />
                            <Sparkles className="w-4 h-4 animate-pulse" />
                          </div>
                        )}
                        {syllabus.status === 'completed' && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                        {syllabus.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <button
                          onClick={() => setUploadedSyllabi(prev => prev.filter(s => s.id !== syllabus.id))}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          syllabus.status === 'error' 
                            ? 'bg-red-500' 
                            : 'bg-gradient-to-r from-purple-500 to-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${syllabus.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatFileSize(syllabus.file.size)}
                      </span>
                      <span className={`${
                        syllabus.status === 'error' ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {syllabus.status === 'uploading' && 'Uploading...'}
                        {syllabus.status === 'processing' && 'Generating Quiz...'}
                        {syllabus.status === 'completed' && 'Quiz Generated!'}
                        {syllabus.status === 'error' && (syllabus.error || 'Error')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quizzes Grid */}
      {state.quizzes.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Your Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{quiz.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Questions</span>
                    <span className="font-medium text-gray-900 dark:text-white">{quiz.totalQuestions}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Time Limit</span>
                    <span className="font-medium text-gray-900 dark:text-white">{quiz.timeLimit} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Created</span>
                    <span className="font-medium text-gray-900 dark:text-white">{format(quiz.createdAt, 'MMM dd')}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startQuiz(quiz)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Quiz</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Create Quiz Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Custom Quiz</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Mathematics Final Exam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Brief description of the quiz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Questions
                  </label>
                  <select
                    value={newQuiz.questionCount}
                    onChange={(e) => setNewQuiz({ ...newQuiz, questionCount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={25}>25 Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={newQuiz.difficulty}
                    onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="mixed">Mixed Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newQuiz.timeLimit}
                    onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Syllabus
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setNewQuiz({ ...newQuiz, syllabusFile: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.txt"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateQuiz}
                  disabled={!newQuiz.syllabusFile}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Quiz
                </motion.button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Taking Modal */}
      <AnimatePresence>
        {showQuizModal && selectedQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedQuiz.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{selectedQuiz.timeLimit} min</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Current Question */}
              {selectedQuiz.questions[currentQuestionIndex] && (
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedQuiz.questions[currentQuestionIndex].question}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedQuiz.questions[currentQuestionIndex].difficulty)}`}>
                      {selectedQuiz.questions[currentQuestionIndex].difficulty}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswerSelect(selectedQuiz.questions[currentQuestionIndex].id, index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === index
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                        } bg-white dark:bg-gray-700`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === index
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300 dark:border-gray-500'
                          }`}>
                            {selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === index && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          <span className="text-gray-900 dark:text-white">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </motion.button>

                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Object.keys(selectedAnswers).length} of {selectedQuiz.questions.length} answered
                </span>

                {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitQuiz}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow"
                  >
                    Submit Quiz
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextQuestion}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-md transition-shadow"
                  >
                    Next
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}