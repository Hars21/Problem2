// require('dotenv').config();
var response = { "status": 200, "response": "" };
import {cryptoRandomStringAsync} from 'crypto-random-string';
import validation from '../../utility/validation.js';
import qry from '../../utility/selectQueries.js';
import dtUtil from './../../utility/dateUtility.js';



export default  {
    login,
    deleteForm,
    getform,
    createForm,
    updateForm,
    updatePassword
};

async function login(req){
    try{
        let validationError = [];
        validation.issetNotEmpty(req.body.credential) ? true : validationError.push({ field: 'Email/Phone', message: 'Mandatory parameter.' });
        validation.issetNotEmpty(req.body.password) ? true : validationError.push({ field: 'Password', message: 'Mandatory parameter.' });
        if (validationError.length == 0) {

            let email_phone = req.body.credential
            let pass = req.body.password

            let acc_sql = `Select * from public.team_table where (username = '${email_phone}' or phonenumber = '${email_phone}') and password = '${pass}'`
            let acc_sql_res = await client.query(acc_sql)
            let account_type =  acc_sql_res.rows[0]['id']
            console.log(account_type);
          
            if(acc_sql_res.rows.length > 0){
                const token = await cryptoRandomStringAsync({length: 30, type: 'alphanumeric'});
                let token_update_sql = `update public.team_table
                                    set token = '${token}', loggedin = '${true}', login_date_time = '${dtUtil.todayDatetime()}'
                                    where id = '${acc_sql_res.rows[0]['id']}'`
                let token_update_res = await client.query(token_update_sql)
                response.response = { 'success': true, 'data': acc_sql_res.rows ,"message":"Logged In Sucessfully", 'new_token':token};
                response.status = 200;
                return response;
            }else{
                response.response = { 'success': true, "message": "No User Found !" };
                response.status = 200;
                return response;
            }
        }else{
            response.response = { 'success': false, 'data': validationError};
            response.status = 400;
            return response;
        }
    }catch(e){
        console.log('error :::> Login 01 :::>', e);
        response.response = { success: false, message: 'Internal Server error.' };
        response.status = 500;
        return response;
    }
}

async function deleteForm(req){
    try{
        let validationError = [];
        validation.issetNotEmpty(req.query.id) ? true : validationError.push({ field: 'ID', message: 'Mandatory parameter.' });
        if (validationError.length == 0) {

  

            let from_del_sql = `Delete from public.form where id = '${req.query.id}'`
            let from_del_sql_res = await client.query(from_del_sql)
          
            if(from_del_sql_res.rowCount){
              
                response.response = { 'success': true ,"message":"Form deleted Successfully"};
                response.status = 200;
                return response;
            }else{
                response.response = { 'success': true, "message": "No data found to delete!" };
                response.status = 200;
                return response;
            }
        }else{
            response.response = { 'success': false, 'data': validationError};
            response.status = 400;
            return response;
        }
    }catch(e){
        console.log('error :::> Login 01 :::>', e);
        response.response = { success: false, message: 'Internal Server error.' };
        response.status = 500;
        return response;
    }
}


async function getform(req) {
    try {



        let acc_sql = `Select * from public.form`
        let acc_sql_res = await client.query(acc_sql)

        if (acc_sql_res.rows.length > 0) {

            response.response = { 'success': true, 'data': acc_sql_res.rows, "message": "Data fetched Successfully" };
            response.status = 200;
            return response;
        } else {
            response.response = { 'success': true, "message": "No Token Found !" };
            response.status = 200;
            return response;
        }

    } catch (e) {
        console.log('error :::> Login 01 :::>', e);
        response.response = { success: false, message: 'Internal Server error.' };
        response.status = 500;
        return response;
    }
}

