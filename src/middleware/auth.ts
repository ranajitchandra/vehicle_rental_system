// higher order Fn is return a Fn

import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

// This is higher order function
const auth = (...roles: string[]) => {
    
    
    // this is inner function
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            console.log("Auth Middleware Token----", token);

            if (!token) {
                return res.status(500).json({ message: "Not Allowed" })
            }

            const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload
            console.log({ decoded });
            
            // to set decoded into >>> req, and the decoded type is JwtPayload, it is say jwt
            req.user = decoded

            // ["admin"] check from roles
            if(roles.length && !roles.includes(decoded.role as string)){
                return res.status(500).json({
                    error: "Unauthorized!!"
                })
            }

            next()
            
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message })
        }
    }
}

export default auth;