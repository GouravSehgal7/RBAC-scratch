import { prisma } from "../lib/prismaAdaptor.js"

export const getallusercontroller = async (req,res)=>{
    try {
        const users = await prisma.userData.findMany();
        return res.status(200).json({
            success:true,
            data:users,
            message:"Users found"
        })
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
    }
}

export const getuserbyidcontroller = async (req,res)=>{
    try {
        const {email} = req.body;
        const user = await prisma.userAuth.findUnique({
            where:{
                email:email
            },
            select:{
                userdata:true
            }
        })
        if(!user){
            return res.status(404).json({
                success:false,
                data:[],
                message:"no such user found"
            })
        }
        return res.status(200).json({
            success:true,
            data:user,
            message:"Users found"
        })
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
    }
}
// admin can not change status of admin status only can after down grade their status
export const updateuserstatuscontroller = async (req,res)=>{
    const {email,status} = req.body;
    try {
        // find id by email
        const user = await prisma.userAuth.findFirst({
            where : {
                email : email
            },
            select:{
                userdata:{
                    include:{
                        role:true
                    }
                }
            }
        })
        if(!user){
            return res.status(404).json({
                success:false,
                data:[],
                message:"no such user found"
            })
        }else if(user.userdata.role.name === 'admin'){
            return res.status(404).json({
                success:false,
                data:[],
                message:"you can not change status of user who is already admin it should be and viewer or analysist"
            })
        }
        // if
        const updateduser = await prisma.userData.update({
            where : {
                userid :user.userdata.id
            },
            data : {
                status : status
            }
        })
        return res.status(200).json({
            success:true,
            data:updateduser,
            message:"Users found"
        })
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
    }
}

// if 
export const updaterolecontroller = async (req,res)=>{
    const {email,roleid} = req.body;
    try {
        const role = await prisma.roles.findUnique({
            where:{
                id:roleid
            }
        })
        if(!role){
            return res.status(404).json({
                success:false,
                message:"no such role exist"
            })
        }
        const rolename = role.name;
        // find id by email
        const user = await prisma.userAuth.findUnique({
            where : {
                email : email
            },
            select:{
                userdata:{
                    include:{
                        role:true
                    }
                }
                
            }
        })
        if(!user || !user.userdata){
            return res.status(404).json({
                success:false,
                message:"no such user exist"
            })
        }
        const userrolename = user.userdata.role.name;
        if(rolename === userrolename){
            return res.status(404).json({
                success:false,
                message:"action not allowed you are not changing your user role is same as selected role"
            })
        }
        if(userrolename === 'admin'){
            const admincount = await prisma.userData.count({
                where:{
                    roleid: user.userdata.roleid
                }
            })
            if(admincount<=1){
                return res.status(404).json({
                    success:false,
                    message:"admin count can not be less then 1  choosen user is admin right now"
                })
            }
        }
        const updaterole = await prisma.userData.update({
            where : {
                id :user.userdata.id
            },
            data : {
                roleid: roleid,
            }
        })
        return res.status(200).json({
            success:true,
            data:updaterole,
            message:"Users found"
        })
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
    }
}

export const transferownership = async(req,res) => {
    try {
        const {from,to} = req.body;
        if (from === to) {
            return res.status(400).json({
                msg: "'from' and 'to' cannot be the same"
            });
        }
        const users = await prisma.userAuth.findMany({
            where:{
                email:{in:[from,to]}
            },
            select:{
                email:true,
                userdata:{
                    include:{
                        role:true
                    }
                }
            }
        })
        if(users.length !== 2){
            return res.status(404).json({
                msg: "Either one or both users does not exist"
            });
        }
        const userMap = Object.fromEntries(
            users.map(u => [u.email, u.userdata])
        );
        const fromUser = userMap[from];
        const toUser = userMap[to];
        if(fromUser.role.id === toUser.role.id || fromUser.role.name !== 'admin' || toUser.role.name === 'admin'){
            return res.status(404).json({
                msg: "Invalid operation with admin roles"
            });
        }
        const fromuserroleid = fromUser.roleid;
        const touserroleid = toUser.roleid;
        await prisma.$transaction([
            prisma.userData.update({
                where: { id: toUser.id },
                data: { roleid: fromuserroleid }
            }),
            prisma.userData.update({
                where: { id: fromUser.id },
                data: { roleid: touserroleid }
            })
        ])
        return res.status(200).json({
            success: true,
            msg: "Ownership transferred successfully"
        });
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
    }
}