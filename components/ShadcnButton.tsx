'use client'
import clsx from 'clsx'

export default function ShadcnButton({children, className, onClick}:{children:React.ReactNode,className?:string,onClick?:()=>void}){
  return (
    <button onClick={onClick} className={clsx('px-4 py-2 rounded-md bg-gradient-to-br from-[#0f172a] to-[#020617] border border-[rgba(255,255,255,0.04)] text-sm text-white shadow-sm hover:brightness-105 transition', className)}>
      {children}
    </button>
  )
}
