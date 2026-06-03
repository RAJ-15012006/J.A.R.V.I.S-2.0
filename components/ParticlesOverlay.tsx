'use client'
import { useEffect, useRef } from 'react'
import { useSettings } from './SettingsContext'

export default function ParticlesOverlay(){
  const ref = useRef<HTMLCanvasElement | null>(null)
  const { settings } = useSettings()

  useEffect(()=>{
    const canvas = ref.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')!

    let w = canvas.width = canvas.clientWidth
    let h = canvas.height = canvas.clientHeight
    
    // Seed particles
    let particles = Array.from({ length: settings.particleCount }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.55 + 0.15
    }))

    function resize(){
      if (!canvas) return
      w = canvas.width = canvas.clientWidth
      h = canvas.height = canvas.clientHeight
    }
    window.addEventListener('resize', resize)

    let rafId: number
    function draw(){
      ctx.clearRect(0, 0, w, h)
      
      const count = particles.length
      const speedMultiplier = settings.particleSpeed

      // Move and draw particles
      for (let i = 0; i < count; i++) {
        const p = particles[i]
        p.x += p.vx * speedMultiplier
        p.y += p.vy * speedMultiplier

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.fillStyle = settings.themeColor
        ctx.globalAlpha = p.a
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        // Constellation lines for sci-fi mesh effect
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          // Connect if close enough
          if (dist < 75) {
            ctx.beginPath()
            ctx.strokeStyle = settings.themeColor
            // Fade line based on distance
            ctx.globalAlpha = (1.0 - dist / 75) * 0.08 * (p.a + p2.a) / 2
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
      
      ctx.globalAlpha = 1.0 // reset
      rafId = requestAnimationFrame(draw)
    }
    draw()
    return ()=>{ cancelAnimationFrame(rafId); window.removeEventListener('resize', resize) }
  },[settings.particleCount, settings.particleSpeed, settings.themeColor])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-50 mix-blend-screen" />
}

