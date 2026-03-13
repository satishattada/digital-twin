import React, { useState } from 'react';

interface ChatAssistantProps {
  onCommand?: (command: string) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ onCommand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your rDOS assistant. Ask me about assets, run analyses, or generate strategy packs.'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Simulate response
    setTimeout(() => {
      let response = '';
      if (userMessage.toLowerCase().includes('asset 12783') || userMessage.toLowerCase().includes('hvac')) {
        response = 'Asset AST-12783 (HVAC Unit 3B) has an RUL of 180 days with 93% confidence. Recommendation: Refurbish in Q2 2026 to avoid £240K replacement cost. Would you like me to open the detailed view?';
      } else if (userMessage.toLowerCase().includes('apac') && userMessage.toLowerCase().includes('rul')) {
        response = 'Found 3 assets in APAC with RUL < 60 days: AST-16341 (720 days, Monitor), AST-16389 (45 days, Renew), AST-16402 (30 days, Urgent Renew). Showing in workbench.';
      } else if (userMessage.toLowerCase().includes('stress') || userMessage.toLowerCase().includes('demo preset')) {
        response = 'Running demo preset stress-test: "Parts Shortage (EU) + 10% Inflation". This will simulate supply chain disruption and cost increases. Results will appear in the Simulator screen.';
      } else if (userMessage.toLowerCase().includes('strategy pack')) {
        response = 'I can generate and send a Strategy Pack for any market or time period. Which market would you like: UK, EU, APAC, or Americas? Or would you like a global summary?';
      } else {
        response = `I can help you with:\n• Asset details and recommendations\n• Running simulations and stress-tests\n• Generating Strategy Packs\n• Filtering and analyzing data\n• Creating cases and approvals`;
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      if (onCommand) onCommand(userMessage);
    }, 800);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 md:p-4 shadow-lg transition-all z-40"
        title="rDOS Chat Assistant"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-4 md:bottom-24 md:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-8rem)] sm:h-[500px] max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-40">
          <div className="bg-green-600 text-white p-3 md:p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold text-sm md:text-base">rDOS Chat Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask rDOS anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
