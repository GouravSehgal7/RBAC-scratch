import { STATES } from "mongoose";
import { STATUS } from "../lib/constants.js";
import { prisma } from "../lib/prismaAdaptor.js";


export const isStatusAllowed = (allowedstatus = [])=>{
    return (req,res,next)=>{
        const user = req.user;
        const isAllowed = allowedstatus.includes(user.status);
        if (!isAllowed) {
            return res.status(403).json({
                msg: "You are either blocked or deactivated by admin"
            });
        }
        next();
    }
}

export const isroleallowed = (allowedroles=[])=>{
    return (req,res,next)=>{
        const user = req.user;
        const isAllowed = allowedroles.includes(user.role.name)
        if (!isAllowed) {
            return res.status(403).json({
                msg: "You role does not match with the requirements role"
            });
        }
        next();
    }
}

export const ispermissionallowed = (allowedpermission=[])=>{
    return (req,res,next)=>{
        const user = req.user;
        const haspermission = user.role.rolepermission.some(p => 
            allowedpermission.includes(`${p.attribute}:${p.action}`)
        );
        if (!haspermission) {
            return res.status(403).json({
                msg: "Permission denied"
            });
        }
        next();
    }
}

export const accessdashboarddataread=(req,res,next)=>{
    const user = req.user;
    if(user?.status === STATUS.block){
        return res.status(403).json({
            msg: "Blocked users cannot access"
        });
    }
    if (user.status === STATUS.active) {
        return next();
    }
    if(user.status === STATUS.inactive &&user.role.name === ROLES.ANALYST){
        return next();
    }
    return res.status(403).json({
        msg: "Access denied based on role & status"
    });
}

export const isloginallowed = async (req,res,next)=>{
    const {email} = req.body;
    try {
        const user = await prisma.userAuth.findUnique({
            where:{
                email:email
            },
            include:{
                userdata:true
            }
        })
        const status = user.userdata.status;
        if(status === STATUS.block){
            return res.status(403).json({
                msg: "Blocked users cannot access"
            });
        }
        return next()
    } catch (error) {
        return res.status(500).json({
            success : false,
            place:"error at isloginallowed middleware",
            error : error.message
        })
    }
    
}