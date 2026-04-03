import { DEFAULT_PERMISSION_FOR_ADMIN, DEFAULT_ROLES, DEFAULTADMIN, STATUS } from "../lib/constants.js";
import {prisma} from "../lib/prismaAdaptor.js"
import bcrypt from 'bcrypt'

async function Seed() {
    // first make default roles
    const existingRoles = await prisma.roles.findMany();
    let rolesMap = {};
    if(existingRoles.length === 0){
        const create_role = await Promise.all(
            DEFAULT_ROLES.map(role =>
                prisma.roles.create({
                    data:{
                        name:role
                    }
                })
            )
        )
        create_role.forEach((r) => {
            rolesMap[r.name] = r.id;
        });
        console.log('Roles created:', Object.keys(rolesMap));
    }else {
        existingRoles.forEach((r) => {
            rolesMap[r.name] = r.id;
        });
        console.log("Roles already exist:", rolesMap);
    }

    // add default role permission
    await prisma.permission.create({
        data:{
            action:DEFAULT_PERMISSION_FOR_ADMIN.action,
            attribute:DEFAULT_PERMISSION_FOR_ADMIN.attribute,
            role:{
                connect:{
                    id:rolesMap.admin
                }
            }
        }
    })

    // make default admin

    const hashpass = await bcrypt.hash(DEFAULTADMIN.defaultAdminPass,10);
    await prisma.userAuth.create({
        data:{
            email:DEFAULTADMIN.defaultAdminEmail,
            name:DEFAULTADMIN.defaultAdminName,
            password:hashpass,
            userdata : {
                create : {
                    status: STATUS.active,
                    roleid:rolesMap.admin
                }
            }
        }
    })
}
Seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());