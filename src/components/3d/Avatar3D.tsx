import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface Avatar3DProps {
  gender: 'male' | 'female';
  outfit?: {
    top?: string;
    bottom?: string;
    shoes?: string;
    accessories?: string[];
  };
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

// 3D Avatar Component
const Avatar: React.FC<{
  gender: 'male' | 'female';
  outfit?: any;
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}> = ({ gender, outfit, position, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Rotation when selected
      if (isSelected) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  // Color schemes for different genders
  const skinColor = gender === 'female' ? '#FDBCB4' : '#E8B4A0';
  const hairColor = gender === 'female' ? '#8B4513' : '#654321';
  
  // Outfit colors based on type
  const getOutfitColor = (piece: string) => {
    const colors = {
      elegant: '#2D1B69',
      confident: '#DC2626',
      casual: '#059669',
      professional: '#1F2937',
      romantic: '#EC4899',
      adventurous: '#F59E0B'
    };
    return colors[piece as keyof typeof colors] || '#6B7280';
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {/* Head */}
      <Sphere args={[0.3, 16, 16]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color={skinColor} />
      </Sphere>
      
      {/* Hair */}
      <Sphere 
        args={gender === 'female' ? [0.35, 16, 16] : [0.32, 16, 16]} 
        position={[0, gender === 'female' ? 1.8 : 1.75, 0]}
      >
        <meshStandardMaterial color={hairColor} />
      </Sphere>
      
      {/* Body */}
      <Cylinder args={[0.25, 0.3, 0.8, 8]} position={[0, 1, 0]}>
        <meshStandardMaterial 
          color={outfit?.top ? getOutfitColor(outfit.top) : '#4F46E5'} 
        />
      </Cylinder>
      
      {/* Arms */}
      <Cylinder args={[0.08, 0.08, 0.6, 8]} position={[-0.4, 1, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color={skinColor} />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.6, 8]} position={[0.4, 1, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color={skinColor} />
      </Cylinder>
      
      {/* Legs */}
      <Cylinder args={[0.12, 0.12, 0.8, 8]} position={[-0.15, 0.2, 0]}>
        <meshStandardMaterial 
          color={outfit?.bottom ? getOutfitColor(outfit.bottom) : '#1F2937'} 
        />
      </Cylinder>
      <Cylinder args={[0.12, 0.12, 0.8, 8]} position={[0.15, 0.2, 0]}>
        <meshStandardMaterial 
          color={outfit?.bottom ? getOutfitColor(outfit.bottom) : '#1F2937'} 
        />
      </Cylinder>
      
      {/* Shoes */}
      <Box args={[0.2, 0.1, 0.3]} position={[-0.15, -0.25, 0.1]}>
        <meshStandardMaterial 
          color={outfit?.shoes ? getOutfitColor(outfit.shoes) : '#000000'} 
        />
      </Box>
      <Box args={[0.2, 0.1, 0.3]} position={[0.15, -0.25, 0.1]}>
        <meshStandardMaterial 
          color={outfit?.shoes ? getOutfitColor(outfit.shoes) : '#000000'} 
        />
      </Box>
      
      {/* Selection indicator */}
      {isSelected && (
        <Cylinder args={[0.8, 0.8, 0.05, 32]} position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#10B981" transparent opacity={0.3} />
        </Cylinder>
      )}
      
      {/* Gender label */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color={isSelected ? "#10B981" : "#6B7280"}
        anchorX="center"
        anchorY="middle"
      >
        {gender === 'male' ? 'Male Model' : 'Female Model'}
      </Text>
    </group>
  );
};

// Lighting setup
const Lighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <directionalLight
        position={[0, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
};

// Main Avatar3D component
const Avatar3D: React.FC<Avatar3DProps> = ({ 
  gender, 
  outfit, 
  position, 
  isSelected, 
  onClick 
}) => {
  return (
    <Avatar
      gender={gender}
      outfit={outfit}
      position={position}
      isSelected={isSelected}
      onClick={onClick}
    />
  );
};

export { Avatar3D, Lighting };