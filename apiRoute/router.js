import express from 'express'
const app = express();
import formCtrl from '.././modules/form/form.controller.js'
import imageCtrl from '../modules/form/uploadImage/uploadImage.controller.js'



app.use('/form',formCtrl);
app.use('/image',imageCtrl);

export default  app ;