import React from 'react';
import { X, Sparkles, TrendingUp, Search } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn relative">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Welcome to Lumina</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Feature 1 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <Sparkles className="text-blue-500" size={20} />
              Real-Time Conversion
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Lumina uses <strong>Google Search Grounding</strong> to find current market rates instantly. No more relying on stale data; you get verified links to live sources for every conversion.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={20} />
              Market Trends & Comparison
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Analyze the last 14 days of currency performance. Use the <strong>Compare</strong> feature to see how two different currency pairs perform side-by-side on one interactive chart.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-3">
             <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <Search className="text-blue-500" size={20} />
              AI-Powered Insights
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Beyond just numbers, Gemini provides concise summaries and bulleted market insights to help you understand the "why" behind currency fluctuations.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl transform active:scale-95"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;