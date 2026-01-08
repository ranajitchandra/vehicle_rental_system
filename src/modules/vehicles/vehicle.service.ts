import { pool } from "../../config/db";

const createVehicle = async (payload: { vehicle_name: string; type: "car" | "bike" | "van" | "SUV"; registration_number: string; daily_rent_price: number; availability_status: "available" | "booked" }) => {
    const result = await pool.query(
    `INSERT INTO vehicles 
    (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, [ payload.vehicle_name, payload.type, payload.registration_number, payload.daily_rent_price, payload.availability_status ] );

    return result.rows[0];
};

const getAllVehicles = async () => {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
    return result.rows;
};

const getVehicleById = async (vehicleId: number) => {
    const result = await pool.query(
        "SELECT * FROM vehicles WHERE id = $1",
        [vehicleId]
    );
    return result.rows[0];
};

const updateVehicle = async (
  vehicleId: number,
  payload: { vehicle_name?: string; type?: "car" | "bike" | "van" | "SUV"; registration_number?: string; daily_rent_price?: number; availability_status?: "available" | "booked" }) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `
    UPDATE vehicles SET
    vehicle_name = COALESCE($1, vehicle_name),
    type = COALESCE($2, type),
    registration_number = COALESCE($3, registration_number),
    daily_rent_price = COALESCE($4, daily_rent_price),
    availability_status = COALESCE($5, availability_status),
    updated_at = NOW()
    WHERE id = $6
    RETURNING *
    `,
    [
      vehicle_name ?? null,        
      type ?? null,                
      registration_number ?? null, 
      daily_rent_price ?? null,    
      availability_status ?? null, 
      vehicleId,                   
    ]
  );

  return result.rows[0];
};


const deleteVehicle = async (vehicleId: number) => {
    const activeBooking = await pool.query(`SELECT id FROM bookings WHERE vehicle_id = $1 AND status = 'active'`, [vehicleId]);

    if (activeBooking.rowCount) {
        throw new Error("Vehicle has active bookings");
    }

    await pool.query("DELETE FROM vehicles WHERE id = $1", [vehicleId]);
};

export const VehicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
