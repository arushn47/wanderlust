import Listing from '@models/listing';
import { connectToDB } from '@utils/database';
import mongoose from 'mongoose';

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    params = await params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response('Invalid listing ID', { status: 400 });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return new Response('Listing not found', { status: 404 });
    }

    return new Response(JSON.stringify(listing), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/listings/[id] error:', error);
    return new Response('Failed to fetch listing', { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response('Invalid listing ID', { status: 400 });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return new Response('Listing not found', { status: 404 });
    }

    await Listing.findByIdAndDelete(id);

    return new Response('Listing deleted', { status: 200 });
  } catch (error) {
    console.error('DELETE /api/listings/[id] error:', error);
    return new Response('Failed to delete listing', { status: 500 });
  }
};