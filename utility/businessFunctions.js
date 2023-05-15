
export default  {
    getChildParty,
    getUniqueValuesFromArrayOfObject
};

async function getChildParty(account_id){
    try{
        let account_ids = [account_id]
        let child_sql = `select sfid 
                        from ${process.env.TABLE_SCHEMA_NAME}.${SF_ACCOUNT_TABLE_NAME}
                        where parentid = '${account_id}'`
        let child_res = await client.query(child_sql)
        if(child_res.rows.length > 0){
            child_res.rows.map((data) => {
                account_ids.push(data['sfid'])
            })
        }
        return account_ids
    }catch(e){
        console.log(`Error In Get Child Party Function ---> ${e}`);
    }
}

async function getUniqueValuesFromArrayOfObject(array_of_objects){
    try{
        const uniqueData = [...array_of_objects.reduce((map, obj) => map.set(obj.sfid, obj), new Map()).values()];
        //console.log('GG------',uniqueData.length);
        return uniqueData;
    }catch(e){
        console.log('Error In Unique Values In Functional Util ---->',e);
    }
}