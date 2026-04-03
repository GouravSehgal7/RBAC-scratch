import "dotenv/config"
import jwt from "jsonwebtoken"
import{prisma} from "../lib/prismaAdaptor.js"
export const isauth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await prisma.userData.findUnique({
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
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};