'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSettings } from './SettingsContext'

export default function Telemetry(){
  const { settings } = useSettings()
  
  // Real-time jitter parameters
  const [reactorLoad, setReactorLoad] = useState(98.7)
  const [thermalTemp, setThermalTemp] = useState(1280)
  const [stabilizerFlux, setStabilizerFlux] = useState(45.2)

  // Real-time SVG chart points stream
  const [points, setPoints] = useState<number[]>([40, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 75, 80, 88, 92])

  useEffect(() => {
    const timer = setInterval(() => {
      // Small random jitter on numeric readouts
      setReactorLoad(prev => Math.min(100, Math.max(95, prev + (Math.random() - 0.5) * 0.15)))
      setThermalTemp(prev => Math.min(1450, Math.max(1200, prev + (Math.random() - 0.5) * 4)))
      setStabilizerFlux(prev => Math.min(60, Math.max(30, prev + (Math.random() - 0.5) * 1.0)))

      // Roll points for line graph
      setPoints(prev => {
        const next = [...prev.slice(1)]
        const last = prev[prev.length - 1]
        const jitter = (Math.random() - 0.5) * 8
        const value = Math.min(100, Math.max(20, last + jitter))
        next.push(value)
        return next
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])

  // Build SVG polyline points from stream array
  const width = 280
  const height = 50
  const step = width / (points.length - 1)
  const svgPoints = points.map((p, i) => `${i * step},${height - (p / 100) * height}`).join(' ')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.5 }} 
      className="p-5 bg-[rgba(10,12,16,0.5)] border border-[rgba(255,255,255,0.05)] rounded-xl backdrop-blur-md relative overflow-hidden font-mono"
    >
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3 mb-4">
        <div>
          <h4 className="text-xs font-mono uppercase tracking-[0.2em] opacity-60">System Feed</h4>
          <div className="text-sm font-bold tracking-wide mt-0.5">TELEMETRY DECK</div>
        </div>
        <div className="text-[10px] text-gray-500 font-mono tracking-wider animate-pulse">LIVE STREAM</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Reactor Load Gauge with animated circular ring */}
        <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Reactor core</div>
            <div className="text-sm font-bold mt-1 text-white">{reactorLoad.toFixed(1)}%</div>
            <div className="text-[8px] text-gray-400 mt-0.5">NOMINAL FLOW</div>
          </div>
          
          <div className="relative w-10 h-10">
            {/* SVG Arc Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="20" cy="20" r="16" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle 
                cx="20" cy="20" r="16" fill="transparent" 
                stroke={settings.themeColor} 
                strokeWidth="3.2" 
                strokeDasharray={100}
                strokeDashoffset={100 - reactorLoad}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[7px] font-bold" style={{ color: settings.themeColor }}>
              ARC
            </div>
          </div>
        </div>

        {/* Thermal Temperature Gauge */}
        <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-lg">
          <div className="text-[9px] text-gray-500 uppercase tracking-widest">CORE THERMALS</div>
          <div className="text-sm font-bold mt-1 text-white transition-colors duration-300" style={{ color: thermalTemp > 1380 ? '#ff2a5f' : '#ffffff' }}>
            {Math.floor(thermalTemp)} °C
          </div>
          <div className="w-full bg-[rgba(255,255,255,0.05)] h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full transition-all duration-300" 
              style={{ 
                width: `${(thermalTemp / 1500) * 100}%`,
                backgroundColor: thermalTemp > 1380 ? '#ff2a5f' : settings.themeColor 
              }} 
            />
          </div>
        </div>
      </div>

      {/* SVG Real-time Waveform Chart */}
      <div className="p-3 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.03)] rounded-lg relative">
        <div className="flex justify-between items-center text-[8px] text-gray-500 uppercase tracking-widest mb-2">
          <span>Stardust Flux Feed</span>
          <span style={{ color: settings.themeColor }}>{stabilizerFlux.toFixed(1)} GHz</span>
        </div>

        <svg className="w-full h-12 overflow-visible">
          {/* Grid lines */}
          <line x1="0" y1="12" x2="300" y2="12" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="0" y1="24" x2="300" y2="24" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          <line x1="0" y1="36" x2="300" y2="36" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

          {/* Glowing Shadow Area */}
          <path
            d={`M 0,${height} L ${svgPoints} L ${width},${height} Z`}
            fill={`url(#gradient-${settings.themeColor.replace('#', '')})`}
            opacity="0.1"
            className="transition-all duration-200 ease-out"
          />

          {/* Polyline */}
          <polyline
            fill="none"
            stroke={settings.themeColor}
            strokeWidth="1.6"
            points={svgPoints}
            className="transition-all duration-200 ease-out"
          />

          {/* Linear Gradient definition */}
          <defs>
            <linearGradient id={`gradient-${settings.themeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={settings.themeColor} stopOpacity="1" />
              <stop offset="100%" stopColor={settings.themeColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-[8px] text-gray-500">
        <span>FRAME-INTEGRATION: SYNCED</span>
        <span>JARVIS-2.0 R3F</span>
      </div>
    </motion.div>
  )
}

