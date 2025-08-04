'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams();
    const cardId = params?.id;

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        country: '',
        image: {
            url: ''
        }
    });

    useEffect(() => {
        const fetchListing = async () => {
            const res = await fetch(`/api/listings/${cardId}`);
            const data = await res.json();
            setForm(data);
        };
        if (cardId) fetchListing();
    }, [cardId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const { value } = e.target;
        setForm((prev) => ({
            ...prev,
            image: { ...prev.image, url: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/api/listings/${cardId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        router.push(`/listings/${cardId}`);
    };

    return (
        <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded shadow">
            <h1 className="text-3xl font-semibold text-wanderlustRed mb-6">Edit Listing</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {[
                    { label: 'Title', name: 'title', type: 'text' },
                    { label: 'Price (₹)', name: 'price', type: 'number' },
                    { label: 'Location', name: 'location', type: 'text' },
                    { label: 'Country', name: 'country', type: 'text' },
                ].map(({ label, name, type }) => (
                    <div key={name}>
                        <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
                            {label}
                        </label>
                        <input
                            id={name}
                            name={name}
                            type={type}
                            value={form[name]}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wanderlustRed"
                            required
                        />
                    </div>
                ))}

                <div>
                    <label htmlFor="imageUrl" className="block font-medium text-gray-700 mb-1">
                        Image URL
                    </label>
                    <input
                        id="imageUrl"
                        type="text"
                        value={form.image?.url}
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wanderlustRed"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wanderlustRed"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#d64545] hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                    Update Listing
                </button>
            </form>
        </div>
    );
}