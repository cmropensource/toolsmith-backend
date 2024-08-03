const pg = require('pg');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//postgres data querying
export const QueryData = async (req : any, res : any) => {
    try {
        const {url , query} = req.body;
        const client = new pg.Client({
            connectionString: url
        });

        client.connect()
        .then(async() => {
            console.log("Connected")
            const data = await client.query(query)
            console.log(data)
            return res.status(200).json({message : "Connected can execute query"})
        })
        .finally(() => {
            client.end()
            console.log("Disconnected")
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }
}

//mongoDb data querying
export const QueryMongo = async (req : any, res : any) => {
    try {
        const {url , query} = req.body;
        mongoose.connect(url)
        .then(async() => {
            console.log("Connected to users MongoDb");
            //querying
            //pending task
            //Try to find a way to execute query
        })
        .catch((err : any) => {
            console.log(err)
            return res.status(500).json({message : "Internal Server Error"})
        })
        .finally(() => {
            mongoose.disconnect()
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }
}

module.exports = { QueryData , QueryMongo };