// src/modules/users/user.route.ts
import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
import { userController } from "./user.controller";

const router = Router();

// GET all users - Admin only
router.get("/", authMiddleware, roleMiddleware(["admin"]), userController.getUsers);

// PUT update user - Admin or Own
router.put("/:userId", authMiddleware, userController.updateUser);

// DELETE user - Admin only
router.delete("/:userId", authMiddleware, roleMiddleware(["admin"]), userController.deleteUser);

export const userRoutes = router;
