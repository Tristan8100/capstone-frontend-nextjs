import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useId, useState } from "react"
import { EyeIcon, EyeOffIcon,  } from "lucide-react"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper"
import { Link } from "react-router-dom"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

    const steps = [1, 2]
  const id = useId()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)


  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleNextStep = () => {
    //handle fetch here then block next step if false
    setIsLoading(true)
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
      setIsLoading(false)
    }, 1000)
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
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" type="text" placeholder="John" required />
                </div>
                <div className="flex flex-col flex-1">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" type="text" placeholder="Smith" required />
                </div>
            </div>
            <div className="flex gap-3">
                <div className="flex flex-col flex-1">
                    <Label htmlFor="student-number">Student Number</Label>
                    <Input id="student-number" type="number" placeholder="e.g. 12345678" required />
                </div>
                <div className="flex flex-col flex-1">
                    <Label htmlFor="batch-graduated">Batch Graduated</Label>
                    <Input id="batch-graduated" type="number" placeholder="e.g. 2023" required />
                </div>
            </div>
            <div className="flex gap-3">
                <div className="flex flex-col flex-1">
                    <Label htmlFor="course">Course</Label>
                    <select
                      id="course"
                      required
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select course</option>
                      <option value="BSCS">BS Computer Science</option>
                      <option value="BSIT">BS Information Technology</option>
                      <option value="BSIS">BS Information Systems</option>
                      <option value="BSCE">BS Civil Engineering</option>
                      <option value="BSEE">BS Electrical Engineering</option>
                    </select>
                </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="flex gap-3">
                <div className="flex flex-col flex-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="personal@email.com" required />
                </div>
            </div>
            <div className="flex gap-3">
                <div className="*:not-first:mt-2 w-full">
                    <Label htmlFor={id}>Password</Label>
                    <div className="relative">
                        <Input
                        id={id}
                        className="pe-9"
                        placeholder="Password"
                        type={isVisible ? "text" : "password"}
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
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or continue with
                </span>
            </div>
            <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Login with Google
            </Button>
          </>)}

        <div className="mx-auto max-w-xl space-y-8 text-center">
            <div className="flex justify-center space-x-4">
                <Button
                variant="outline"
                className="w-32"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={currentStep === 1}
                >
                Prev step
                </Button>
                <Button
                variant="outline"
                className="w-32"
                onClick={handleNextStep}
                disabled={currentStep > steps.length}
                >
                Next step
                </Button>
            </div>
        </div>
    </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  )
}
