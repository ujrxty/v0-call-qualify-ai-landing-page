import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Zap, ArrowRight, BarChart3, Clock } from "lucide-react"
import Link from "next/link"
import Hero3DBackground from "@/components/hero-3d-background"
import CallQualificationDemo from "@/components/call-qualification-demo"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* 4.1 Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">CallQualify AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#stats" className="hover:text-foreground transition-colors">
              Results
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Login
            </Button>
            <Button size="sm" className="rounded-full px-5">
              Launch Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 4.2 Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden border-b border-white/10 min-h-screen">
          <Hero3DBackground />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(120,119,198,0.1),transparent)]" style={{ zIndex: 1 }} />
          <div className="container relative mx-auto px-4 text-center" style={{ zIndex: 10 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 shadow-xl mb-8 animate-in fade-in slide-in-from-bottom-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Enterprise AI Transcription & QA
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-balance">
              Stop Listening to Calls.
              <br />
              <span className="text-muted-foreground">Start Qualifying Them.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[700px] mx-auto mb-10 text-pretty leading-relaxed">
              CallQualify AI transcribes and qualifies call recordings automatically using strict business rules — in
              seconds, not hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-full h-12 px-8 text-base font-semibold group">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-12 px-8 text-base font-semibold bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </Button>
            </div>
            <CallQualificationDemo />
          </div>
        </section>

        {/* 4.3 Credibility / Stats Section */}
        <section id="stats" className="py-20 md:py-28 border-b border-white/10 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-black p-10 flex flex-col items-center text-center">
                <span className="text-5xl font-bold mb-2">90%</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  Less QA Time
                </span>
                <p className="mt-4 text-sm text-muted-foreground">
                  Replace manual listening with instant AI qualification.
                </p>
              </div>
              <div className="bg-black p-10 flex flex-col items-center text-center border-l border-white/10">
                <span className="text-5xl font-bold mb-2">1000+</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  Calls Per Batch
                </span>
                <p className="mt-4 text-sm text-muted-foreground">
                  Scale your review process without adding headcount.
                </p>
              </div>
              <div className="bg-black p-10 flex flex-col items-center text-center border-l border-white/10">
                <span className="text-5xl font-bold mb-2 flex items-center justify-center">
                  <ShieldCheck className="mr-2 h-8 w-8" />
                  100%
                </span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Audit-Ready</span>
                <p className="mt-4 text-sm text-muted-foreground">Deterministic, rule-based decisions you can trust.</p>
              </div>
            </div>

            <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl font-bold tracking-tighter">NETFLIX</span>
              <span className="text-xl font-bold tracking-tighter">Tripadvisor</span>
              <span className="text-xl font-bold tracking-tighter">box</span>
              <span className="text-xl font-bold tracking-tighter">ebay</span>
              <span className="text-xl font-bold tracking-tighter">Salesforce</span>
            </div>
          </div>
        </section>

        {/* 4.4 Features Section */}
        <section id="features" className="py-24 md:py-32 bg-black relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-grade QA Automation</h2>
              <p className="text-lg text-muted-foreground">
                Built for high-volume lead buyers and call centers who demand accuracy, compliance, and clear audit
                trails.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all group overflow-hidden">
                <CardContent className="p-8">
                  <div className="size-12 rounded-lg bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">AI Transcription</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Optimized for phone calls with background noise, varied accents, and long conversations. Get 99%
                    accuracy on every word.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all group overflow-hidden">
                <CardContent className="p-8">
                  <div className="size-12 rounded-lg bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Rule-Based Qualification</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    No "black-box" AI. Define strict business rules and deterministic logic to qualify calls based on
                    your specific needs.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all group overflow-hidden">
                <CardContent className="p-8">
                  <div className="size-12 rounded-lg bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Audit-Ready Output</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every qualification decision is linked directly to a transcript segment. Full transparency for
                    compliance and dispute resolution.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all group overflow-hidden">
                <CardContent className="p-8">
                  <div className="size-12 rounded-lg bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Batch Processing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Upload hundreds or thousands of calls via CSV or API. Process entire lead batches in minutes instead
                    of weeks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4.5 "How It Works" Section */}
        <section id="how-it-works" className="py-24 md:py-32 border-t border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(120,119,198,0.05),transparent)]" />
          <div className="container mx-auto px-4 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Seamless 3-Step Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector lines for desktop */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="flex flex-col items-center text-center group">
                <div className="size-16 rounded-full bg-white text-black flex items-center justify-center mb-6 font-bold text-xl z-10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Upload Recordings</h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Simply drop a CSV with recording links or use our robust API.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="size-16 rounded-full bg-white text-black flex items-center justify-center mb-6 font-bold text-xl z-10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">AI Evaluation</h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  AI transcribes and evaluates calls against your custom business rules.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="size-16 rounded-full bg-white text-black flex items-center justify-center mb-6 font-bold text-xl z-10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Get Results</h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Instant qualification status with clear audit trails for every decision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4.6 Primary Call-to-Action Section */}
        <section className="py-24 md:py-32 bg-white text-black text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.1),transparent)]" />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 max-w-4xl mx-auto">
              Replace Hours of Manual QA with AI Decisions
            </h2>
            <p className="text-xl mb-10 opacity-70 max-w-2xl mx-auto">
              Stop guessing and start scaling. Join forward-thinking lead buyers using deterministic AI for
              qualification.
            </p>
            <Button
              size="lg"
              className="rounded-full h-14 px-10 text-lg font-bold bg-black text-white hover:bg-black/90 group transition-all"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="mt-8 text-sm font-medium opacity-50">No credit card required to start.</p>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-semibold">CallQualify AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 CallQualify AI. All rights reserved. Data privacy and compliance first.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
