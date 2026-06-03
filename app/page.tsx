'use client'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import HUD from '../components/HUD'
import Telemetry from '../components/Telemetry'
import ParticlesOverlay from '../components/ParticlesOverlay'
import { useSettings } from '../components/SettingsContext'
import ironmanBg from '../ironman-1043700_1280.jpg'

const Hero3D = dynamic(() => import('../components/Hero3D'), { ssr: false })

export default function Page(){
  const { settings } = useSettings()
  const [time, setTime] = useState('')
  const [systemLogs, setSystemLogs] = useState<string[]>([
    'SYSTEM: Core interface loaded.',
    'DIAGNOSTIC: repulsor feedback loop - OK.',
    'NETWORK: Stark Satellite uplink - SECURE.'
  ])

  useEffect(() => {
    // Client-side ticking secure clock
    const updateTime = () => {
      const d = new Date()
      setTime(d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC')
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Generate dynamic dashboard logs in background
    const logInterval = setInterval(() => {
      const alerts = [
        'TELEMETRY: Fluid pressure calibrated.',
        'MONITOR: Particle acceleration at nominal efficiency.',
        'SYSTEM: Stark Tower sub-grid syncing...',
        'GRID: Repulsor arrays stabilized.',
        'DECK: Armor temperature threshold calibrated.',
        'SATELLITE: Stark-Net v4 telemetry buffer refreshed.'
      ]
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)]
      setSystemLogs(prev => [...prev.slice(-3), randomAlert])
    }, 4500)
    return () => clearInterval(logInterval)
  }, [])

  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white relative font-sans overflow-x-hidden"
      style={{ backgroundImage: `url(${ironmanBg.src})` }}
    >
      {/* Dark overlay backdrop to keep the cyan UI highly visible and contrasty */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />

      {/* Sci-fi layout borders */}
      <div className="absolute inset-0 pointer-events-none border border-[rgba(255,255,255,0.02)] m-4 rounded-2xl z-10" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent z-10" />

      {/* Cinematic Header Bar */}
      <header className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(6,8,12,0.4)] backdrop-blur-md sticky top-0 z-30 px-8 py-3">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Glowing SVG Arc Reactor Logo */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 5px ${settings.themeColor}aa)` }}>
                {/* Outer dashed ring */}
                <circle cx="50" cy="50" r="44" fill="none" stroke={settings.themeColor} strokeWidth="3" strokeDasharray="8 4" opacity="0.8" />
                {/* Inner solid ring */}
                <circle cx="50" cy="50" r="30" fill="none" stroke={settings.themeColor} strokeWidth="1.5" opacity="0.6" />
                {/* Center glowing triangle */}
                <polygon points="50,28 69,61 31,61" fill="none" stroke={settings.themeColor} strokeWidth="2.5" />
                {/* Core emitter */}
                <circle cx="50" cy="52" r="7" fill={settings.themeColor} />
                {/* Radiating power channels */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 45 * Math.PI) / 180
                  const x1 = 50 + Math.cos(angle) * 30
                  const y1 = 50 + Math.sin(angle) * 30
                  const x2 = 50 + Math.cos(angle) * 44
                  const y2 = 50 + Math.sin(angle) * 44
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={settings.themeColor} strokeWidth="1.2" opacity="0.75" />
                })}
              </svg>
            </div>
            <div>
              <h1 className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500">Raj Industries</h1>
              <div className="text-md font-bold tracking-[0.1em] font-sans flex items-center gap-2">
                JARVIS 2.0
                <span className="text-[10px] font-mono font-normal opacity-50">// ACCESS COMPLIANCE</span>
              </div>
            </div>
          </div>

          {/* Center Coordinates */}
          <div className="hidden lg:flex flex-col items-center font-mono text-[10px] tracking-widest text-gray-400">
            <div>STARK TOWER STAGING AREA</div>
            <div className="mt-0.5" style={{ color: settings.themeColor }}>
              COORD: 40.7580° N, 73.9855° W // ALT: 382M
            </div>
          </div>

          {/* Secure ticking clock */}
          <div className="flex items-center gap-4 font-mono text-[10px]">
            <div className="text-right">
              <span className="opacity-55 block">STARK SECURE LOGTIME</span>
              <span style={{ color: settings.themeColor }}>{time || 'INITIALIZING LOGTIME...'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Deck */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 3D Stage Column */}
          <section className="lg:col-span-8 relative rounded-xl border border-[rgba(255,255,255,0.04)] bg-gradient-to-b from-[rgba(10,12,16,0.3)] to-black overflow-hidden shadow-2xl">
            {/* Sci-fi framing overlay corners */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 opacity-35" style={{ borderColor: settings.themeColor }} />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 opacity-35" style={{ borderColor: settings.themeColor }} />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 opacity-35" style={{ borderColor: settings.themeColor }} />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 opacity-35" style={{ borderColor: settings.themeColor }} />

            <div className="absolute top-4 left-10 font-mono text-[8px] tracking-[0.2em] opacity-45 uppercase">
              R3F CAMERA FIELD RECONNAISSANCE // ORBIT CONTROLS ACTIVE
            </div>

            <Suspense fallback={
              <div className="h-[720px] flex flex-col items-center justify-center bg-black font-mono text-xs uppercase tracking-widest text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border border-white border-t-transparent mb-4" />
                Compiling 3D Engine...
              </div>
            }>
              <Hero3D />
            </Suspense>
            <ParticlesOverlay />
          </section>

          {/* Right Side Control Bar */}
          <aside className="lg:col-span-4 space-y-6">
            <HUD />
            <Telemetry />

            {/* Sub-grid system logs */}
            <div className="p-4 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.03)] rounded-xl font-mono text-[9px] text-gray-400 space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[80px] pointer-events-none opacity-10" style={{ backgroundColor: settings.themeColor }} />
              <div className="text-[10px] text-gray-500 uppercase tracking-widest pb-1 border-b border-[rgba(255,255,255,0.04)] mb-2 flex items-center justify-between">
                <span>STARK-OS RUNTIME BUFFER</span>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: settings.themeColor }} />
              </div>
              {systemLogs.map((log, idx) => (
                <div key={idx} className="flex gap-1.5">
                  <span style={{ color: settings.themeColor }} className="opacity-70">&gt;&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

