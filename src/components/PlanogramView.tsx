

import React from 'react';
import { PlanogramData, Product } from "../types"

type PlanogramViewProps = {
  data: PlanogramData;
  isOptimized?: boolean;
};

const ProductTile: React.FC<{ product: Product; isOptimized?: boolean }> = ({ product, isOptimized }) => {
  let bgColor = 'bg-gray-100';
  let borderColor = 'border-gray-300';
  let textColor = 'text-gray-700';
  
  if (product.alert === 'WRONG_LOCATION') {
    bgColor = 'bg-red-100';
    borderColor = 'border-red-400';
    textColor = 'text-red-800';
  } else if (product.alert === 'EMPTY_SHELF' || product.name === 'Empty Slot') {
    bgColor = 'bg-yellow-100';
    borderColor = 'border-yellow-400';
    textColor = 'text-yellow-800';
  }

  const hasRationale = !!product.rationale;
  let tooltipTitle = 'AI Rationale:';
  if (product.alert === 'WRONG_LOCATION') {
      tooltipTitle = 'Issue: Misplaced SKU';
  } else if (product.alert === 'EMPTY_SHELF' || product.name === 'Empty Slot') {
      tooltipTitle = isOptimized ? 'AI Rationale:' : 'Issue: Empty Slot';
  }


  return (
    <div className={`relative group border-2 ${borderColor} ${bgColor} ${textColor} rounded-md p-2 flex flex-col justify-center items-center text-center shadow-sm h-full`}>
       {/* Image removed as per request */}
       <div className="flex flex-col justify-center">
         <p className="text-sm font-bold leading-tight">{product.name}</p>
         <p className="text-xs text-gray-500">{product.brand}</p>
       </div>
       {hasRationale && (
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs text-left text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
               <span className="font-bold block">{tooltipTitle}</span>
               {product.rationale}
               <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-gray-900 rotate-45"></div>
           </div>
       )}
    </div>
  );
};


export const PlanogramView: React.FC<PlanogramViewProps> = ({ data, isOptimized = false }) => {
  return (
    <div className={`h-full p-2 border-2 rounded-lg ${isOptimized ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white'}`}>
      <div className="grid grid-cols-4 grid-rows-3 gap-2 h-full">
        {data.products.slice(0, 12).map(product => <ProductTile key={product.id} product={product} isOptimized={isOptimized} />)}
      </div>
    </div>
  );
};