// File: app/api/bookings/[id]/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectToDB } from "@utils/database";
import Booking from "@models/booking"; // Make sure you have a Booking model

export async function DELETE(request, { params }) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        // 1. Check if the user is authenticated
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }
        
        params = await params;
        const { id } = params; // This is the ID of the booking to delete

        // 2. Find the booking in the database
        const booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
        }

        // 3. IMPORTANT: Check if the authenticated user is the owner of the booking
        // This is where the 403 Forbidden error comes from if the emails don't match.
        if (booking.userEmail !== session.user.email) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        // 4. If all checks pass, delete the booking
        await Booking.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Booking cancelled successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error cancelling booking:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
