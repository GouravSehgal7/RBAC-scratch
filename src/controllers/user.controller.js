import { prisma } from "../lib/prismaAdaptor.js"
export const getallusercontroller = async (req,res)=>{

}

export const getuserbyidcontroller = async (req,res)=>{

}

export const updateuserstatuscontroller = async (req,res)=>{
    const {email,status} = req.body;
    try {
        // find id by email
        const userid = await prisma.userAuth.findFirst({
            where : {
                email : {in : email}
            }
        })
        await prisma.userData.update({
            where : {
                userid : {in : userid.id}
            },
            data : {
                status : status
            }
        })
    } catch (error) {
        
    }
}

export const updaterolecontroller = async (req,res)=>{
    const {email,roleid} = req.body;
    try {

        // find id by email
        const userid = await prisma.userAuth.findFirst({
            where : {
                email : {in : email}
            },
            include : {
                userdata : true
            }
        })
        await prisma.userData.update({
            where : {
                id : {in : userid.id}
            },
            data : {
                roleid: roleid,
            }
        })
    } catch (error) {
        
    }
}

export const transferownership = async(req,res) => {
    
}