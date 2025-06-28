import { Question, StudyMaterial, QuizQuestion } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Enhanced AI processing with more realistic content analysis
export function analyzeFileContent(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // In a real app, this would be sent to an AI service
      // For demo, we'll simulate content extraction
      resolve(content || `Content from ${file.name}`);
    };
    
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // For other file types, simulate content extraction
      setTimeout(() => {
        resolve(`Extracted content from ${file.name}. This document contains important study material covering key concepts and practical applications.`);
      }, 500);
    }
  });
}

export function generateSummary(content: string, title: string): string {
  const keyTerms = extractKeyTerms(title);
  const summaryTemplates = [
    `This document on ${title} provides comprehensive coverage of ${keyTerms.join(', ')}. Key concepts include theoretical foundations, practical applications, and real-world examples. The material emphasizes understanding core principles and their interconnections, making it essential for mastering the subject matter.`,
    
    `An in-depth exploration of ${title} focusing on ${keyTerms.join(' and ')}. The content systematically builds from fundamental concepts to advanced applications. Critical insights are provided throughout, with emphasis on problem-solving methodologies and analytical thinking approaches.`,
    
    `Comprehensive study guide for ${title} covering essential topics in ${keyTerms.join(', ')}. The material is structured to facilitate progressive learning, with clear explanations, practical examples, and connections to broader concepts. Ideal for both review and deep understanding.`,
    
    `Detailed analysis of ${title} with focus on ${keyTerms.join(', ')}. The document presents both theoretical frameworks and practical implementations, supported by examples and case studies. Key learning objectives are clearly defined with measurable outcomes.`
  ];
  
  return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
}

function extractKeyTerms(title: string): string[] {
  const commonTerms = {
    'math': ['equations', 'functions', 'derivatives', 'integrals', 'theorems'],
    'physics': ['forces', 'energy', 'momentum', 'waves', 'particles'],
    'chemistry': ['reactions', 'molecules', 'bonds', 'equilibrium', 'kinetics'],
    'biology': ['cells', 'genetics', 'evolution', 'ecology', 'physiology'],
    'computer': ['algorithms', 'data structures', 'programming', 'systems', 'networks'],
    'history': ['events', 'causes', 'effects', 'timeline', 'significance'],
    'literature': ['themes', 'characters', 'symbolism', 'analysis', 'interpretation']
  };
  
  const titleLower = title.toLowerCase();
  for (const [subject, terms] of Object.entries(commonTerms)) {
    if (titleLower.includes(subject)) {
      return terms.slice(0, 3);
    }
  }
  
  return ['key concepts', 'fundamental principles', 'practical applications'];
}

export function generateQuestions(content: string, title: string): Question[] {
  const keyTerms = extractKeyTerms(title);
  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
  
  const questionTemplates = [
    {
      template: `What are the main ${keyTerms[0]} discussed in ${title}?`,
      answerTemplate: `The main ${keyTerms[0]} include systematic approaches, theoretical foundations, and practical implementations as outlined in the study material.`,
      difficulty: 'easy' as const
    },
    {
      template: `How do ${keyTerms[1]} relate to ${keyTerms[2]} in the context of ${title}?`,
      answerTemplate: `${keyTerms[1]} and ${keyTerms[2]} are interconnected through fundamental principles that demonstrate their practical relationship and theoretical significance.`,
      difficulty: 'medium' as const
    },
    {
      template: `Analyze the significance of ${keyTerms[0]} in advanced applications of ${title}.`,
      answerTemplate: `${keyTerms[0]} play a crucial role in advanced applications by providing the theoretical framework necessary for complex problem-solving and innovative solutions.`,
      difficulty: 'hard' as const
    },
    {
      template: `What are the key differences between ${keyTerms[1]} and ${keyTerms[2]}?`,
      answerTemplate: `The key differences lie in their fundamental properties, applications, and theoretical foundations, each serving distinct purposes in the broader context.`,
      difficulty: 'medium' as const
    },
    {
      template: `Explain the practical applications of ${keyTerms[0]} in real-world scenarios.`,
      answerTemplate: `Practical applications include problem-solving in professional settings, research applications, and innovative solutions to contemporary challenges.`,
      difficulty: 'hard' as const
    }
  ];

  return questionTemplates.slice(0, 4).map((template, index) => ({
    id: uuidv4(),
    question: template.template,
    answer: template.answerTemplate,
    difficulty: template.difficulty,
    category: title
  }));
}

