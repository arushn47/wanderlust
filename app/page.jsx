import Card from '@components/listings/Card';
import { connectToDB } from '@utils/database';
import Listing from '@models/listing';

async function getListings() {
  try {
    await connectToDB();
    const listings = await Listing.find({});
    // Return the plain data. Mongoose documents need to be converted.
    return JSON.parse(JSON.stringify(listings));
  } catch (error) {
    console.error('Error fetching listings directly:', error);
    return [];
  }
}


export default async function HomePage() {
  const listings = await getListings();

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">

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
