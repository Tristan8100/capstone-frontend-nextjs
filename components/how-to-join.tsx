"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  UserCheck,
  Mail,
  Shield,
  GraduationCap,
  Award as IdCard,
  Calendar,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function HowToJoin() {
  const [activeStep, setActiveStep] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const steps = [
    {
      number: 1,
      title: "Verify Your Alumni Profile",
      description: "We'll verify if you're in our alumni list using your academic records",
      icon: <UserCheck className="h-6 w-6" />,
      requirements: ["First and Last Name", "Student Number", "Graduation Year (Batch)", "Course/Program Name"],
      tip: "Make sure to use the exact name and details from your academic records",
    },
    {
      number: 2,
      title: "Create Your Account",
      description: "Set up your personal account with email and secure password",
      icon: <Shield className="h-6 w-6" />,
      requirements: ["Personal Email Address", "Strong Password"],
      tip: "Use a personal email you regularly use, we'll send important updates here",
    },
    {
      number: 3,
      title: "Verify Your Email",
      description: "Confirm your email address with a verification code",
      icon: <Mail className="h-6 w-6" />,
      requirements: ["Access to Your Email", "6-Digit Verification Code"],
      tip: "Check your spam folder if you don't see the verification email",
    },
  ]

  const requiredInfo = [
    { icon: <IdCard className="h-5 w-5" />, label: "Student ID Number", example: "e.g., 2022445674" },
    { icon: <GraduationCap className="h-5 w-5" />, label: "Course/Program", example: "e.g., Information Technology" },
    { icon: <Calendar className="h-5 w-5" />, label: "Graduation Year", example: "e.g., 2023" },
    { icon: <Mail className="h-5 w-5" />, label: "Personal Email", example: "e.g., kyle@gmail.com" },
  ]

  return (
    <section className="py-16 px-4 relative" id="how-to-join">
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Alumni Account Registration
          </Badge>
          <h2 className="text-3xl font-bold mb-4">How to Join BTECHLINK</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow graduates, access exclusive resources, and stay updated with your alma mater.
            Registration takes just a few minutes!
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    activeStep >= index
                      ? "bg-primary border-primary text-primary-foreground shadow-lg"
                      : "bg-background border-muted-foreground/30 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="font-semibold">{step.number}</span>
                  {activeStep >= index && (
                    <div className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-20" />
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                      activeStep > index ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeStep === index
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* What You'll Need */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              What You'll Need to Get Started
            </CardTitle>
            <CardDescription>Gather these details from your academic records before you begin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {requiredInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors duration-200"
                >
                  <div className="text-primary">{item.icon}</div>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.example}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8 mb-12">
          <h3 className="text-2xl font-semibold text-center">Registration Process</h3>

          {steps.map((step, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-500 hover:shadow-lg ${
                activeStep === index ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "hover:shadow-md"
              }`}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        activeStep >= index
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <div
                        className={`transition-colors duration-300 ${
                          activeStep >= index ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {step.icon}
                      </div>
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-base">{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-16">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Required Information:</h4>
                    <ul className="space-y-1">
                      {step.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>💡 Tip:</strong> {step.tip}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {index > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setActiveStep(index - 1)}>
                      Previous
                    </Button>
                  )}
                  {index < steps.length - 1 && (
                    <Button size="sm" onClick={() => setActiveStep(index + 1)} className="ml-auto">
                      Next Step
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </CardContent>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-6 -bottom-4 w-0.5 h-8 transition-colors duration-300 ${
                    activeStep > index ? "bg-primary" : "bg-border"
                  }`}
                ></div>
              )}
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">Ready to Join?</h3>
            <p className="text-muted-foreground mb-6">
              The entire process takes less than 5 minutes. Join thousands of alumni already connected!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/register">Start Registration</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Already Have an Account?</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ or Support */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Having trouble with registration?
              Contact our Facebook Page
            for assistance.
          </p>
        </div>
      </div>
    </section>
  )
}
