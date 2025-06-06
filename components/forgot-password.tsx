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

// Import Shadcn's input-otp components
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"


export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const steps = [1, 2, 3]; // Three steps for forgot password
  const id = useId(); // For password visibility toggle
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // State to hold form data for each step
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // OTP will be a single string from InputOTP
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNextStep = async () => {
    setIsLoading(true);
    let success = true; // Assume success for now

    if (currentStep === 1) {
      // Step 1: Enter Email
      // In a real app: Send API request to trigger OTP email
      console.log("Sending OTP to:", email);
      // Example: const response = await fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ email }) });
      // if (!response.ok) success = false;
    } else if (currentStep === 2) {
      // Step 2: Verify OTP
      // In a real app: Send API request to verify OTP
      console.log("Verifying OTP:", otp);
      // Example: const response = await fetch('/api/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) });
      // if (!response.ok) success = false;
    } else if (currentStep === 3) {
      // Step 3: Reset Password
      // In a real app: Send API request to reset password
      console.log("Attempting to reset password for", email, "to", newPassword);
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match!"); // Basic client-side validation
        success = false;
      }
      // Example: const response = await fetch('/api/reset-password', { method: 'POST', body: JSON.stringify({ email, newPassword }) });
      // if (!response.ok) success = false;
    }

    setTimeout(() => { // Simulate API call delay
      setIsLoading(false);
      if (success) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Handle error, e.g., display a message to the user
        alert("An error occurred. Please try again.");
      }
    }, 1500); // Simulate network latency
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
    <form className={cn("flex flex-col gap-6", className)} {...props}>
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
              A 6-digit code has been sent to **{email}**.
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
            <Button variant="link" className="mt-2" onClick={() => console.log("Resend OTP logic here")}>
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
            >
              Prev step
            </Button>
            <Button
              variant="outline"
              className="w-32"
              onClick={handleNextStep}
              disabled={isNextButtonDisabled()}
            >
              {currentStep < steps.length ? "Next step" : "Reset Password"}
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