// src/modules/users/user.controller.ts
import { Request, Response } from "express";
import { userService } from "./user.service";

// Payload type for updateUser
type UpdateUserPayload = {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
};

// Get all users
 const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update a user
 const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, email, phone, role } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const id = parseInt(userId, 10);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    try {
        // Admin can update anyone; customer only own profile
        if (req.user?.role !== "admin" && req.user?.id !== id) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        // Customer cannot update role
        if (req.user?.role !== "admin" && role) {
            return res.status(403).json({ success: false, message: "Cannot update role" });
        }

        const payload: UpdateUserPayload = { name, email, phone };
        if (req.user?.role === "admin" && role) {
            payload.role = role;
        }

        const updatedUser = await userService.updateUser(id, payload);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete a user
 const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const id = parseInt(userId, 10);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    try {
        await userService.deleteUser(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const userController = {
    getUsers,
    updateUser,
    deleteUser
}