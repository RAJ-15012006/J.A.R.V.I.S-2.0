'use client'
import React, { createContext, useContext, useState } from 'react'


export type Settings = {
  ambient: number
  directional: number
  fill: number
  bloomIntensity: number
  bloomThreshold: number
  noiseOpacity: number
  particleCount: number
  particleSpeed: number
  scanlineOpacity: number
  themeColor: string
  glowIntensity: number
  preset: 'stealth' | 'vanguard' | 'overdrive' | 'hyperion' | 'custom'
}

export const PRESETS: Record<Exclude<Settings['preset'], 'custom'>, Omit<Settings, 'preset'>> = {
  stealth: {
    ambient: 0.12,
    directional: 0.8,
    fill: 0.25,
    bloomIntensity: 0.9,
    bloomThreshold: 0.45,
    noiseOpacity: 0.015,
    particleCount: 50,
    particleSpeed: 0.8,
    scanlineOpacity: 0.08,
    themeColor: '#00f3ff', // Cyber Cyan
    glowIntensity: 1.2,
  },
  vanguard: {
    ambient: 0.08,
    directional: 1.9,
    fill: 0.4,
    bloomIntensity: 1.6,
    bloomThreshold: 0.35,
    noiseOpacity: 0.03,
    particleCount: 30,
    particleSpeed: 0.4,
    scanlineOpacity: 0.15,
    themeColor: '#ff2a5f', // Stark Red
    glowIntensity: 2.0,
  },
  overdrive: {
    ambient: 0.22,
    directional: 2.5,
    fill: 0.7,
    bloomIntensity: 2.4,
    bloomThreshold: 0.25,
    noiseOpacity: 0.04,
    particleCount: 90,
    particleSpeed: 2.2,
    scanlineOpacity: 0.22,
    themeColor: '#ff9f00', // Amber Gold
    glowIntensity: 2.8,
  },
  hyperion: {
    ambient: 0.32,
    directional: 1.2,
    fill: 0.3,
    bloomIntensity: 0.5,
    bloomThreshold: 0.65,
    noiseOpacity: 0.01,
    particleCount: 35,
    particleSpeed: 0.5,
    scanlineOpacity: 0.04,
    themeColor: '#39ff14', // Matrix Green
    glowIntensity: 0.6,
  },
}

const defaultSettings: Settings = {
  ...PRESETS.stealth,
  preset: 'stealth',
}

const SettingsContext = createContext<{
  settings: Settings
  setSettings: (s: Partial<Settings>) => void
  applyPreset: (p: Exclude<Settings['preset'], 'custom'>) => void
}>({
  settings: defaultSettings,
  setSettings: () => {},
  applyPreset: () => {},
})

export function SettingsProvider({ children }: { children: React.ReactNode }){
  const [settings, set] = useState<Settings>(defaultSettings)
  
  function setSettings(s: Partial<Settings>){
    set(prev => {
      const next = { ...prev, ...s }
      // If any core setting differs from the active preset, fall back to 'custom'
      if (prev.preset !== 'custom') {
        const presetData = PRESETS[prev.preset]
        const modified = Object.keys(s).some(key => {
          if (key === 'preset') return false
          const k = key as keyof typeof presetData
          return presetData[k] !== s[k]
        })
        if (modified) {
          next.preset = 'custom'
        }
      }
      return next
    })
  }

  function applyPreset(p: Exclude<Settings['preset'], 'custom'>){
    set({
      ...PRESETS[p],
      preset: p
    })
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings, applyPreset }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(){ return useContext(SettingsContext) }

