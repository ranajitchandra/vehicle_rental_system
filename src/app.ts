
import express, { Request, Response } from "express";
import initDB from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import path from "path";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";


const app = express()

// middleware body parser
app.use(express.json())
// middleware form data parser
app.use(express.urlencoded())

// initializer DB
initDB()





app.get("/", logger, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "index.html"));
});



// auth Route
app.use("/api/v1/auth", authRoutes)

// user CURD
app.use("/api/v1/users", userRoutes)

//  vwchile crud
app.use("/api/v1/vehicles", vehicleRoutes)

// booking crud
app.use("/api/v1/bookings", bookingRoutes)




// prevent route not exist
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
        path: req.path
    })
})


export default app;