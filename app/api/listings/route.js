// File: app/api/listings/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; 
import { connectToDB } from "@utils/database";
import Listing from "../../../models/listing";

export const POST = async (request) => {
    try {
        await connectToDB();
        
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // --- ADDED DEBUGGING STEP ---
        // Let's log the specific email value to be 100% sure what it is.
        const userEmail = session.user.email;
        console.log("Email from session:", userEmail);

        // Also, let's add a hard check to ensure it's a valid string.
        if (typeof userEmail !== 'string' || userEmail.length === 0) {
            return NextResponse.json({ success: false, error: "User email is missing or invalid in session." }, { status: 400 });
        }

        const listingData = await request.json();

        const dataToSave = {
            title: listingData.title,
            description: listingData.description,
            image: listingData.image,
            price: listingData.price,
            location: listingData.location,
            country: listingData.country,
            ownerEmail: userEmail
        };

        const newListing = await Listing.create(dataToSave);
        
        return NextResponse.json({ success: true, data: newListing }, { status: 201 });

    } catch (error) {
        console.error("Error creating listing:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};

export const GET = async () => {
    try {
        await connectToDB();
        const listings = await Listing.find({});
        return NextResponse.json({ success: true, data: listings }, { status: 200 });
    } catch (error) {
        console.error("Error fetching listings:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch listings" }, { status: 500 });
    }
};
