// File: app/my-bookings/page.jsx

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// A simple booking type for clarity
/**
 * @typedef {Object} Booking
 * @property {string} _id
 * @property {string} listingId
 * @property {string} listingTitle
 * @property {string} listingLocation
 * @property {string} listingImage
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} price
 */

export default function MyBookingsPage() {
    const { data: session, status } = useSession();
    /** @type {[Booking[], Function]} */
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/bookings')
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then((data) => {
                    // FIX: Correctly access the 'data' property from the API response
                    if (data.success) {
                        setBookings(data.data || []);
                    } else {
                        throw new Error(data.error || 'Failed to fetch bookings');
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        }
        if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status]);

    const handleCancelClick = (booking) => {
        setBookingToCancel(booking);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;

        try {
            const res = await fetch(`/api/bookings/${bookingToCancel._id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to cancel booking');
            }
            
            setBookings(currentBookings =>
                currentBookings.filter(b => b._id !== bookingToCancel._id)
            );

        } catch (err) {
            alert(err.message);
        } finally {
            setIsModalOpen(false);
            setBookingToCancel(null);
        }
    };

    if (status === 'loading' || loading) {
        return <div className="text-center py-10">Loading your bookings...</div>;
    }

    if (status !== 'authenticated') {
        return <div className="text-center py-10">Please log in to see your bookings.</div>;
    }
    
    if (error) {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    if (bookings.length === 0) {
        return <div className="text-center py-10">You have no bookings yet.</div>;
    }

    return (
        <>
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h1>
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="flex flex-col md:flex-row bg-white border rounded-lg shadow-sm overflow-hidden">
                            <div className="md:w-1/3 h-48 md:h-auto relative">
                                <Image
                                    src={booking.listingImage || 'https://images.unsplash.com/photo-1652820330085-82a0c2b88d78?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                                    alt={`Image of ${booking.listingTitle}`}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className="p-6 flex flex-col justify-between md:w-2/3">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">{booking.listingTitle}</h2>
                                    <p className="text-gray-600 mt-1">{booking.listingLocation}</p>
                                    <div className="mt-4 text-sm text-gray-700">
                                        <p>
                                            <span className="font-medium">From:</span> {new Date(booking.startDate).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <span className="font-medium">To:</span> {new Date(booking.endDate).toLocaleDateString()}
                                        </p>
                                        <p className="mt-2 text-lg font-bold">
                                            Total: ₹{booking.price.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={() => handleCancelClick(booking)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cancellation Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                        <p className="mb-6">Do you really want to cancel your booking for <br/><b>{bookingToCancel?.listingTitle}</b>?</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-md border">
                                Nevermind
                            </button>
                            <button onClick={handleConfirmCancel} className="px-6 py-2 rounded-md bg-red-600 text-white">
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
