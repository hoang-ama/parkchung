import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslations } from '../i18n';

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
    paymentMethods: string[];
    contactPhone: string;
    openTime: string;
    bookingTypes: string[];
    addOnServices: string[];
}

interface FormErrors {
    name?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    hourlyRate?: string;
    monthlyRate?: string;
    numberOfSlots?: string;
    vehicleTypes?: string;
    paymentMethods?: string;
    images?: string;
    contactPhone?: string;
    bookingTypes?: string;
}

interface ParkingSpot {
    _id: string;
    name: string;
    address: string;
    description?: string;
    location: { type: string; coordinates: [number, number] };
    hourlyRate: number;
    monthlyRate?: number;
    numberOfSlots: number;
    hasRoof: boolean;
    vehicleTypes: string[];
    paymentMethods: string[];
    contactPhone?: string;
    openTime?: string;
    bookingTypes?: string[];
    addOnServices?: string[];
    images: string[];
    status: string;
}

const MAX_IMAGES = 5;
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ============ API Helpers ============
async function fetchSpotById(id: string): Promise<ParkingSpot> {
    const response = await fetch(`${API_BASE_URL}/host/spots/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch spot');
    }
    return response.json();
}

async function updateSpot(id: string, formData: FormData): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/host/spots/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to update spot');
    }
    return result;
}

// ============ Validation ============
function validateForm(values: SpotFormValues): FormErrors {
    const errors: FormErrors = {};

    if (!values.name.trim()) errors.name = 'Spot name is required';
    if (!values.address.trim()) errors.address = 'Address is required';

    if (!values.latitude.trim()) {
        errors.latitude = 'Latitude is required';
    } else {
        const lat = parseFloat(values.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) errors.latitude = 'Invalid latitude';
    }

    if (!values.longitude.trim()) {
        errors.longitude = 'Longitude is required';
    } else {
        const lng = parseFloat(values.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) errors.longitude = 'Invalid longitude';
    }

    if (!values.hourlyRate.trim()) {
        errors.hourlyRate = 'Hourly rate is required';
    } else if (parseFloat(values.hourlyRate) <= 0) {
        errors.hourlyRate = 'Must be greater than 0';
    }

    if (values.monthlyRate.trim() && parseFloat(values.monthlyRate) <= 0) {
        errors.monthlyRate = 'Must be greater than 0';
    }

    if (!values.numberOfSlots.trim() || parseInt(values.numberOfSlots) <= 0) {
        errors.numberOfSlots = 'Must be at least 1';
    }

    if (values.vehicleTypes.length === 0) errors.vehicleTypes = 'Select at least one';
    if (values.paymentMethods.length === 0) errors.paymentMethods = 'Select at least one';
    if (values.bookingTypes.length === 0) errors.bookingTypes = 'Select at least one';
    if (!values.contactPhone.trim()) errors.contactPhone = 'Phone is required';

    return errors;
}

// ============ Component ============
export default function HostEditSpotPage() {
    const t = useTranslations();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Define options with translations
    const VEHICLE_TYPE_OPTIONS = [
        { value: 'car', label: t.car },
        { value: 'motorbike', label: t.motorbike },
        { value: 'bicycle', label: t.bicycle },
        { value: 'truck', label: t.truck },
    ];

    const PAYMENT_METHOD_OPTIONS = [
        { value: 'cash', label: t.cash, icon: '💵' },
        { value: 'paypal', label: t.paypal, icon: '💳' },
    ];

    const BOOKING_TYPE_OPTIONS = [
        { value: 'online', label: t.onlineBooking, icon: '🌐' },
        { value: 'call', label: t.callBooking, icon: '📞' },
    ];

    const ADDON_SERVICE_OPTIONS = [
        { value: 'valet', label: t.valetParking, icon: '🚗' },
        { value: 'carwash', label: t.carWashing, icon: '🧼' },
        { value: 'ev_charging', label: t.evCharging, icon: '⚡' },
    ];

    const [isLoadingSpot, setIsLoadingSpot] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [existingImages, setExistingImages] = useState<string[]>([]);

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
        paymentMethods: ['cash'],
        contactPhone: '',
        openTime: '',
        bookingTypes: ['online'],
        addOnServices: [],
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Load spot data on mount
    useEffect(() => {
        if (!id) {
            setLoadError('Spot ID not found');
            setIsLoadingSpot(false);
            return;
        }

        fetchSpotById(id)
            .then((spot) => {
                setFormValues({
                    name: spot.name || '',
                    address: spot.address || '',
                    description: spot.description || '',
                    latitude: spot.location?.coordinates?.[1]?.toString() || '',
                    longitude: spot.location?.coordinates?.[0]?.toString() || '',
                    hourlyRate: spot.hourlyRate?.toString() || '',
                    monthlyRate: spot.monthlyRate?.toString() || '',
                    numberOfSlots: spot.numberOfSlots?.toString() || '',
                    hasRoof: spot.hasRoof || false,
                    vehicleTypes: spot.vehicleTypes || [],
                    paymentMethods: spot.paymentMethods || ['cash'],
                    contactPhone: spot.contactPhone || '',
                    openTime: spot.openTime || '',
                    bookingTypes: spot.bookingTypes || ['online'],
                    addOnServices: spot.addOnServices || [],
                });
                setExistingImages(spot.images || []);
                setIsLoadingSpot(false);
            })
            .catch((err) => {
                setLoadError(err.message);
                setIsLoadingSpot(false);
            });
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (apiError) setApiError(null);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    };

    const toggleArrayValue = (field: keyof SpotFormValues, value: string) => {
        setFormValues((prev) => {
            const arr = prev[field] as string[];
            const newArr = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
            return { ...prev, [field]: newArr };
        });
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files).slice(0, MAX_IMAGES));
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeNewFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const allTouched: Record<string, boolean> = {};
        Object.keys(formValues).forEach((key) => { allTouched[key] = true; });
        setTouched(allTouched);

        const validationErrors = validateForm(formValues);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setApiError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
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
            formData.append('contactPhone', formValues.contactPhone);
            formData.append('openTime', formValues.openTime);

            formValues.vehicleTypes.forEach((v) => formData.append('vehicleTypes[]', v));
            formValues.paymentMethods.forEach((v) => formData.append('paymentMethods[]', v));
            formValues.bookingTypes.forEach((v) => formData.append('bookingTypes[]', v));
            formValues.addOnServices.forEach((v) => formData.append('addOnServices[]', v));

            // Send existing images that should be kept
            formData.append('existingImages', JSON.stringify(existingImages));

            // Append new images
            selectedFiles.forEach((file) => formData.append('images', file));

            await updateSpot(id!, formData);

            setSuccessMessage('Parking spot updated successfully!');
            setTimeout(() => navigate('/host/spots'), 1500);
        } catch (error) {
            setApiError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const getFieldError = (field: keyof FormErrors) => touched[field] ? errors[field] : undefined;

    // Loading state
    if (isLoadingSpot) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading spot details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (loadError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Spot</h2>
                    <p className="text-gray-600 mb-4">{loadError}</p>
                    <button
                        onClick={() => navigate('/host/spots')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        Back to My Spots
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto p-4 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{t.editSpotTitle}</h1>
                        <p className="text-gray-500 mt-1">{t.editSpotTitle}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/host/spots')}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                        ← {t.back}
                    </button>
                </div>

                {/* Messages */}
                {apiError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {apiError}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {successMessage}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Basic Info Section */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.basicInfo}</h2>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.spotName} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('name') ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-200'}`}
                                />
                                {getFieldError('name') && <p className="mt-1 text-xs text-red-500">{getFieldError('name')}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.address} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formValues.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('address') ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-200'}`}
                                />
                                {getFieldError('address') && <p className="mt-1 text-xs text-red-500">{getFieldError('address')}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.contactPhone} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    value={formValues.contactPhone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('contactPhone') ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-200'}`}
                                />
                                {getFieldError('contactPhone') && <p className="mt-1 text-xs text-red-500">{getFieldError('contactPhone')}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.description}</label>
                                <textarea
                                    name="description"
                                    value={formValues.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.images}</h2>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">{t.images}:</p>
                                <div className="flex flex-wrap gap-2">
                                    {existingImages.map((img, i) => (
                                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                            <img src={img.startsWith('http') ? img : `${API_BASE_URL.replace('/api', '')}${img}`} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(i)}
                                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700"
                        />
                        {selectedFiles.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {selectedFiles.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-600">{file.name}</span>
                                        <button type="button" onClick={() => removeNewFile(i)} className="text-red-500">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Location Section */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.location}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.latitude} *</label>
                                <input
                                    type="number"
                                    name="latitude"
                                    value={formValues.latitude}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    step="any"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('latitude') ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-200'}`}
                                />
                                {getFieldError('latitude') && <p className="mt-1 text-xs text-red-500">{getFieldError('latitude')}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.longitude} *</label>
                                <input
                                    type="number"
                                    name="longitude"
                                    value={formValues.longitude}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    step="any"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('longitude') ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-200'}`}
                                />
                                {getFieldError('longitude') && <p className="mt-1 text-xs text-red-500">{getFieldError('longitude')}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.pricingCapacity}</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.hourlyRate} (VND) *</label>
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formValues.hourlyRate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('hourlyRate') ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-200'}`}
                                />
                                {getFieldError('hourlyRate') && <p className="mt-1 text-xs text-red-500">{getFieldError('hourlyRate')}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.monthlyRate} (VND)</label>
                                <input
                                    type="number"
                                    name="monthlyRate"
                                    value={formValues.monthlyRate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t.numberOfSlots} *</label>
                                <input
                                    type="number"
                                    name="numberOfSlots"
                                    value={formValues.numberOfSlots}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    min="1"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('numberOfSlots') ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-200'}`}
                                />
                                {getFieldError('numberOfSlots') && <p className="mt-1 text-xs text-red-500">{getFieldError('numberOfSlots')}</p>}
                            </div>
                        </div>

                        {/* Open Time */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.operatingHours}</label>
                            <textarea
                                name="openTime"
                                value={formValues.openTime}
                                onChange={handleChange}
                                placeholder="e.g.&#10;Monday-Friday: 08:00-22:00&#10;Saturday: 09:00-20:00&#10;Sunday: Closed"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">Enter operating hours for each day. Press Enter to add multiple lines.</p>
                        </div>

                        {/* Has Roof */}
                        <div className="mt-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="hasRoof"
                                    checked={formValues.hasRoof}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-emerald-600 rounded"
                                />
                                <span className="text-sm text-gray-700">{t.hasRoof}</span>
                            </label>
                        </div>
                    </div>

                    {/* Vehicle Types */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.vehicleTypes} *</h2>
                        <div className="flex flex-wrap gap-3">
                            {VEHICLE_TYPE_OPTIONS.map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`px-4 py-2 rounded-lg border cursor-pointer transition-colors ${formValues.vehicleTypes.includes(opt.value) ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formValues.vehicleTypes.includes(opt.value)}
                                        onChange={() => toggleArrayValue('vehicleTypes', opt.value)}
                                        className="sr-only"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                        {getFieldError('vehicleTypes') && <p className="mt-2 text-xs text-red-500">{getFieldError('vehicleTypes')}</p>}
                    </div>

                    {/* Booking Types */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.bookingMethods} *</h2>
                        <div className="flex flex-wrap gap-3">
                            {BOOKING_TYPE_OPTIONS.map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`px-4 py-2 rounded-lg border cursor-pointer transition-colors flex items-center gap-2 ${formValues.bookingTypes.includes(opt.value) ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formValues.bookingTypes.includes(opt.value)}
                                        onChange={() => toggleArrayValue('bookingTypes', opt.value)}
                                        className="sr-only"
                                    />
                                    <span>{opt.icon}</span> {opt.label}
                                </label>
                            ))}
                        </div>
                        {getFieldError('bookingTypes') && <p className="mt-2 text-xs text-red-500">{getFieldError('bookingTypes')}</p>}
                    </div>

                    {/* Payment Methods */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.paymentMethods} *</h2>
                        <div className="flex flex-wrap gap-3">
                            {PAYMENT_METHOD_OPTIONS.map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`px-4 py-2 rounded-lg border cursor-pointer transition-colors flex items-center gap-2 ${formValues.paymentMethods.includes(opt.value) ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formValues.paymentMethods.includes(opt.value)}
                                        onChange={() => toggleArrayValue('paymentMethods', opt.value)}
                                        className="sr-only"
                                    />
                                    <span>{opt.icon}</span> {opt.label}
                                </label>
                            ))}
                        </div>
                        {getFieldError('paymentMethods') && <p className="mt-2 text-xs text-red-500">{getFieldError('paymentMethods')}</p>}
                    </div>

                    {/* Add-on Services */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.addOnServices}</h2>
                        <div className="flex flex-wrap gap-3">
                            {ADDON_SERVICE_OPTIONS.map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`px-4 py-2 rounded-lg border cursor-pointer transition-colors flex items-center gap-2 ${formValues.addOnServices.includes(opt.value) ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formValues.addOnServices.includes(opt.value)}
                                        onChange={() => toggleArrayValue('addOnServices', opt.value)}
                                        className="sr-only"
                                    />
                                    <span>{opt.icon}</span> {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="p-6 bg-gray-50">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? t.savingChanges : t.saveChanges}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
