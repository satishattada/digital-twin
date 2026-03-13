import React, { useState } from 'react';

interface SMEFeedbackProps {
  assetId: string;
  onFeedback?: (feedback: 'agree' | 'disagree', comment: string) => void;
}

export const SMEFeedback: React.FC<SMEFeedbackProps> = ({ assetId: _assetId, onFeedback }) => {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleFeedback = (type: 'agree' | 'disagree') => {
    if (type === 'disagree' && !showComment) {
      setShowComment(true);
      return;
    }

    if (onFeedback) {
      onFeedback(type, comment);
    }

    // Show confidence uplift toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setShowComment(false);
    setComment('');
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">SME Feedback</h4>
      <p className="text-xs text-gray-600 mb-3">Help improve model confidence</p>
      
      {!showComment ? (
        <div className="flex gap-3">
          <button
            onClick={() => handleFeedback('agree')}
            className="flex-1 flex items-center justify-center gap-2 text-white py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#036b38' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            Agree
          </button>
          <button
            onClick={() => setShowComment(true)}
            className="flex-1 flex items-center justify-center gap-2 text-white py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#036b38' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
            </svg>
            Disagree
          </button>
        </div>
      ) : (
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Please provide context for your disagreement..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-2"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleFeedback('disagree')}
              className="px-4 py-2 text-white rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#036b38' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#094a46'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#036b38'}
            >
              Submit Feedback
            </button>
            <button
              onClick={() => {
                setShowComment(false);
                setComment('');
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Confidence Uplift Toast */}
      {showToast && (
        <div className="fixed bottom-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Confidence Uplift: Model learning from your feedback</span>
          </div>
        </div>
      )}
    </div>
  );
};
