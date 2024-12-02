import db from 'better-sqlite3'
import { InputUser, IUser } from './types'
import { handleLogin } from './actions'
const sql = new db('auth.db')

export const getUserByLogin = (login: string): (IUser | null) => {
    const user = sql.prepare("SELECT * FROM users where login = ?").get(login)
    if (user) {
        return user as IUser
    }
    return null
}

export const getAllUsers = () => {
    return sql.prepare("SELECT * FROM users").all()
}

export const insertUser = (user: InputUser): db.RunResult => {
    return sql.prepare(`INSERT INTO users(name, surname, login, password)
                        VALUES(@name, @surname, @login, @password)                    
    `).run(user)
}

export const createSession = (user: number, token: string) => {
    return sql.prepare(` INSERT INTO session(id,user_id,expires)
        VALUES(?,?,?)
        `).run(token, user, Date.now() + 50000)
}


export const getUserByToken = (token: string): (IUser & { expires: number }) | null => {
    const query = `
      SELECT users.*, session.expires 
      FROM users 
      JOIN session ON session.user_id = users.id 
      WHERE session.id = ?;
    `;

    const user = sql.prepare(query).get(token);

    return user ? (user as IUser & { expires: number }) : null;
};


export const updateToken = (token: string, newExpiry: number): void => {
    const query = `
      UPDATE session 
      SET expires = ? 
      WHERE id = ?;
    `;

    sql.prepare(query).run(newExpiry, token);
};