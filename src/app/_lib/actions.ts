"use server"

import { redirect } from "next/navigation"
import { createSession, getUserByLogin, getUserByToken, insertUser, updateAttempts, updateTime, updateToken } from "./model"
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
    let attempts = found?.attempts

    if (!login.trim() || !password.trim()) {
        return { message: "Please fill all the fields" }
    }

    if (!found) {
        return { message: "User not found" }
    }


    if (handleBlock(found)) {
        return { message: "Account is blocked" };
    }

    const result = await bcrypt.compare(password, found.password)

    if (!result) {
        ++found.attempts
        if (found.attempts === 3) {
            updateTime(Date.now(), found.id);
            return { message: "Account is blocked due to multiple failed attempts." };
        }
        return { message: "Wrong credentials" }
    }

    updateAttempts(0, found.id);
    updateTime(0, found.id);
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


    updateToken(token, Date.now() + 60_000);

    return user;
};

export const handleBlock = (user: IUser): boolean => {
    const time = 5 * 60 * 1000;

    if (user.attempts >= 3) {
        if (!user.time) {
            updateTime(Date.now(), user.id);
            return true;
        } else if (Date.now() - user.time < time) {
            return true;
        } else {
            updateAttempts(0, user.id);
            updateTime(0, user.id);
            return false;
        }
    }
    return false;
};
