'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  // A boolean check for whether the user is logged in
  const isUserLoggedIn = !!session?.user;

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);

  return (
    <nav className="fixed bg-white flex justify-between items-center w-full mb-16 py-3 px-4 sm:px-6 lg:px-8 z-10 h-16">
      {/* Logo */}
      <Link href="/" className="flex gap-2 items-center">
         <i className="fa-regular fa-compass text-2xl text-red-500"></i>
        <p className="text-2xl font-bold text-red-500 hidden sm:block">WanderLust</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center">
        {/* Always visible links */}
        
        {isUserLoggedIn ? (
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/listings/new" className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition">
              Add New Listing
            </Link>
            <button type="button" onClick={() => signOut()} className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition">
              Sign Out
            </button>
            <Link href="/my-bookings">
              <Image
                src={session.user.image || `https://placehold.co/37x37/EFEFEF/333333?text=${session.user.name?.[0] || 'U'}`}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition ml-4"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {isUserLoggedIn ? (
          <div className="flex">
            <Image
              src={session.user.image || `https://placehold.co/37x37/EFEFEF/333333?text=${session.user.name?.[0] || 'U'}`}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              <div className="absolute right-0 top-full mt-3 w-full p-5 rounded-lg bg-white min-w-[210px] flex flex-col gap-2 justify-end items-end border shadow-lg">
                <Link href="/my-bookings" className="text-sm text-gray-700 hover:text-red-500 font-medium" onClick={() => setToggleDropdown(false)}>
                  My Bookings
                </Link>
                <Link href="/listings/new" className="text-sm text-gray-700 hover:text-red-500 font-medium" onClick={() => setToggleDropdown(false)}>
                  Add New Listing
                </Link>
                <button
                  type="button"
                  className="mt-5 w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition"
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
}
