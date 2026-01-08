
import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";

const router = express.Router()

// create users
router.post("/", userControllers.createUser)

// all users
router.get("/", logger, auth("admin"), userControllers.getUsers)

// single users
router.get("/:id", auth("admin", "user"), userControllers.getSingleUser)

// update users
router.put("/:id", userControllers.updateUser)

//  delete users
router.delete("/:id", userControllers.deleteUser)


export const userRoutes = router;

