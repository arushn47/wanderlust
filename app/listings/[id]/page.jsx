'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

async function getListing(id) {
  const res = await fetch(`/api/listings/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch listing');
  return res.json();
}

export default function ShowListingPage() {
  const params = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [listing, setListing] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    if (params?.id) {
      getListing(params.id)
        .then(setListing)
        .catch(console.error);
    }
  }, [params?.id]);

  if (!listing) return <div className="text-center py-10">Loading listing...</div>;
  if (status === 'loading') return <div>Loading user session...</div>;

  const isOwner = session?.user?.email && listing.ownerEmail === session.user.email;

  const handleBooking = async () => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing._id,
          listingTitle: listing.title,
          listingLocation: listing.location,
          listingImage: listing.image.url,
          startDate: '2025-08-10', // Replace with real date picker input
          endDate: '2025-08-12',
          price: listing.price,
        }),
      });

      if (!res.ok) throw new Error('Failed to book');

      const data = await res.json();
      console.log('Booking successful:', data);
      router.push('/my-bookings'); // or show success message
    } catch (err) {
      console.error(err);
      alert('Booking failed');
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <img
        src={listing.image?.url}
        alt={listing.title}
        className="w-full h-[40vh] object-cover rounded-lg mb-6"
      />

      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-wanderlustRed">{listing.title}</h2>
        <p className="text-gray-700 text-lg">₹{listing.price.toLocaleString('en-IN')} /night</p>
        <p className="text-gray-600">{listing.description}</p>
        <p className="text-sm text-gray-500">Located in {listing.location}, {listing.country}</p>

        {isOwner ? (
          <div className="flex gap-4 mt-6">
            <button
              onClick={async () => {
                if (!confirm('Are you sure you want to delete this listing?')) return;
                await fetch(`/api/listings/${params.id}`, { method: 'DELETE' });
                router.push('/');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>

            <button
              onClick={() => router.push(`/listings/${params.id}/edit`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <button
              onClick={handleBooking}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Book Now
            </button>
            {bookingMessage && (
              <p className="mt-2 text-sm text-gray-700">{bookingMessage}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}