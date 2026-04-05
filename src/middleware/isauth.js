import "dotenv/config"
import jwt from "jsonwebtoken"
import{prisma} from "../lib/prismaAdaptor.js"
export const isauth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({
            message: "No authorization header provided"
          });
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message: "No authorization token provided"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                message: "wrong token send"
            });
        }
        const user = await prisma.userData.findUnique({
            where:{
                userid:decoded.id,
            },
            include:{
                role:{
                    include:{
                        rolepermission: true
                    }
                }
            }
        })
        // user.role.name
        req.user = user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(500).json({ message: 'Server error', place : "inside isauth middleware",error : error.message });
    }
};