export function generateQuizFromSyllabus(
  content: string, 
  fileName: string, 
  questionCount: number = 10,
  difficulty: 'mixed' | 'easy' | 'medium' | 'hard' = 'mixed'
): Promise<{
  title: string;
  description: string;
  questions: QuizQuestion[];
}> {
  return new Promise((resolve) => {
    // Simulate AI processing time
    const processingTime = 2000 + Math.random() * 3000; // 2-5 seconds
    
    setTimeout(() => {
      const keyTerms = extractKeyTerms(fileName);
      const title = `${fileName.replace(/\.[^/.]+$/, '')} Quiz`;
      const description = `AI-generated quiz covering key concepts from ${fileName}`;
      
      const questions = generateQuizQuestions(content, keyTerms, questionCount, difficulty);
      
      resolve({ title, description, questions });
    }, processingTime);
  });
}

function generateQuizQuestions(
  content: string, 
  keyTerms: string[], 
  count: number,
  difficulty: 'mixed' | 'easy' | 'medium' | 'hard'
): QuizQuestion[] {
  const questionTemplates = [
    // Easy Questions
    {
      template: `What is the definition of ${keyTerms[0]}?`,
      options: [
        `${keyTerms[0]} refers to the fundamental concept in the subject area`,
        `${keyTerms[0]} is an advanced technique used in specialized applications`,
        `${keyTerms[0]} is a measurement tool used in research`,
        `${keyTerms[0]} is a theoretical framework for analysis`
      ],
      correctAnswer: 0,
      difficulty: 'easy' as const,
      points: 1
    },
    {
      template: `Which of the following is an example of ${keyTerms[1]}?`,
      options: [
        'A complex theoretical model',
        'A practical application in real-world scenarios',
        'An abstract mathematical concept',
        'A historical development in the field'
      ],
      correctAnswer: 1,
      difficulty: 'easy' as const,
      points: 1
    },
    // Medium Questions
    {
      template: `How do ${keyTerms[0]} and ${keyTerms[1]} interact in practical applications?`,
      options: [
        'They work independently without any connection',
        'They complement each other to achieve optimal results',
        'They compete for the same resources',
        'They are used in completely different contexts'
      ],
      correctAnswer: 1,
      difficulty: 'medium' as const,
      points: 2
    },
    {
      template: `What is the primary advantage of using ${keyTerms[2]} in modern applications?`,
      options: [
        'It reduces complexity without sacrificing functionality',
        'It increases cost while improving performance',
        'It simplifies the process but reduces accuracy',
        'It provides enhanced efficiency and better outcomes'
      ],
      correctAnswer: 3,
      difficulty: 'medium' as const,
      points: 2
    },
    // Hard Questions
    {
      template: `Analyze the relationship between ${keyTerms[0]}, ${keyTerms[1]}, and ${keyTerms[2]} in advanced implementations.`,
      options: [
        'They form a hierarchical structure with clear dependencies',
        'They operate as independent modules with minimal interaction',
        'They create a synergistic system where each component enhances the others',
        'They represent different phases of the same process'
      ],
      correctAnswer: 2,
      difficulty: 'hard' as const,
      points: 3
    },
    {
      template: `What would be the most significant consequence of removing ${keyTerms[0]} from the system?`,
      options: [
        'Minor performance degradation',
        'Complete system failure',
        'Improved efficiency in some areas',
        'Fundamental restructuring of core processes would be required'
      ],
      correctAnswer: 3,
      difficulty: 'hard' as const,
      points: 3
    }
  ];

  let selectedTemplates: typeof questionTemplates = [];
  
  if (difficulty === 'mixed') {
    // Mix of all difficulties
    const easyCount = Math.ceil(count * 0.4);
    const mediumCount = Math.ceil(count * 0.4);
    const hardCount = count - easyCount - mediumCount;
    
    selectedTemplates = [
      ...questionTemplates.filter(q => q.difficulty === 'easy').slice(0, easyCount),
      ...questionTemplates.filter(q => q.difficulty === 'medium').slice(0, mediumCount),
      ...questionTemplates.filter(q => q.difficulty === 'hard').slice(0, hardCount)
    ];
  } else {
    selectedTemplates = questionTemplates.filter(q => q.difficulty === difficulty).slice(0, count);
  }

  // Fill remaining slots if needed
  while (selectedTemplates.length < count) {
    const randomTemplate = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    selectedTemplates.push(randomTemplate);
  }

  return selectedTemplates.slice(0, count).map((template, index) => ({
    id: uuidv4(),
    question: template.template,
    options: template.options,
    correctAnswer: template.correctAnswer,
    explanation: `This question tests understanding of ${keyTerms.join(', ')} and their practical applications.`,
    difficulty: template.difficulty,
    category: 'General',
    points: template.points
  }));
}

