const mongoose = require('mongoose');
const pg = require('pg');
const pgp = require('pg-promise')();
export const MongoHandler = async(dburl : string , collection : string ) => {
    try {
        await mongoose.connect(dburl)
        .then(async() => {
            console.log("Connected to users MongoDb");
            const Model = mongoose.model(collection , new mongoose.Schema({} , {strict : false}) , collection);
            const data = await Model.find();
            console.log(data);
            return {message : "Connected ans executed query" }
        })
    } catch (error  : any) {
        console.log("From the MongoHandler middleware: ", error);
        return {message : "Internal Server Error" , error}
    }
}

export const postgreHandler = async( url : string , controller : string , myobj : any ) => {
    try{
        var message = "";
        const client = new pg.Client({
            connectionString: url
        })
        await client.connect()
        .then(async() => {
            console.log("Postgres connected");
            // var query = `SELECT c.table_name ,  c.column_name , c.data_type , c.is_nullable , i.constraint_name
            // FROM information_schema.columns as c
            // LEFT JOIN information_schema.key_column_usage as i
            // ON c.table_name = i.table_name and c.column_name = i.column_name and c.table_schema = i.table_schema
            // WHERE c.table_name = '${controller}'
            // GROUP BY c.table_name, c.column_name, c.data_type, c.is_nullable, i.constraint_name`;
            // const data = await client.query(query);
            console.log(myobj)

            //pg-promise interacting with pg drivers - handles Insertion realted queries internally
            const columns = Object.keys(myobj[0]);
            const cs = new pgp.helpers.ColumnSet(columns, { table: controller }); //defines attributes
            const query = pgp.helpers.insert(myobj, cs); //inserting values
            console.log(query)
            
            //inserting into db
            await client.query(query)
            .then(() => {
                console.log("Inserted Succesfully to your postgress DB");
                message = "Inserted Succesfully to your postgress DB";
            })
            .catch((error : any) => {
                console.log("Error in inserting to postgress \n" , error);
                message =  `Error in inserting to postgress - ${error}`
            })
        })
        .catch((error : any) => {
            console.log(error);
            message = "Internal Server Error";
        })
        .finally(() => {
            client.end()
            console.log("Disconnected")
        })
        return {message : message}
    }
    catch(error){
        console.log("From the postgreHandler middleware: ", error);
        return {message : "Internal Server Error" , error}
    }
}

module.exports = { MongoHandler  , postgreHandler };