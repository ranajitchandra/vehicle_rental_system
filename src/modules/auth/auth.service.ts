import { pool } from "../../config/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import config from "../../config"

const loginUserQurey = async (email: string, password: string) => {
    // find user
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
    if (result.rows.length === 0) {
        return null
    }

    const user = result.rows[0]
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
        return false
    }

    
    const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.jwtSecret as string, {
        expiresIn: "1d",
    })
    console.log(token);
    

    return { token, user }
}

export const authServices = {
    loginUserQurey,
}