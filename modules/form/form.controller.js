import express from 'express'
var router = express.Router();
import formServices from "./form.service.js"
import _ from 'lodash'
import cors from 'cors'
import validation from '../../utility/validation.js';


router.post('/createForm',cors(), createForm);
router.get('/deleteForm',cors() ,deleteForm);
router.get('/getform',cors(), getform);
router.post('/signup', signup);
router.post('/updateForm',cors() ,updateForm);





async function createForm(req, res, next) {
  try {
   
    formServices.createForm(req)
      .then(states => res.status(states.status).json(states.response))
      .catch(err => next(err));

  } catch (e) {
    res.status(500).json({ "success": false, "error": "Internal server error." });
  }
}

async function deleteForm(req, res, next) {
  try {
    formServices.deleteForm(req)
        .then(states => res.status(states.status).json(states.response))
        .catch(err => next(err));
   
  } catch (e) {
    res.status(500).json({ "success": false, "error": "Internal server error." });
  }
}

async function getform(req, res, next) {
  try {
    formServices.getform(req)
      .then(states => res.status(states.status).json(states.response))
      .catch(err => next(err));

  } catch (e) {
    res.status(500).json({ "success": false, "error": "Internal server error." });
  }
}

async function signup(req, res, next) {
  try {
    formServices.signup(req)
      .then(states => res.status(states.status).json(states.response))
      .catch(err => next(err));

  } catch (e) {
    res.status(500).json({ "success": false, "error": "Internal server error." });
  }
}

async function updateForm(req, res, next) {
  try {
      formServices.updateForm(req)
        .then(states => res.status(states.status).json(states.response))
        .catch(err => next(err));
   
  } catch (e) {
    res.status(500).json({ "success": false, "error": "Internal server error." });
  }
}

// async function logout(req, res, next) {
//   try {
//     if (!_.isEmpty(req.headers.token) && await validation.isValidToken(req.headers.token) != false) {
//       loginServices.logout(req)
//         .then(states => res.status(states.status).json(states.response))
//         .catch(err => next(err));
//     } else {
//       res.status(400).json({ "success": false, "message": "You do not have authorised access." });
//     }
//   } catch (e) {
//     res.status(500).json({ "success": false, "error": "Internal server error." });
//   }
// }

export default router;
