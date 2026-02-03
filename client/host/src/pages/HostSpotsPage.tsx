import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../i18n';
import defaultParkingImg from '../../../assets/image/parking-area.jpg';

// ============ Types ============
interface ParkingSpot {
    _id: string;
    name: string;
    address: string;
    hourlyRate: number;
    monthlyRate?: number;
    numberOfSlots: number;
    status: 'pending' | 'approved' | 'rejected' | 'archived';
    isActive: boolean;
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

async function deleteSpotAPI(spotId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/host/spots/${spotId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete parking spot');
    }
}

async function toggleSpotActiveAPI(spotId: string): Promise<{ spot: { isActive: boolean } }> {
    const response = await fetch(`${API_BASE_URL}/host/spots/${spotId}/toggle-active`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle spot status');
    }

    return response.json();
}

// ============ Components ============

function StatusBadge({ status }: { status: ParkingSpot['status'] }) {
    const t = useTranslations();
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200',
        archived: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const labels = {
        pending: t.statusPending,
        approved: t.statusApproved,
        rejected: t.statusRejected,
        archived: t.statusArchived,
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

function SpotCard({
    spot,
    onEdit,
    onDelete,
    onToggleActive
}: {
    spot: ParkingSpot;
    onEdit: (id: string) => void;
    onDelete: (id: string, name: string) => void;
    onToggleActive: (id: string) => void;
}) {
    const navigate = useNavigate();
    const t = useTranslations();

    // Use first image or placeholder
    const imageUrl = spot.images && spot.images.length > 0
        ? (spot.images[0].startsWith('http') ? spot.images[0] : `${API_BASE_URL.replace('/api', '')}${spot.images[0]}`)
        : defaultParkingImg;

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Image Header */}
            <div className="h-48 bg-gray-100 relative group">
                <img
                    src={imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultParkingImg;
                    }}
                />
                {/* Status Badges */}
                <div className="absolute top-3 right-3">
                    <StatusBadge status={spot.status} />
                </div>
                {!spot.isActive && (
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                            {t.inactive}
                        </span>
                    </div>
                )}

                {/* Overlay Actions - Vertical Stack on Left */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start p-3">
                    <div className="flex flex-col gap-1.5 w-28">
                        <button
                            onClick={() => onEdit(spot._id)}
                            className="w-full px-2 py-1.5 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-50 transition-colors text-xs"
                        >
                            {t.editDetails}
                        </button>
                        <button
                            onClick={() => navigate(`/host/bookings?spotId=${spot._id}`)}
                            className="w-full px-2 py-1.5 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition-colors text-xs"
                        >
                            {t.viewBookings}
                        </button>
                        <button
                            onClick={() => onToggleActive(spot._id)}
                            className={`w-full px-2 py-1.5 rounded-md font-medium transition-colors text-xs ${spot.isActive
                                ? 'bg-orange-600 text-white hover:bg-orange-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {spot.isActive ? t.deactivate : t.activate}
                        </button>
                        <button
                            onClick={() => onDelete(spot._id, spot.name)}
                            className="w-full px-2 py-1.5 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors text-xs"
                        >
                            {t.deleteSpot}
                        </button>
                    </div>
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
                        <span>{spot.numberOfSlots} {t.slots}</span>
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
                            {t.covered}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    const navigate = useNavigate();
    const t = useTranslations();
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🅿️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{t.noSpotsYet}</h3>
            <p className="text-gray-500 mb-6">{t.createFirstSpot}</p>
            <button
                onClick={() => navigate('/host/spots/new')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium inline-flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t.addNewSpot}
            </button>
        </div>
    );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
    isOpen,
    spotName,
    onConfirm,
    onCancel,
    isDeleting
}: {
    isOpen: boolean;
    spotName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}) {
    const t = useTranslations();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t.deleteSpotConfirmTitle}</h3>
                    </div>
                </div>

                <p className="text-gray-600 mb-2">
                    {t.deleteSpotConfirmMessage}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    <strong>{spotName}</strong>
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                    >
                        {t.cancel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t.loading}
                            </>
                        ) : (
                            t.delete
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============ Main Page Component ============
export default function HostSpotsPage() {
    const navigate = useNavigate();
    const t = useTranslations();
    const [spots, setSpots] = useState<ParkingSpot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; spotId: string; spotName: string }>({
        isOpen: false,
        spotId: '',
        spotName: ''
    });
    const [isDeleting, setIsDeleting] = useState(false);

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
        navigate(`/host/spots/${id}/edit`);
    };

    const handleDeleteClick = (spotId: string, spotName: string) => {
        setDeleteModal({ isOpen: true, spotId, spotName });
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            await deleteSpotAPI(deleteModal.spotId);

            // Remove spot from list
            setSpots(spots.filter(spot => spot._id !== deleteModal.spotId));

            // Close modal
            setDeleteModal({ isOpen: false, spotId: '', spotName: '' });

            // Show success message
            alert(t.deleteSpotSuccess);
        } catch (err: any) {
            console.error('Error deleting spot:', err);
            alert(err.message || t.deleteSpotError);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, spotId: '', spotName: '' });
    };

    const handleToggleActive = async (spotId: string) => {
        try {
            const result = await toggleSpotActiveAPI(spotId);

            // Update spot in list
            setSpots(spots.map(spot =>
                spot._id === spotId
                    ? { ...spot, isActive: result.spot.isActive }
                    : spot
            ));

            // Show success message
            const message = result.spot.isActive ? t.activateSuccess : t.deactivateSuccess;
            alert(message);
        } catch (err: any) {
            console.error('Error toggling spot status:', err);
            alert(err.message || t.toggleActiveError);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t.mySpotsTitle}</h1>
                    <p className="text-gray-500 mt-1">{t.mySpotsTitle}</p>
                </div>
                <button
                    onClick={() => navigate('/host/spots/new')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t.addNewSpot}
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
                        <SpotCard
                            key={spot._id}
                            spot={spot}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                            onToggleActive={handleToggleActive}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                spotName={deleteModal.spotName}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                isDeleting={isDeleting}
            />
        </div>
    );
}
