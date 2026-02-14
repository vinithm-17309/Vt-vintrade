import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { realTimeMarketService, CandlestickData } from '../services/realTimeMarketService';

interface CandlestickChartProps {
  symbol: string;
  timeframe: string;
  width: number;
  height: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  symbol, 
  timeframe, 
  width, 
  height 
}) => {
  const [candleData, setCandleData] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setLoading(true);
    
    // Fetch historical data
    const fetchData = async () => {
      try {
        const data = await realTimeMarketService.fetchCandlestickData(symbol, timeframe, 100);
        setCandleData(data);
      } catch (error) {
        console.error('Error fetching candlestick data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up periodic updates for real-time effect
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, [symbol, timeframe]);

  if (loading || candleData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  // Calculate price range
  const allPrices = candleData.flatMap(d => [d.high, d.low]);
  const maxPrice = Math.max(...allPrices);
  const minPrice = Math.min(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  // Chart dimensions
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const candleWidth = Math.max(2, chartWidth / candleData.length - 2);

  // Helper functions
  const getY = (price: number) => {
    return padding + ((maxPrice - price) / priceRange) * chartHeight;
  };

  const getX = (index: number) => {
    return padding + (index * (chartWidth / candleData.length)) + candleWidth / 2;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeframe.includes('m') || timeframe.includes('hr')) {
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="relative w-full h-full">
      <svg
        ref={chartRef}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        {/* Grid Lines */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path 
              d="M 50 0 L 0 0 0 50" 
              fill="none" 
              stroke="#374151" 
              strokeWidth="0.5" 
              opacity="0.3"
            />
          </pattern>
        </defs>
        
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#grid)" 
        />

        {/* Price Grid Lines */}
        {Array.from({ length: 6 }, (_, i) => {
          const price = minPrice + (priceRange * i / 5);
          const y = getY(price);
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#4B5563"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <text
                x={padding - 5}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#9CA3AF"
              >
                ₹{formatPrice(price)}
              </text>
            </g>
          );
        })}

        {/* Candlesticks */}
        {candleData.map((candle, index) => {
          const x = getX(index);
          const openY = getY(candle.open);
          const closeY = getY(candle.close);
          const highY = getY(candle.high);
          const lowY = getY(candle.low);
          
          const isGreen = candle.close > candle.open;
          const bodyTop = Math.min(openY, closeY);
          const bodyBottom = Math.max(openY, closeY);
          const bodyHeight = Math.abs(closeY - openY);

          return (
            <motion.g
              key={`${candle.timestamp}-${index}`}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.3, delay: index * 0.01 }}
            >
              {/* Wick */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={isGreen ? '#10B981' : '#EF4444'}
                strokeWidth="1"
              />
              
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={Math.max(bodyHeight, 1)}
                fill={isGreen ? '#10B981' : '#EF4444'}
                stroke={isGreen ? '#10B981' : '#EF4444'}
                strokeWidth="1"
                opacity={isGreen ? 0.8 : 1}
              />
              
              {/* Hover area */}
              <rect
                x={x - candleWidth}
                y={highY}
                width={candleWidth * 2}
                height={lowY - highY}
                fill="transparent"
                className="hover:fill-blue-500 hover:opacity-10 cursor-crosshair"
              >
                <title>
                  {`${formatTime(candle.timestamp)}
Open: ₹${formatPrice(candle.open)}
High: ₹${formatPrice(candle.high)}
Low: ₹${formatPrice(candle.low)}
Close: ₹${formatPrice(candle.close)}
Volume: ${candle.volume.toLocaleString()}`}
                </title>
              </rect>
            </motion.g>
          );
        })}

        {/* Time Labels */}
        {candleData.map((candle, index) => {
          if (index % Math.ceil(candleData.length / 8) !== 0) return null;
          
          const x = getX(index);
          return (
            <text
              key={`time-${index}`}
              x={x}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#9CA3AF"
            >
              {formatTime(candle.timestamp)}
            </text>
          );
        })}

        {/* Current Price Line */}
        {candleData.length > 0 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <line
              x1={padding}
              y1={getY(candleData[candleData.length - 1].close)}
              x2={width - padding}
              y2={getY(candleData[candleData.length - 1].close)}
              stroke="#3B82F6"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.8"
            />
            <rect
              x={width - padding - 60}
              y={getY(candleData[candleData.length - 1].close) - 10}
              width="55"
              height="20"
              fill="#3B82F6"
              rx="3"
            />
            <text
              x={width - padding - 32}
              y={getY(candleData[candleData.length - 1].close) + 4}
              textAnchor="middle"
              fontSize="10"
              fill="white"
              fontWeight="bold"
            >
              ₹{formatPrice(candleData[candleData.length - 1].close)}
            </text>
          </motion.g>
        )}
      </svg>

      {/* Volume Chart */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-800/50">
        <svg width={width} height="60" className="w-full h-full">
          {candleData.map((candle, index) => {
            const maxVolume = Math.max(...candleData.map(d => d.volume));
            const volumeHeight = (candle.volume / maxVolume) * 50;
            const x = getX(index);
            const isGreen = candle.close > candle.open;
            
            return (
              <rect
                key={`volume-${index}`}
                x={x - candleWidth / 2}
                y={60 - volumeHeight}
                width={candleWidth}
                height={volumeHeight}
                fill={isGreen ? '#10B981' : '#EF4444'}
                opacity="0.6"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default CandlestickChart;