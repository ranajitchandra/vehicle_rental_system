import { pool } from "../../config/db";

const dateDiffInDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const bookingService = {
    // 11. Create Booking
    async createBooking(payload: { customer_id: number; vehicle_id: number; rent_start_date: string; rent_end_date: string }) {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

        // check vehicle
        const vehicleRes = await pool.query(
            `SELECT id, vehicle_name, daily_rent_price, availability_status
       FROM vehicles WHERE id = $1`,
            [vehicle_id]
        );

        if (vehicleRes.rowCount === 0) {
            throw new Error("Vehicle not found");
        }

        const vehicle = vehicleRes.rows[0];

        if (vehicle.availability_status !== "available") {
            throw new Error("Vehicle is not available");
        }

        const days = dateDiffInDays(rent_start_date, rent_end_date);
        if (days <= 0) {
            throw new Error("Invalid rental period");
        }

        const totalPrice = Number(vehicle.daily_rent_price) * days;

        // create booking
        const bookingRes = await pool.query(
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
        );

        // update vehicle status
        await pool.query(
            `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
            [vehicle_id]
        );

        return {
            ...bookingRes.rows[0],
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: vehicle.daily_rent_price
            }
        };
    },

    // 12. Get All Bookings
    async getBookings(user: any) {
        if (user.role === "admin") {
            const res = await pool.query(`SELECT  b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, u.name AS customer_name, u.email AS customer_email, v.vehicle_name, v.registration_numbe FROM bookings  JOIN users u ON b.customer_id = u.i JOIN vehicles v ON b.vehicle_id = v.i ORDER BY b.created_at DESC`);

            return res.rows.map(row => ({
                id: row.id,
                customer_id: row.customer_id,
                vehicle_id: row.vehicle_id,
                rent_start_date: row.rent_start_date,
                rent_end_date: row.rent_end_date,
                total_price: row.total_price,
                status: row.status,
                customer: {
                    name: row.customer_name,
                    email: row.customer_email
                },
                vehicle: {
                    vehicle_name: row.vehicle_name,
                    registration_number: row.registration_number
                }
            }));
        }

        // customer view
        const res = await pool.query(
            `SELECT b.id, b.vehicle_id,b.rent_start_date, b.rent_end_date,b.total_price, b.status,v.vehicle_name, registration_number, v.type FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id WHERE b.customer_id = $1 ORDER BY b.created_at DESC`,
            [user.id]
        );

        return res.rows.map(row => ({
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type
            }
        }));
    },

    // 13. Update Booking
    async updateBooking(bookingId: number, status: string, user: any) {
        const bookingRes = await pool.query(
            `SELECT * FROM bookings WHERE id = $1`,
            [bookingId]
        );

        if (bookingRes.rowCount === 0) {
            throw new Error("Booking not found");
        }

        const booking = bookingRes.rows[0];

        // customer cancellation rule
        if (status === "cancelled") {
            if (user.role !== "customer" || booking.customer_id !== user.id) {
                throw new Error("Forbidden");
            }

            if (new Date(booking.rent_start_date) <= new Date()) {
                throw new Error("Cannot cancel after rental start");
            }
        }

        // admin return rule
        if (status === "returned" && user.role !== "admin") {
            throw new Error("Forbidden");
        }

        const updatedRes = await pool.query(
            `UPDATE bookingsSET status = $1, updated_at = NOW()WHERE id = $2RETURNING *`,
            [status, bookingId]
        );

        // update vehicle availability
        if (status === "returned" || status === "cancelled") {
            await pool.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
                [booking.vehicle_id]
            );
        }

        return updatedRes.rows[0];
    }
};
