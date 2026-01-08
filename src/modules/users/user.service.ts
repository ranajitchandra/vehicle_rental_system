import { pool } from "../../config/db"
import bcrypt from "bcryptjs";

const createUserQuery = async(payload: Record<string, unknown>) => {
    const { name, email, role, password } = payload
    const hashPass = await bcrypt.hash(password as string, 10)
    const result = await pool.query(`INSERT INTO users(name, email, role, password) VALUES($1, $2, $3, $4) RETURNING *`, [name, email, role, hashPass]);
    return result;
}

const getAllUserQuery = async() => {
    const result = await pool.query(`SELECT * FROM users`)
    return result;
}

const getSingleUserQuery = async(user_id: any) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
    return result;
}
const updateUserQuery = async(name: string, email: string, user_id: any) => {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id = $3 RETURNING *`, [name, email, user_id]);
    return result;
}

const deleteUserQuery = async(user_id: any) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [user_id]);
    return result;
}

export const userServices = {
    createUserQuery,
    getAllUserQuery,
    getSingleUserQuery,
    updateUserQuery,
    deleteUserQuery
}