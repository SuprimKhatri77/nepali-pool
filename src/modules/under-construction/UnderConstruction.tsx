import React from "react";
import { Hammer, Sparkles, Zap, Clock } from "lucide-react";

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Hammer className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-yellow-900" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              We&apos;re Building
              <br />
              Something Amazing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              This page is currently under construction. Our team is working
              hard to bring you an incredible experience.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="bg-white border border-emerald-100 rounded-xl p-6 text-left hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-gray-600">
                Optimized for performance and built with the latest
                technologies.
              </p>
            </div>

            <div className="bg-white border border-emerald-100 rounded-xl p-6 text-left hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Beautiful Design
              </h3>
              <p className="text-sm text-gray-600">
                Crafted with attention to detail and modern design principles.
              </p>
            </div>

            <div className="bg-white border border-emerald-100 rounded-xl p-6 text-left hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600">
                We&apos;re putting the finishing touches. Stay tuned for
                updates!
              </p>
            </div>
          </div>

          {/* Status Banner */}
          {/* <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-8 text-white shadow-xl shadow-emerald-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Want to be notified?
                </h3>
                <p className="text-emerald-50">
                  We&apos;ll let you know as soon as this page is ready.
                </p>
              </div>
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg">
                Notify Me
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div> */}

          {/* Progress Indicator */}
          <div className="pt-8">
            <div className="inline-flex items-center gap-3 bg-white border border-emerald-100 rounded-full px-6 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse delay-150"></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                Development in Progress
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