export function simulateAIProcessing(material: StudyMaterial, content?: string): Promise<{
  summary: string;
  questions: Question[];
  tags: string[];
}> {
  return new Promise((resolve) => {
    // Simulate realistic AI processing time
    const processingTime = 3000 + Math.random() * 4000; // 3-7 seconds
    
    setTimeout(() => {
      const summary = generateSummary(content || '', material.title);
      const questions = generateQuestions(content || '', material.title);
      const tags = generateTags(material.title);
      
      resolve({ summary, questions, tags });
    }, processingTime);
  });
}

function generateTags(title: string): string[] {
  const titleLower = title.toLowerCase();
  const tagMap: { [key: string]: string[] } = {
    'math': ['mathematics', 'calculus', 'algebra', 'geometry', 'statistics'],
    'physics': ['physics', 'mechanics', 'thermodynamics', 'electromagnetism', 'quantum'],
    'chemistry': ['chemistry', 'organic', 'inorganic', 'biochemistry', 'analytical'],
    'biology': ['biology', 'genetics', 'ecology', 'molecular', 'cellular'],
    'computer': ['computer science', 'programming', 'algorithms', 'software', 'data'],
    'history': ['history', 'historical', 'timeline', 'events', 'analysis'],
    'literature': ['literature', 'analysis', 'themes', 'writing', 'criticism']
  };
  
  for (const [subject, tags] of Object.entries(tagMap)) {
    if (titleLower.includes(subject)) {
      return tags.slice(0, 3);
    }
  }
  
  return ['study material', 'education', 'learning'];
}

export function generateStudyPlan(materials: StudyMaterial[]): {
  title: string;
  duration: string;
  tasks: string[];
  description: string;
} {
  const materialCount = materials.length;
  const hasAIProcessed = materials.some(m => m.summary);
  
  const plans = [
    {
      title: 'Comprehensive Review Session',
      duration: '2-3 hours',
      description: 'Deep dive into all uploaded materials with AI-generated insights',
      tasks: [
        'Review AI-generated summaries from uploaded materials',
        'Work through practice questions together',
        'Create collaborative mind maps',
        'Discuss challenging concepts',
        'Plan follow-up study sessions'
      ]
    },
    {
      title: 'Interactive Problem Solving',
      duration: '1.5-2 hours',
      description: 'Focus on practical application and problem-solving techniques',
      tasks: [
        'Analyze key concepts from study materials',
        'Solve practice problems collaboratively',
        'Use whiteboard for visual explanations',
        'Peer teaching exercises',
        'Q&A session with group feedback'
      ]
    },
    {
      title: 'Quick Knowledge Reinforcement',
      duration: '1 hour',
      description: 'Efficient review session for concept reinforcement',
      tasks: [
        'Quiz based on uploaded materials',
        'Rapid-fire Q&A session',
        'Key concept identification',
        'Summary creation exercise',
        'Next session planning'
      ]
    }
  ];

  const selectedPlan = plans[Math.floor(Math.random() * plans.length)];
  
  if (hasAIProcessed) {
    selectedPlan.tasks.unshift('Leverage AI-generated summaries and questions');
  }
  
  if (materialCount > 3) {
    selectedPlan.duration = '3-4 hours';
    selectedPlan.tasks.push('Break into focused sub-topics');
  }

  return selectedPlan;
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}