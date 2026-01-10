import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post("/", authMiddleware, bookingControllers.createBooking);
router.get("/", authMiddleware, bookingControllers.getBookings);
router.put("/:bookingId", authMiddleware, bookingControllers.updateBooking);

export const bookingRoutes = router;
