import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ============ Types ============
interface SpotFormValues {
    name: string;
    address: string;
    description: string;
    latitude: string;
    longitude: string;
    hourlyRate: string;
    monthlyRate: string;
    numberOfSlots: string;
    hasRoof: boolean;
    vehicleTypes: string[];
    paymentMethods: string[]; // 'cash', 'paypal', or both
    contactPhone: string; // Phone number for booking
    openTime: string; // Operating hours, e.g., "08:00-22:00"
    bookingTypes: string[]; // ['online'], ['call'], or ['online', 'call']
    addOnServices: string[]; // ['valet', etc.]
}

interface FormErrors {
    name?: string;
    address?: string;
    description?: string;
    latitude?: string;
    longitude?: string;
    hourlyRate?: string;
    monthlyRate?: string;
    numberOfSlots?: string;
    vehicleTypes?: string;
    paymentMethods?: string;
    images?: string;
    contactPhone?: string;
    openTime?: string;
    bookingTypes?: string;
    addOnServices?: string;
}

// ============ Constants ============
const VEHICLE_TYPE_OPTIONS = [
    { value: 'car', label: 'Car' },
    { value: 'motorbike', label: 'Motorbike' },
    { value: 'truck', label: 'Small truck' },
];

const PAYMENT_METHOD_OPTIONS = [
    { value: 'cash', label: 'Cash', icon: '💵', description: 'Pay at the spot' },
    { value: 'paypal', label: 'PayPal', icon: '💳', description: 'Online payment' },
];

const BOOKING_TYPE_OPTIONS = [
    { value: 'online', label: 'Online Booking', icon: '🌐', description: 'Customers can book through the website' },
    { value: 'call', label: 'Call Booking', icon: '📞', description: 'Customers must call to book' },
];

const ADDON_SERVICE_OPTIONS = [
    { value: 'valet', label: 'Valet Parking', icon: '🚗', description: 'Free valet service', price: 'Free' },
];

const MAX_IMAGES = 5;

