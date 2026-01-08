import { Request, Response } from "express";
import { VehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await VehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};

const getAllVehicles = async (_req: Request, res: Response) => {
  const vehicles = await VehicleService.getAllVehicles();

  res.status(200).json({
    success: true,
    message: vehicles.length
      ? "Vehicles retrieved successfully"
      : "No vehicles found",
    data: vehicles,
  });
};

const getVehicleById = async (req: Request, res: Response) => {
  const vehicle = await VehicleService.getVehicleById(
    Number(req.params.vehicleId)
  );

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
      errors: "Vehicle not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Vehicle retrieved successfully",
    data: vehicle,
  });
};

const updateVehicle = async (req: Request, res: Response) => {
  const vehicle = await VehicleService.updateVehicle(
    Number(req.params.vehicleId),
    req.body
  );

  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
      errors: "Vehicle not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Vehicle updated successfully",
    data: vehicle,
  });
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await VehicleService.deleteVehicle(Number(req.params.vehicleId));

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};

export const VehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
