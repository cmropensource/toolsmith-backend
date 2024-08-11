import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const {MongoTable , PostgreTable} = require("../middleware/tablesMiddleware") 


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
                userId : id, 
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

export const getTableNames = async(req : any , res : any) => {
    try {
        const {database , url} = req.body;
        console.log(database , url);
        var result;
        switch(database){
            case 'MongoDB':
                var table : any = await MongoTable(url);
                console.log(table);
                return res.status(200).json(table)
            case 'PostgreSQL':
                var result = await PostgreTable(url);
                console.log("From the main function \n" , result.table);
                return res.status(200).json(result)
            case 'MySQL':
                // get Table Names from the function
                break;
        }

        return res.status(200).json({
            message : "Table Names Fetched",
            data : result
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }
}

module.exports = { AddDataBase , getDatabases , getTableNames};