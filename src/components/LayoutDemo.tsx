import React, { useState } from 'react';
import Store3DLayout from './Store3DLayout';
import { HeatmapZoneData } from '@/types';

const LayoutDemo: React.FC = () => {
  const [activeLayout, setActiveLayout] = useState<'2d' | '3d'>('2d');

  return (
    <div className="bg-gray-100 p-4">
      {/* Header with Layout Toggle */}
      <div className="mb-4 flex justify-between items-center">

        
        <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => setActiveLayout('2d')}
            className={`px-6 py-2 font-medium transition-all duration-200 ${
              activeLayout === '2d'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            2D Heatmap Layout
          </button>
          <button
            onClick={() => setActiveLayout('3d')}
            className={`px-6 py-2 font-medium transition-all duration-200 ${
              activeLayout === '3d'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            3D Cube Layout
          </button>
        </div>
      </div>

      {/* Layout Display */}
      <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
        {activeLayout === '2d' ? (
          <div className="w-full h-full bg-white p-4">
            asasa
          </div>
        ) : (
          <Store3DLayout onMouseEnter={function (zone: HeatmapZoneData, event: React.MouseEvent): void {
              throw new Error('Function not implemented.');
            } } onMouseLeave={function (): void {
              throw new Error('Function not implemented.');
            } } onMouseMove={function (event: React.MouseEvent): void {
              throw new Error('Function not implemented.');
            } } />
        )}
      </div>
    </div>
  );
};

export default LayoutDemo;
