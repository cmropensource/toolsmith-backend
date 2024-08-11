const mongoose = require('mongoose');
const pg = require('pg');
const {getStructuredData} = require("../helper/structerData")

export const MongoTable = async (dburl  : string) => {
    try {
        var tables : any;
        var msg : string = "";
        await mongoose.connect(dburl)
        .then(async() => {
            console.log("Connected to users MongoDb");
            const response = await mongoose.connection.db.listCollections().toArray();
            console.log("this is it \n" , response);
            // tables = response.toArray().map((table : any) => {
            //     return table.name
            // })
            
        })
        .catch((error : any) => {
            console.log("Unable to connect/fetch to/from MongoServer " , error);
            msg = "Internal Server Error"
        })
        .finally(() => {
            mongoose.disconnect();
        })
        if(msg == "Internal Server Error"){
            return {message : msg , tables : []}
        }
        return {
            message : "Table Names Fetched",
            tables
        };
    } catch (error) {
        console.log("From the MongoTable middleware: ", error);
        return {message : "Internal Server Error" , error}
    }
}

export const PostgreTable = async (dburl  : string) => {
    try {
        const client = new pg.Client({
            connectionString : dburl
        })
        var table : any;
        var msg: string = "";
        await client.connect()
        .then(async() => { 
            const query = "SELECT table_name ,  column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' group by table_name , column_name , data_type";
            const data = await client.query(query);
            const response = await getStructuredData(data.rows);
            table = await response;
            msg = "Table Names Fetched"
        })
        .catch((error : any) => {
            console.log("Unable to connect/fetch to/from Postgress " , error);
            msg = "Internal Server Error"
        })
        .finally(() => {
            client.end();
        })
        if(msg == "Internal Server Error"){
            return {message : msg , tables : []}
        }
        return {message : msg , table}
    } catch (error) {
        console.log("From the MongoTable middleware: ", error);
        return {message : "Internal Server Error" , error}
    }
}

module.exports = { MongoTable , PostgreTable }