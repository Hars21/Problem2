import validator from 'validator';
import validation from './validation.js';

export default {
    selectAllQuery,
    SelectAllQry,
    SelectWithSubAllQry,
    fetchAllWithJoinQry,
    getDbResult,
    agentDetail,
    insertRecord,
    updateRecord,
    getLocationAddr,
    getAsmHirarchy,
    insertManyRecord,
    insertManyRecordCustom,
    clearTable,
    distanceP2p,
    getDistanceTravlled,
    getThroughSfid,
    getPriorityOfApproval,
    getTeamandAreaMembers,
    deleteRecord
};

/**
 * 
 * @param {*} fieldsArray, tableName, WhereClouse, offset, limit, orderBy 
 * @param {*} tableName 
 * @param {*} WhereClouse 
 * @param {*} offset 
 * @param {*} limit 
 * @param {*} orderBy 
 */


 function getPriorityOfApproval(designation) {
    // teams designation: Director, CGM, GM, AGM, ASM, MO
      let priority;
      switch (designation) {
        case 'RM':
          priority = 3;
          break;
        case 'ASM':
          priority = 2;
          break;
        case 'SE':
          priority = 1;
          break;
    
        default:
          priority = 0;
          break;
      }
      return priority;
    }

    async function deleteRecord(tableName, WhereClouse){
        try {       
            
             var sql = `DELETE FROM ${tableName}`;       
    
            sql +=` where `;
    
    
            counter = 1;
            WhereClouse.forEach(element => {
                if(counter > 1)
                    sql+=` and `;
                if(element.type!=undefined && element.type=='IN'){
                    teamsMemString =element.value.join("','");
                    sql +=` ${element.field} IN ('${teamsMemString}')`;
                }  else
                    sql +=` ${element.field}='${element.value}'`;
                counter++;
            });
    
            console.log(`INFO::::: ${sql}`);
    
            return await client.query(sql)
                .then(data => {
                    if(data.rowCount > 0){
                        return { "success": true, "message": "Record deleted successfully.","data":data };
                    }else{
                        return { "success": false, "message": "Record deleted failed.","data":{} };
                    }
                }).catch(err => {
                    console.log('ERROR:::: err 144 >>>> ', err);
                    return { "success": false, "message": "Error while update record." };
                });
        } catch (e) {
            console.log("Error :::::::>>>>> 144 :::::",e)
            return { "success": false, "message": "Error while deleteing record." };
        }
      
    }
 async function getThroughSfid(tablename, sfid) {
    let fields = ['*'];
    let wehereClouse = [];
    wehereClouse.push({ fieldName: 'sfid', fieldValue: sfid });
    let sql = SelectAllQry(fields, tablename, wehereClouse);
    let data = await client.query(sql);
    if (data.rows.length) {
      return data.rows[0];
    } else {
      return;
    }
  }
  async function getTeamandAreaMembers(team_id,data_return){

    let area_arr=[]
        let subordinate_id=[];
        let fields = ['*'];
          let tableName = 'team__c';
          let team_WhereClouse = [];
          team_WhereClouse.push({ "fieldName": "sfid", "fieldValue": team_id}); 
    let offset='0';
    let limit='100';
          let user_sql = SelectAllQry(fields, tableName, team_WhereClouse, offset, limit,' order by createddate desc');
          let user_res = await client.query(user_sql)
    
          let final_team = [];
        //   console.log('user ---->', user_res.rows[0]['sfid']);
    
          /////// after that we match all the team member under a herarichy 
          if(user_res.rows.length > 0){
    
            let user_sfid = user_res.rows[0]['sfid'];
            let user_list_sql = `select * from ${process.env.TABLE_SCHEMA_NAME}.team__c where team_manager__c = '${user_sfid}';`;
            // console.log('user_list_sql ---> ',user_list_sql);
            let user_list_res = await client.query(user_list_sql);
            let final_user_list = [...user_res.rows,...user_list_res.rows];
    
            final_user_list.map((team)=> {
              final_team.push(team['sfid']);
            })
            // console.log('final teams before starting the loop ----->', final_team);
    
            let recent_data;
    
            for(let i = 0 ; i<7 ; i++){
                console.log("loop no. ",i);
    
              if(i==0){
                recent_data = [...final_team];
              }
            //   console.log(`final_team starting inside for loop  :::: ${i}>>>>`, recent_data);
              if(recent_data.length > 0){
                const fields = ['sfid,name'];
                const tableName = 'team__c';
                const WhereClouse = [];
                WhereClouse.push({ "fieldName": "team_manager__c", "fieldValue": recent_data, "type": 'IN' });
                
                let offset = '0', limit = '1000';
                            
                let sql = SelectAllQry(fields, tableName, WhereClouse, offset, limit,' order by createddate desc');
                let teams = await client.query(sql);
                recent_data = []
    
                // console.log('teams SQL  :::: >>>> ', sql);         
                // console.log('teams  :::: >>>> ', teams.rows);
    
                if(teams.rows.length > 0){
                  teams.rows.map((team)=>{
                      recent_data.push(team['sfid']);
                      final_team.push(team['sfid']);
                      let obj = {
                        id: team['sfid'],
                        name: team['name']
                      };
                      subordinate_id.push(obj);
                  });
                }
            }
            else{
                break;
            }
            // console.log('Subordinate Data ---->',subordinate_id);
            // console.log('Inside Forloop And After All Queries ---->',final_team);
          }
    
        }
        // console.log('final team -->', final_team);
        final_team = sort.removeDuplicates(final_team);
    
        // console.log('Finally final_team----->',final_team);
    
        const area_table_name = 'account';
        const area_fields = ['area__c'];
        const area_WhereClouse = [];
        area_WhereClouse.push({"fieldName": "team__c", "fieldValue": final_team , type: 'IN'});
        let area_offset = '0' , area_limit = '100'
    
        let area_sql =SelectAllQry(area_fields , area_table_name , area_WhereClouse , area_offset , area_limit , ' order by createddate desc');
        // console.log('Area sql --->', area_sql);
        let area_res = await client.query(area_sql);
    
        if(area_res.rows.length > 0){
          area_res.rows.map(area=>{
            area_arr.push(area['area__c'])
          })
        }
        
        area_arr = sort.removeDuplicates(area_arr);
        // console.log('area_arr ---->' , area_arr);
    
        if(data_return=='Team'){
            
            return final_team 
        }
        if(data_return=='Area'){
           return area_arr
    
        }
    }
