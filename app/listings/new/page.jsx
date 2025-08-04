'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NewListingPage() {
  const router = useRouter();
  const { data: session } = useSession(); // <-- get current session
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!session?.user?.email) {
      alert('You must be logged in to create a listing');
      return;
    }

    const body = { ...formData, ownerEmail: session.user.email };

    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) router.push('/');
    else alert('Failed to create listing');
  };

  if (!session) {
    return <p className="text-center py-10">Please log in to create a listing.</p>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Add New Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (INR)"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.country}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.image}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-[#d64545] text-white px-6 py-2 rounded hover:bg-red-500 transition"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}