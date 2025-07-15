'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useId, useState, useEffect } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"
import Link from "next/link"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Course {
  id: string;
  name: string;
  full_name: string;
  institute_id: string;
  institute: {
    id: string;
    name: string;
    description: string;
    image_path: string;
  };
}

interface AlumniData {
  student_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  batch: number;
  course: string;
  email: string;
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const steps = [1, 2, 3]
  const id = useId()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    studentNumber: '',
    batchGraduated: '',
    course: '',
    email: '',
    password: '',
    otp: ''
  })

  const [alumniData, setAlumniData] = useState<AlumniData | null>(null)
  const [verificationEmail, setVerificationEmail] = useState<string>('')
  const [otpResendTimer, setOtpResendTimer] = useState<number>(0)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get<Course[]>('/api/get-courses-general')
        setCourses(response.data)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
        toast.error('Failed to load courses')
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchCourses()

    const checkEmailVerification = () => {
      // Only run on client side
      if (typeof window === 'undefined') return;

      try {
        // Get email from URL parameters
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');

        if (email) {
          // Basic email validation
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.error('Invalid email format in URL');
            return;
          }

          setVerificationEmail(email);
          setCurrentStep(3); // Jump to OTP verification step
          setOtpResendTimer(60); // Start resend timer
          toast.info('Please verify your email to continue');

          // Clean up the URL without reloading
          params.delete('email');
          window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    };

    checkEmailVerification();
  }, [])

  // OTP resend timer
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpResendTimer])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleFindProfile = async () => {
    setIsLoading(true)
    try {
      const response = await api.post<AlumniData[]>('/api/find-profile', {
        student_id: formData.studentNumber,
        first_name: formData.firstName,
        last_name: formData.lastName,
        batch: formData.batchGraduated,
        course_name: formData.course,
        middle_name: formData.middleName || undefined,
      })

      setAlumniData(response.data[0])
      setCurrentStep(2)
      toast.success('Profile verified! Please continue with registration')
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Profile not found in alumni records')
      } else {
        toast.error('Profile verification failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      const response = await api.post<AlumniData>('/api/register', {
        student_id: formData.studentNumber,
        first_name: formData.firstName,
        last_name: formData.lastName,
        batch: formData.batchGraduated,
        course_name: formData.course,
        middle_name: formData.middleName || undefined,
        email: formData.email,
        password: formData.password,
      })

      setVerificationEmail(response.data.email)
      setCurrentStep(3)
      setOtpResendTimer(60)
      toast.success('Registration successful! Check your email for OTP')
    } catch (error: any) {
      if (error.response?.status === 422) {
        toast.error('Validation error: ' + Object.values(error.response.data.errors).join(', '))
      } else if (error.response?.status === 403) {
        toast.error('Registration not allowed for this profile')
      } else {
        toast.error('Registration failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setIsLoading(true)
    try {
      await api.post('/api/verify-otp', {
        email: verificationEmail,
        otp: formData.otp,
      })

      toast.success('Email verified successfully!')
      router.push('/login')
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message)
      } else {
        toast.error('OTP verification failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await api.post('/api/resend-otp', { email: verificationEmail })
      setOtpResendTimer(60)
      toast.success('New OTP sent to your email')
    } catch (error) {
      toast.error('Failed to resend OTP')
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1) return handleFindProfile()
    if (currentStep === 2) return handleRegister()
    if (currentStep === 3) return handleVerifyOtp()
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Find My Profile</h1>
        <Stepper value={currentStep} onValueChange={setCurrentStep}>
          {steps.map((step) => (
            <StepperItem
              key={step}
              step={step}
              className="not-last:flex-1"
              loading={isLoading}
            >
              <StepperTrigger asChild>
                <StepperIndicator />
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
      </div>
      <div className="grid gap-6">
        {currentStep === 1 && (
          <>
            <div className="flex gap-3">
              <div className="flex flex-col flex-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  type="text" 
                  placeholder="John" 
                  required 
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col flex-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  type="text" 
                  placeholder="Smith" 
                  required 
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col flex-1">
                <Label htmlFor="studentNumber">Student Number</Label>
                <Input 
                  id="studentNumber" 
                  type="number" 
                  placeholder="e.g. 12345678" 
                  required 
                  value={formData.studentNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col flex-1">
                <Label htmlFor="batchGraduated">Batch Graduated</Label>
                <Input 
                  id="batchGraduated" 
                  type="number" 
                  placeholder="e.g. 2023" 
                  required 
                  value={formData.batchGraduated}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col flex-1">
                <Label htmlFor="course">Course</Label>
                {isLoadingCourses ? (
                  <Input disabled placeholder="Loading courses..." />
                ) : (
                  <select
                    id="course"
                    required
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.course}
                    onChange={handleInputChange}
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="flex gap-3">
              <div className="flex flex-col flex-1">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="personal@email.com" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="*:not-first:mt-2 w-full">
                <Label htmlFor={id}>Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    className="pe-9"
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="password"
                  >
                    {isVisible ? (
                      <EyeOffIcon size={16} aria-hidden="true" />
                    ) : (
                      <EyeIcon size={16} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="flex flex-col gap-3 text-center">
              <Label htmlFor="otp">Enter Verification Code</Label>
              <p className="text-sm text-muted-foreground">
                A 6-digit code has been sent to {verificationEmail}
              </p>
              <div className="flex items-center justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={formData.otp} 
                  onChange={(value) => setFormData(prev => ({ ...prev, otp: value }))}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button 
                variant="link" 
                className="mt-2" 
                onClick={handleResendOtp}
                disabled={otpResendTimer > 0}
              >
                {otpResendTimer > 0 ? `Resend in ${otpResendTimer}s` : 'Resend Code'}
              </Button>
            </div>
          </>
        )}

        <div className="mx-auto max-w-xl space-y-8 text-center">
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="w-32"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1 || isLoading}
            >
              Prev step
            </Button>
            <Button
              variant="outline"
              className="w-32"
              onClick={handleNextStep}
              disabled={
                isLoading || 
                (currentStep === 1 && (
                  !formData.firstName || 
                  !formData.lastName || 
                  !formData.studentNumber || 
                  !formData.batchGraduated || 
                  !formData.course
                )) ||
                (currentStep === 2 && (
                  !formData.email || 
                  !formData.password
                )) ||
                (currentStep === 3 && formData.otp.length !== 6)
              }
            >
              {isLoading ? 'Processing...' : 
               currentStep === 3 ? 'Verify' : 'Next step'}
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  )
}