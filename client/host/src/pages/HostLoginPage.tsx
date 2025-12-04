import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ============ Types ============
interface LoginFormValues {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

// ============ API Helper ============
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface LoginResponse {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    token: string;
}

async function loginHost(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Login failed');
    }

    // Check if user has host role
    if (result.role !== 'host' && result.role !== 'admin') {
        throw new Error('This account is not registered as a Host. Please register as a Host first.');
    }

    return result;
}

// ============ Main Component ============
export default function HostLoginPage() {
    const navigate = useNavigate();

    // Form state
    const [formValues, setFormValues] = useState<LoginFormValues>({
        email: '',
        password: '',
    });

    // UI state
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        if (apiError) setApiError(null);
    };

    // Handle input blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        // Validate on blur
        const newErrors: FormErrors = {};
        if (name === 'email' && !formValues.email.trim()) {
            newErrors.email = 'Email is required';
        }
        if (name === 'password' && !formValues.password) {
            newErrors.password = 'Password is required';
        }
        setErrors((prev) => ({ ...prev, ...newErrors }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FormErrors = {};
        if (!formValues.email.trim()) {
            newErrors.email = 'Email is required';
        }
        if (!formValues.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        setTouched({ email: true, password: true });

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setApiError(null);
        setIsLoading(true);

        try {
            const result = await loginHost(formValues.email, formValues.password);

            // Store token and user info
            localStorage.setItem('hostToken', result.token);
            localStorage.setItem('hostUser', JSON.stringify({
                id: result._id,
                fullName: result.fullName,
                email: result.email,
                role: result.role,
            }));

            // Navigate to dashboard
            navigate('/host/dashboard');
        } catch (error) {
            const err = error as Error;
            setApiError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to show error for a field
    const getFieldError = (field: keyof FormErrors) => {
        return touched[field] ? errors[field] : undefined;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Host Login</h1>
                        <p className="text-gray-600 mt-2">
                            Sign in to manage your parking spots
                        </p>
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-700 text-sm">{apiError}</span>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formValues.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="host@example.com"
                                autoComplete="email"
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('email')
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                    }`}
                            />
                            {getFieldError('email') && (
                                <p className="mt-1 text-xs text-red-500">{getFieldError('email')}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formValues.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('password')
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                    }`}
                            />
                            {getFieldError('password') && (
                                <p className="mt-1 text-xs text-red-500">{getFieldError('password')}</p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 font-semibold text-white rounded-lg transition-all duration-200 ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md hover:shadow-lg'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            Don't have a Host account?{' '}
                            <Link
                                to="/host/register"
                                className="font-medium text-emerald-600 hover:text-emerald-700"
                            >
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
