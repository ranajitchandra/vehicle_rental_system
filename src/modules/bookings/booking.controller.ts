import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = await bookingService.createBooking(req.body);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getBookings(req.user);

        res.status(200).json({
            success: true,
            message:
                req.user?.role === "admin"
                    ? "Bookings retrieved successfully"
                    : "Your bookings retrieved successfully",
            data: bookings
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.bookingId);
        const { status } = req.body;

        const updated = await bookingService.updateBooking(
            bookingId,
            status,
            req.user
        );

        res.status(200).json({
            success: true,
            message:
                status === "returned"
                    ? "Booking marked as returned. Vehicle is now available"
                    : "Booking cancelled successfully",
            data: updated
        });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const bookingControllers = {
    createBooking,
    getBookings,
    updateBooking
}