var response = { "status": 200, "response": "" };
import {cryptoRandomStringAsync} from 'crypto-random-string';
import validation from '../../utility/validation.js';
import qry from '../../utility/selectQueries.js';
import dtUtil from './../../utility/dateUtility.js';
import sms from '../../../utility/sms.js'



export default  {
    signup,
    generateOtp,
    verifyOtp
};

async function signup(req) {
    try {
      let body_arr = req.body
      let da;
      if (body_arr) {
  
        for (let i = 0; i < body_arr.length; i++) {
          da = body_arr[i];
        
          let insert_SQL = await qry.insertRecord(Object.keys(da), Object.values(da), 'public.form')
          console.log(insert_SQL)
        }
  
        if (Object.keys(da).length > 0) {
          response.response = { success: true, message: 'SignUp successfully' };
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

  async function generateOtp(req) { //{ username,type }
    try {
        var validationError = [];
        validation.issetNotEmpty(req.query.mobile) ? true : validationError.push({ "field": "mobile__c", "message": "Mandatory parameter." });
        if (validationError.length == 0) {
            let fields = ['*']
            let tableName = `public."user"`;
            var offset = '0', limit = '1';
            let WhereClouse = [];
            WhereClouse.push({ "fieldName": "mobile", "fieldValue": req.query.mobile});

            let sql = qry.SelectAllQry(fields, tableName, WhereClouse, offset, limit);
            console.log("sql in sendOTP :: ", sql)
            let user = await client.query(sql);
            if (user.rowCount > 0) {
                var genrateOtp = sms.generateOTP();

                // if (user.rows[0].username) {
                //     emailmo.email_otp(user.rows[0].username, genrateOtp)
                // }

                sms.sendOTPLogin(user.rows[0]['mobile'], genrateOtp);

                let fieldValue = [];
                let whereClouse = [];
                whereClouse.push({ "field": "id", "value": user.rows[0]['id'] });
                fieldValue.push({ "field": "otp", "value": genrateOtp });
                var updateSql = await qry.updateRecord('public."user"', fieldValue, whereClouse)

                if (updateSql.success) {
                    response.response = { 'success': true, "data": genrateOtp, "message": "OTP Sent successfully.", "error": [] };
                    response.status = 200;
                    return response;
                } else {
                    response.response = { 'success': false, "data": [], "message": "Error in sending OTP", "error": [] };
                    response.status = 400;
                    return response;
                }
            } else {
                response.status = 400;
                response.response = { "success": false, "message": "Invalid login credentials.", "error": [] };
                return response;
            }
        } else {
            response.status = 400;
            response.response = { "success": false, "message": "mandatory parameter missing", "error": validationError };
            return response;
        }
    } catch (e) {
        let error_log = `Error ::::: 017 ::::: ${e}`
        console.log(error_log);
        response.response = { success: false, message: 'Internal Server error.' };
        response.status = 500;
        return response;
    }

}

async function verifyOtp(req) { //{ username, password }
    try {
        var validationError = [];
        validation.issetNotEmpty(req.query.otp) ? true : validationError.push({ "field": "otp", "message": "Mandatory parameter." });
        validation.issetNotEmpty(req.query.mobile) ? true : validationError.push({ "field": "mobile", "message": "Mandatory parameter." });

        if (validationError.length == 0) {

            let fields = ['*']
            let tableName = `public."user"`
            var offset = '0', limit = '1';
            let WhereClouse = [];
            WhereClouse.push({ "fieldName": "mobile", "fieldValue": req.query.mobile });
            WhereClouse.push({ "fieldName": "otp", "fieldValue": req.query.otp });

            let sql = qry.SelectAllQry(fields, tableName, WhereClouse, offset, limit, ' order by createddate desc');
            //    console.log("sql in sendOTP ---> ",sql)
            let user = await client.query(sql);
            if (user.rowCount > 0) {


                response.response = { 'success': true, "message": "Login Successfully using otp.", "error": [] };
                response.status = 200;
                return response;
               
            } else {
                response.status = 400;
                response.response = { "success": false, "message": "Invalid OTP or wrong login credentials.", "error": [] };
                return response;
            }
        } else {
            response.status = 400;
            response.response = { "success": false, "message": "mandatory parameter missing", "error": validationError };
            return response;
        }
    } catch (e) {
        let error_log = `Error ::::: 018 ::::: ${e}`
        console.log(error_log);
        func.mailErrorLog(error_log, req.route['path'], req.body, req.query, req.headers.token, req.headers['client-name']);
        response.response = { success: false, message: 'Internal Server error.' };
        response.status = 500;
        return response;
    }
}