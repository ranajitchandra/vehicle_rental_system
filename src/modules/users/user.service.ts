
import { pool } from "../../config/db";

const getAllUsers = async () => {
    const result = await pool.query(`SELECT id, name, email, phone, role, created_at, updated_at FROM users`);
    return result.rows;
};

const getUserById = async (userId: number) => {
    const result = await pool.query(`SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id=$1`, [userId]);
    return result.rows[0];
};

const updateUser = async (userId: number, data: { name?: string; phone?: string; role?: string }) => {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name) {
        fields.push(`name=$${idx++}`);
        values.push(data.name);
    }
    if (data.phone) {
        fields.push(`phone=$${idx++}`);
        values.push(data.phone);
    }
    if (data.role) {
        fields.push(`role=$${idx++}`);
        values.push(data.role);
    }

    if (fields.length === 0) return getUserById(userId);

    values.push(userId);
    const query = `UPDATE users SET ${fields.join(", ")}, updated_at=NOW() WHERE id=$${idx} RETURNING id, name, email, phone, role, created_at, updated_at`;
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteUser = async (userId: number) => {
    const bookingCheck = await pool.query(
        `SELECT COUNT(*) FROM bookings WHERE customer_id=$1 AND status='active'`,
        [userId]
    );
    if (parseInt(bookingCheck.rows[0].count) > 0) {
        throw new Error("Cannot delete user with active bookings");
    }

    const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING id, name, email`, [userId]);
    return result.rows[0];
};

export const userService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}