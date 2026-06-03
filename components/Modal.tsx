'use client'
import { motion } from 'framer-motion'
import React from 'react'

export default function Modal({ open, onClose, children}:{open:boolean,onClose:()=>void,children:React.ReactNode}){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}} transition={{duration:0.28}} className="relative z-10 w-[520px] max-w-full p-4 bg-[rgba(10,12,15,0.9)] border border-[rgba(255,255,255,0.04)] rounded-md backdrop-blur-sm">
        {children}
      </motion.div>
    </div>
  )
}
