import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2, Users, Shield, LineChart, Wallet, Globe } from "lucide-react"

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Former fintech executive with a passion for making personal finance accessible to everyone.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Software engineer with 15+ years of experience building secure financial applications.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      bio: "Product designer focused on creating intuitive user experiences for financial tools.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  // Core values
  const coreValues = [
    {
      icon: Users,
      title: "User-Centered",
      description: "We put our users first in everything we do, designing our product around real financial needs.",
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "We maintain the highest standards of security and privacy protection for your financial data.",
    },
    {
      icon: LineChart,
      title: "Financial Empowerment",
      description: "We believe everyone deserves the tools and knowledge to take control of their financial future.",
    },
    {
      icon: Wallet,
      title: "Simplicity",
      description: "We make complex financial concepts and tasks simple and accessible for everyone.",
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "We build for a diverse global user base with different financial needs and contexts.",
    },
    {
      icon: CheckCircle2,
      title: "Continuous Improvement",
      description: "We constantly refine our product based on user feedback and emerging financial trends.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">FinanceTracker</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/features" className="transition-colors hover:text-foreground/80">
                Features
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground/80">
                Pricing
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground">
                About
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
              <Link href="/login" className="px-4">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                  Sign up
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Mission: Financial Freedom for Everyone
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're building the tools that help people understand, manage, and grow their finances with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Story</h2>
                <p className="text-muted-foreground">
                  FinanceTracker was founded in 2023 with a simple idea: personal finance shouldn't be complicated. Our
                  founder, Alex Johnson, experienced firsthand the challenges of managing finances across multiple
                  accounts, currencies, and financial goals.
                </p>
                <p className="text-muted-foreground">
                  After struggling with existing tools that were either too complex or too simplistic, Alex assembled a
                  team of financial experts and software engineers to build a solution that strikes the perfect balance
                  between powerful features and ease of use.
                </p>
                <p className="text-muted-foreground">
                  Today, FinanceTracker helps thousands of users around the world take control of their finances, make
                  informed decisions, and work toward their financial goals with confidence.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Team working together"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core values section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Core Values</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  These principles guide everything we do at FinanceTracker.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Meet Our Team</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The passionate people behind FinanceTracker.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="rounded-full object-cover"
                  />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-sm font-medium text-primary">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join Our Financial Journey</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Take the first step toward financial freedom today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
                <Link href="/features">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Explore Features
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 FinanceTracker. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