function selectAllQuery(param) {

    var fields = param.fields.toString();
    var WhereClouse = param.WhereClouse;
    var tableName = param.tableName;
    var offset = param.offset;
    var limit = param.limit;
    var orderBy = param.orderBy;
    var sql = `SELECT ${fields} FROM ${process.env.TABLE_SCHEMA_NAME}.${tableName}`;
    
    if (WhereClouse != undefined && WhereClouse.length > 0) {
        sql+= ' where';
        
        var couter = 0;
        WhereClouse.forEach(element => {
            if(couter > 0){
                sql+= ' and';
            }
            console.log("sql", sql);
            if(validation.issetNotEmpty(element.type)){
                switch(element.type){
                    case 'IN':
                        teamsMemString = element.fieldValue.join("','");
                        sql+=` ${element.fieldName} IN ('${teamsMemString}')`;
                    break;
                    case 'NOTIN':
                        teamsMemString = element.fieldValue.join("','");
                        sql+=` ${element.fieldName} NOT IN ('${teamsMemString}')`;
                    break;
                    case 'LIKE':
                        sql+=` ${element.fieldName} LIKE '%${element.fieldValue}%'`;
                    break;  
                    case 'GTE':
                        sql+=` ${element.fieldName} >= '${element.fieldValue}'`;
                    break;  
                    case 'LTE':
                        sql+=` ${element.fieldName} <= '${element.fieldValue}'`;
                    break;  
                    case 'BETWEEN':
                        sql+=` ${element.fieldName} BETWEEN ${element.fieldValue}`;
                    break; 
                    case 'NOTNULL':
                        sql+=` ${element.fieldName} is not null`;
                    break;   
                }
            }else{
                sql+=` ${element.fieldName}='${element.fieldValue}'`;
            }
            couter++;
        });
    }

    if(validation.issetNotEmpty(orderBy)){
        sql+=` ${orderBy}`;
    }
    if(validation.issetNotEmpty(offset)){
        sql+=` offset ${offset}`;
    }
    if(validation.issetNotEmpty(limit)){
        sql+=` limit ${limit}`;
    }
    return sql;
}

