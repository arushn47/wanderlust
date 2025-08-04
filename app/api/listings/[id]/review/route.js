// File: app/api/listings/[id]/reviews/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { handler } from "@auth/[...nextauth]/route";
import { connectToDB } from "@utils/database";
import Listing from "@models/listing";
import Review from "@models/review";

export async function POST(request, { params }) {
    try {
        await connectToDB();
        
        const session = await getServerSession(handler);
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const reviewData = await request.json();

        const listing = await Listing.findById(id);
        if (!listing) {
            return NextResponse.json({ success: false, error: "Listing not found." }, { status: 404 });
        }

        const newReview = new Review({
            ...reviewData,
            ownerEmail: session.user.email 
        });

        await newReview.save();
        
        // Example of how you might push the new review's ID to the listing
        listing.reviews.push(newReview._id);
        await listing.save();
        
        return NextResponse.json({ success: true, data: newReview }, { status: 201 });

    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
