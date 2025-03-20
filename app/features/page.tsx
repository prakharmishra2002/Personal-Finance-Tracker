import Link from "next/link"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Globe,
  LineChart,
  Lock,
  PieChart,
  Repeat,
  Shield,
  Smartphone,
} from "lucide-react"

export default function FeaturesPage() {
  // Feature sections with icons and descriptions
  const featureSections = [
    {
      title: "Core Features",
      description: "Essential tools to manage your personal finances",
      features: [
        {
          icon: CreditCard,
          title: "Transaction Tracking",
          description:
            "Log and categorize all your financial transactions in one place. Track expenses, income, and transfers with ease.",
        },
        {
          icon: PieChart,
          title: "Budget Management",
          description:
            "Create custom budgets for different categories and track your spending against them. Get alerts when you're approaching your limits.",
        },
        {
          icon: DollarSign,
          title: "Financial Overview",
          description:
            "Get a clear picture of your financial health with intuitive dashboards showing income, expenses, savings, and net worth.",
        },
      ],
    },
    {
      title: "Advanced Analytics",
      description: "Gain deeper insights into your financial habits",
      features: [
        {
          icon: LineChart,
          title: "Spending Trends",
          description:
            "Visualize your spending patterns over time with interactive charts and graphs. Identify trends and opportunities to save.",
        },
        {
          icon: BarChart3,
          title: "Income Analysis",
          description:
            "Track your income sources and analyze earnings over time. Understand your cash flow and plan for the future.",
        },
        {
          icon: Repeat,
          title: "Recurring Expenses",
          description:
            "Identify and track recurring expenses like subscriptions and bills. Never miss a payment and find opportunities to cut costs.",
        },
      ],
    },
    {
      title: "Global Finance Tools",
      description: "Tools for managing international finances",
      features: [
        {
          icon: Globe,
          title: "Multi-Currency Support",
          description:
            "Track accounts and transactions in multiple currencies. Perfect for travelers, expats, or anyone with international finances.",
        },
        {
          icon: Repeat,
          title: "Currency Converter",
          description:
            "Convert between currencies with real-time exchange rates. Make informed decisions about international purchases and investments.",
        },
        {
          icon: Smartphone,
          title: "Mobile Access",
          description:
            "Access your financial data anytime, anywhere with our responsive design. Check your finances on the go from any device.",
        },
      ],
    },
    {
      title: "Security & Privacy",
      description: "Your financial data is protected",
      features: [
        {
          icon: Lock,
          title: "Secure Authentication",
          description:
            "Your account is protected with secure authentication methods. Optional two-factor authentication for added security.",
        },
        {
          icon: Shield,
          title: "Data Privacy",
          description:
            "Your financial data is encrypted and never shared with third parties without your explicit consent.",
        },
      ],
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
              <Link href="/features" className="transition-colors hover:text-foreground/80 text-foreground">
                Features
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground/80">
                Pricing
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground/80">
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
                  Powerful Features for Your Financial Journey
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover all the tools and features that make FinanceTracker the perfect companion for managing your
                  personal finances.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature sections */}
        {featureSections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{section.title}</h2>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                {section.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Take Control of Your Finances?
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are already managing their finances with ease.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Get Started for Free
                  </button>
                </Link>
                <Link href="/about">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Learn More
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

