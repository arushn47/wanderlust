// File: app/api/bookings/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDB } from "@utils/database";
import Booking from "@models/booking"; // Ensure you have a Booking model

/**
 * Handles GET requests to fetch bookings for the authenticated user.
 */
export async function GET(request) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Using session.user.id is more robust than using email.
        const bookings = await Booking.find({ userId: session.user.id });

        return NextResponse.json({ success: true, data: bookings }, { status: 200 });

    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}

/**
 * Handles POST requests to create a new booking.
 */
export async function POST(request) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { listingId, listingTitle, listingLocation, listingImage, startDate, endDate, price } = await request.json();

        const newBooking = new Booking({
            userId: session.user.id,
            // --- FIX: Add the user's email from the session ---
            userEmail: session.user.email,
            listingId,
            listingTitle,
            listingLocation,
            listingImage,
            startDate,
            endDate,
            price,
        });

        await newBooking.save();

        return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
    } catch (error) {
        console.error("Booking creation error:", error);
        return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 });
    }
}
