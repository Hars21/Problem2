import express from 'express'
const router = express.Router();
 import _ from 'lodash'
import singleImageUpload from '../../../utility/imageUpload.js'
var singleUpload=singleImageUpload.single("image");
router.post('/single', uploadSingleImage);
export default router;




async function uploadSingleImage(req, res, next) {
    try {

            singleUpload(req, res, function (err) {
                if (err) {
                  return res.json({
                    success: false,
                    errors: {
                      title: "Image Upload Error",
                      detail: err.message,
                      error: err,
                    },
                  });
                }

                // console.log(res);
                res.status(200).json({ "success": true, "url":req.file.location})
            })
        
    } catch (e) {
        console.log("Error :::::>>>>>>> 073 :::::::", e);
        res.status(500).json({ "success": false, "message": "INTERNAL_SERVER_ERROR" });
    }
}

