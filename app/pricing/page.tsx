import Link from "next/link"
import { Check } from "lucide-react"

export default function PricingPage() {
  // Define pricing tiers with features and pricing details
  const pricingTiers = [
    {
      name: "Free",
      description: "Essential tools for personal finance management",
      price: "$0",
      period: "forever",
      features: [
        "Track up to 50 transactions per month",
        "Basic budget management",
        "Single currency support",
        "30-day transaction history",
        "Mobile access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Premium",
      description: "Advanced features for serious financial planning",
      price: "$9.99",
      period: "per month",
      features: [
        "Unlimited transactions",
        "Advanced budget management",
        "Multi-currency support",
        "Unlimited transaction history",
        "Detailed analytics and reports",
        "Recurring transactions",
        "Data export (CSV, PDF)",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Family",
      description: "Manage finances for the entire family",
      price: "$19.99",
      period: "per month",
      features: [
        "All Premium features",
        "Up to 5 user accounts",
        "Shared budgets and goals",
        "Family spending insights",
        "Bill splitting",
        "Priority support",
        "Financial planning tools",
      ],
      cta: "Start Free Trial",
      popular: false,
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
              <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground">
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that fits your financial management needs. No hidden fees or surprises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`flex flex-col rounded-lg border p-6 ${tier.popular ? "border-primary shadow-lg" : ""}`}
                >
                  {tier.popular && (
                    <div className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground mb-4 self-start">
                      Most Popular
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="ml-1 text-muted-foreground">/{tier.period}</span>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href="/register">
                      <button
                        className={`w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                          tier.popular
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        } h-10 px-4 py-2`}
                      >
                        {tier.cta}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our pricing and plans.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Can I switch plans later?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your
                  next billing cycle.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Is there a free trial for paid plans?</h3>
                <p className="text-muted-foreground">
                  Yes, both Premium and Family plans come with a 14-day free trial. No credit card required to start.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Can I cancel my subscription?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                  your current billing period.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Absolutely. We use bank-level encryption to protect your data. We never sell your personal information
                  to third parties.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Do you offer discounts?</h3>
                <p className="text-muted-foreground">
                  We offer annual billing with a 20% discount compared to monthly billing. We also have special
                  discounts for students and non-profits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are already managing their finances with ease.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Sign Up Now
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

