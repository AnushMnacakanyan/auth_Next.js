import { NextRequest } from "next/server";
import Db from 'better-sqlite3'

const sql = new Db('auth.db')
export const GET = (req:NextRequest) => {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table")
    const result = sql.prepare("SELECT * FROM " + table).all()
    return Response.json({result})

}