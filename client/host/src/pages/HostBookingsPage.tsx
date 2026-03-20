import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslations } from '../i18n';

// ============ Types ============
interface Booking {
    id: string;
    spotId: string;
    spotName: string;
    spotAddress: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | 'unpaid' | 'cancelled' | 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | 'UNPAID' | 'CANCELLED';
    paymentMethod: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ParkingSpotSimple {
    _id: string;
    name: string;
}

// ============ API Helper ============
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchBookings(params: URLSearchParams): Promise<{ data: Booking[]; pagination: Pagination }> {
    const queryString = params.toString();
    const response = await fetch(`${API_BASE_URL}/host/bookings?${queryString}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }

    return response.json();
}

async function fetchMySpots(): Promise<ParkingSpotSimple[]> {
    const response = await fetch(`${API_BASE_URL}/host/spots?limit=100`, { // Fetch all spots for dropdown
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
    });
    if (!response.ok) return [];
    const result = await response.json();
    return result.data || [];
}

async function cancelBooking(bookingId: string, reason: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/host/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
        body: JSON.stringify({ cancellationReason: reason }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel booking');
    }
}

async function markBookingAsPaid(bookingId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/host/bookings/${bookingId}/mark-paid`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update payment status');
    }
}

// ============ Components ============

function StatusBadge({ status }: { status: string }) {
    const t = useTranslations();
    const styles: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const labels: Record<string, string> = {
        pending: t.pending,
        confirmed: t.confirmed,
        completed: t.completed,
        cancelled: t.cancelled,
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {labels[status] || status}
        </span>
    );
}

function PaymentBadge({ status }: { status: string }) {
    const t = useTranslations();
    const normalizedStatus = status ? status.toLowerCase() : '';
    
    const styles: Record<string, string> = {
        paid: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        failed: 'bg-red-100 text-red-800',
        refunded: 'bg-gray-100 text-gray-800',
        unpaid: 'bg-orange-100 text-orange-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const labels: Record<string, string> = {
        paid: t.paid,
        pending: t.pending,
        failed: t.paymentFailed,
        refunded: t.refunded,
        unpaid: t.unpaid,
        cancelled: t.cancelled,
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[normalizedStatus] || 'bg-gray-100 text-gray-800'}`}>
            {labels[normalizedStatus] || status}
        </span>
    );
}

// ============ Main Page ============
export default function HostBookingsPage() {
    const t = useTranslations();
    const [searchParams, setSearchParams] = useSearchParams();

    // Data State
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [spots, setSpots] = useState<ParkingSpotSimple[]>([]);

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [isMarkingPaid, setIsMarkingPaid] = useState<string | null>(null);

    // Filters State
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
    const [spotFilter, setSpotFilter] = useState(searchParams.get('spotId') || '');
    const [dateFrom, setDateFrom] = useState(searchParams.get('from') || '');
    const [dateTo, setDateTo] = useState(searchParams.get('to') || '');

    // Load initial data
    useEffect(() => {
        loadSpots();
    }, []);

    // Load bookings when filters/pagination change
    useEffect(() => {
        loadBookings();
    }, [searchParams]);

    const loadSpots = async () => {
        try {
            const data = await fetchMySpots();
            setSpots(data);
        } catch (err) {
            console.error('Failed to load spots for filter', err);
        }
    };

    const loadBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchBookings(searchParams);
            setBookings(result.data);
            setPagination(result.pagination);
        } catch (err) {
            console.error(err);
            setError('Failed to load bookings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Update URL params when filters apply
    const applyFilters = () => {
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        if (spotFilter) params.set('spotId', spotFilter);
        if (dateFrom) params.set('from', dateFrom);
        if (dateTo) params.set('to', dateTo);
        params.set('page', '1'); // Reset to page 1
        setSearchParams(params);
    };

    const clearFilters = () => {
        setStatusFilter('');
        setSpotFilter('');
        setDateFrom('');
        setDateTo('');
        setSearchParams(new URLSearchParams());
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        setSearchParams(params);
    };

    const openCancelModal = (id: string) => {
        setSelectedBookingId(id);
        setCancelReason('');
        setIsCancelModalOpen(true);
    };

    const handleCancelBooking = async () => {
        if (!selectedBookingId) return;

        setIsCancelling(true);
        try {
            await cancelBooking(selectedBookingId, cancelReason);
            setIsCancelModalOpen(false);
            loadBookings(); // Refresh list
            alert('Booking cancelled successfully');
        } catch (err) {
            alert((err as Error).message);
        } finally {
            setIsCancelling(false);
        }
    };

    const handleMarkAsPaid = async (bookingId: string) => {
        if (!window.confirm(t.confirmMarkPaid || 'Are you sure you want to mark this booking as paid?')) return;
        
        setIsMarkingPaid(bookingId);
        try {
            await markBookingAsPaid(bookingId);
            loadBookings(); // Refresh list
        } catch (err) {
            alert((err as Error).message);
        } finally {
            setIsMarkingPaid(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{t.bookingsTitle}</h1>
                <p className="text-gray-500 mt-1">{t.bookingsTitle}</p>
            </div>

            {/* Filters Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.status}</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="">{t.allStatuses}</option>
                            <option value="pending">{t.pending}</option>
                            <option value="confirmed">{t.confirmed}</option>
                            <option value="completed">{t.completed}</option>
                            <option value="cancelled">{t.cancelled}</option>
                        </select>
                    </div>

                    {/* Spot Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.spot}</label>
                        <select
                            value={spotFilter}
                            onChange={(e) => setSpotFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="">{t.allSpots}</option>
                            {spots.map(spot => (
                                <option key={spot._id} value={spot._id}>{spot.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.dateTime}</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.dateTime}</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {t.clearFilters}
                    </button>
                    <button
                        onClick={applyFilters}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        {t.applyFilters}
                    </button>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">{t.loadingBookings}</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : bookings.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-4xl mb-3">📅</div>
                        <h3 className="text-lg font-medium text-gray-900">{t.noBookingsFound}</h3>
                        <p className="text-gray-500">{t.noBookingsFound}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.spot}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.customer}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.dateTime}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.amount}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.status}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.paymentStatus || 'Payment Status'}</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{booking.spotName}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{booking.spotAddress}</div>
                                            <div className="text-xs text-gray-400 mt-1">ID: {booking.id.slice(-6)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                                            <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                                            {booking.customerPhone && (
                                                <div className="text-sm text-gray-500 mt-0.5">{booking.customerPhone}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {new Date(booking.startTime).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{booking.totalPrice.toLocaleString()}đ</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <PaymentBadge status={booking.paymentStatus} />
                                            <div className="mt-1 text-xs text-gray-500">
                                                {t.via || 'via'} <span className="capitalize">{booking.paymentMethod.toLowerCase()}</span>
                                            </div>
                                            {booking.paymentMethod.toLowerCase() === 'cash' && 
                                             booking.paymentStatus.toLowerCase() === 'unpaid' && 
                                             booking.status.toLowerCase() !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleMarkAsPaid(booking.id)}
                                                    disabled={isMarkingPaid === booking.id}
                                                    className="mt-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium disabled:opacity-50 flex items-center gap-1 transition-colors w-max"
                                                >
                                                    ✓ {isMarkingPaid === booking.id ? t.loading : (t.markPaid || 'Mark Paid')}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {['pending', 'confirmed'].includes(booking.status) && (
                                                <button
                                                    onClick={() => openCancelModal(booking.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                                                >
                                                    {t.cancel}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && bookings.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            {t.showing} {t.page} <span className="font-medium">{pagination.page}</span> {t.of} <span className="font-medium">{pagination.totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.previous}
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.next}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{t.cancelBooking}</h3>
                        <p className="text-gray-600 mb-4">
                            {t.confirmCancellation}
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.cancelReason} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                                rows={3}
                                placeholder={t.cancelReason}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                disabled={!cancelReason.trim() || isCancelling}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isCancelling ? t.cancelling : t.confirmCancellation}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
