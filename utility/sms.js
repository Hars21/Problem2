
import dotenv from 'dotenv';
dotenv.config();
import request from "request" 

import otpGenerator from 'otp-generator'

// var twilio = require('twilio');

// Find your account sid and auth token in your Twilio account Console.



function sendOTPLogin(mobile,otp)
{
 
    // req.end();
    var options = {
      'method': 'GET',
      // "hostname": "http://sms6.rmlconnect.net",
      // "port": 8080,
      'url': `https://onlysms.co.in/api/otp.aspx?UserID=cementop&UserPass=Cement@123&MobileNo=${mobile}&GSMID=GUJSID&PEID=1101501300000021325&Message=OTP / Verification Code to login SFDC App is ${otp} -Test 1 Limited&TEMPID=1107164119315501853&UNICODE=TEXT`,
      'headers': {
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });
}

const generateOTP = () => { 
  return otpGenerator.generate(4, { upperCase: false, specialChars: false,alphabets:false});
};


  module.exports = {
    sendOTPLogin,
    generateOTP
};