async function createForm(req) {
    try {
      let body_arr = req.body
      let da;
      if (body_arr) {
  
        for (let i = 0; i < body_arr.length; i++) {
          da = body_arr[i];
          console.log("helllo",da)
        
          let insert_SQL = await qry.insertRecord(Object.keys(da), Object.values(da), 'public.form')
          console.log(insert_SQL)
        }
  
        if (Object.keys(da).length > 0) {
          response.response = { success: true, message: 'records created successfully' };
          response.status = 200;
          return response;
        } else {
          response.response = { success: false, message: 'error while inserrting record' };
          response.status = 400;
          return response;
        }
      } else {
        response.response = { success: false, message: 'Nothing to create' };
        response.status = 400;
        return response;
      }
    } catch (e) {
      let error_log = `Error ::::: 052 ::::: ${e}`
      console.log(error_log);
      response.response = { success: false, message: 'Internal Server error.' };
      response.status = 500;
      return response;
    }
  }

  async function updateForm(req) {
    try {

        var validationError = [];
        validation.issetNotEmpty(req.query.id) ? true : validationError.push({ "field": "id", "message": "Mandatory parameter." });

        if (validationError.length == 0) {
            let fieldValue = [];
            let whereClouse = [];
            whereClouse.push({ "field": "id", "value": req.query.id });
          
            let title = req.body.title ? req.body.title : ''
            
           
            let category = req.body.category ? req.body.category : ''
            
         
            let imgurl =  req.body.imgurl ?req.body.imgurl : ''
            
            let item_for_sale = req.body.item_for_sale ? req.body.item_for_sale : false
            let item_price = req.body.item_price ? req.body.item_price : 0

                var updateVisitInfo = `Update public.form set title = '${title}', category = '${category}', imgurl = '${imgurl}', item_for_sale = '${item_for_sale}', item_price = '${item_price}' where id = ${ req.query.id }`
                let updateVisitInfo_res = await client.query(updateVisitInfo)
                console.log(updateVisitInfo_res)

                if (updateVisitInfo_res.rowCount > 0) {
                    response.response = { 'success': true, "data": 'Form Updated' };
                    response.status = 200;
                    return response;
                } else {
                    response.response = { 'success': false, "data": [], "message": "Error in updating" };
                    response.status = 400;
                    return response;
                }
           
        } else {
            //console.log(validationError)
            response.response = { 'success': false, "data": [], "message": "Mandatory parameter(s) are missing.", error : validationError };
            response.status = 400;
            return response;
        }
    } catch (e) {
        console.log("Error :::::>>>>>>> 010 :::::::", e);
        response.response = { 'success': false, "data": [], "message": "Internal server error." };
        response.status = 500;
        return response;
    }
}

async function updatePassword(req) {
    try {
        let validationError = [];
        validation.issetNotEmpty(req.body.phonenumber) ? true : validationError.push({ "field": "phonenumber", "message": "Mandatory parameter." });
        validation.issetNotEmpty(req.body.token_generated) ? true : validationError.push({ "field": "token_generated", "message": "Mandatory parameter." });
        validation.issetNotEmpty(req.body.new_password) ? true : validationError.push({ "field": "new_password", "message": "Mandatory parameter." });

        if (validationError.length == 0) {

            let todayDate = dtUtil.todayDate()
            let check_sql = `SELECT * FROM salesforce.${SF_TEAM_TABLE_NAME} WHERE phone_number__c = '${req.body.phonenumber}' AND password__c='${req.body.token_generated}'`
            let result_check_sql = await client.query(check_sql)

            if (result_check_sql.rows.length > 0) {

                let fieldValue = [{ "field": "token__c", "value": null, "type": 'BOOLEAN' }];
                let WhereClouse = [{ "field": "date__c", "value": `${todayDate}` },
                { "field": "team__c", "value": `${result_check_sql.rows[0].sfid}` }];

                let token_null = await qry.updateRecord(SF_TOKEN, fieldValue, WhereClouse);
                if (token_null.success) {
                    let update_sql = `UPDATE salesforce.${SF_TEAM_TABLE_NAME} SET password__c='${req.body.new_password}' WHERE phone_number__c = '${req.body.mobile__c}'`
                    let result_update_sql = await client.query(update_sql)

                    if (result_update_sql.rowCount) {
                        response.status = 200;
                        response.response = { success: true, message: 'Password updated' };
                        return response;
                    } else {
                        response.status = 400;
                        response.response = { success: false, message: 'Error occurred while updating password' };
                        return response;
                    }
                } else {
                    response.status = 400;
                    response.response = { success: false, message: 'Please try again not able to clear the session' };
                    return response;
                }
            } else {
                response.status = 400;
                response.response = { success: false, message: 'Either generated token or username is incorect' };
                return response;
            }
        } else {
            response.response = { 'success': false, "data": validationError, "message": "Mandatory parameter(s) are missing.", error: validationError };
            response.status = 400;
            return response;
        }
    } catch (e) {
        let error_log = `Error ::::: 013 ::::: ${e}`
        console.log(error_log);
        func.mailErrorLog(error_log, req.route['path'], req.body, req.query, req.headers.token, req.headers['client-name']);
        response.response = { success: false, message: 'Internal Server error.' };
        response.status = 500;
        return response;
    }
}