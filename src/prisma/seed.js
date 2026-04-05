import bcrypt from 'bcrypt'
import { DEFAULT_ROLES, DEFAULTADMIN, STATUS } from "../lib/constants.js";
import {prisma} from "../lib/prismaAdaptor.js"
import { DEFAULT_DATA } from "../lib/sampledata/transaction.js";

async function Seed() {
    try {
        await prisma.$transaction(async(tx)=>{
            console.log("Seeding start");
            let rolesMap = {};
            for(let role of DEFAULT_ROLES){
                const r = await tx.roles.upsert({
                    where :{
                        name:role
                    },
                    update:{},
                    create:{
                        name:role
                    }
                })
                rolesMap[role] = r.id;
            }
            console.log(rolesMap);
            const existingAdmin = await tx.userAuth.findUnique({
                where: { email: DEFAULTADMIN.defaultAdminEmail },
            });
            if(!existingAdmin){
                const hashpass = await bcrypt.hash(DEFAULTADMIN.defaultAdminPass,10);
                await tx.userAuth.create({
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
                console.log("Admin created");
            }else{
                console.log("Admin already exist");
            }

            const existingDataCount = await tx.financeData.count();
            if (existingDataCount === 0) {
              await tx.financeData.createMany({
                data: DEFAULT_DATA.map((item) => ({
                  ...item,
                  date: new Date(item.date),
                })),
              });
          
              console.log("Finance data seeded");
            } else {
              console.log("Finance data already exists, skipping");
            }
            console.log("Seeding completed successfully!");
        })
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}
Seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());