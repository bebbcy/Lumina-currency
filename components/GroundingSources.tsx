
import React from 'react';
import { ExternalLink, Search } from 'lucide-react';

interface GroundingSourcesProps {
  // Update: Reflect optional properties from the updated ConversionResponse type
  sources: Array<{
    web?: {
      uri?: string;
      title?: string;
    };
  }>;
}

const GroundingSources: React.FC<GroundingSourcesProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Search size={12} />
        <span>Verified Sources</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((chunk, idx) => {
          // Fix: Ensure we have a web part and a valid URI before rendering the link
          if (!chunk.web || !chunk.web.uri) return null;
          return (
            <a
              key={idx}
              href={chunk.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-full text-xs font-medium transition-colors border border-slate-200"
            >
              <span className="truncate max-w-[150px]">{chunk.web.title || 'Source'}</span>
              <ExternalLink size={10} />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default GroundingSources;
