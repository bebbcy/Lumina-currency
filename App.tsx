import React, { useState, useCallback } from 'react';
import { ArrowRightLeft, Sparkles, TrendingUp, Info, GitCompare, CircleHelp } from 'lucide-react';
import { CurrencyCode, ConversionResponse, HistoryResponse } from './types';
import { convertCurrencyWithGenAI, getHistoricalTrends } from './services/geminiService';
import CurrencyInput from './components/CurrencyInput';
import HistoryChart from './components/HistoryChart';
import GroundingSources from './components/GroundingSources';
import HelpModal from './components/HelpModal';

const App: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  
  // Main Conversion State
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>(CurrencyCode.USD);
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(CurrencyCode.EUR);
  
  // Comparison State
  const [isComparing, setIsComparing] = useState(false);
  const [compareFrom, setCompareFrom] = useState<CurrencyCode>(CurrencyCode.GBP);
  const [compareTo, setCompareTo] = useState<CurrencyCode>(CurrencyCode.USD);

  const [loading, setLoading] = useState(false);
  const [conversionData, setConversionData] = useState<ConversionResponse | null>(null);
  const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConversionData(null);
    setHistoryData(null);
  };

  const handleConvert = useCallback(async () => {
    if (amount <= 0) return;

    setLoading(true);
    setLoadingHistory(true);
    setError(null);
    setConversionData(null);
    setHistoryData(null);

    try {
      // 1. Fetch Real-time Conversion (with Search Grounding)
      const result = await convertCurrencyWithGenAI(amount, fromCurrency, toCurrency);
      setConversionData(result);

      setLoading(false);

      // 2. Fetch Historical Trends
      const history = await getHistoricalTrends(
        fromCurrency, 
        toCurrency, 
        isComparing ? compareFrom : undefined,
        isComparing ? compareTo : undefined
      );
      setHistoryData(history);
      
    } catch (err: any) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while connecting to Gemini. Please try again later.");
      }
    } finally {
      setLoading(false);
      setLoadingHistory(false);
    }
  }, [amount, fromCurrency, toCurrency, isComparing, compareFrom, compareTo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4facfe] to-[#00f2fe] p-4 md:p-8 flex flex-col items-center justify-center font-sans relative">
      
      <button 
        onClick={() => setShowHelp(true)}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-white/80 hover:text-white transition-all transform hover:scale-110 p-2 bg-white/10 rounded-full backdrop-blur-sm"
        title="Help & Info"
      >
        <CircleHelp size={28} />
      </button>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      <header className="mb-8 text-center text-white drop-shadow-md mt-8 md:mt-0">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          <h1 className="text-4xl font-extrabold tracking-tight">Lumina Currency</h1>
        </div>
        <p className="text-blue-50 opacity-90 font-medium">AI-Powered Real-Time Exchange & Analytics</p>
      </header>

      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95">
          
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Input Section */}
            <div className="space-y-4">
              <CurrencyInput
                label="Amount & Source"
                amount={amount}
                currency={fromCurrency}
                onAmountChange={setAmount}
                onCurrencyChange={setFromCurrency}
              />

              <div className="relative h-4">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <button 
                    onClick={handleSwap}
                    className="bg-white p-2 rounded-full shadow-md border border-slate-100 hover:bg-blue-50 hover:text-blue-500 transition-all transform hover:rotate-180 active:scale-95"
                    title="Swap Currencies"
                  >
                    <ArrowRightLeft size={20} className="text-slate-600" />
                  </button>
                </div>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
              </div>

              <CurrencyInput
                label="Target Currency"
                amount={conversionData?.calculatedAmount ? parseFloat(conversionData.calculatedAmount) : undefined}
                currency={toCurrency}
                onCurrencyChange={setToCurrency}
                onAmountChange={() => {}} // Read only
                readOnlyAmount={true}
              />
            </div>

            {/* Comparison Toggle */}
            <div className="pt-2">
              <button 
                onClick={() => setIsComparing(!isComparing)}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isComparing ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isComparing ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                   {isComparing && <GitCompare size={10} className="text-white" />}
                </div>
                Compare Market Trends
              </button>

              {isComparing && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fadeIn space-y-4">
                  <p className="text-xs text-slate-500 font-medium">Select a second pair to compare historical performance:</p>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                       <CurrencyInput 
                          label="Compare From"
                          currency={compareFrom}
                          onCurrencyChange={setCompareFrom}
                          hideAmount={true}
                       />
                    </div>
                    <div className="text-slate-400">
                      <ArrowRightLeft size={16} />
                    </div>
                    <div className="flex-1">
                      <CurrencyInput 
                          label="Compare To"
                          currency={compareTo}
                          onCurrencyChange={setCompareTo}
                          hideAmount={true}
                       />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleConvert}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform active:scale-[0.98]
                ${loading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-cyan-200/50'
                }
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Market...
                </div>
              ) : (
                "Get Live Rate"
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                <Info size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Results Section */}
            {conversionData && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-500 uppercase">Live Rate</span>
                    {conversionData.exchangeRate && (
                       <span className="font-mono text-xs text-slate-400">1 {fromCurrency} ≈ {conversionData.exchangeRate} {toCurrency}</span>
                    )}
                  </div>
                  
                  <div className="text-3xl font-extrabold text-slate-800 break-words mb-4">
                     {conversionData.calculatedAmount 
                        ? `${parseFloat(conversionData.calculatedAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency}`
                        : "Conversion Complete"}
                  </div>

                  {/* AI Narrative */}
                  <div className="text-slate-600 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-xs uppercase tracking-wide">
                      <Sparkles size={14} />
                      Gemini Analysis
                    </div>
                    <div className="whitespace-pre-line leading-relaxed text-sm">
                      {conversionData.rateText}
                    </div>
                  </div>

                   <GroundingSources sources={conversionData.groundingChunks || []} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        {(historyData || loadingHistory) && !loading && (
          <div className="mt-6 animate-slideUp">
             <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                   <TrendingUp size={20} className="text-blue-500" />
                   <h2 className="font-bold text-lg">Market Trends</h2>
                </div>
                <HistoryChart 
                  data={historyData?.data || []} 
                  from={fromCurrency} 
                  to={toCurrency} 
                  isLoading={loadingHistory}
                  analysis={historyData?.analysis}
                  compareData={historyData?.compareData}
                  compareFrom={isComparing ? compareFrom : undefined}
                  compareTo={isComparing ? compareTo : undefined}
                  compareAnalysis={historyData?.compareAnalysis}
                />
             </div>
          </div>
        )}

      </div>
      
      <footer className="mt-12 text-white/80 text-xs font-medium">
        Powered by Google Gemini 3 Flash &bull; Real-time data via Search Grounding
      </footer>
    </div>
  );
};

export default App;