const express =require('express')
const router =express.Router()
router.use(express.json());
const AuthController = require ('../Controllers/AuthController')


router.post('/register', AuthController.register)

router.post('/login', AuthController.login)
 
router.post('/refresh-token',AuthController.refreshToken )



module.exports =router