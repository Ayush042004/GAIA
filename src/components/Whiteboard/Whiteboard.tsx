import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Users,
  Download,
  Trash2,
  Undo,
  Redo,
  Minus
} from 'lucide-react';
import { WhiteboardElement } from '../../types';
import { v4 as uuidv4 } from 'uuid';

type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text';

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#3B82F6');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [elements, setElements] = useState<WhiteboardElement[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const tools = [
    { id: 'pen', icon: Minus, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    elements.forEach(element => {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (element.type === 'line' && element.points) {
        ctx.beginPath();
        element.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (element.type === 'rectangle') {
        ctx.strokeRect(element.x, element.y, element.width || 0, element.height || 0);
      } else if (element.type === 'circle') {
        const radius = Math.min(element.width || 0, element.height || 0) / 2;
        ctx.beginPath();
        ctx.arc(element.x + radius, element.y + radius, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (element.type === 'text' && element.content) {
        ctx.font = '16px Inter, sans-serif';
        ctx.fillStyle = element.color;
        ctx.fillText(element.content, element.x, element.y);
      }
    });

    // Draw current path
    if (currentPath.length > 0 && tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      currentPath.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }
  }, [elements, currentPath, color, strokeWidth, tool]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setIsDrawing(true);

    if (tool === 'pen') {
      setCurrentPath([pos]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);

    if (tool === 'pen') {
      setCurrentPath(prev => [...prev, pos]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (tool === 'pen' && currentPath.length > 0) {
      const newElement: WhiteboardElement = {
        id: uuidv4(),
        type: 'line',
        x: currentPath[0].x,
        y: currentPath[0].y,
        color,
        strokeWidth,
        points: currentPath
      };
      setElements(prev => [...prev, newElement]);
      setCurrentPath([]);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setCurrentPath([]);
  };

  const activeParticipants = [
    { id: '1', name: 'Alex Chen', color: '#3B82F6' },
    { id: '2', name: 'Sarah Kim', color: '#EF4444' },
    { id: '3', name: 'Mike Johnson', color: '#10B981' }
  ];

  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Collaborative Whiteboard</h1>
          <p className="text-gray-600">Draw, sketch, and collaborate in real-time</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{activeParticipants.length} active</span>
          </div>
          <div className="flex -space-x-2">
            {activeParticipants.map((participant) => (
              <div
                key={participant.id}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: participant.color }}
                title={participant.name}
              >
                {participant.name.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex space-x-6">
        {/* Toolbar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-16 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 h-fit"
        >
          <div className="space-y-3">
            {tools.map((toolItem) => {
              const Icon = toolItem.icon;
              return (
                <motion.button
                  key={toolItem.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTool(toolItem.id as Tool)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    tool === toolItem.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'hover:bg-purple-50 text-gray-600'
                  }`}
                  title={toolItem.label}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              );
            })}

            <div className="border-t border-gray-200 pt-3">
              <div className="grid grid-cols-2 gap-1">
                {colors.map((c) => (
                  <motion.button
                    key={c}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-md border-2 ${
                      color === c ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 text-center mt-1">
                {strokeWidth}px
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-600"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-600"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearCanvas}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-red-600"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-600"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 bg-white rounded-2xl border border-purple-100 shadow-sm relative overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDrawing(false)}
          />
          
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Participant cursors simulation */}
          <div className="absolute top-4 left-4 space-y-2">
            {activeParticipants.slice(1).map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.5 }}
                className="flex items-center space-x-2"
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: participant.color }}
                />
                <span className="text-xs text-gray-600">{participant.name} is drawing</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}