import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============ Types ============
interface HostRegisterFormValues {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agreedToTerms: boolean;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    agreedToTerms?: string;
}

interface ApiError {
    message: string;
    statusCode?: number;
}

// ============ API Helper ============
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function registerHost(data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register-host`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Registration failed. Please try again.');
    }

    return result;
}

// ============ Validation Helpers ============
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateForm = (values: HostRegisterFormValues): FormErrors => {
    const errors: FormErrors = {};

    // Full Name validation
    if (!values.fullName.trim()) {
        errors.fullName = 'Full name is required';
    }

    // Email validation
    if (!values.email.trim()) {
        errors.email = 'Email is required';
    } else if (!validateEmail(values.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!values.phone.trim()) {
        errors.phone = 'Phone number is required';
    }

    // Password validation
    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }

    // Confirm Password validation
    if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!values.agreedToTerms) {
        errors.agreedToTerms = 'You must agree to the terms to continue';
    }

    return errors;
};

// ============ Component ============
export default function HostRegisterPage() {
    const navigate = useNavigate();

    // Form state
    const [formValues, setFormValues] = useState<HostRegisterFormValues>({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreedToTerms: false,
    });

    // UI state
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Validate on value changes (only for touched fields)
    useEffect(() => {
        const newErrors = validateForm(formValues);
        // Only show errors for touched fields
        const filteredErrors: FormErrors = {};
        Object.keys(touched).forEach((key) => {
            if (touched[key] && newErrors[key as keyof FormErrors]) {
                filteredErrors[key as keyof FormErrors] = newErrors[key as keyof FormErrors];
            }
        });
        setErrors(filteredErrors);
    }, [formValues, touched]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear API error when user starts typing
        if (apiError) setApiError(null);
    };

    // Handle input blur (mark as touched)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {};
        Object.keys(formValues).forEach((key) => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        // Validate all fields
        const validationErrors = validateForm(formValues);
        setErrors(validationErrors);

        // Check if there are any errors
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        // Clear previous messages
        setApiError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            await registerHost({
                fullName: formValues.fullName,
                email: formValues.email,
                password: formValues.password,
                phone: formValues.phone,
            });

            setSuccessMessage('Account created successfully! Redirecting...');

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                navigate('/host/dashboard');
            }, 1500);
        } catch (error) {
            const apiErr = error as ApiError;
            setApiError(apiErr.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle login link click
    const handleLoginClick = () => {
        navigate('/host/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Register as Host / Parking Partner
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Join ParkChung and start earning by renting out your parking spots to drivers in need.
                    </p>
                </div>

                {/* API Error Alert */}
                {apiError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-red-700 text-sm">{apiError}</span>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-green-700 text-sm">{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} noValidate>
                    {/* Full Name Field */}
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formValues.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.fullName
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                }`}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
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
                            placeholder="you@example.com"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.email
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                }`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formValues.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="0903 229 906"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.phone
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                }`}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
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
                            placeholder="At least 8 characters"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.password
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                }`}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Re-enter your password"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${errors.confirmPassword
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                }`}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="mb-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="agreedToTerms"
                                checked={formValues.agreedToTerms}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-600">
                                I agree to the{' '}
                                <a
                                    href="/host/terms"
                                    className="text-emerald-600 hover:text-emerald-700 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Terms & Conditions for Parking Hosts
                                </a>
                            </span>
                        </label>
                        {errors.agreedToTerms && (
                            <p className="mt-1 text-xs text-red-500">{errors.agreedToTerms}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
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
                                Creating account...
                            </span>
                        ) : (
                            'Create Host Account'
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already a Host?{' '}
                        <button
                            type="button"
                            onClick={handleLoginClick}
                            className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                        >
                            Log in
                        </button>
                    </p>
                </div>

                {/* Footer Branding */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-400">
                        © 2025 ParkChung. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
