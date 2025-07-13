'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useId, useState } from "react"
import { EyeIcon, EyeOffIcon, } from "lucide-react"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"
import Link from "next/link"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface Response {
  message: string;
  token: string; // Optional token for password reset
  error: string; // Optional error message
  email: string; // Optional email for verification
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const steps = [1, 2, 3]; // Three steps for forgot password
  const id = useId(); // For password visibility toggle
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // State to hold form data for each step
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // OTP will be a single string from InputOTP
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNextStep = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (currentStep === 1) {
        // Step 1: Enter Email
        const response = await api.post<Response>('/api/forgot-password', { email });
        if (response.data.message === 'OTP sent to your email.') {
          setCurrentStep(2);
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      } else if (currentStep === 2) {
        // Step 2: Verify OTP
        const response = await api.post<Response>('/api/forgot-password-token', { 
          email, 
          otp 
        });
        if (response.data.message === 'OTP verified successfully.') {
          setToken(response.data.token);
          setCurrentStep(3);
        } else {
          setError('Invalid OTP. Please try again.');
        }
      } else if (currentStep === 3) {
        // Step 3: Reset Password
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match!");
        }
        
        const response = await api.post<Response>('/api/reset-password', { 
          email,
          password: newPassword,
          password_confirmation: confirmPassword,
          token
        });
        
        if (response.data.message === 'Password reset successfully.') {
          toast.success('Password reset successfully!');
          router.push('/login?reset=success');
        } else {
          setError('Failed to reset password. Please try again.');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post<Response>('/api/forgot-password', { email });
      if (response.data.message === 'OTP sent to your email.') {
        // Show success message
        setError('OTP resent successfully!');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const isNextButtonDisabled = () => {
    if (isLoading) return true;
    if (currentStep === 1 && !email) return true;
    // For OTP, ensure it's 6 digits long
    if (currentStep === 2 && (otp.length !== 6 || !/^\d+$/.test(otp))) return true;
    if (currentStep === 3 && (!newPassword || !confirmPassword || newPassword !== confirmPassword)) return true;
    return false;
  };

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        handleNextStep();
      }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
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

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Step 1: Enter Email */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="personal@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter your registered email address to receive a verification code.
            </p>
          </div>
        )}

        {/* Step 2: Input OTP Code */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-3 text-center">
            <Label htmlFor="otp">Enter Verification Code</Label>
            <p className="text-sm text-muted-foreground">
              A 6-digit code has been sent to <strong>{email}</strong>.
            </p>
            {/* Using Shadcn's InputOTP components */}
            <div className="flex items-center justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
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
              disabled={isLoading}
            >
              Resend Code
            </Button>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-3">
            <div className="*:not-first:mt-2 w-full">
              <Label htmlFor={`${id}-new-password`}>New Password</Label>
              <div className="relative">
                <Input
                  id={`${id}-new-password`}
                  className="pe-9"
                  placeholder="New Password"
                  type={isVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls={`${id}-new-password`}
                >
                  {isVisible ? (
                    <EyeOffIcon size={16} aria-hidden="true" />
                  ) : (
                    <EyeIcon size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="*:not-first:mt-2 w-full">
              <Label htmlFor={`${id}-confirm-password`}>Confirm New Password</Label>
              <div className="relative">
                <Input
                  id={`${id}-confirm-password`}
                  className="pe-9"
                  placeholder="Confirm New Password"
                  type={isVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls={`${id}-confirm-password`}
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
        )}

        {/* Navigation Buttons */}
        <div className="mx-auto max-w-xl space-y-8 text-center">
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="w-32"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1 || isLoading}
              type="button"
            >
              Prev step
            </Button>
            <Button
              className="w-32"
              disabled={isNextButtonDisabled()}
              type="submit"
            >
              {isLoading ? (
                <span className="animate-pulse">Processing...</span>
              ) : currentStep < steps.length ? (
                "Next step"
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center text-sm">
        Remembered your password?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  );
}