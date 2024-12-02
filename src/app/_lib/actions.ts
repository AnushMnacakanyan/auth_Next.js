"use server"

import { redirect } from "next/navigation"
import { createSession, getUserByLogin, getUserByToken, insertUser, updateToken } from "./model"
import bcrypt from "bcrypt"
import { nanoid } from "nanoid"
import { Session } from "inspector/promises"
import { cookies } from "next/headers"
import { IUser } from "./types"

interface IState {
    message: string
}

export const handleSignup = async (prevState: IState, form: FormData) => {
    const name = form.get("name") as string
    const surname = form.get("surname") as string
    const login = form.get("login") as string
    let password = form.get("password") as string

    if (!name.trim() || !surname.trim() || !login.trim() || !password.trim()) {
        return { message: "Please fill all the fields" }
    }

    if (password.length < 6) {
        return { message: "Password is too short!!!" }
    }

    const found = getUserByLogin(login)
    if (found) {
        return { message: "Login is busy!" }
    }

    password = await bcrypt.hash(password, 10)

    const result = insertUser({ login, password, name, surname })
    if (result.changes) {
        return redirect("/")
    } else {
        return { message: "Internal server error!" }
    }
}

export const handleLogin = async (state: IState, form: FormData) => {
    const login = form.get("login") as string
    const password = form.get("password") as string
    const found = getUserByLogin(login)

    if (!found) {
        return { message: "User not found" }
    }

    const result = await bcrypt.compare(password, found.password)

    if (!result) {
        return { message: "Wrong credentials" }
    }

    const token = nanoid()
    createSession(found.id, token);
    (await cookies()).set("token", token)

    return redirect("/Profile")
}



export const handleVerifyUser = async (): Promise<IUser | null> => {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
        return null;
    }
    const user = getUserByToken(token); 
    if (!user || Date.now() >= user.expires) {
        (await cookies()).delete("token");
        return null; 
    }


    updateToken(token, Date.now() + 60_000 );

    return user; 
};
