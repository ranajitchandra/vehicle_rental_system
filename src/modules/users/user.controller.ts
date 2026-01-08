import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    

    try {
        const result = await userServices.createUserQuery(req.body)
        console.log(result.rows[0]);
        res.status(201).json({ success: true, message: "data inserted successfully", data: result.rows[0] })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getUsers = async (req: Request, res: Response) => {

    try {
        const result = await userServices.getAllUserQuery()
        res.status(200).json({
            success: true,
            message: "Users Retrived Successfully",
            data: result.rows,
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getSingleUser = async (req: Request, res: Response) => {

    try {
        const result = await userServices.getSingleUserQuery(req.params.id)
        if (result.rows.length > 0) {
            res.status(200).json({
                success: true,
                message: "User get successfully",
                data: result.rows[0]
            })
        } else {
            res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        console.log(result);

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const updateUser = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    const { name, email } = req.body

    try {
        const result = await userServices.updateUserQuery(name, email, req.params.id)
        if (result.rows.length > 0) {
            res.status(200).json({
                success: true,
                message: "User Updated successfully",
                data: result.rows[0]
            })
        } else {
            res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        console.log(result);

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }

}

const deleteUser = async (req: Request, res: Response) => {
    // console.log(req.params.id);

    try {

        const result = await userServices.deleteUserQuery(req.params.id)
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User Deleted successfully",
                data: result.rows
            })
        }
        console.log(result);


    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }

}


export const userControllers = {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
}