function SelectAllQry(fieldsArray, tableName, WhereClouse, offset, limit, orderBy ) {
    var fields = fieldsArray.toString();
    var sql = `SELECT ${fields} FROM ${tableName}`;
    if (WhereClouse != undefined && WhereClouse.length > 0) {
        sql+= ` where`;
        
        var couter = 0;
        WhereClouse.forEach(element => {
            if(couter > 0){
                sql+= ` and`;
            }

            if(element.type!=undefined && element.type!=''){
                switch(element.type){
                    case 'IN':
                        teamsMemString = element.fieldValue.join("','");
                        sql+=` ${element.fieldName} IN ('${teamsMemString}')`;
                    break;
                    case 'NOTIN':
                        teamsMemString = element.fieldValue.join("','");
                        sql+=` ${element.fieldName} NOT IN ('${teamsMemString}')`;
                    break;
                    case 'LIKE':
                        sql+=` ${element.fieldName} LIKE '%${element.fieldValue}%'`;
                    break;  
                    case 'GTE':
                        sql+=` ${element.fieldName} >= '${element.fieldValue}'`;
                    break;  
                    case 'LTE':
                        sql+=` ${element.fieldName} <= '${element.fieldValue}'`;
                    break;  
                    case 'BETWEEN':
                        sql+=` ${element.fieldName} BETWEEN ${element.fieldValue}`;
                    break; 
                    case 'NOTNULL':
                        sql+=` ${element.fieldName} is not null`;
                    break;   
                }
            }else{
                sql+=` ${element.fieldName}='${element.fieldValue}'`;
            }
            couter++;
        });
    }

    console.log('orderBy >>>>> ',orderBy  )
    if(orderBy!=undefined && orderBy!=''){
        sql+=` ${orderBy}`;
    }
    if(offset!=undefined && validator.isInt(offset,{ min: 0, max: 9999999999999 })){
        sql+=` offset ${offset}`;
    }
    if(limit!=undefined && validator.isInt(limit,{ min: 0, max: 10000 })){
        sql+=` limit ${limit}`;
    }
    return sql;
}

function SelectWithSubAllQry(fieldsArray, subQuery, WhereClouse, offset, limit, orderBy ) {
    const fields = fieldsArray.toString();
    var sql = `SELECT ${fields} FROM ${subQuery}`;
    if (WhereClouse != undefined && WhereClouse.length > 0) {
        sql+= ` where`;
        
        var couter = 0;
        WhereClouse.forEach(element => {
            if(couter > 0){
                sql+= ` and`;
            }

            if(element.type!=undefined && element.type!=''){
                switch(element.type){
                    case 'IN':
                        teamsMemString = element.fieldValue.join("','");
                        sql+=` ${element.fieldName} IN ('${teamsMemString}')`;
                    break;
                    case 'LIKE':
                        sql+=` ${element.fieldName} LIKE '%${element.fieldValue}%'`;
                    break;  
                    case 'GTE':
                        sql+=` ${element.fieldName} >= '${element.fieldValue}'`;
                    break;  
                    case 'LTE':
                        sql+=` ${element.fieldName} <= '${element.fieldValue}'`;
                    break;  
                    case 'BETWEEN':
                        sql+=` ${element.fieldName} BETWEEN ${element.fieldValue}`;
                    break;   
                    case 'NOTNULL':
                        sql+=` ${element.fieldName} is not null`;
                    break;  
                }
            }else{
                sql+=` ${element.fieldName}='${element.fieldValue}'`;
            }
            couter++;
        });
    }

    console.log('orderBy >>>>> ',orderBy  )
    if(orderBy!=undefined && orderBy!=''){
        sql+=` ${orderBy}`;
    }
    if(offset!=undefined && validator.isInt(offset,{ min: 0, max: 9999999999999 })){
        sql+=` offset ${offset}`;
    }
    if(limit!=undefined && validator.isInt(limit,{ min: 0, max: 1000 })){
        sql+=` limit ${limit}`;
    }
    return sql;
}

