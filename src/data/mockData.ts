import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ethereal Silk Dress',
    price: 189,
    image: 'https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sustainable silk dress crafted from regenerative silkworms',
    category: 'dresses',
    mood: ['elegant', 'romantic', 'confident'],
    esgMetadata: {
      carbonFootprint: 2.3,
      waterUsage: 45,
      region: 'Karnataka, India',
      sustainabilityScore: 9.2,
      materials: ['Peace Silk', 'Organic Cotton'],
      certifications: ['GOTS', 'Fair Trade', 'Cradle to Cradle'],
      supplyChain: {
        ethicsRating: 9.5,
        laborPractices: 'Fair wages, safe working conditions, no child labor',
        fairTrade: true,
        localSourcing: true,
        transparencyLevel: 'high',
        auditDate: '2024-01-15',
        certifyingBody: 'Fair Trade International'
      },
      impactZone: {
        lat: 15.3173,
        lng: 75.7139,
        description: 'Regenerative silk farming community'
      }
    },
    transparencyIndex: {
      overall: 92,
      carbon: {
        score: 95,
        verified: true,
        methodology: 'LCA ISO 14040/14044',
        lastUpdated: '2024-01-10'
      },
      water: {
        score: 88,
        verified: true,
        methodology: 'Water Footprint Network',
        lastUpdated: '2024-01-10'
      },
      ethics: {
        score: 96,
        verified: true,
        auditReport: 'FT-2024-001.pdf',
        lastAudit: '2024-01-15'
      },
      region: {
        score: 90,
        verified: true,
        traceability: 'Farm to garment tracking',
        documentation: ['Origin certificate', 'Transport logs', 'Processing records']
      }
    },
    vendorId: '1',
    stylingTips: ['Pair with delicate jewelry', 'Add a light cardigan for versatility'],
    pairsWith: ['silk-scarf', 'vintage-heels', 'minimalist-jewelry']
  },
  {
    id: '2',
    name: 'Ocean Breeze Linen Shirt',
    price: 98,
    image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Breathable linen made from recycled ocean plastic',
    category: 'tops',
    mood: ['casual', 'calm', 'adventurous'],
    esgMetadata: {
      carbonFootprint: 1.8,
      waterUsage: 32,
      region: 'California, USA',
      sustainabilityScore: 8.7,
      materials: ['Recycled Ocean Plastic', 'Organic Linen'],
      certifications: ['Ocean Positive', 'OEKO-TEX'],
      supplyChain: {
        ethicsRating: 8.2,
        laborPractices: 'Living wages, worker safety programs',
        fairTrade: false,
        localSourcing: false,
        transparencyLevel: 'medium',
        auditDate: '2023-11-20',
        certifyingBody: 'WRAP'
      },
      impactZone: {
        lat: 36.7783,
        lng: -119.4179,
        description: 'Ocean plastic cleanup initiative'
      }
    },
    transparencyIndex: {
      overall: 78,
      carbon: {
        score: 82,
        verified: true,
        methodology: 'GHG Protocol',
        lastUpdated: '2023-12-01'
      },
      water: {
        score: 85,
        verified: true,
        methodology: 'Water Footprint Assessment',
        lastUpdated: '2023-12-01'
      },
      ethics: {
        score: 75,
        verified: true,
        auditReport: 'WRAP-2023-045.pdf',
        lastAudit: '2023-11-20'
      },
      region: {
        score: 70,
        verified: false,
        traceability: 'Partial supply chain visibility',
        documentation: ['Material certificates', 'Shipping records']
      }
    },
    vendorId: '1',
    stylingTips: ['Roll up sleeves for casual look', 'Tuck into high-waisted pants'],
    pairsWith: ['denim-jeans', 'canvas-sneakers', 'crossbody-bag']
  },
  {
    id: '3',
    name: 'Bold Statement Jacket',
    price: 245,
    image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Upcycled denim jacket with artistic embroidery',
    category: 'jackets',
    mood: ['bold', 'confident', 'adventurous'],
    esgMetadata: {
      carbonFootprint: 3.1,
      waterUsage: 78,
      region: 'Mexico City, Mexico',
      sustainabilityScore: 8.9,
      materials: ['Upcycled Denim', 'Organic Cotton Thread'],
      certifications: ['Upcycled Certified', 'B-Corp'],
      supplyChain: {
        ethicsRating: 9.0,
        laborPractices: 'Artisan cooperative, profit sharing',
        fairTrade: true,
        localSourcing: true,
        transparencyLevel: 'high',
        auditDate: '2024-02-01',
        certifyingBody: 'B-Corp Assessment'
      },
      impactZone: {
        lat: 19.4326,
        lng: -99.1332,
        description: 'Artisan cooperative supporting local families'
      }
    },
    transparencyIndex: {
      overall: 85,
      carbon: {
        score: 80,
        verified: false,
        methodology: 'Estimated based on upcycling process',
        lastUpdated: '2024-01-20'
      },
      water: {
        score: 88,
        verified: true,
        methodology: 'Direct measurement',
        lastUpdated: '2024-01-20'
      },
      ethics: {
        score: 92,
        verified: true,
        auditReport: 'BCORP-2024-012.pdf',
        lastAudit: '2024-02-01'
      },
      region: {
        score: 85,
        verified: true,
        traceability: 'Direct partnership with artisans',
        documentation: ['Artisan profiles', 'Production photos', 'Payment records']
      }
    },
    vendorId: '2',
    stylingTips: ['Layer over simple pieces', 'Perfect for music festivals'],
    pairsWith: ['white-tee', 'black-jeans', 'ankle-boots']
  },
  {
    id: '4',
    name: 'Zen Garden Meditation Pants',
    price: 67,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Organic hemp pants for mindful movement',
    category: 'bottoms',
    mood: ['calm', 'casual', 'zen'],
    esgMetadata: {
      carbonFootprint: 1.2,
      waterUsage: 28,
      region: 'Oregon, USA',
      sustainabilityScore: 9.5,
      materials: ['Organic Hemp', 'Natural Dyes'],
      certifications: ['USDA Organic', 'Carbon Neutral'],
      supplyChain: {
        ethicsRating: 8.8,
        laborPractices: 'Local manufacturing, living wages',
        fairTrade: false,
        localSourcing: true,
        transparencyLevel: 'high',
        auditDate: '2024-01-05',
        certifyingBody: 'USDA Organic'
      },
      impactZone: {
        lat: 44.9429,
        lng: -123.0351,
        description: 'Regenerative hemp farming'
      }
    },
    transparencyIndex: {
      overall: 94,
      carbon: {
        score: 98,
        verified: true,
        methodology: 'Carbon Trust Standard',
        lastUpdated: '2024-01-05'
      },
      water: {
        score: 95,
        verified: true,
        methodology: 'Direct farm measurement',
        lastUpdated: '2024-01-05'
      },
      ethics: {
        score: 90,
        verified: true,
        auditReport: 'USDA-ORG-2024-003.pdf',
        lastAudit: '2024-01-05'
      },
      region: {
        score: 95,
        verified: true,
        traceability: 'Seed to garment tracking',
        documentation: ['Farm records', 'Processing logs', 'Transport data']
      }
    },
    vendorId: '1',
    stylingTips: ['Great for yoga and lounging', 'Pair with fitted top'],
    pairsWith: ['crop-top', 'sneakers', 'yoga-mat']
  },
  {
    id: '5',
    name: 'Professional Power Blazer',
    price: 178,
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Tailored blazer from recycled wool fibers',
    category: 'jackets',
    mood: ['professional', 'confident', 'elegant'],
    esgMetadata: {
      carbonFootprint: 2.7,
      waterUsage: 52,
      region: 'Scotland, UK',
      sustainabilityScore: 8.4,
      materials: ['Recycled Wool', 'Recycled Polyester Lining'],
      certifications: ['RWS', 'Recycled Claim Standard'],
      supplyChain: {
        ethicsRating: 7.5,
        laborPractices: 'Industry standard wages, safety protocols',
        fairTrade: false,
        localSourcing: false,
        transparencyLevel: 'medium',
        auditDate: '2023-10-15',
        certifyingBody: 'Textile Exchange'
      },
      impactZone: {
        lat: 55.9533,
        lng: -3.1883,
        description: 'Sustainable wool processing facility'
      }
    },
    transparencyIndex: {
      overall: 72,
      carbon: {
        score: 75,
        verified: true,
        methodology: 'Higg MSI',
        lastUpdated: '2023-11-01'
      },
      water: {
        score: 78,
        verified: true,
        methodology: 'Higg FEM',
        lastUpdated: '2023-11-01'
      },
      ethics: {
        score: 68,
        verified: true,
        auditReport: 'TE-RCS-2023-089.pdf',
        lastAudit: '2023-10-15'
      },
      region: {
        score: 65,
        verified: false,
        traceability: 'Limited supply chain visibility',
        documentation: ['Material certificates']
      }
    },
    vendorId: '2',
    stylingTips: ['Perfect for boardroom meetings', 'Dress down with jeans'],
    pairsWith: ['silk-blouse', 'dress-pants', 'leather-heels']
  },
  {
    id: '6',
    name: 'Romantic Moonlight Skirt',
    price: 134,
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Flowing skirt made from peace silk',
    category: 'skirts',
    mood: ['romantic', 'elegant', 'dreamy'],
    esgMetadata: {
      carbonFootprint: 1.9,
      waterUsage: 41,
      region: 'Tamil Nadu, India',
      sustainabilityScore: 9.1,
      materials: ['Peace Silk', 'Natural Dyes'],
      certifications: ['GOTS', 'Ahimsa Silk'],
      supplyChain: {
        ethicsRating: 9.2,
        laborPractices: 'Fair wages, women empowerment programs',
        fairTrade: true,
        localSourcing: true,
        transparencyLevel: 'high',
        auditDate: '2024-01-20',
        certifyingBody: 'GOTS International'
      },
      impactZone: {
        lat: 11.1271,
        lng: 78.6569,
        description: 'Ethical silk production'
      }
    },
    transparencyIndex: {
      overall: 89,
      carbon: {
        score: 85,
        verified: true,
        methodology: 'GOTS LCA',
        lastUpdated: '2024-01-15'
      },
      water: {
        score: 90,
        verified: true,
        methodology: 'GOTS Water Assessment',
        lastUpdated: '2024-01-15'
      },
      ethics: {
        score: 94,
        verified: true,
        auditReport: 'GOTS-2024-TN-045.pdf',
        lastAudit: '2024-01-20'
      },
      region: {
        score: 88,
        verified: true,
        traceability: 'Cocoon to garment tracking',
        documentation: ['Farmer records', 'Processing certificates', 'Transport logs']
      }
    },
    vendorId: '1',
    stylingTips: ['Perfect for date nights', 'Add a denim jacket for contrast'],
    pairsWith: ['camisole', 'strappy-sandals', 'delicate-necklace']
  }
];

