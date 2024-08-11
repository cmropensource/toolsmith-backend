
const convertObject = async(map : Map<string , any>) => {
    const result : any = [];
    for (let [key, value] of map) {
        var attributes : {
            column_name : string,
            data_type : string
        }[] = [];

        value.forEach((element : any) => {
            attributes.push({
                column_name : element.column_name,
                data_type : element.data_type
            })
        })
        result.push({
            table_name : key,
            attributes : attributes
        })
    }
    return result;
}

export const getStructuredData = async (data : any) => {
    const length = data.length;
    var map = new Map();
    for(let i = 0 ; i < length ; i++){
        const table_name = data[i].table_name;
        if(!map.has(table_name)){
            map.set(table_name , []);
        }
        map.get(table_name).push({
            column_name : data[i].column_name,
            data_type : data[i].data_type
        })
    }
    var respose = await convertObject(map);
    // for(let i = 0 ; i < respose.length ; i++){
    //     console.log(respose[i].table_name);
    //     console.log( respose[i].attributes);
    // }
    return respose;
}

module.exports = { getStructuredData }