"use client";

import { useRouter } from 'next/navigation';
import React from 'react';
interface IProps {
    children: React.ReactNode;
}

export default function Layout({ children }: IProps) {
    const navigate = useRouter()
    const handleLogout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate.push("/login")
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-green-900 text-white">
            <nav className="flex items-center justify-between px-8 py-4 bg-purple-800 shadow-md">
                <div className="text-2xl font-bold">MyApp</div>
                <ul className="flex space-x-6">
                    <li className="hover:text-green-300 transition-all duration-300">
                        <a href="#profile">Profile</a>
                    </li>
                    <li className="hover:text-green-300 transition-all duration-300">
                        <a href="#settings">Settings</a>
                    </li>
                    <li className="hover:text-green-300 transition-all duration-300">
                        <a href="#photos">Photos</a>
                    </li>
                    <li className="hover:text-green-300 transition-all duration-300">
                        <a href="#posts">Posts</a>
                    </li>
                    <li className="hover:text-green-300 transition-all duration-300">
                        <a href="#more">More</a>
                    </li>
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>

            <main className="px-8 py-12">{children}</main>
        </div>
    );
}
