
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