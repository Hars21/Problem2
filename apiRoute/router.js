import express from 'express'
const app = express();
import formCtrl from '.././modules/form/form.controller.js'



app.use('/form',formCtrl);

export default  app ;