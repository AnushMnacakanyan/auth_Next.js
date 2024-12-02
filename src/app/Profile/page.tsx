"use client"
import { useEffect, useState } from "react";
import { IUser } from "../_lib/types";
import { handleVerifyUser } from "../_lib/actions";
import { useRouter } from "next/navigation";

export default function Profile() {
    const [user, setUser] = useState<IUser | null>(null);
    const navigate = useRouter()

    useEffect(() => {
        handleVerifyUser()
            .then((res) => {
                if (res) {
                    setUser(res)
                } else {
                    navigate.push("/")
                }
            })
            .catch(() => navigate.push("/"))
    }, [navigate]);


    return (
        <div className="max-w-sm mx-auto bg-gradient-to-br from-green-900 to-purple-900 p-8 rounded-xl shadow-lg text-center text-white">
            <img
                src=""
                alt="Profile"
                className="w-32 h-32 mx-auto rounded-full border-4 border-purple-400 shadow-md"
            />
            <h1 className="mt-4 text-2xl font-bold text-purple-200">{user?.name} {user?.surname}</h1>
        </div>
    );
}