// ============ API Helper ============
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function createSpot(formData: FormData): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/host/spots`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
            // Note: Do NOT set Content-Type for FormData; let browser handle it
        },
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to create parking spot');
    }

    return result;
}

// ============ Validation ============
function validateForm(values: SpotFormValues, selectedFiles: File[]): FormErrors {
    const errors: FormErrors = {};

    // Name validation
    if (!values.name.trim()) {
        errors.name = 'Spot name is required';
    }

    // Address validation
    if (!values.address.trim()) {
        errors.address = 'Address is required';
    }

    // Latitude validation
    if (!values.latitude.trim()) {
        errors.latitude = 'Latitude is required';
    } else {
        const lat = parseFloat(values.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
            errors.latitude = 'Latitude must be between -90 and 90';
        }
    }

    // Longitude validation
    if (!values.longitude.trim()) {
        errors.longitude = 'Longitude is required';
    } else {
        const lng = parseFloat(values.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) {
            errors.longitude = 'Longitude must be between -180 and 180';
        }
    }

    // Hourly rate validation
    if (!values.hourlyRate.trim()) {
        errors.hourlyRate = 'Hourly rate is required';
    } else {
        const rate = parseFloat(values.hourlyRate);
        if (isNaN(rate) || rate <= 0) {
            errors.hourlyRate = 'Hourly rate must be greater than 0';
        }
    }

    // Monthly rate validation (optional but must be valid if provided)
    if (values.monthlyRate.trim()) {
        const rate = parseFloat(values.monthlyRate);
        if (isNaN(rate) || rate <= 0) {
            errors.monthlyRate = 'Monthly rate must be greater than 0';
        }
    }

    // Number of slots validation
    if (!values.numberOfSlots.trim()) {
        errors.numberOfSlots = 'Number of slots is required';
    } else {
        const slots = parseInt(values.numberOfSlots, 10);
        if (isNaN(slots) || slots <= 0) {
            errors.numberOfSlots = 'Number of slots must be greater than 0';
        }
    }

    // Vehicle types validation
    if (values.vehicleTypes.length === 0) {
        errors.vehicleTypes = 'Select at least one vehicle type';
    }

    // Payment methods validation
    if (values.paymentMethods.length === 0) {
        errors.paymentMethods = 'Select at least one payment method';
    }

    // Images validation (optional but max 5)
    if (selectedFiles.length > MAX_IMAGES) {
        errors.images = `Maximum ${MAX_IMAGES} images allowed`;
    }

    // Booking types validation
    if (values.bookingTypes.length === 0) {
        errors.bookingTypes = 'Select at least one booking type';
    }

    // Contact phone validation (required)
    if (!values.contactPhone.trim()) {
        errors.contactPhone = 'Phone number is required';
    }

    return errors;
}

// ============ Component ============
export default function HostCreateSpotPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formValues, setFormValues] = useState<SpotFormValues>({
        name: '',
        address: '',
        description: '',
        latitude: '',
        longitude: '',
        hourlyRate: '',
        monthlyRate: '',
        numberOfSlots: '',
        hasRoof: false,
        vehicleTypes: [],
        paymentMethods: ['cash'], // Default to cash
        contactPhone: '',
        openTime: '', // Operating hours
        bookingTypes: ['online'], // Default to online booking
        addOnServices: [], // No add-on services by default
    });

    // File state
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // UI state
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    // Handle text input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (apiError) setApiError(null);
    };

    // Handle input blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    // Handle vehicle type checkbox change
    const handleVehicleTypeChange = (value: string) => {
        setFormValues((prev) => {
            const newTypes = prev.vehicleTypes.includes(value)
                ? prev.vehicleTypes.filter((t) => t !== value)
                : [...prev.vehicleTypes, value];
            return { ...prev, vehicleTypes: newTypes };
        });
        setTouched((prev) => ({ ...prev, vehicleTypes: true }));
    };

    // Handle payment method checkbox change
    const handlePaymentMethodChange = (value: string) => {
        setFormValues((prev) => {
            const newMethods = prev.paymentMethods.includes(value)
                ? prev.paymentMethods.filter((m) => m !== value)
                : [...prev.paymentMethods, value];
            return { ...prev, paymentMethods: newMethods };
        });
        setTouched((prev) => ({ ...prev, paymentMethods: true }));
    };

    // Handle booking type toggle (multi-select)
    const handleBookingTypeChange = (type: string) => {
        setFormValues((prev) => ({
            ...prev,
            bookingTypes: prev.bookingTypes.includes(type)
                ? prev.bookingTypes.filter((t) => t !== type)
                : [...prev.bookingTypes, type],
        }));
        setTouched((prev) => ({ ...prev, bookingTypes: true }));
    };

    // Handle add-on service toggle
    const handleAddOnServiceChange = (service: string) => {
        setFormValues((prev) => ({
            ...prev,
            addOnServices: prev.addOnServices.includes(service)
                ? prev.addOnServices.filter((s) => s !== service)
                : [...prev.addOnServices, service],
        }));
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files).slice(0, MAX_IMAGES);
            setSelectedFiles(fileArray);
        }
    };

    // Remove a selected file
    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Get current location
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            setApiError('Geolocation is not supported by your browser');
            return;
        }

        setIsGettingLocation(true);
        setApiError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormValues((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                }));
                // Mark fields as touched so validation doesn't complain immediately if valid
                setTouched((prev) => ({ ...prev, latitude: true, longitude: true }));
                setIsGettingLocation(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                let errorMessage = 'Failed to get your location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable. Please check your device settings.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'The request to get user location timed out. Please try again.';
                        break;
                }
                setApiError(errorMessage);
                setIsGettingLocation(false);
            }
        );
    };

    // Check if Google Maps link is valid
    const isMapLinkValid = () => {
        const lat = parseFloat(formValues.latitude);
        const lng = parseFloat(formValues.longitude);
        return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
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

        // Validate
        const validationErrors = validateForm(formValues, selectedFiles);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        // Clear messages
        setApiError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            // Build FormData
            const formData = new FormData();
            formData.append('name', formValues.name);
            formData.append('address', formValues.address);
            formData.append('description', formValues.description);
            formData.append('latitude', formValues.latitude);
            formData.append('longitude', formValues.longitude);
            formData.append('hourlyRate', formValues.hourlyRate);
            if (formValues.monthlyRate.trim()) {
                formData.append('monthlyRate', formValues.monthlyRate);
            }
            formData.append('numberOfSlots', formValues.numberOfSlots);
            formData.append('hasRoof', String(formValues.hasRoof));

            // Append vehicle types
            formValues.vehicleTypes.forEach((type) => {
                formData.append('vehicleTypes[]', type);
            });

            // Append payment methods
            formValues.paymentMethods.forEach((method) => {
                formData.append('paymentMethods[]', method);
            });

            // Append booking types (array)
            formValues.bookingTypes.forEach((type) => {
                formData.append('bookingTypes[]', type);
            });

            // Append open time
            if (formValues.openTime.trim()) {
                formData.append('openTime', formValues.openTime);
            }

            // Append contact phone
            if (formValues.contactPhone.trim()) {
                formData.append('contactPhone', formValues.contactPhone);
            }

            // Append add-on services
            formValues.addOnServices.forEach((service) => {
                formData.append('addOnServices[]', service);
            });

            // Append images
            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });

            await createSpot(formData);

            setSuccessMessage('Your parking spot has been created and is pending approval.');

            // Redirect after short delay
            setTimeout(() => {
                navigate('/host/spots');
            }, 2000);
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
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Create New Parking Spot</h1>
                    <p className="text-gray-600 mt-1">
                        Fill in the details below to add a new parking spot to your listings.
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

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-700 text-sm">{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Section A: Basic Information */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>

                        {/* Spot Name */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Spot Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formValues.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. Downtown Parking Garage"
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('name')
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                    }`}
                            />
                            {getFieldError('name') && (
                                <p className="mt-1 text-xs text-red-500">{getFieldError('name')}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formValues.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Full street address"
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('address')
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                    }`}
                            />
                            {getFieldError('address') && (
                                <p className="mt-1 text-xs text-red-500">{getFieldError('address')}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="mb-4">
                            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-gray-500 mb-2">
                                Provide a contact number for customer inquiries and call bookings
                            </p>
                            <input
                                type="tel"
                                id="contactPhone"
                                name="contactPhone"
                                value={formValues.contactPhone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g. 0123456789"
                                className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('contactPhone')
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                    }`}
                            />
                            {getFieldError('contactPhone') && (
                                <p className="mt-1 text-xs text-red-500">{getFieldError('contactPhone')}</p>
                            )}

                            {/* Call booking only notice */}
                            {formValues.bookingTypes.includes('call') && !formValues.bookingTypes.includes('online') && (
                                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">📞</span>
                                        <span className="text-sm text-amber-700">
                                            <strong>Call Booking Only:</strong> Customers must call to reserve.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formValues.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={3}
                                placeholder="Describe how to access the spot, opening hours, special instructions..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Section B: Images */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Images <span className="text-gray-400 font-normal text-sm">(max {MAX_IMAGES})</span>
                        </h2>

                        {/* File Input */}
                        <div className="mb-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Upload photos of your parking spot. Clear images help attract more customers.
                            </p>
                            {getFieldError('images') && (
                                <p className="mt-1 text-xs text-red-500">{getFieldError('images')}</p>
                            )}
                        </div>

                        {/* Selected Files List */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Selected files:</p>
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={`${file.name}-${index}`}
                                        className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                                    >
                                        <span className="text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section C: Location */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Location</h2>
                            <button
                                type="button"
                                onClick={handleGetCurrentLocation}
                                disabled={isGettingLocation}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGettingLocation ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Detecting...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Use Current Location
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            {/* Latitude */}
                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="latitude"
                                    name="latitude"
                                    value={formValues.latitude}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    step="any"
                                    placeholder="e.g. 10.7769"
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('latitude')
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                        }`}
                                />
                                {getFieldError('latitude') && (
                                    <p className="mt-1 text-xs text-red-500">{getFieldError('latitude')}</p>
                                )}
                            </div>

                            {/* Longitude */}
                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="longitude"
                                    name="longitude"
                                    value={formValues.longitude}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    step="any"
                                    placeholder="e.g. 106.7009"
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('longitude')
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                        }`}
                                />
                                {getFieldError('longitude') && (
                                    <p className="mt-1 text-xs text-red-500">{getFieldError('longitude')}</p>
                                )}
                            </div>
                        </div>

                        {/* Google Maps Link */}
                        {isMapLinkValid() ? (
                            <a
                                href={`https://www.google.com/maps?q=${formValues.latitude},${formValues.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                View on Google Maps
                            </a>
                        ) : (
                            <span className="text-sm text-gray-400">
                                Enter valid coordinates to view on Google Maps
                            </span>
                        )}
                    </div>

                    {/* Section D: Open Time */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Open Time</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Specify the operating hours for this parking spot
                        </p>
                        <input
                            type="text"
                            id="openTime"
                            name="openTime"
                            value={formValues.openTime}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="e.g. 08:00-22:00 or 24/7"
                            className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-colors"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Enter operating hours (e.g., "08:00-22:00") or "24/7" if open all day
                        </p>
                    </div>

                    {/* Section E: Pricing & Capacity */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Capacity</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            {/* Hourly Rate */}
                            <div>
                                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hourly Rate (VND) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="hourlyRate"
                                    name="hourlyRate"
                                    value={formValues.hourlyRate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    min="0"
                                    placeholder="e.g. 20000"
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('hourlyRate')
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                        }`}
                                />
                                {getFieldError('hourlyRate') && (
                                    <p className="mt-1 text-xs text-red-500">{getFieldError('hourlyRate')}</p>
                                )}
                            </div>

                            {/* Monthly Rate */}
                            <div>
                                <label htmlFor="monthlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Monthly Rate (VND)
                                </label>
                                <input
                                    type="number"
                                    id="monthlyRate"
                                    name="monthlyRate"
                                    value={formValues.monthlyRate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    min="0"
                                    placeholder="Optional"
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('monthlyRate')
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                        }`}
                                />
                                {getFieldError('monthlyRate') && (
                                    <p className="mt-1 text-xs text-red-500">{getFieldError('monthlyRate')}</p>
                                )}
                            </div>

                            {/* Number of Slots */}
                            <div>
                                <label htmlFor="numberOfSlots" className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Slots <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="numberOfSlots"
                                    name="numberOfSlots"
                                    value={formValues.numberOfSlots}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    min="1"
                                    placeholder="e.g. 10"
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${getFieldError('numberOfSlots')
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-emerald-200 focus:border-emerald-500'
                                        }`}
                                />
                                {getFieldError('numberOfSlots') && (
                                    <p className="mt-1 text-xs text-red-500">{getFieldError('numberOfSlots')}</p>
                                )}
                            </div>
                        </div>

                        {/* Has Roof Checkbox */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="hasRoof"
                                checked={formValues.hasRoof}
                                onChange={handleChange}
                                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">
                                Covered parking (has roof)
                            </span>
                        </label>
                    </div>

                    {/* Section F: Vehicle Types */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Vehicle Types <span className="text-red-500">*</span>
                        </h2>

                        <div className="flex flex-wrap gap-4">
                            {VEHICLE_TYPE_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${formValues.vehicleTypes.includes(option.value)
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formValues.vehicleTypes.includes(option.value)}
                                        onChange={() => handleVehicleTypeChange(option.value)}
                                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-medium">{option.label}</span>
                                </label>
                            ))}
                        </div>
                        {getFieldError('vehicleTypes') && (
                            <p className="mt-2 text-xs text-red-500">{getFieldError('vehicleTypes')}</p>
                        )}
                    </div>

                    {/* Section G: Booking Type */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Booking Type <span className="text-red-500">*</span>
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Select how customers can book this parking spot (you can choose both)
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {BOOKING_TYPE_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formValues.bookingTypes.includes(option.value)
                                        ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formValues.bookingTypes.includes(option.value)}
                                        onChange={() => handleBookingTypeChange(option.value)}
                                        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-2xl">{option.icon}</span>
                                        <div>
                                            <p className={`font-medium ${formValues.bookingTypes.includes(option.value)
                                                ? 'text-emerald-700'
                                                : 'text-gray-800'
                                                }`}>
                                                {option.label}
                                            </p>
                                            <p className="text-xs text-gray-500">{option.description}</p>
                                        </div>
                                    </div>
                                    {formValues.bookingTypes.includes(option.value) && (
                                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </label>
                            ))}
                        </div>
                        {getFieldError('bookingTypes') && (
                            <p className="mt-2 text-xs text-red-500">{getFieldError('bookingTypes')}</p>
                        )}

                        {/* Both selected indicator */}
                        {formValues.bookingTypes.length === 2 && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-blue-700">
                                        Both booking types enabled - Customers can choose to book online or call
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section H: Payment Methods */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Accepted Payment Methods <span className="text-red-500">*</span>
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Select payment options available for customers booking this spot
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PAYMENT_METHOD_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formValues.paymentMethods.includes(option.value)
                                        ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formValues.paymentMethods.includes(option.value)}
                                        onChange={() => handlePaymentMethodChange(option.value)}
                                        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-2xl">{option.icon}</span>
                                        <div>
                                            <p className={`font-medium ${formValues.paymentMethods.includes(option.value)
                                                ? 'text-emerald-700'
                                                : 'text-gray-800'
                                                }`}>
                                                {option.label}
                                            </p>
                                            <p className="text-xs text-gray-500">{option.description}</p>
                                        </div>
                                    </div>
                                    {formValues.paymentMethods.includes(option.value) && (
                                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </label>
                            ))}
                        </div>
                        {getFieldError('paymentMethods') && (
                            <p className="mt-2 text-xs text-red-500">{getFieldError('paymentMethods')}</p>
                        )}

                        {/* Both selected indicator */}
                        {formValues.paymentMethods.length === 2 && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-blue-700">
                                        Both payment methods accepted - Customers can choose either option
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section I: Add-on Services */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Add-on Services
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Select additional services offered at this parking spot
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {ADDON_SERVICE_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formValues.addOnServices.includes(option.value)
                                        ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formValues.addOnServices.includes(option.value)}
                                        onChange={() => handleAddOnServiceChange(option.value)}
                                        className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-2xl">{option.icon}</span>
                                        <div>
                                            <p className={`font-medium ${formValues.addOnServices.includes(option.value)
                                                ? 'text-emerald-700'
                                                : 'text-gray-800'
                                                }`}>
                                                {option.label}
                                            </p>
                                            <p className="text-xs text-gray-500">{option.description}</p>
                                            <span className="text-xs font-medium text-emerald-600">{option.price}</span>
                                        </div>
                                    </div>
                                    {formValues.addOnServices.includes(option.value) && (
                                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>







                    {/* Form Actions */}
                    <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/host/spots')}
                            className="px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-3 font-semibold text-white rounded-lg transition-all duration-200 ${isLoading
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
                                    Creating...
                                </span>
                            ) : (
                                'Create Parking Spot'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