function fetchAllWithJoinQry(fieldsArray, tableName,joins, WhereClouse, offset, limit, orderBy ) {
    const fields = fieldsArray.toString();
    var sql = `SELECT ${fields} FROM ${tableName}`;
    var joinString = ``;
    if (joins != undefined && joins.length > 0) {
       
        joins.forEach(async element => {
           
            joinString += ` ${element.type} JOIN ${process.env.TABLE_SCHEMA_NAME}.${element.table_name} ON ${element.p_table_field} = ${element.s_table_field}`;
            
        });
        sql+=joinString;
    }

    if (WhereClouse != undefined && WhereClouse.length > 0) {
        sql+=` where`;
        var couter = 0;
        WhereClouse.forEach(element => {
            if(couter > 0){
                sql += ` and`;
            }
            if(element.type!=undefined && element.type!=''){
                switch(element.type){
                    case 'IN':
                        teamsMemString = element.fieldValue.join("','");
                        sql+=` ${element.fieldName} IN ('${teamsMemString}')`;
                    break;
                    case 'LIKE':
                        sql+=` ${element.fieldName} LIKE '%${element.fieldValue}%'`;
                    break;  
                    case 'GTE':
                        sql+=` ${element.fieldName} >= '${element.fieldValue}'`;
                    break;
                    case 'GT':
                        sql+=` ${element.fieldName} > '${element.fieldValue}'`;
                    break;
                    case 'LT':
                        sql+=` ${element.fieldName} < '${element.fieldValue}'`;
                    break;
                    case 'LTE':
                        sql+=` ${element.fieldName} <= '${element.fieldValue}'`;
                    break;  
                    case 'BETWEEN':
                        sql+=` ${element.fieldName} BETWEEN ${element.fieldValue}`;
                    break;  
                    case 'NOTNULL':
                        sql+=` ${element.fieldName} is not null `;
                    break;  

                }
            }else{
                sql+=` ${element.fieldName}='${element.fieldValue}'`;
            }
            couter++;
        });
    }
    
    if(orderBy!=undefined && orderBy!=''){
        sql +=` ${orderBy}`;
    }
    if(offset!=undefined && validator.isInt(offset,{ min: 0, max: 9999999999999 })){
        sql+=` offset ${offset}`;
    }
    if(limit!=undefined && validator.isInt(limit,{ min: 0, max: 10000 })){
        sql+=` limit ${limit}`;
    }
    return sql;
}

async function getDbResult(sql) {
    return await client.query(sql)
        .then(data => {
            console.log('INFO::: Fetch DB result');
            return data;
        })
        .catch(err => {
            console.log('err ====>>>  ',err);
            return [];
        });
}

