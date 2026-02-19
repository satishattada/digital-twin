

import React from 'react';
import { PlanogramData, Product } from "../types"

type PlanogramViewProps = {
  data: PlanogramData;
  isOptimized?: boolean;
};

const ProductTile: React.FC<{ product: Product; isOptimized?: boolean }> = ({ product, isOptimized }) => {
  let bgColor = 'bg-white';
  let borderColor = 'border-gray-200';
  let textColor = 'text-gray-700';
  let statusIcon = null;
  let statusMessage = '';

  if (product.alert === 'WRONG_LOCATION') {
    bgColor = 'bg-orange-50';
    borderColor = 'border-orange-200';
    textColor = 'text-orange-800';
    statusIcon = '❌';
        statusMessage = 'Ready to optimize';
  } else if (product.alert === 'EMPTY_SHELF' || product.name === 'Empty Slot') {
    bgColor = 'bg-blue-50';
    borderColor = 'border-blue-200';
    textColor = 'text-blue-800';
    statusIcon = '🎯';
    statusMessage = 'Opportunity available';
  } else {
    statusIcon = '✅';
    statusMessage = 'Perfectly placed';
    bgColor = 'bg-green-50';
    borderColor = 'border-green-200';
  }

  // Generate product emoji based on product name/type
  const getProductEmoji = (productName: string) => {
    if (productName === 'Empty Slot') return '📦';
    
    const name = productName.toLowerCase();
    if (name.includes('coca') || name.includes('coke')) return '🥤';
    if (name.includes('pepsi')) return '🥤';
    if (name.includes('sprite') || name.includes('lemon')) return '🍋';
    if (name.includes('water')) return '💧';
    if (name.includes('juice') || name.includes('orange')) return '🍊';
    if (name.includes('energy') || name.includes('red bull')) return '⚡';
    if (name.includes('coffee')) return '☕';
    if (name.includes('tea')) return '🍵';
    if (name.includes('milk')) return '🥛';
    return '🥤'; // Default beverage
  };

  const hasRationale = !!product.rationale;
  let tooltipTitle = '🤖 AI Insight:';
  if (product.alert === 'WRONG_LOCATION') {
      tooltipTitle = '💡 Optimization Tip:';
  } else if (product.alert === 'EMPTY_SHELF' || product.name === 'Empty Slot') {
      tooltipTitle = isOptimized ? '🎯 Shelfie Recommendation:' : '🚀 Growth Opportunity:';
  }

   bgColor = product.rationale?.includes("Moved") || product.rationale?.includes("Positioned")? 'bg-green-200' : bgColor;

   bgColor = product.rationale?.includes("Swapped") || product.rationale?.includes("Shifted")? 'bg-purple-200' : bgColor;
    return (
      <div className={`relative group border-2 ${borderColor} ${bgColor} ${textColor} rounded-lg p-2 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-md transition-all duration-200 h-full min-h-[90px]`}>
      {/* Status icon */}
      <div className="absolute top-1 right-1 text-sm" title={statusMessage}>
        {statusIcon}
      </div>
      
      {/* Product representation */}
      <div className="text-2xl mb-1 mt-1">
        {getProductEmoji(product.name)}
      </div>
      
      {/* Product info */}
      <div className="flex flex-col justify-center flex-grow">
        <p className="text-xs font-bold leading-tight mb-1">{product.name}</p>
        <p className="text-xs text-gray-500">{product.brand}</p>
      </div>

      {/* Progress indicator for optimized view */}
      {isOptimized && (
        <div className="w-full h-1 bg-green-200 rounded-full mt-1">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
        </div>
      )}

      {hasRationale && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 text-xs text-left text-white bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
          <span className="font-bold block mb-1">{tooltipTitle}</span>
          <p className="leading-relaxed">{product.rationale}</p>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-3 bg-blue-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export const PlanogramView: React.FC<PlanogramViewProps> = ({ data, isOptimized = false }) => {
  return (
    <div className={`h-full p-2 border-2 rounded-lg ${isOptimized ? 'border-green-300 bg-white' : 'border-gray-300 bg-white'}`}>
      <div className="grid grid-cols-4 grid-rows-3 gap-2 h-[400px]">
        {data.products.slice(0, 12).map(product => <ProductTile key={product.id} product={product} isOptimized={isOptimized} />)}
      </div>
    </div>
  );
};