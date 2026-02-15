"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Lock, Bell, Globe, Moon, Sun, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { PasswordInput } from "@/components/password-input"

export default function SettingsPage() {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    weeklyReports: true,
    newFeatures: false,
  })
  const [preferenceSettings, setPreferenceSettings] = useState({
    defaultCurrency: "USD",
    dateFormat: "MM/DD/YYYY",
    theme: "system",
  })
  const router = useRouter()
  const { toast } = useToast()
  const { setTheme } = useTheme()

  // Currencies
  const currencies = [
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "JPY", label: "Japanese Yen (JPY)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "AUD", label: "Australian Dollar (AUD)" },
    { value: "CNY", label: "Chinese Yuan (CNY)" },
    { value: "INR", label: "Indian Rupee (INR)" },
  ]

  // Date formats
  const dateFormats = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  ]

  // Theme options
  const themeOptions = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]

  useEffect(() => {
    setIsClient(true)

    // Check if user is logged in
    const authToken = localStorage.getItem("authToken")
    const currentUser = localStorage.getItem("currentUser")

    if (!authToken || !currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Initialize form with user data
    setProfileForm({
      name: userData.name || "",
      email: userData.email || "",
    })

    // Load settings from localStorage or use defaults
    const savedNotificationSettings = localStorage.getItem(`notificationSettings_${userData.id}`)
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings))
    }

    const savedPreferenceSettings = localStorage.getItem(`preferenceSettings_${userData.id}`)
    if (savedPreferenceSettings) {
      const preferences = JSON.parse(savedPreferenceSettings)
      setPreferenceSettings(preferences)

      // Apply theme
      if (preferences.theme) {
        setTheme(preferences.theme)
      }
    }
  }, [router, setTheme])

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle notification toggle changes
  const handleNotificationToggle = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => {
      const updated = { ...prev, [name]: checked }
      localStorage.setItem(`notificationSettings_${user.id}`, JSON.stringify(updated))
      return updated
    })
  }

  // Handle preference changes
  const handlePreferenceChange = (name: string, value: string) => {
    setPreferenceSettings((prev) => {
      const updated = { ...prev, [name]: value }
      localStorage.setItem(`preferenceSettings_${user.id}`, JSON.stringify(updated))

      // Apply theme change immediately
      if (name === "theme") {
        setTheme(value)
      }

      return updated
    })
  }

  // Update profile
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update user in localStorage
    const updatedUser = {
      ...user,
      name: profileForm.name,
      email: profileForm.email,
    }

    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u: any) => (u.id === user.id ? updatedUser : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    setUser(updatedUser)

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  // Update password
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate current password
    if (passwordForm.currentPassword !== user.password) {
      toast({
        title: "Incorrect password",
        description: "Your current password is incorrect.",
        variant: "destructive",
      })
      return
    }

    // Validate new password
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Your new password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    // Validate password confirmation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation don't match.",
        variant: "destructive",
      })
      return
    }

    // Update password in localStorage
    const updatedUser = {
      ...user,
      password: passwordForm.newPassword,
    }

    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u: any) => (u.id === user.id ? updatedUser : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    setUser(updatedUser)

    // Reset form
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })
  }

  // Delete account
  const handleDeleteAccount = () => {
    // Remove user from users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.filter((u: any) => u.id !== user.id)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Remove user data
    localStorage.removeItem("currentUser")
    localStorage.removeItem("authToken")
    localStorage.removeItem(`transactions_${user.id}`)
    localStorage.removeItem(`budgets_${user.id}`)
    localStorage.removeItem(`notificationSettings_${user.id}`)
    localStorage.removeItem(`preferenceSettings_${user.id}`)

    toast({
      title: "Account deleted",
      description: "Your account and all associated data have been deleted.",
    })

    // Redirect to home page
    router.push("/")
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="profile" className="flex items-center text-xs sm:text-sm py-2">
              <User className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center text-xs sm:text-sm py-2">
              <Lock className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="hidden sm:inline">Password</span>
              <span className="sm:hidden">Pass</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center text-xs sm:text-sm py-2">
              <Bell className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notif</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center text-xs sm:text-sm py-2">
              <Globe className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="hidden sm:inline">Preferences</span>
              <span className="sm:hidden">Pref</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Profile</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Update your personal information.</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      required
                      className="text-sm"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full sm:w-auto text-xs sm:text-sm">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Password Settings */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <PasswordInput
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <PasswordInput
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 8 characters long.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Update Password</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                    <span>Email Notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">Receive notifications via email.</span>
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="budgetAlerts" className="flex flex-col space-y-1">
                    <span>Budget Alerts</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Get notified when you're approaching budget limits.
                    </span>
                  </Label>
                  <Switch
                    id="budgetAlerts"
                    checked={notificationSettings.budgetAlerts}
                    onCheckedChange={(checked) => handleNotificationToggle("budgetAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="weeklyReports" className="flex flex-col space-y-1">
                    <span>Weekly Reports</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive weekly summary of your financial activity.
                    </span>
                  </Label>
                  <Switch
                    id="weeklyReports"
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => handleNotificationToggle("weeklyReports", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="newFeatures" className="flex flex-col space-y-1">
                    <span>New Features</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Get notified about new features and updates.
                    </span>
                  </Label>
                  <Switch
                    id="newFeatures"
                    checked={notificationSettings.newFeatures}
                    onCheckedChange={(checked) => handleNotificationToggle("newFeatures", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Note: In this demo, notifications are simulated and won't actually be sent.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Preferences Settings */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your app experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={preferenceSettings.defaultCurrency}
                    onValueChange={(value) => handlePreferenceChange("defaultCurrency", value)}
                  >
                    <SelectTrigger id="defaultCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This will be the default currency for new transactions and budgets.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={preferenceSettings.dateFormat}
                    onValueChange={(value) => handlePreferenceChange("dateFormat", value)}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme" className="flex items-center">
                    Theme
                  </Label>
                  <Select
                    value={preferenceSettings.theme}
                    onValueChange={(value) => handlePreferenceChange("theme", value)}
                  >
                    <SelectTrigger id="theme" className="w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {themeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            {option.value === "light" && <Sun className="mr-2 h-4 w-4" />}
                            {option.value === "dark" && <Moon className="mr-2 h-4 w-4" />}
                            {option.value === "system" && (
                              <div className="mr-2 flex h-4 w-4 items-center justify-center">
                                <Sun className="h-3 w-3" />
                                <Moon className="h-3 w-3" />
                              </div>
                            )}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Your preferences are automatically saved when changed.</p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-500 text-base sm:text-lg">Danger Zone</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Irreversible actions that affect your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-medium text-sm sm:text-base">Delete Account</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto text-xs sm:text-sm">
                    <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all of your
                      data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-600">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