async function insertRecord(fieldsToBeInsert, fieldValues, tableName, returnIds){
   
    let sql = ''
    sql = `INSERT into ${tableName} (${fieldsToBeInsert}) VALUES(`;
    if(fieldValues.length > 0){
        var counter = 1;
        fieldValues.forEach(element => {
            if(counter > 1){ sql += `,`; }
            sql += `$${counter}`;
            counter++
        })
    }
    sql += `) RETURNING id`;
    if(returnIds!=undefined){
        sql +=` ${returnIds}`;
    }

    // sql += `) ON CONFLICT (username__c) 
    // DO NOTHING RETURNING id`;
    // if(returnIds!=undefined){
    //     sql +=` ${returnIds}`;
    // }

    console.log('INFO ::::::  SQL::::  ', sql);
    return await client.query(sql,fieldValues)
        .then(data => { 
            console.log(` INFO::::: INSERT RESPONSE table =${tableName} >>>>> `,data)
            if(data.rowCount > 0){
                return { "success": true, "message": "", "data": data.rows };

            }else{
                return { "success": false, "message": "Error while create record. Please try again.", "data": {} };
            }
        }).catch(err => {
            console.log('Error::: Catch 162 >>>> ', err);
            return { "success": false, "message": "Error while insert", "data": {} };
        });

}

async function insertManyRecord(fieldsToBeInsert, fieldValues, tableName, returnIds){
   

    sql = `INSERT into ${tableName} (${fieldsToBeInsert}) VALUES`;
    if(fieldValues.length > 0){
        let counter = 1;  // for giving '(' / ')'
        let counter2 = 1;     // for giving ','
        fieldValues.forEach((fieldValue)=> {
            if(counter == 1){ 
                sql += `(`; 
            } else {
                sql += ',('
            }
            let data = Object.values(fieldValue);
            data.forEach(value => {
                if (counter2 == 1) {
                    sql += `'${value}'`;
                } else{
                    sql += `, '${value}'`;
                }
                counter2++
            })
            counter2 = 1;
            sql += `)`;
            counter++
        })
    }
    sql += ` RETURNING id`;
    if(returnIds!=undefined){
        sql +=` ${returnIds}`;
    }
    console.log('INFO ::::::  SQL::::  ', sql);
    return await client.query(sql)
        .then(data => { 
            console.log(` INFO::::: INSERT RESPONSE table =${tableName} >>>>> `,data)
            if(data.rowCount > 0){
                return { "success": true, "message": "", "data": data.rows };

            }else{
                return { "success": false, "message": "Error while create record. Please try again.", "data": {} };
            }
        }).catch(err => {
            console.log('Error::: Catch 162 >>>> ', err);
            return { "success": false, "message": "Error while insert", "data": {} };
        });

}

async function insertManyRecordCustom(fieldsToBeInsert, fieldValues, tableName, returnIds){
   

    sql = `INSERT into ${process.env.TABLE_SCHEMA_NAME}.${tableName} (${fieldsToBeInsert}) VALUES`;
    if(fieldValues.length > 0){
        let counter = 1;  // for giving '(' / ')'
        let counter2 = 1;     // for giving ','
        fieldValues.forEach((fieldValue)=> {
            if(counter == 1){ 
                sql += `(`; 
            } else {
                sql += ',('
            }
            let data = Object.values(fieldValue);
            data.forEach(value => {
                if (counter2 == 1) {
                    sql += `'${value}'`;
                } else{
                    sql += `, '${value}'`;
                }
                counter2++
            })
            counter2 = 1;
            sql += `)`;
            counter++
        })
    }
    sql += ` ON CONFLICT (username__c) 
    DO NOTHING RETURNING id`;
    if(returnIds!=undefined){
        sql +=` ${returnIds}`;
    }
    console.log('INFO ::::::  SQL::::  ', sql);
    return await client.query(sql)
        .then(data => { 
            console.log(` INFO::::: INSERT RESPONSE table =${tableName} >>>>> `,data)
            if(data.rowCount > 0){
                return { "success": true, "message": "", "data": data.rows };

            }else{
                return { "success": false, "message": "Error while create record. Please try again.", "data": {} };
            }
        }).catch(err => {
            console.log('Error::: Catch 162 >>>> ', err);
            return { "success": false, "message": "Error while insert", "data": {} };
        });

}

