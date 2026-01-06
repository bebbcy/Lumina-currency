import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { HistoryDataPoint } from '../types';

interface HistoryChartProps {
  data: HistoryDataPoint[];
  from: string;
  to: string;
  isLoading: boolean;
  analysis?: string;
  compareData?: HistoryDataPoint[];
  compareFrom?: string;
  compareTo?: string;
  compareAnalysis?: string;
}

const HistoryChart: React.FC<HistoryChartProps> = ({ 
  data, from, to, isLoading, analysis,
  compareData, compareFrom, compareTo, compareAnalysis 
}) => {
  if (isLoading) {
    return (
      <div className="h-64 w-full bg-slate-50 rounded-xl flex items-center justify-center animate-pulse">
        <span className="text-slate-400 font-medium">Loading market data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Merge data for the chart if comparison is active
  const chartData = useMemo(() => {
    if (!compareData || compareData.length === 0) return data;
    
    return data.map((item, index) => ({
      ...item,
      compareRate: compareData[index]?.rate,
      compareDate: compareData[index]?.date // Just for reference
    }));
  }, [data, compareData]);

  const hasComparison = !!(compareData && compareData.length > 0 && compareFrom && compareTo);

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
      <div className="mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500"></span>
              {from}/{to}
            </h3>
            {analysis && (
              <p className="text-sm text-slate-500 mt-1 italic pl-5 border-l-2 border-slate-100">
                {analysis}
              </p>
            )}
          </div>
          
          {hasComparison && compareAnalysis && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                {compareFrom}/{compareTo}
              </h3>
              <p className="text-sm text-slate-500 mt-1 italic pl-5 border-l-2 border-slate-100">
                {compareAnalysis}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompare" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(val) => val ? val.split('-').slice(1).join('/') : ''}
            />
            
            {/* Left Axis for Main Pair */}
            <YAxis 
              yAxisId="left"
              domain={['auto', 'auto']} 
              tick={{ fontSize: 12, fill: '#0ea5e9' }} 
              axisLine={false}
              tickLine={false}
              width={40}
            />

            {/* Right Axis for Comparison Pair */}
            {hasComparison && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: '#8b5cf6' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
            )}

            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
              itemStyle={{ fontWeight: 600, padding: '2px 0' }}
              formatter={(value: number, name: string) => {
                if (name === 'rate') return [value.toFixed(4), `${from}/${to}`];
                if (name === 'compareRate') return [value.toFixed(4), `${compareFrom}/${compareTo}`];
                return [value, name];
              }}
            />
            
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="rate"
              name={`${from}/${to}`}
              stroke="#0ea5e9"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRate)"
            />
            
            {hasComparison && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="compareRate"
                name={`${compareFrom}/${compareTo}`}
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCompare)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;