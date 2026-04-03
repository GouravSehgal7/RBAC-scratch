import "dotenv/config"
import jwt from 'jsonwebtoken'
import {prisma} from '../lib/prismaAdaptor.js'
import bcrypt from 'bcrypt'

export const logincontroller = async (req,res)=>{
    try {
        const { email, password } = req.body;

        const user = await prisma.userAuth.findUnique({
            where : { email : email }
        })
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch =  bcrypt.compare(password,user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{ expiresIn: "1d" });

        return res.status(200).json({ message: 'Login successful', token , user });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}

export const signupcontroller = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        let user = await prisma.userAuth.findUnique({
            where : {email : email}
        })
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        let pass = await bcrypt.hash(password,10);
        const defaultRole = await prisma.roles.findFirst({
            where: { name: "Viewer" }
        });

        if (!defaultRole) {
            return res.status(500).json({
                message: "Default role not found"
            });
        }
        user = await prisma.userAuth.create({
            data: {
                name : name,
                email : email,
                password : pass,
                userdata : {
                    create : {
                        status : "ACTIVE",
                        roleid: defaultRole.id
                    }
                }
            },
            include: {
                userdata : {
                    include : {
                        role : true
                    }
                }
            }
        })
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{ expiresIn: "1d" })
        return res.status(201).json({
            message: "User created successfully",
            token,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error
        });
    }
}