async function clearTable(tableName){
   

    let sql = `DELETE FROM ${process.env.TABLE_SCHEMA_NAME}.${tableName}`;

    console.log('INFO ::::::  SQL::::  ', sql);
    return await client.query(sql)
        .then(data => { 
            console.log(` INFO::::: DELETE TABLE DATA, table =${tableName}`)
            if(data.rowCount > 0){
                return { "success": true, "message": "", "data": data.rows };

            }else{
                return { "success": false, "message": "Error while deleting records. Please try again.", "data": {} };
            }
        }).catch(err => {
            console.log('Error::: Catch 162 >>>> ', err);
            return { "success": false, "message": "Error while deleting", "data": {} };
        });

}

async function updateRecord(tableName, fieldValue, WhereClouse){
    try {

        //sql = `update zoxima.${tableName} set End_Day__c='true', End_Time__c='${attendance_time}' where Team__c='${agentid}' and Attendance_Date__c='${attendance_date}'`;
        
         var sql = `update ${tableName} set`;


        counter = 1;
        fieldValue.forEach(element => {
            if(counter > 1)
                sql+=`,`;
            if(element.type!=undefined && element.type == 'BOOLEAN')
                sql +=` ${element.field}=${element.value}`;
            else
                sql +=` ${element.field}='${element.value}'`;
            counter++;
        });

        sql +=` where `;


        counter = 1;
        WhereClouse.forEach(element => {
            if(counter > 1)
                sql+=` and `;
            if(element.type!=undefined && element.type=='IN'){
                teamsMemString =element.value.join("','");
                sql +=` ${element.field} IN ('${teamsMemString}')`;
            }  else
                sql +=` ${element.field}='${element.value}'`;
            counter++;
        });

        console.log(`INFO::::: ${sql}`);

        return await client.query(sql)
            .then(data => {
                if(data.rowCount > 0){
                    return { "success": true, "message": "Record updated successfully.","data":data };
                }else{
                    return { "success": false, "message": "Record updated failed.","data":{} };
                }
            }).catch(err => {
                console.log('ERROR:::: err 137 >>>> ', err);
                return { "success": false, "message": "Error while update record." };
            });
    } catch (e) {
        return { "success": false, "message": "Error while update record." };
    }
  
}

async function agentDetail(agentId){
    if (validation.issetNotEmpty(agentId)) {
        fieldsArray = [
            `team__c.member_type__c as member_type`,
            `team__c.email__c as email`, `team__c.name as team_member_name`,
            `team__c.dob__c as dob`, `team__c.designation__c as designation`,
            `team__c.phone_no__c as phone_no`,
            `team__c.Business__c as business`,
            `team__c.Manager__c as manager_id`,
            `team__c.sfid as team_id`
        ];
        tableName = `team__c`;
        WhereClouse = [];
            WhereClouse.push({ "fieldName": "sfid", "fieldValue": agentId  })
        
        orderBy = '';
        var sql = SelectAllQry(fieldsArray, tableName, WhereClouse, '0', '1', orderBy );
        console.log(`INFO:::: GET AGENT DETAIL: ${sql}`);
        var result =  await getDbResult(sql);
        return result;
    }else{
        return false;
    }
}

//getAsmHirarchy('a0H1m000001Owv4EAC');
async function getAsmHirarchy(agentid) {
    var team = {};
    team['ASM'] = [];
    team['PSM'] = [];
    team['memberType'] = '';
    team['success'] = true;
    try {
        myDetails = await agentDetail(agentid);
        
        if (myDetails.rowCount > 0) {
            team['memberType'] = myDetails.rows[0].member_type;
            var sql = '';
            if (myDetails.rowCount > 0 && myDetails.rows[0].member_type == 'PSM') {
                team['PSM'].push(agentid)
            } else {
                sql = `WITH RECURSIVE subordinates AS (
                SELECT
                sfid,
                manager__c,
                name,
                member_type__c
                FROM
                cns.team__c
                WHERE
                sfid = '${agentid}'
                UNION
                SELECT
                    e.sfid,
                    e.manager__c,
                    e.name,
                    e.member_type__c
                FROM
                    cns.team__c e
                INNER JOIN subordinates s ON s.sfid = e.manager__c
            ) SELECT
                *
            FROM
                subordinates`;
                var result = await getDbResult(sql);
                if (result.rows.length > 0) {
                    for (i in result.rows) {
                        if (result.rows[i].member_type__c == 'PSM') {
                            team['PSM'].push(result.rows[i].sfid);
                        } else {
                            team['ASM'].push(result.rows[i].sfid);
                        }
                    }
                }else{
                    team['success'] = false;
                }
            }
            
            console.log('result  > ', team)
            return team;
        }
    } catch (e) {
        team['success'] = false;
        return team;
    }
}

