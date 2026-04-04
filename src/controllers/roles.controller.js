import z from 'zod';
import {prisma} from '../lib/prismaAdaptor.js'

export const getrolescontroller = async (req,res)=>{
    try {
        const allroleperm = await prisma.roles.findMany({
            include: {
                rolepermission: true
            }
        })
        console.log(JSON.stringify(allroleperm,null,2));
        return res.json({ success: true, data: allroleperm });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error",error:error });
  }
}

export const createrolecontroller = async (req,res)=>{
    try {
        const bodyschema = z.object({
            rolename: z.string({error:'role name should be string'}),
        })
        const {rolename} = bodyschema.parse(req.body);
        const role = await prisma.roles.create({
            data: {
                name : rolename,
            }
        })
        console.log(JSON.stringify(role,null,2));
        return res.json({ success: true, data: role });
    } catch (error) {
        if (error.errors) {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors,
          });
        }
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error",error:error });
  }
}

export const createpermission = async (req,res)=>{
    try {
        const bodyschema = z.object({
            attribute: z.string({error:'attribute name should be string'}),
            action: z.string({error:'action name should be string'}),
        })
        const {attribute,action} = bodyschema.parse(req.body);
        const permission = await prisma.permission.create({
            data: {
                attribute: attribute,
                action: action,

            }
        })
        console.log(JSON.stringify(permission,null,2));
        return res.json({ success: true, data: permission });
    } catch (error) {
        if (error.errors) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors,
          });
        }
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error",error:error });
  }
}

export const createrolewithpermission = async (req,res)=>{
    const {rolename,permissionidarray} = req.body;
    try {
        const permissionexist = await prisma.permission.findMany({
            where:{
                id: {in:permissionidarray},
            }
        })
        if(permissionexist.length !== permissionidarray.length ){
            return res.status(400).json({
                message: "One or more permissions do not exist"
            });
        }
        const data = await prisma.roles.create({
            data: {
                name: rolename,
                rolepermission : {
                    connect : permissionidarray.map(id=>({id}))
                }
            },
            include: {
                rolepermission: true,
            }
        })

        return res.json({ success: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error",error:error });
    }
}

export const Assignroletopermission = async (req,res)=>{
    // i will get role and array of permission
    const {roleid , permessionidarray} = req.body;
    try {
        // if role does not exist then return error
        // if permission does not exist then return error
        await prisma.roles.update({
            where:{
                id:roleid
            },
            data : {
                rolepermission : {
                    connect : permessionidarray.map(id=>({id}))
                }
            }
        })
        return res.json({ success: true, message: 'role assigned' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error",error:error });
    }
}

export const removePermissionsFromRole = async (req, res) => {
    const roleid = parseInt(req.params.id)
    const { permissionidarray } = req.body;
    try {
        const updatedRole = await prisma.roles.update({
            where: { id: roleid },
            data: {
                rolepermission: {
                    disconnect: permissionidarray.map(id => ({ id }))
                }
            },
            include: { rolepermission: true }
        });
        return res.json({
            message: "Permissions removed successfully",
            data: updatedRole
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal error" });
    }
};

export const deletepermission = async (req,res)=>{
    const pmid = parseInt(req.params.id)
    try {
        const ispermissionexist = await prisma.permission.findUnique({
            where:{
                id : pmid
            },
            include :{
                role : true
            }
        })
        if(!ispermissionexist){
            return res.status(404).json({
                msg: "no such permission found"
            })
        }

        const perm = await prisma.permission.delete({
            where : {
                id : pmid
            },
            include : {
                role : true
            }
        })
        console.log(perm);
        return res.json({ success: true, message: 'role assigned', data:perm });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error",error:error });
  }
}
