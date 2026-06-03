'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Modal from './Modal'
import ShadcnButton from './ShadcnButton'
import { useSettings, PRESETS, Settings } from './SettingsContext'

export default function HUD(){
  const { settings, setSettings, applyPreset } = useSettings()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'presets' | 'lighting' | 'fx' | 'particles'>('presets')
  
  // Diagnostics simulation states
  const [diagStep, setDiagStep] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [isRunningDiag, setIsRunningDiag] = useState(false)

  const diagMessages = [
    'Establishing secure link to Raj Industries mainframes...',
    'Loading telemetry protocol v88.5...',
    'Scanning Vibranium-Nanoparticle lattice integrity...',
    'Integrity: 100% nominal.',
    'Verifying Arc Reactor power cell distribution...',
    'Current flow: 98.7% - STABLE.',
    'Calibrating flight stabilizers and repulsors...',
    'Repulsors: 100% functional.',
    'Optimizing lighting buffers and Bloom presets...',
    'Mark LXXXV HUD Online. System Standby.'
  ]

  useEffect(() => {
    if (!isRunningDiag) return
    if (diagStep < diagMessages.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, diagMessages[diagStep]])
        setDiagStep(prev => prev + 1)
      }, 700)
      return () => clearTimeout(timer)
    } else {
      setIsRunningDiag(false)
    }
  }, [isRunningDiag, diagStep])

  const runDiagnostics = () => {
    setLogs([])
    setDiagStep(0)
    setIsRunningDiag(true)
    setOpen(true)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.4 }} 
      className="p-5 bg-[rgba(10,12,16,0.5)] border border-[rgba(255,255,255,0.05)] rounded-xl backdrop-blur-md relative overflow-hidden"
    >
      {/* Background glow matching theme color */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[100px] pointer-events-none opacity-20 transition-all duration-700" 
        style={{ backgroundColor: settings.themeColor }}
      />

      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4 mb-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] opacity-60">Control Console</h3>
          <div className="text-md font-bold font-sans tracking-wide mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: settings.themeColor }} />
            J.A.R.V.I.S. HUD
          </div>
        </div>
        <div 
          className="text-[10px] font-mono border rounded-full px-2 py-0.5 uppercase tracking-wider transition-colors duration-300"
          style={{ borderColor: settings.themeColor + '33', color: settings.themeColor }}
        >
          {settings.preset === 'custom' ? 'Custom Rig' : `${settings.preset} Mode`}
        </div>
      </div>

      {/* Sci-Fi Tabs */}
      <div className="flex bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-lg p-0.5 mb-4 text-[11px] font-mono">
        {(['presets', 'lighting', 'fx', 'particles'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-md text-center capitalize transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-[rgba(255,255,255,0.06)] font-bold' 
                : 'text-gray-400 hover:text-white'
            }`}
            style={activeTab === tab ? { color: settings.themeColor } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="h-[270px] overflow-y-auto pr-1">
        <AnimatePresence mode="wait">
          {activeTab === 'presets' && (
            <motion.div 
              key="presets" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-2 gap-3"
            >
              {(Object.keys(PRESETS) as Array<Exclude<Settings['preset'], 'custom'>>).map(key => {
                const isActive = settings.preset === key
                const details = PRESETS[key]
                return (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="p-3 text-left rounded-lg border bg-[rgba(255,255,255,0.01)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.03)] group"
                    style={{
                      borderColor: isActive ? settings.themeColor : 'rgba(255,255,255,0.04)',
                      boxShadow: isActive ? `0 0 10px ${settings.themeColor}22` : 'none'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider capitalize">{key}</span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: details.themeColor }} />
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-2 space-y-0.5">
                      <div>Light: {details.directional.toFixed(1)}</div>
                      <div>Bloom: {details.bloomIntensity.toFixed(1)}</div>
                    </div>
                  </button>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'lighting' && (
            <motion.div 
              key="lighting" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4 font-mono text-[11px]"
            >
              {/* Ambient */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Ambient Illumination</span>
                  <span style={{ color: settings.themeColor }}>{settings.ambient.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" value={settings.ambient} 
                  onChange={(e)=>setSettings({ ambient: parseFloat(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>

              {/* Directional */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Directional Intensity</span>
                  <span style={{ color: settings.themeColor }}>{settings.directional.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="3.5" step="0.05" value={settings.directional} 
                  onChange={(e)=>setSettings({ directional: parseFloat(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>

              {/* Fill */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Fill Ambient Contrast</span>
                  <span style={{ color: settings.themeColor }}>{settings.fill.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1.5" step="0.05" value={settings.fill} 
                  onChange={(e)=>setSettings({ fill: parseFloat(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>

              {/* Rim Light */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Contour Rim Intensity</span>
                  <span style={{ color: settings.themeColor }}>{settings.glowIntensity.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="4" step="0.05" value={settings.glowIntensity} 
                  onChange={(e)=>setSettings({ glowIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'fx' && (
            <motion.div 
              key="fx" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4 font-mono text-[11px]"
            >
              {/* Bloom Intensity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Bloom Intensity</span>
                  <span style={{ color: settings.themeColor }}>{settings.bloomIntensity.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="4.0" step="0.05" value={settings.bloomIntensity} 
                  onChange={(e)=>setSettings({ bloomIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>

              {/* Bloom Threshold */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Bloom Cutoff Threshold</span>
                  <span style={{ color: settings.themeColor }}>{settings.bloomThreshold.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.02" value={settings.bloomThreshold} 
                  onChange={(e)=>setSettings({ bloomThreshold: parseFloat(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>

              {/* Noise */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Dynamic Noise Opacity</span>
                  <span style={{ color: settings.themeColor }}>{settings.noiseOpacity.toFixed(3)}</span>
                </div>
                <input 
                  type="range" min="0" max="0.1" step="0.005" value={settings.noiseOpacity} 
                  onChange={(e)=>setSettings({ noiseOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>

              {/* Scanlines */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Overlay Scanline Visibility</span>
                  <span style={{ color: settings.themeColor }}>{settings.scanlineOpacity.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="0.3" step="0.01" value={settings.scanlineOpacity} 
                  onChange={(e)=>setSettings({ scanlineOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'particles' && (
            <motion.div 
              key="particles" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4 font-mono text-[11px]"
            >
              {/* Particle Count */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Particle Matrix Density</span>
                  <span style={{ color: settings.themeColor }}>{settings.particleCount}</span>
                </div>
                <input 
                  type="range" min="10" max="150" step="5" value={settings.particleCount} 
                  onChange={(e)=>setSettings({ particleCount: parseInt(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>

              {/* Particle Velocity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Velocity Multiplier</span>
                  <span style={{ color: settings.themeColor }}>{settings.particleSpeed.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" min="0.1" max="3" step="0.05" value={settings.particleSpeed} 
                  onChange={(e)=>setSettings({ particleSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-current h-1 bg-[rgba(255,255,255,0.06)] rounded-lg appearance-none cursor-pointer"
                  style={{ color: settings.themeColor }}
                />
              </div>

              {/* Theme Color selectors */}
              <div className="pt-2">
                <span className="text-gray-400 block mb-2">Arc Reactor Core Tint</span>
                <div className="flex gap-2">
                  {['#00f3ff', '#ff2a5f', '#ff9f00', '#39ff14', '#a855f7'].map(color => (
                    <button
                      key={color}
                      onClick={() => setSettings({ themeColor: color })}
                      className="w-6 h-6 rounded-full border transition-transform duration-300 hover:scale-110 active:scale-95"
                      style={{
                        backgroundColor: color,
                        borderColor: settings.themeColor === color ? '#ffffff' : 'rgba(255,255,255,0.2)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] flex gap-2">
        <ShadcnButton 
          onClick={runDiagnostics}
          className="flex-1 text-center py-2"
        >
          Check Diagnostics
        </ShadcnButton>
        <button
          onClick={() => applyPreset('overdrive')}
          className="px-4 py-2 rounded-md border border-orange-500/20 text-orange-400 text-xs font-mono tracking-wider transition-all duration-300 hover:bg-orange-500/10 active:scale-95"
        >
          OVERDRIVE
        </button>
      </div>

      {/* Diagnostics Modal Dialog */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3 mb-4">
          <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isRunningDiag ? 'animate-pulse' : ''}`} style={{ backgroundColor: settings.themeColor }} />
            SYSTEM DIAGNOSTICS
          </h4>
          <span className="text-[10px] text-gray-500 font-mono">STARK-OS v98</span>
        </div>

        {/* Scrolling console log simulator */}
        <div className="h-64 bg-black/60 rounded-md border border-[rgba(255,255,255,0.03)] p-4 overflow-y-auto font-mono text-[10px] space-y-1.5 leading-relaxed">
          {logs.map((log, index) => {
            const isError = log.includes('error') || log.includes('warning')
            const isOk = log.includes('nominal') || log.includes('100%') || log.includes('Online')
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  color: isError ? '#ff2a5f' : isOk ? '#39ff14' : '#e6e6e6'
                }}
              >
                &gt; {log}
              </motion.div>
            )
          })}
          {isRunningDiag && (
            <div className="flex items-center gap-1 mt-2 text-gray-500 animate-pulse text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: settings.themeColor }} />
              RUNNING PIPELINE TRACE...
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span>Reactor Core: 98.7% capacity</span>
          <ShadcnButton onClick={() => setOpen(false)}>Dismiss Log</ShadcnButton>
        </div>
      </Modal>
    </motion.div>
  )
}

