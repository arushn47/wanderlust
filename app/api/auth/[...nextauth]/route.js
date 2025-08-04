// File: app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth environment variables (GOOGLE_ID or GOOGLE_CLIENT_SECRET)");
}

export const authOptions = {
    providers: [
        (GoogleProvider.default || GoogleProvider)({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                try {
                    await connectToDB();
                    const dbUser = await User.findOne({ email: user.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                    }
                } catch (error) {
                    console.error("Error in JWT callback while fetching user:", error);
                }
            }
            return token;
        },
        async signIn({ profile }) {
            try {
                await connectToDB();
                const userExists = await User.findOne({ email: profile.email });

                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(/\s/g, "").toLowerCase(),
                        image: profile.picture,
                    });
                }
                return true;
            } catch (error) {
                console.log("Error in signIn callback: ", error.message);
                return false;
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

// FIX: Use a robust handler initialization that checks for the .default property,
// which is necessary based on your console logs.
const handler = (NextAuth.default || NextAuth)(authOptions);

export { handler as GET, handler as POST };
