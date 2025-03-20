import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
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
              <Link href="/about" className="transition-colors hover:text-foreground/80">
                About
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
              <Link href="/login" className="px-4">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Take Control of Your Finances
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Track expenses, manage budgets, and convert between currencies with our easy-to-use personal finance
                    tracker.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-primary/20 to-primary/10 p-4 shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md space-y-4 rounded-lg bg-background p-6 shadow-lg">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">Financial Overview</h3>
                        <div className="h-2 w-20 rounded-full bg-primary"></div>
                      </div>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-muted p-4">
                            <div className="text-sm text-muted-foreground">Income</div>
                            <div className="text-2xl font-bold text-green-500">$4,250.00</div>
                          </div>
                          <div className="rounded-lg bg-muted p-4">
                            <div className="text-sm text-muted-foreground">Expenses</div>
                            <div className="text-2xl font-bold text-red-500">$2,150.00</div>
                          </div>
                        </div>
                        <div className="rounded-lg bg-muted p-4">
                          <div className="text-sm text-muted-foreground">Balance</div>
                          <div className="text-2xl font-bold">$2,100.00</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Budget Progress</div>
                            <div className="text-sm text-muted-foreground">75%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-full w-3/4 rounded-full bg-primary"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Features</h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Everything you need to manage your personal finances in one place.
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:gap-8 mt-8">
              <div className="relative overflow-hidden rounded-lg border bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M16 2v5h5"></path>
                    <path d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17l4 4z"></path>
                    <path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15"></path>
                    <path d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11"></path>
                  </svg>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-bold">Expense Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Easily log and categorize your expenses to keep track of where your money is going.
                  </p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 2v20"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-bold">Budget Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Set budgets for different categories and track your progress to stay on top of your financial goals.
                  </p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <path d="M3 6h18"></path>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-bold">Currency Conversion</h3>
                  <p className="text-sm text-muted-foreground">
                    Convert between multiple currencies with real-time exchange rates to manage international finances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
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

