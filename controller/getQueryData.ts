const pg = require('pg');
const jwt = require('jsonwebtoken');
const {mongoose} = require('mongoose');


//function to convert string to object => string => {"key" : value}
function findObject(str: string): { [key: string]: any } {
    const trimmedStr = str.trim();
    const [key, value] = trimmedStr.split(':').map(part => part.trim());
    if(!value) return {};
    const cleanedValue = value.replace(/^['"]|['"]$/g, '');
    const result: { [key: string]: any } = {};
    result[key] = cleanedValue;
    return result;
}

//postgres data query
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

//mongoDb data query
export const QueryMongo = async (req : any, res : any) => {
    try {
        const {url , query} = req.body;
        console.log(url)
        mongoose.connect(url)
        .then(async() => {
            console.log("Connected to users MongoDb");
            const {query : string} = req.body;
            //query = db.collection('inventory').find({});
            const collectionMatch = query.match(/\(([^)]+)\)/);
            const collectionName = collectionMatch ? collectionMatch[1].replace(/['"]/g, '').trim() : '';

            // Extract findName using regular expressions
            const findNameMatch = query.match(/\{([^}]+)\}/);
            const findName = findNameMatch ? findNameMatch[1].replace(/['"]/g, '').trim() : '';
            const keyValuePair = findObject(findName);
            console.log(keyValuePair);

            //querying to get data from the MongoDb
            const result = await mongoose.connection.db.collection(collectionName).find(keyValuePair);
            const data = await result.toArray();
            console.log(data);
            return res.status(200).json({message : "Connected ans executed query" })
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