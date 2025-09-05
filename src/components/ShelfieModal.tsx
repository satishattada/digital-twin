import React, { useState, useRef, useMemo } from 'react';
import { ShelfieAnalysisResult, DetectedItem, DetectedItemType } from "../types"
import { MOCK_SHELFIE_SCENARIOS } from "../constants"

type ShelfieModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onInitiateRestock: (items: DetectedItem[]) => void;
};

const getScoreStyling = (score: number) => {
    if (score >= 90) return { text: 'text-green-600', bg: 'bg-green-100', label: 'High Compliance', badge: '🟢' };
    if (score >= 70) return { text: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Moderate Compliance', badge: '🟡' };
    return { text: 'text-red-600', bg: 'bg-red-100', label: 'Low Compliance', badge: '🔴' };
};

const getOverlayStyling = (type: DetectedItemType) => {
    switch (type) {
        case 'correct': return 'border-green-500';
        case 'misplaced': return 'border-red-500';
        case 'low': return 'bg-yellow-500/40 border-yellow-500';
        case 'empty': return 'border-gray-500 bg-repeating-diagonal-lines';
        default: return 'border-gray-400';
    }
};

const AnalysisOverlay: React.FC<{ items: DetectedItem[] }> = ({ items }) => (
    <div className="absolute inset-0 w-full h-full">
        {items.map(item => (
            <div
                key={item.id}
                className={`absolute group border-2 ${getOverlayStyling(item.type)}`}
                style={{
                    left: `${item.box.x}%`,
                    top: `${item.box.y}%`,
                    width: `${item.box.width}%`,
                    height: `${item.box.height}%`,
                }}
            >
                {item.type !== 'correct' && (
                    <div className="absolute -top-5 left-0 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                        {item.type === 'misplaced' && '❌ Misplaced'}
                        {item.type === 'low' && '⚠️ Low Stock'}
                        {item.type === 'empty' && '⛔ Empty Slot'}
                    </div>
                )}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs text-left text-white bg-gray-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {item.tooltip}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
            </div>
        ))}
    </div>
);

const InsightSummary: React.FC<{ analysis: ShelfieAnalysisResult, onRestock: () => void }> = ({ analysis, onRestock }) => (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fade-in">
        <h3 className="font-bold text-lg text-gray-800">SHELFIE Insight Summary</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
            <div className="flex justify-between p-2 rounded-md bg-green-100/60">
                <span className="font-semibold text-green-800">✔ Correctly Placed:</span>
                <span className="font-bold text-green-800">{analysis.summary.correct}</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-red-100/60">
                <span className="font-semibold text-red-800">❌ Misplaced SKUs:</span>
                <span className="font-bold text-red-800">{analysis.summary.misplaced}</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-yellow-100/60">
                <span className="font-semibold text-yellow-800">⚠️ Low-Stock Zones:</span>
                <span className="font-bold text-yellow-800">{analysis.summary.low}</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-gray-200/60">
                <span className="font-semibold text-gray-800">⛔ Empty Slots:</span>
                <span className="font-bold text-gray-800">{analysis.summary.empty}</span>
            </div>
        </div>
        {(analysis.summary.low + analysis.summary.empty > 0) && (
            <button
                onClick={onRestock}
                className="w-full mt-4 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
                ✅ Create Restock Task ({analysis.summary.low + analysis.summary.empty} items)
            </button>
        )}
    </div>
);


export const ShelfieModal: React.FC<ShelfieModalProps> = ({ isOpen, onClose, onInitiateRestock }) => {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<ShelfieAnalysisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAnalysis(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleTriggerAI = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            // 1. Randomly select a scenario
            const scenario = MOCK_SHELFIE_SCENARIOS[Math.floor(Math.random() * MOCK_SHELFIE_SCENARIOS.length)];
            const { summary } = scenario;

            // 2. Calculate dynamic score based on the scenario's data
            const totalDetectedItems = summary.correct + summary.misplaced;
            const totalSlots = summary.correct + summary.misplaced + summary.low + summary.empty;
            
            const weights = { placement: 35, misplaced: 25, fill: 20, variety: 10, facing: 10 };

            const placementScore = summary.totalExpectedSkus > 0 ? (summary.correct / summary.totalExpectedSkus) * weights.placement : 0;
            const misplacedScore = totalDetectedItems > 0 ? ((totalDetectedItems - summary.misplaced) / totalDetectedItems) * weights.misplaced : weights.misplaced;
            const fillLevelScore = totalSlots > 0 ? ((totalSlots - summary.empty - summary.low) / totalSlots) * weights.fill : 0;
            const varietyScore = summary.totalExpectedSkus > 0 ? (totalDetectedItems / summary.totalExpectedSkus) * weights.variety : 0;
            const facingScore = totalDetectedItems > 0 ? ((totalDetectedItems - summary.facingIssues) / totalDetectedItems) * weights.facing : weights.facing;

            const totalScore = Math.round(placementScore + misplacedScore + fillLevelScore + varietyScore + facingScore);

            setAnalysis({
                ...scenario,
                complianceScore: totalScore,
            });
            setIsAnalyzing(false);
        }, 4500);
    };

    const handleCreateRestockTask = () => {
        if (analysis) {
            const itemsToRestock = analysis.detectedItems.filter(item => item.type === 'low' || item.type === 'empty');
            onInitiateRestock(itemsToRestock);
            handleClose();
        }
    };
    
    const resetState = () => {
        setImage(null);
        setAnalysis(null);
        setIsAnalyzing(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };
    
    const scoreStyling = useMemo(() => analysis ? getScoreStyling(analysis.complianceScore) : null, [analysis]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shelfie-modal-title"
        >
            <div className="bg-white shadow-2xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh]">
                <header className="flex items-center justify-between p-4 border-b shrink-0">
                    <h2 id="shelfie-modal-title" className="text-xl font-bold text-[#005BAC]">SHELFIE Mobile Scan</h2>
                    <button onClick={handleClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Close">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start overflow-y-auto">
                    {/* Left side: Upload and Image Preview/Analysis */}
                    <div className="flex flex-col gap-4">
                         <div className="relative flex items-center justify-center h-full bg-slate-100 rounded-lg p-2 border-2 border-dashed border-gray-300 min-h-[300px]">
                            {image ? (
                                <>
                                    <img src={image} alt="Shelf preview" className="max-h-full max-w-full rounded-lg object-contain" />
                                    {analysis && <AnalysisOverlay items={analysis.detectedItems} />}
                                </>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                                    <p className="mt-2 font-semibold">Upload a shelf image</p>
                                    <p className="text-sm">Use your camera or upload from device.</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Right side: Actions and Results */}
                    <div className="flex flex-col gap-4">
                         <div className="flex gap-2">
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full text-center px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                {image ? '📸 Upload New' : '📸 Upload Image'}
                            </button>
                        </div>

                        <button
                            onClick={handleTriggerAI}
                            disabled={!image || isAnalyzing}
                            className="w-full px-4 py-3 bg-[#005BAC] text-white font-bold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700"
                        >
                            {isAnalyzing ? 'Analyzing Shelf Image...' : '🤖 Trigger SHELFIE AI'}
                        </button>
                        
                        {isAnalyzing && (
                            <div className="flex justify-center items-center p-4">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#005BAC]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-gray-600 font-semibold">AI is analyzing the shelf...</span>
                            </div>
                        )}

                        {analysis && scoreStyling && (
                             <div className={`mt-4 p-4 ${scoreStyling.bg} border border-gray-200 rounded-lg animate-fade-in`}>
                                <h3 className="font-bold text-lg text-gray-800">Analysis Complete</h3>
                                <p className="text-sm">Compliance Score: 
                                    <span className={`font-extrabold text-3xl ml-2 ${scoreStyling.text}`}>{analysis.complianceScore}%</span>
                                </p>
                                <div className={`mt-1 font-semibold px-2.5 py-1 rounded-full text-sm inline-flex items-center gap-2 ${scoreStyling.text} ${scoreStyling.bg}`}>
                                    <span>{scoreStyling.badge}</span>
                                    <span>{scoreStyling.label}</span>
                                </div>
                            </div>
                        )}

                        {analysis && <InsightSummary analysis={analysis} onRestock={handleCreateRestockTask} />}
                    </div>
                </div>
            </div>
        </div>
    );
};