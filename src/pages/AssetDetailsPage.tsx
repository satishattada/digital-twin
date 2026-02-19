import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import AssetDetailsFullPage from "../components/AssetDetailsFullPage";
import { equipmentDataAtom } from "../store/facilitiesStore";

export const AssetDetailsPage: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const equipmentData = useAtomValue(equipmentDataAtom);

  const equipment = equipmentData.find(eq => eq.id === assetId) || null;

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Asset Not Found</h2>
          <p className="text-gray-600 mb-4">The asset you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <AssetDetailsFullPage equipment={equipment} onBack={handleBack} />;
};
