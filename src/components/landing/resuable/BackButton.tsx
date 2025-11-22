// components/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()
  
  return (
    <button
      onClick={() => router.back()}
      className="group px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-md hover:bg-emerald-100 transition-colors"
    >
      <ArrowLeft className="group-hover:-translate-x-1.5 group-hover:text-emerald-900 transition-all duration-300" />
    </button>
  )
}