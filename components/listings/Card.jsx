import Link from 'next/link';

export default function Card({ listing }) {
  return (
    <Link href={`/listings/${listing._id}`} className="no-underline">
      <div className="rounded-lg shadow overflow-hidden relative group">
        <img
          src={listing.image?.url}
          alt={listing.title}
          className="w-full h-80 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition" />
        <div className="p-4">
          <p className="text-gray-800 font-medium">
            <b>{listing.title}</b><br />
            ₹{Number(listing.price).toLocaleString('en-IN')} /night
          </p>
        </div>
      </div>
    </Link>
  );
}