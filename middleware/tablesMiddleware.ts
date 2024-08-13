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
            const collections = await mongoose.connection.db.listCollections().toArray();
            tables = collections.map((table : any) => table.name)
            const schemaData = [];
            for (const collection of collections) {
                const collectionName = collection.name;
                //get the schema of respective collection
                const Model = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);
                //finds one document in the respective collection
                const sampleDoc = await Model.findOne();
                if (sampleDoc) {
                    //returns the keys of the document i.e the fields of the collection
                   const fields = Object.keys(sampleDoc.toObject());
                   const fieldTypes = fields.map(field => ({
                        field,
                        type: typeof sampleDoc[field]
                    }));
                    schemaData.push({
                        collection: collectionName,
                        fields: fieldTypes
                    });
                } else {
                    schemaData.push({
                    collection: collectionName,
                    fields: [] 
                    });
                }
            }
            schemaData.forEach((element : any) => {
                console.log(element.collection);
                console.log(element.fields);
            });
            tables = schemaData;
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