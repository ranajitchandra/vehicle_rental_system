import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";
import config from "../../config";

const SALT_ROUNDS = 10;

const signup = async (payload: { name: string; email: string; password: string; phone: string; role: "admin" | "customer" }) => {
    const { name, email, password, phone, role } = payload;

    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email.toLowerCase()]
    );

    if (existingUser.rowCount) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
        `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
        [name, email.toLowerCase(), hashedPassword, phone, role]
    );

    return result.rows[0];
};

const signin = async (payload: { email: string; password: string }) => {
    const { email, password } = payload;

    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email.toLowerCase()]
    );

    if (!result.rowCount) {
        throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, config.jwtSecret as string, { expiresIn: "2d" }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
    };
};

export const AuthService = {
    signup,
    signin,
};
