import express from 'express'
import    aws from 'aws-sdk'
import    bodyParser from 'body-parser'
import    multer from 'multer'
import    multerS3 from 'multer-s3'

aws.config.update({
    secretAccessKey: process.env.CLOUDCUBE_SECRET_ACCESS_KEY,
    accessKeyId: process.env.CLOUDCUBE_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
});

var app = express(),
    s3 = new aws.S3();
app.use(bodyParser.json());



const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: "cloud-cube-us2",
    key: function(req, file, cb) {
      // console.log(file);
      const myFileName = process.env.CLOUDCUBE_BUCKET + Math.floor((Math.random() * 1000000) + 1)+"_"+ Date.now()+file.originalname;
      // console.log(myFileName);
      cb(null, myFileName);
    }
  }),
});

export default upload;