import rp from 'request-promise';
//getLocationAddr('28.5796079','77.3386758')
async function getLocationAddr(lat, long) {
    if (lat != null && lat != '' && long != null && long != '') {
        return rp(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.GOOGLE_API_KEY}`)
            .then(async function (data) {

                data = JSON.parse(data);

                var isResultFound = false, address = 'N/A';
                if (data != undefined && data.results.length > 0) {
                    for (i in data.results) {
                        if (isResultFound == false) {

                            for (j in data.results[i].address_components) {
                                if (data.results[i].geometry.location_type == 'GEOMETRIC_CENTER' && isResultFound == false) {
                                    isResultFound = true;
                                    address = data.results[i].formatted_address;
                                }
                            }
                        }
                    }
                }
                return address;
            })
            .catch(function (err) {
                console.log(err);
                // Crawling failed...
            });
    } else {
        return 'N/A';
    }
}

async function distanceP2p(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
        console.log(`function values ----->lat1 ${lat1}  long1 ${lon1}  lat2 ${lat2}  long2 ${lon2}`);
        console.log('infunction');
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

//Google API integration For Getting Direction , Distance ,Time for The Optimal Route  

// async function getDirection(lat, long) {
//     if (lat != null && lat != '' && long != null && long != '') {
//         return rp(`https://maps.googleapis.com/maps/api/directions/json?origin=37.7680296,-122.4375126&destination=37.7663444,-122.4412006&key=YOUR_API_KEY`)
//             .then(async function (data) {

//                 data = JSON.parse(data);

//                 var isResultFound = false, address = 'N/A';
//                 if (data != undefined && data.results.length > 0) {
//                     for (i in data.results) {
//                         if (isResultFound == false) {

//                             for (j in data.results[i].address_components) {
//                                 if (data.results[i].geometry.location_type == 'GEOMETRIC_CENTER' && isResultFound == false) {
//                                     isResultFound = true;
//                                     address = data.results[i].formatted_address;
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 return address;
//             })
//             .catch(function (err) {
//                 console.log(err);
//                 // Crawling failed...
//             });
//     } else {
//         return 'N/A';
//     }
// }

async function getDistanceTravlled(lat1,lon1,lat2,lon2) {
    if (lat1 != null && lat1 != '' && lon1 != null && lon1 != '' && lat2 != null && lat2 != '' && lon2 != null && lon2 != '') {
        return rp(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lon1}&destinations=${lat2},${lon2}&key=${process.env.GOOGLE_API_KEY}`)
            .then(async function (data) {
                data = JSON.parse(data);
                console.log(`Data ---> ${JSON.stringify(data)}`);
                let value_in_km = data.rows[0].elements[0].distance.text;
                let value = data.rows[0].elements[0].distance.value;
                console.log('DATA ------------------>',value);
                console.log('length ------------------>',data.rows.length);
                let valueInKm = '';
                let valueInNum = '';
                if (data != undefined && data.rows.length > 0) {
                    valueInKm = value_in_km;
                    valueInNum = value;
                }
                console.log('KM ----->',valueInKm);
                console.log('NO ----->',valueInNum);
                return {value_in_km,value};
            })
            .catch(function (err) {
                console.log(err);
                // Crawling failed...
            });
    } else {
        return 'N/A';
    }
}


