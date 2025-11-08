"use client"
import { ArrowRight,  MapPin } from 'lucide-react'
import React from 'react'
import { SchoolSelectType } from '../../../lib/db/schema'
import {motion} from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
const MotionLink = motion(Link)

export default function SchoolShortCard({school, sendTo = "/schools/"}:{school: SchoolSelectType, sendTo?: string}) {
  return (
    <MotionLink
                        href={`/school/${school.id}`}
                        key={school.id}
                        whileHover={{scale: 1.03}}
                        transition={{duration: 0.5}}
                        className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300"
                      >
                        <div className="relative overflow-hidden bg-slate-100">
                          <Image
                            width={400}
                            height={200}
                            src={
                              school.imageUrl ||
                              "/placeholder.svg?height=200&width=400&query=school building"
                            }
                            alt={school.name || "School"}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
    
                        <div className="p-5 space-y-4">
                          <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2 leading-snug">
                              {school.name}
                            </h2>
                          </div>
    
                          <div className="flex items-start gap-2 text-slate-600">
                            <MapPin className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                            <div className="text-sm space-y-0.5 min-w-0">
                              <p className="font-medium text-slate-700 line-clamp-1">
                                {school.address}
                              </p>
                              <p className="text-slate-500">
                                {school.city}, {school.prefecture}
                              </p>
                            </div>
                          </div>
    
                          <div className="flex items-center text-sm font-medium text-emerald-700 group-hover:text-emerald-800 pt-2">
                            <span>View details</span>
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </MotionLink>
  )
}
