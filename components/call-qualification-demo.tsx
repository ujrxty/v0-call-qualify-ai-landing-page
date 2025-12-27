'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

const transcript = [
  { speaker: 'Agent', text: 'Hello, this is Sarah from CallQualify AI, how can I help you today?', time: 0 },
  { speaker: 'Customer', text: 'Hi, I\'m interested in your lead qualification service.', time: 2000 },
  { speaker: 'Agent', text: 'Great! Let me explain how our AI transcription works...', time: 4000 },
  { speaker: 'Customer', text: 'That sounds perfect for our needs.', time: 6000 },
]

const qualificationRules = [
  { name: 'Proper Greeting', key: 'greeting', passTime: 1500 },
  { name: 'Mandatory Disclosure', key: 'disclosure', passTime: 3500 },
  { name: 'Product Mentioned', key: 'product', passTime: 5500 },
  { name: 'Call Duration Met', key: 'duration', passTime: 7500 },
]

export default function CallQualificationDemo() {
  const [activeLines, setActiveLines] = useState<number[]>([])
  const [qualificationStatus, setQualificationStatus] = useState<Record<string, 'pending' | 'checking' | 'pass'>>({})
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Auto-start after a brief delay
    const startDelay = setTimeout(() => {
      setIsPlaying(true)
    }, 1000)

    return () => clearTimeout(startDelay)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    // Animate transcript lines
    const timeouts: NodeJS.Timeout[] = []

    transcript.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setActiveLines(prev => [...prev, index])
      }, line.time)
      timeouts.push(timeout)
    })

    // Animate qualification checks
    qualificationRules.forEach((rule) => {
      const checkingTimeout = setTimeout(() => {
        setQualificationStatus(prev => ({ ...prev, [rule.key]: 'checking' }))
      }, rule.passTime - 500)

      const passTimeout = setTimeout(() => {
        setQualificationStatus(prev => ({ ...prev, [rule.key]: 'pass' }))
      }, rule.passTime)

      timeouts.push(checkingTimeout, passTimeout)
    })

    // Reset and loop
    const resetTimeout = setTimeout(() => {
      setActiveLines([])
      setQualificationStatus({})
      setIsPlaying(false)
      setTimeout(() => setIsPlaying(true), 2000)
    }, 10000)
    timeouts.push(resetTimeout)

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [isPlaying])

  return (
    <div className="mt-20 max-w-5xl mx-auto rounded-xl border border-white/10 bg-white/5 p-2 shadow-2xl overflow-hidden backdrop-blur-sm">
      <div className="rounded-lg bg-black/60 aspect-video flex relative overflow-hidden border border-white/5">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.6))]" />

        {/* Left side - Transcript */}
        <div className="z-10 w-1/2 p-6 border-r border-white/10">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">LIVE TRANSCRIPT</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">00:00:12</div>
          </div>

          <div className="space-y-4 h-64 overflow-hidden">
            {transcript.map((line, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  activeLines.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="text-xs text-purple-400 font-semibold mb-1">{line.speaker}</div>
                <div className="text-sm text-white/90 leading-relaxed">{line.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - AI Analysis */}
        <div className="z-10 w-1/2 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">AI QUALIFICATION</span>
            </div>
          </div>

          <div className="space-y-3">
            {qualificationRules.map((rule) => {
              const status = qualificationStatus[rule.key] || 'pending'
              return (
                <div
                  key={rule.key}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                    status === 'pass'
                      ? 'bg-green-500/10 border-green-500/30'
                      : status === 'checking'
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <span className="text-sm text-white/80">{rule.name}</span>
                  <div className="flex items-center gap-2">
                    {status === 'pending' && (
                      <div className="size-4 rounded-full border-2 border-white/20" />
                    )}
                    {status === 'checking' && (
                      <Loader2 className="size-4 text-blue-400 animate-spin" />
                    )}
                    {status === 'pass' && (
                      <CheckCircle2 className="size-4 text-green-400" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Final result */}
          {Object.keys(qualificationStatus).length === qualificationRules.length &&
            Object.values(qualificationStatus).every(s => s === 'pass') && (
              <div className="mt-6 p-4 rounded-lg bg-green-500/20 border border-green-500/40 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="size-5 text-green-400" />
                  <span className="text-sm font-semibold text-green-400">Call Qualified</span>
                </div>
                <p className="text-xs text-white/60">All compliance rules passed. Ready for review.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
