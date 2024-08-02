import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const prisma = new PrismaClient();

export const CreateUser = async (req: any, res: any) => {
    try {
        const {name , email , password} = req.body;
        const isFound = await prisma.user.findUnique({
            where : {
                email : email
            }
        })

        if(!name || !email || !password){
            return res.status(400).json({message : "Please fill all fields"})
        }

        if(isFound){
            return res.status(400).json({message : "User already exists"})
        }

        const isStrongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(password);
        if(!isStrongPassword){
            return res.status(400).json({message : "Password is weak"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        const secret : string = process.env.JWT_SECRET || "";
        const token = jwt.sign({email : email} , secret , {expiresIn: "1d"});

        const newUser = await prisma.user.create({
            data : {
                name : name,
                email : email,
                password : hashedPassword
            }
        })
        return res.status(200).json({message : "User Created" , token : token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }
}

const LoginUser = async (req: any, res: any) => {
    try {
        const {email , password} = req.body;
        const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        })

        if(!user){
            return res.status(400).json({message : "User not found"})
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid Credentials"})
        }

        const secret : string = process.env.JWT_SECRET || "";
        const token = jwt.sign({email : email} , secret , {expiresIn: "1d"});

        return res.status(200).json({message : "User Logged In" , token : token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }
}


module.exports = { CreateUser , LoginUser };

