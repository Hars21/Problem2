var express = require('express'),
    aws = require('aws-sdk'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
    accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
});

var app = express(),
    s3 = new aws.S3();
app.use(bodyParser.json());



const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "cloud-cube-us2",
    key: function(req, file, cb) {
      // console.log(file);
      const myFileName = process.env.CLOUDCUBE_BUCKET + Date.now()+file.originalname;
      // console.log(myFileName);
      cb(null, myFileName);
    }
  })
});

export default  upload;