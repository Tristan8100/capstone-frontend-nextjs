'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useId, useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface User {
  id: number;
  name: string;
  email: string;
  course: string | null;
  qr_code_path: string | null;
}

interface LoginResponse {
  response_code: number;
  status: string;
  message: string;
  token: string;
  token_type: string;
  user_info: User;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const id = useId()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { login } = useAuth()
  const router = useRouter()

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // First try alumni
      const alumniResponse = await api.post<LoginResponse>('/api/login', {
        email,
        password
      });

      const alumniData = alumniResponse.data;

      if (alumniData.status === 'success') {
        login(alumniData.user_info, alumniData.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${alumniData.token}`;
        toast.success(alumniData.message || 'Login successful!');
        router.push('/alumni/dashboard');
        return;
      }
    } catch (alumniError: any) {
      // If alumni login fails, try admin login
      try {
        const adminResponse = await api.post<LoginResponse>('/api/admin-login', {
          email,
          password
        });

        const adminData = adminResponse.data;

        if (adminData.status === 'success') {
          // For admin, course and qr_code_path will be null idk if that works
          login(adminData.user_info, adminData.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${adminData.token}`;
          toast.success(adminData.message || 'Admin login successful!');
          router.push('/admin/dashboard');
          return;
        }
      } catch (adminError: any) {
        // If both logins fail, show error
        setError(
          adminError.response?.data?.message || 
          alumniError.response?.data?.message || 
          'Invalid credentials'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="*:not-first:mt-2">
            <div className="relative">
              <Input
                id={id}
                className="pe-9"
                placeholder="Password"
                type={isVisible ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </form>
  )
}