export const moodColors = {
  confident: '#FF6B6B',
  calm: '#4ECDC4',
  bold: '#FF8A3D',
  romantic: '#FF9FF3',
  adventurous: '#54A0FF',
  elegant: '#5F27CD',
  casual: '#00D2D3',
  professional: '#2F3542',
  zen: '#A3CB38',
  dreamy: '#C44569'
};

export const ecoAchievements = [
  {
    id: '1',
    title: 'Forest Guardian',
    description: 'Planted 10+ trees',
    icon: '🌳',
    unlocked: true
  },
  {
    id: '2',
    title: 'Ocean Protector',
    description: 'Saved 50+ marine animals',
    icon: '🐠',
    unlocked: true
  },
  {
    id: '3',
    title: 'Carbon Warrior',
    description: 'Reduced 100kg+ CO2',
    icon: '⚡',
    unlocked: false
  },
  {
    id: '4',
    title: 'Sustainability Hero',
    description: 'Made 25+ eco-friendly purchases',
    icon: '🦸‍♀️',
    unlocked: false
  }
];

export const esgCertifications = [
  { id: 'gots', name: 'GOTS', description: 'Global Organic Textile Standard' },
  { id: 'fairtrade', name: 'Fair Trade', description: 'Fair Trade Certified' },
  { id: 'bcorp', name: 'B-Corp', description: 'Certified B Corporation' },
  { id: 'cradle', name: 'Cradle to Cradle', description: 'Cradle to Cradle Certified' },
  { id: 'oeko', name: 'OEKO-TEX', description: 'OEKO-TEX Standard 100' },
  { id: 'organic', name: 'USDA Organic', description: 'USDA Organic Certified' },
  { id: 'rws', name: 'RWS', description: 'Responsible Wool Standard' },
  { id: 'ocean', name: 'Ocean Positive', description: 'Ocean Positive Certified' }
];