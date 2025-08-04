import Card from '@components/listings/Card';

async function getListings() {
  try {
    const res = await fetch('http://localhost:3000/api/listings', { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`Failed to fetch listings: ${res.status}`);
    }

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export default async function HomePage() {
  const listings = await getListings();

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 ">
      <section>
        {listings.length === 0 ? (
          <p className="text-gray-500">No listings available right now. Please check back later.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Card key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}