import express from 'express'
import cors from 'cors'
// global.PROJECT_DIR = "./";
const app = express();
import bodyParser from 'body-parser';
import route from './apiRoute/router.js'
import pkg from 'pg'
const { Client } = pkg
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


/* Middlewares */
//For express
app.use(bodyParser.json({ limit: '200mb' }))
app.use(express.static('public'));
// app.use(bodyParser.text({ limit: '200mb' }));


/** Port Setting */
const port = process.env.PORT || '8080';
app.set('port', port);
app.use('/',route)
app.listen(port, () => {
    console.log(`LIVE on PORT ${port}`)
})

//For GraphQL
// const root = {
//   hello: () => {
//     return "Hello world!"
//   },
// }




global.client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false }
})
//console.log(`Client ----> ${JSON.stringify(client)}`);
client.connect(function (err) {
    if (err) { throw err; }
    else { console.log("Connected To PostGres Database"); }
});
