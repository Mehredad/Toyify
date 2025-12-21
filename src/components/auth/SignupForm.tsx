import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { GoogleLogin } from "@react-oauth/google";
import { z } from "zod";

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number");

type Props = {
  onSwitchToLogin?: () => void;
};

const SignupForm: React.FC<Props> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate password
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      setPasswordError(passwordValidation.error.errors[0].message);
      setLoading(false);
      return;
    }
    setPasswordError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server did not return valid JSON");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Signup failed");
      }

      // Store token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Success!",
        description: "Account created successfully. Redirecting...",
      });

      navigate("/");
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    const credential = credentialResponse.credential;
    if (!credential) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Google login failed");

      // Store your app token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Google login successful",
        description: `Welcome ${data.user.username}`,
      });

      navigate("/");
    } catch (err: any) {
      toast({
        title: "Google login failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleButtonClick = () => {
    const googleBtn = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
    if (googleBtn) {
      googleBtn.click();
    }
  };

  const handleSwitchToLogin = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  return (
    <div className="max-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/Logo.png" alt="Toyify" className="h-10" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
          Create an account
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Start your 30-day free trial.
        </p>

        {/* Username Field */}
        <div className="mb-4">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {passwordError && (
            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
          )}
        </div>

        {/* Continue with Email Button */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors mb-4"
        >
          {loading ? "Creating account..." : "Continue with email"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-xs text-gray-500 uppercase">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleButtonClick}
          type="button"
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.039-3.71z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>
        <div ref={googleButtonRef} className="hidden">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() =>
              toast({
                title: "Google login failed",
                description: "Please try again.",
                variant: "destructive",
              })
            }
          />
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a
            href="#"
            onClick={handleSwitchToLogin}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export { SignupForm };
export default SignupForm;