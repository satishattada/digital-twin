import React from "react";
import "./Store3DLayout.css";
import { HeatmapTooltip } from "./StoreLayoutMap";

interface CubeProps {
  className?: string;
  faceColor?: string;
  zone?: any;
  faces?: {
    front?: string;
    back?: string;
    right?: string;
    left?: string;
    top?: string;
    bottom?: string;
  };
  is3DHeatmapOn?: boolean;
}

const Cube: React.FC<CubeProps> = ({
  className = "",
  faceColor = "",
  zone = {},
  faces = {
    front: "",
    back: "",
    right: "",
    left: "Left",
    top: "Top",
    bottom: "",
  },
  is3DHeatmapOn = false,
}) => {
  const heatmapColors = {
    low: "bg-blue-500/60 border-blue-700",
    medium: "bg-yellow-500/60 border-yellow-700",
    high: "bg-orange-500/60 border-orange-700",
  };
  const engagement = (zone?.engagement as keyof typeof heatmapColors) || "low";
  const heatmapClasses = `shadow-inner ${heatmapColors[engagement]}`;
  const faceClasses =
    is3DHeatmapOn &&
    zone.name !== "POS" &&
    zone.name !== "EXIT" &&
    zone.name !== "ENTRY"
      ? heatmapClasses
      : faceColor;
  return (
    <div className="relative ">
      <div className={`cube ${className}`}>
        <div className={`front ${faceClasses}`}>{faces.back}</div>
        <div className={`back ${faceClasses}`}>{faces.back}</div>
        <div className={`right ${faceClasses}`}>{faces.right}</div>
        <div className={`left ${faceClasses}`}>{zone.name}</div>
        <div id={`cube-top`} className={`top ${faceClasses}`} title={`Zone: ${zone.name}`}>
            {zone.name}
        </div>
        <div className={`bottom ${faceClasses}`}>{faces.bottom}</div>

        {is3DHeatmapOn && zone.insights.topSku !== "N/A" && (
          <HeatmapTooltip zone={zone} />
        )}
      </div>

       
    </div>
  );
};

interface StoreBlockProps {
  className?: string;
  cubes?: Array<{
    className?: string;
    faces?: CubeProps["faces"];
    faceColor?: string;
    zone?: any;
  }>;
  is3DHeatmapOn?: boolean;
}

interface Store3DLayoutProps {
  storeData?: Array<{
    className?: string;
    cubes?: Array<{
      className?: string;
      faces?: CubeProps["faces"];
      zone?: any;
    }>;
  }>;
  is3DHeatmapOn?: boolean;
}

const StoreBlock: React.FC<StoreBlockProps> = ({
  className = "",
  cubes = [
    { className: "cube0" },
    { className: "cube1" },
    { className: "cube2" },
    { className: "cube3" },
  ],
  is3DHeatmapOn = false,
}) => {
  return (
    <div className={`store-block ${className}`}>
      {cubes.map((cube, index) => (
        <Cube
          key={index}
          className={cube.className}
          faces={cube.faces}
          faceColor={cube.faceColor}
          zone={cube.zone}
          is3DHeatmapOn={is3DHeatmapOn}
        />
      ))}
    </div>
  );
};

const Store3DLayout: React.FC<Store3DLayoutProps> = ({
  storeData,
  is3DHeatmapOn,
}) => {
  const defaultStoreBlocks = [
    {
      className: "block0",
      cubes: [
        { className: "cube0", faces: { front: "Fresh Produce" } },
        { className: "cube1", faces: { front: "Fresh Produce" } },
        { className: "cube2", faces: { front: "Fresh Produce" } },
      ],
    },
    {
      className: "block1",
      cubes: [
        { className: "cube0", faces: { front: "Meat & Seafood" } },
        { className: "cube1", faces: { front: "Meat & Seafood" } },
        { className: "cube2", faces: { front: "Meat & Seafood" } },
      ],
    },
    {
      className: "block2",
      cubes: [
        { className: "cube0", faces: { front: "Bakery" } },
        { className: "cube1", faces: { front: "Bakery" } },
        { className: "cube2", faces: { front: "Bakery" } },
      ],
    },
    {
      className: "block3",
      cubes: [
        { className: "cube0", faces: { front: "Dairy & Eggs" } },
        { className: "cube1", faces: { front: "Dairy & Eggs" } },
        { className: "cube2", faces: { front: "Dairy & Eggs" } },
        { className: "cube3", faces: { front: "Dairy & Eggs" } },
      ],
    },
  ];

  const storeBlocks = storeData || defaultStoreBlocks;

  return (
    <div className="store3d-container">
      <div className="store-container store-floor-background">
        <div className="store-blocks">
          {storeBlocks.map((block, index) => (
            <StoreBlock
              key={index}
              className={block.className}
              cubes={block.cubes}
            is3DHeatmapOn={is3DHeatmapOn}
          />
        ))}
        </div>
        
        {/* Store Walls */}
        {/* <div className="store-walls">
          <div className="wall wall-back"></div>
          <div className="wall wall-left"></div>
          <div className="wall wall-right"></div>
          <div className="wall wall-front"></div>
        </div> */}

        {/* Enhanced Floor */}
        {/* <div className="store-floor">
          <div className="floor-tiles"></div>
        </div> */}
      </div>
    </div>
  );
};

export default Store3DLayout;
