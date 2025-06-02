"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import ocpLogo from "../../assets/logo1.png"; // Adjust this import path to your actual logo location

// Button component
const Button = ({
  children,
  type = "button",
  disabled = false,
  variant = "default",
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-[1.02] active:scale-[0.98]";
  const variantClasses =
    variant === "outline"
      ? "border-2 border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 hover:border-emerald-300"
      : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input component
const Input = ({ className = "", type = "text", error, ...props }) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={`flex h-12 w-full rounded-lg border-2xl ${
          error
            ? "border-red-600 focus:border-red-700 focus:ring-red-200"
            : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
        } bg-white px-4 py-3 text-sm font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Label component
const Label = ({ children, htmlFor, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-semibold text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  );
};

// Checkbox component
const Checkbox = ({ checked, onCheckedChange, id }) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 rounded border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 transition-all duration-200"
    />
  );
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('userId', data.data.userId);
      localStorage.setItem('name', data.data.name);
      localStorage.setItem('email', data.data.email);
      localStorage.setItem('role', data.data.role);

      navigate(data.data.role === 'Superadmin' ? '/superadmin/dashboard' : '/dashboard');
    } catch (error) {
      setLoginError(error.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 px-4 sm:px-6 lg:px-8 bg-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md space-y-8"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          {/* OCP Logo - Now using an image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 overflow-hidden">
                <img 
                  src={ocpLogo} 
                  alt="OCP Logo" 
                  className="w-full h-full object-contain"
                />
              </div>

            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
              Bienvenue 
            </h1>
            <p className="text-gray-600 font-medium max-w-sm mx-auto leading-relaxed">
              dans l'application de gestion des opérations de décapage de l'OCP.
            </p>
          </div>
        </motion.div>

        {/* Error Message */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{loginError}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                Email Address
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="pl-12"
                  error={errors.email}
                  required
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                Password
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12"
                  error={errors.password}
                  required
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}


            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing you in...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sign In Securely
                </span>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center space-y-4"
        >
          <p className="text-sm text-gray-500">
            Protected by enterprise-grade security
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <Link to="/privacy" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-emerald-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/support" className="hover:text-emerald-600 transition-colors">
              Support
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}