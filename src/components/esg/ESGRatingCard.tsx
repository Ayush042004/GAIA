import React from 'react';
import { Leaf, Droplets, Wind, Shield, MapPin, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Product } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface ESGRatingCardProps {
  product: Product;
  compact?: boolean;
}

const ESGRatingCard: React.FC<ESGRatingCardProps> = ({ product, compact = false }) => {
  const { user } = useAuthStore();
  const isDarkMode = user?.preferences?.darkMode || false;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getVerificationIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-yellow-600" />
    );
  };

  const transparencyIndex = product.transparencyIndex;
  const esgData = product.esgMetadata;

  if (compact) {
    return (
      <div className={`p-3 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ESG Score
          </span>
          <div className={`px-2 py-1 rounded-full text-sm font-bold ${
            getScoreBgColor(transparencyIndex.overall)
          } ${getScoreColor(transparencyIndex.overall)}`}>
            {transparencyIndex.overall}/100
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <Wind className="h-3 w-3 mx-auto mb-1 text-blue-600" />
            <div className={getScoreColor(transparencyIndex.carbon.score)}>
              {transparencyIndex.carbon.score}
            </div>
          </div>
          <div className="text-center">
            <Droplets className="h-3 w-3 mx-auto mb-1 text-cyan-600" />
            <div className={getScoreColor(transparencyIndex.water.score)}>
              {transparencyIndex.water.score}
            </div>
          </div>
          <div className="text-center">
            <Shield className="h-3 w-3 mx-auto mb-1 text-purple-600" />
            <div className={getScoreColor(transparencyIndex.ethics.score)}>
              {transparencyIndex.ethics.score}
            </div>
          </div>
          <div className="text-center">
            <MapPin className="h-3 w-3 mx-auto mb-1 text-orange-600" />
            <div className={getScoreColor(transparencyIndex.region.score)}>
              {transparencyIndex.region.score}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ESG Transparency Index
          </h3>
        </div>
        <div className={`px-4 py-2 rounded-full text-lg font-bold ${
          getScoreBgColor(transparencyIndex.overall)
        } ${getScoreColor(transparencyIndex.overall)}`}>
          {transparencyIndex.overall}/100
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carbon Footprint */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-blue-600" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                Carbon Impact
              </span>
            </div>
            {getVerificationIcon(transparencyIndex.carbon.verified)}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                Footprint: {esgData.carbonFootprint}kg CO₂
              </span>
              <span className={`text-sm font-medium ${getScoreColor(transparencyIndex.carbon.score)}`}>
                {transparencyIndex.carbon.score}/100
              </span>
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-blue-600'}`}>
              Method: {transparencyIndex.carbon.methodology}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-blue-600'}`}>
              Updated: {new Date(transparencyIndex.carbon.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Water Usage */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-cyan-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-cyan-600" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-cyan-900'}`}>
                Water Impact
              </span>
            </div>
            {getVerificationIcon(transparencyIndex.water.verified)}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-cyan-700'}`}>
                Usage: {esgData.waterUsage}L saved
              </span>
              <span className={`text-sm font-medium ${getScoreColor(transparencyIndex.water.score)}`}>
                {transparencyIndex.water.score}/100
              </span>
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-cyan-600'}`}>
              Method: {transparencyIndex.water.methodology}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-cyan-600'}`}>
              Updated: {new Date(transparencyIndex.water.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Supply Chain Ethics */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
                Supply Chain Ethics
              </span>
            </div>
            {getVerificationIcon(transparencyIndex.ethics.verified)}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-purple-700'}`}>
                Ethics Rating: {esgData.supplyChain.ethicsRating}/10
              </span>
              <span className={`text-sm font-medium ${getScoreColor(transparencyIndex.ethics.score)}`}>
                {transparencyIndex.ethics.score}/100
              </span>
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-purple-600'}`}>
              {esgData.supplyChain.fairTrade && '✓ Fair Trade Certified'}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-purple-600'}`}>
              Last Audit: {new Date(transparencyIndex.ethics.lastAudit).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Region Transparency */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-orange-900'}`}>
                Region Transparency
              </span>
            </div>
            {getVerificationIcon(transparencyIndex.region.verified)}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-orange-700'}`}>
                Origin: {esgData.region}
              </span>
              <span className={`text-sm font-medium ${getScoreColor(transparencyIndex.region.score)}`}>
                {transparencyIndex.region.score}/100
              </span>
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-orange-600'}`}>
              Traceability: {transparencyIndex.region.traceability}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-orange-600'}`}>
              {esgData.supplyChain.localSourcing && '✓ Locally Sourced'}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-6">
        <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Certifications & Standards
        </h4>
        <div className="flex flex-wrap gap-2">
          {esgData.certifications.map((cert, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="mt-4">
        <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Sustainable Materials
        </h4>
        <div className="flex flex-wrap gap-2">
          {esgData.materials.map((material, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs font-medium rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {material}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ESGRatingCard;