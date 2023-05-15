import express from 'express'
var router = express.Router();
import loginServices from "./login.service.js"
import _ from 'lodash'
import cors from 'cors'
import validation from '../../utility/validation.js';


router.post('/signup', cors(), signup);
router.get('/generateOtp', cors(), generateOtp);
router.post('/verifyOtp', cors(), verifyOtp);





async function signup(req, res, next) {
    try {

        loginServices.signup(req)
            .then(states => res.status(states.status).json(states.response))
            .catch(err => next(err));

    } catch (e) {
        res.status(500).json({ "success": false, "error": "Internal server error." });
    }
}


async function generateOtp(req, res, next) {
    try {

        loginServices.generateOtp(req)
            .then(states => res.status(states.status).json(states.response))
            .catch(err => next(err));

    } catch (e) {
        res.status(500).json({ "success": false, "error": "Internal server error." });
    }
}

function verifyOtp(req, res, next) {
    try {
        loginServices.verifyOtp(req)
            .then(states => res.status(states.status).json(states.response))
            .catch(err => next(err));
    } catch (e) {
        res.status(500).json({ "success": false, "error": "Internal server error." });
    }
}











export default router;
