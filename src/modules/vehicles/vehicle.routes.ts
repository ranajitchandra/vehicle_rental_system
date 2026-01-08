import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

router.post( "/", authMiddleware, roleMiddleware(["admin"]), VehicleController.createVehicle );

router.get("/", VehicleController.getAllVehicles);

router.get("/:vehicleId", VehicleController.getVehicleById);

router.put( "/:vehicleId", authMiddleware, roleMiddleware(["admin"]), VehicleController.updateVehicle );

router.delete( "/:vehicleId", authMiddleware, roleMiddleware(["admin"]), VehicleController.deleteVehicle );


export const vehicleRoutes = router;
