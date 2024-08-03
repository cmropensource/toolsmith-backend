import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const AddDataBase = async ( req : any , res : any) => {
    try{
        const {id , database , dbname , dburl} = req.body;

        if(!id || !database || !dbname || !dburl){
            return res.status(400).json({message : "Please fill all fields"})
        }

        const isFound = await prisma.userDbs.findFirst({
            where : {
                userId : id,
                dburl : dburl
            }
        })

        if(isFound){
            return res.status(400).json({
                message : "Database already exists with given user"
            })
        }

        const newEntry = await prisma.userDbs.create({
            data : {
                userId : id , 
                database : database,
                dbname : dbname,
                dburl : dburl
            }
        })
        return res.status(200).json({message : "Database Added" , data : newEntry})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }
}

export const getDatabases = async (req : any , res : any) => {
    try{
        const {id} = req.body;

        if(!id){
            return res.status(400).json({message : "Please fill all fields"})
        }
        const data = await prisma.userData.findUnique({
            where : {
                id : id
            },
            select : {
                dbs : true  
            }
        })
        return res.status(200).json({message : "Databases Fetched" , data : data})
    }

    catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }
}

module.exports = { AddDataBase , getDatabases };