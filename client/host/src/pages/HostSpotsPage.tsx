import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============ Types ============
interface ParkingSpot {
    _id: string;
    name: string;
    address: string;
    hourlyRate: number;
    monthlyRate?: number;
    numberOfSlots: number;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    images: string[];
    hasRoof: boolean;
    vehicleTypes: string[];
    createdAt: string;
}

// ============ API Helper ============
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchMySpots(): Promise<ParkingSpot[]> {
    const response = await fetch(`${API_BASE_URL}/host/spots`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch parking spots');
    }

    const result = await response.json();
    return result.data || [];
}

// ============ Components ============

function StatusBadge({ status }: { status: ParkingSpot['status'] }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200',
        archived: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const labels = {
        pending: 'Pending Review',
        approved: 'Active',
        rejected: 'Rejected',
        archived: 'Archived',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

function SpotCard({ spot, onEdit }: { spot: ParkingSpot; onEdit: (id: string) => void }) {
    const navigate = useNavigate();

    // Use first image or placeholder
    const imageUrl = spot.images && spot.images.length > 0
        ? (spot.images[0].startsWith('http') ? spot.images[0] : `${API_BASE_URL.replace('/api', '')}${spot.images[0]}`)
        : '/uploads/default-parking.jpg';

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Image Header */}
            <div className="h-48 bg-gray-100 relative group">
                <img
                    src={imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/uploads/default-parking.jpg';
                    }}
                />
                <div className="absolute top-3 right-3">
                    <StatusBadge status={spot.status} />
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        onClick={() => onEdit(spot._id)}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Edit Details
                    </button>
                    <button
                        onClick={() => navigate(`/host/bookings?spotId=${spot._id}`)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                        View Bookings
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1" title={spot.name}>
                        {spot.name}
                    </h3>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-1" title={spot.address}>
                    📍 {spot.address}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                        <span>🚗</span>
                        <span>{spot.numberOfSlots} slots</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>💰</span>
                        <span>{spot.hourlyRate.toLocaleString()}đ/hr</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                        Added {new Date(spot.createdAt).toLocaleDateString()}
                    </span>
                    {spot.hasRoof && (
                        <span className="text-emerald-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Covered
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    const navigate = useNavigate();
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🅿️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No parking spots yet</h3>
            <p className="text-gray-500 mb-6">Get started by listing your first parking spot.</p>
            <button
                onClick={() => navigate('/host/spots/new')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium inline-flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Spot
            </button>
        </div>
    );
}

// ============ Main Page Component ============
export default function HostSpotsPage() {
    const navigate = useNavigate();
    const [spots, setSpots] = useState<ParkingSpot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSpots();
    }, []);

    const loadSpots = async () => {
        try {
            setIsLoading(true);
            const data = await fetchMySpots();
            setSpots(data);
        } catch (err) {
            console.error('Error loading spots:', err);
            setError('Failed to load your parking spots. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        // Navigate to edit page (to be implemented)
        // navigate(`/host/spots/${id}/edit`);
        alert(`Edit feature coming soon! (Spot ID: ${id})`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Parking Spots</h1>
                    <p className="text-gray-500 mt-1">Manage your listings and view their status</p>
                </div>
                <button
                    onClick={() => navigate('/host/spots/new')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Spot
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100">
                            <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : spots.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spots.map((spot) => (
                        <SpotCard key={spot._id} spot={spot} onEdit={handleEdit} />
                    ))}
                </div>
            )}
        </div>
    );
}
