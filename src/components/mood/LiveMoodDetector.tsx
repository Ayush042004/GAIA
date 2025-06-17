import React, { useState, useRef, useCallback } from 'react';
import { Camera, Play, Square, Sparkles } from 'lucide-react';
import { useMoodStore } from '../../store/moodStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const LiveMoodDetector: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { setDetectedMood } = useMoodStore();
  const { setCurrentMood } = useAuthStore();

  const moodEmojis = {
    happy: '😊',
    confident: '💪',
    calm: '🧘‍♀️',
    excited: '🎉',
    elegant: '✨',
    romantic: '💕',
    adventurous: '🌍'
  };

  const startDetection = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
        setIsDetecting(true);
        
        // Mock mood detection - in real implementation, this would use face-api.js or similar
        setTimeout(() => {
          const moods = ['happy', 'confident', 'calm', 'excited', 'elegant'];
          const randomMood = moods[Math.floor(Math.random() * moods.length)];
          const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
          
          setDetectedMood(randomMood, confidence);
          setCurrentMood(randomMood);
          
          toast.success(`Mood detected: ${randomMood} (${Math.round(confidence * 100)}% confidence)`);
          
          stopDetection();
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Camera access denied. Please enable camera permissions.');
    }
  }, [setDetectedMood, setCurrentMood]);

  const stopDetection = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsDetecting(false);
    setHasPermission(false);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Camera className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Live Mood Mirror</h3>
        <Sparkles className="h-5 w-5 text-purple-500" />
      </div>

      <div className="text-center">
        <div className="relative w-64 h-48 mx-auto mb-6 bg-gray-100 rounded-lg overflow-hidden">
          {hasPermission ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {isDetecting && (
            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Analyzing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={isDetecting ? stopDetection : startDetection}
            disabled={isDetecting}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 mx-auto ${
              isDetecting
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isDetecting ? (
              <>
                <Square className="h-4 w-4" />
                <span>Stop Detection</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start Mood Detection</span>
              </>
            )}
          </button>

          <div className="text-sm text-gray-600">
            <p>AI-powered emotion recognition</p>
            <p>Get personalized outfit recommendations based on your current mood</p>
          </div>

          {/* Recent Mood History */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Recent Moods</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <span
                  key={mood}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-white rounded-full text-sm"
                >
                  <span>{emoji}</span>
                  <span className="capitalize">{mood}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMoodDetector;