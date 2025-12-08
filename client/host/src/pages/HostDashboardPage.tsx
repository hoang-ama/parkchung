import { useState, useEffect } from 'react';

// ============ Types ============
interface OverviewStats {
    totalRevenueMonth: number;
    totalBookingsMonth: number;
    occupancyRate: number; // 0–1
    spotsCount: number;
}

interface HostBooking {
    id: string;
    spotName: string;
    customerName: string;
    startTime: string; // ISO
    endTime: string;   // ISO
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

// ============ API Helpers ============
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchOverviewStats(): Promise<OverviewStats> {
    const response = await fetch(`${API_BASE_URL}/host/analytics/overview`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch overview stats');
    }

    return response.json();
}

async function fetchRecentBookings(limit: number = 5): Promise<HostBooking[]> {
    const response = await fetch(`${API_BASE_URL}/host/bookings?limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('hostToken')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }

    const result = await response.json();
    // API returns { data: [...], pagination: {...} }
    // Extract the data array, or return empty array if not present
    return Array.isArray(result) ? result : (result.data || []);
}

// ============ Mock Data (fallback for development) ============
const mockOverviewStats: OverviewStats = {
    totalRevenueMonth: 12500000,
    totalBookingsMonth: 47,
    occupancyRate: 0.72,
    spotsCount: 5,
};

const mockBookings: HostBooking[] = [
    {
        id: '1',
        spotName: '123 Nguyen Hue, District 1',
        customerName: 'Nguyen Van A',
        startTime: '2025-12-04T08:00:00Z',
        endTime: '2025-12-04T12:00:00Z',
        totalPrice: 120000,
        status: 'confirmed',
    },
    {
        id: '2',
        spotName: '45 Le Loi, District 1',
        customerName: 'Tran Thi B',
        startTime: '2025-12-04T14:00:00Z',
        endTime: '2025-12-04T18:00:00Z',
        totalPrice: 160000,
        status: 'pending',
    },
    {
        id: '3',
        spotName: '123 Nguyen Hue, District 1',
        customerName: 'Le Van C',
        startTime: '2025-12-03T09:00:00Z',
        endTime: '2025-12-03T17:00:00Z',
        totalPrice: 320000,
        status: 'completed',
    },
    {
        id: '4',
        spotName: '78 Hai Ba Trung, District 3',
        customerName: 'Pham Thi D',
        startTime: '2025-12-03T10:00:00Z',
        endTime: '2025-12-03T14:00:00Z',
        totalPrice: 200000,
        status: 'cancelled',
    },
    {
        id: '5',
        spotName: '45 Le Loi, District 1',
        customerName: 'Hoang Van E',
        startTime: '2025-12-02T08:00:00Z',
        endTime: '2025-12-02T20:00:00Z',
        totalPrice: 480000,
        status: 'completed',
    },
];

// ============ Helper Functions ============
function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN') + ' VND';
}

function getStatusBadgeClasses(status: HostBooking['status']): string {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
        case 'confirmed':
            return `${baseClasses} bg-green-100 text-green-700`;
        case 'pending':
            return `${baseClasses} bg-yellow-100 text-yellow-700`;
        case 'completed':
            return `${baseClasses} bg-blue-100 text-blue-700`;
        case 'cancelled':
            return `${baseClasses} bg-red-100 text-red-700`;
        default:
            return `${baseClasses} bg-gray-100 text-gray-700`;
    }
}

// ============ Stat Card Component ============
interface StatCardProps {
    icon: string;
    label: string;
    value: string | number;
    subtext?: string;
}

function StatCard({ icon, label, value, subtext }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subtext && (
                        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
                    )}
                </div>
                <span className="text-3xl">{icon}</span>
            </div>
        </div>
    );
}

// ============ Loading Skeleton Components ============
function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}

function TableRowSkeleton() {
    return (
        <tr className="animate-pulse">
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
        </tr>
    );
}

// ============ Main Dashboard Component ============
export default function HostDashboardPage() {
    const [overview, setOverview] = useState<OverviewStats | null>(null);
    const [bookings, setBookings] = useState<HostBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data on mount
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            setError(null);

            try {
                const [overviewData, bookingsData] = await Promise.all([
                    fetchOverviewStats(),
                    fetchRecentBookings(5),
                ]);
                setOverview(overviewData);
                setBookings(bookingsData);
            } catch (err) {
                console.warn('API not available, using mock data:', err);
                // Fallback to mock data in development
                setOverview(mockOverviewStats);
                setBookings(mockBookings);
                // Optionally set error for production:
                // setError('Failed to load dashboard data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <div className="p-4 lg:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, <span className="text-emerald-600">Host Partner</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's what's happening with your parking spots today.
                </p>
            </div>

            {/* Dashboard Content */}
            <main className="flex-1 p-4 lg:p-8 overflow-auto">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 text-sm">{error}</span>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    {isLoading ? (
                        <>
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </>
                    ) : overview ? (
                        <>
                            <StatCard
                                icon="💰"
                                label="Revenue this month"
                                value={formatCurrency(overview.totalRevenueMonth)}
                            />
                            <StatCard
                                icon="📅"
                                label="Bookings this month"
                                value={overview.totalBookingsMonth}
                                subtext="Total confirmed bookings"
                            />
                            <StatCard
                                icon="📈"
                                label="Occupancy rate"
                                value={`${Math.round(overview.occupancyRate * 100)}%`}
                                subtext="Average across all spots"
                            />
                            <StatCard
                                icon="🅿️"
                                label="Active spots"
                                value={overview.spotsCount}
                                subtext="Approved and visible"
                            />
                        </>
                    ) : null}
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
                        <p className="text-sm text-gray-500">Latest booking activity across your parking spots</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Spot
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <>
                                        <TableRowSkeleton />
                                        <TableRowSkeleton />
                                        <TableRowSkeleton />
                                        <TableRowSkeleton />
                                        <TableRowSkeleton />
                                    </>
                                ) : bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <span className="text-4xl mb-2">📭</span>
                                                <p>No bookings yet</p>
                                                <p className="text-sm text-gray-400">Your recent bookings will appear here</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking, index) => (
                                        <tr
                                            key={booking.id}
                                            className={`hover:bg-gray-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : ''
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                                                    {booking.spotName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700">{booking.customerName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700">
                                                    <div>{formatDateTime(booking.startTime)}</div>
                                                    <div className="text-xs text-gray-400">
                                                        to {formatDateTime(booking.endTime)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(booking.totalPrice)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={getStatusBadgeClasses(booking.status)}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* View All Link */}
                    {bookings.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100">
                            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                <a href="/host/bookings">View all bookings →</a>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
