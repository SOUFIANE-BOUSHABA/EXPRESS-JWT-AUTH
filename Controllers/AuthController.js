
const createError = require('http-errors');
const User = require('../Models/User.model')
const {authSchema} = require('../helpers/validation.schema')

const {signAccesToken, signRefreshToken, verifyAccessToken, verifyRefreshToken} = require('../helpers/jwt')

const accessTokenExpiry = 24 * 60 * 60 * 1000; 
const refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000; 



module.exports = {
   

        register:async(req,res,next)=>{
                try {
                    const {email , password } = req.body
                    const result = await authSchema.validateAsync(req.body)
                 
                    
                   const doesExist=  await User.findOne({ email : result.email})
                   if(doesExist) throw createError.Conflict(' this email  alredy regester')
            
                   const user = new User({email , password})
                   const savedUser = await user.save()
                   const accesToken = await signAccesToken(savedUser.id)
                   const refreshToken =await signRefreshToken(savedUser.id)
                  
                   res.cookie('accessToken', accesToken, {
                    httpOnly: true,
                    expires: new Date(Date.now() + accessTokenExpiry),
                  });
                  
                  res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    expires: new Date(Date.now() + refreshTokenExpiry),
                  });
            
            
            
                   res.send({accesToken},refreshToken)
            
            
                } catch (error) {
                    if(error.isJoi === true) error.status = 422
                    next(error)
                }
            },



        login:async(req,res,next)=>{

            try {
                const result = await authSchema.validateAsync(req.body)
                const user=  await User.findOne({ email : result.email})
                if(!user) throw createError.NotFound(' not regester')
              
                const isMatch = await user.isValidPassword(result.password)
                if(!isMatch)throw createError.Unauthorized('username/password not valid')
                
                const accesToken =await signAccesToken(user.id)
                const refreshToken =await signRefreshToken(user.id)
        
                res.cookie('accessToken', accesToken, {
                    httpOnly: true,
                    expires: new Date(Date.now() + accessTokenExpiry),
                  });
                  
                  res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    expires: new Date(Date.now() + refreshTokenExpiry),
                  });
        
                res.send({accesToken, refreshToken})
        
            } catch (error) {
                if(error.isJoi === true) error.status = 422
                next(error)
            }
        },




        refreshToken:async(req,res,next)=>{
            try {
                const {refreshToken} = req.body
                if(!refreshToken) throw createError.BadRequest()
               const userId = await verifyRefreshToken(refreshToken)
               const accesToken = await signAccesToken(userId)
               const refreshtoken = await signRefreshToken(userId)
         
               res.cookie('accessToken', accesToken, {
                 httpOnly: true,
                 expires: new Date(Date.now() + accessTokenExpiry),
               });
               
               res.cookie('refreshToken', refreshtoken, {
                 httpOnly: true,
                 expires: new Date(Date.now() + refreshTokenExpiry),
               });
         
               res.send({accesToken, refreshToken: refreshtoken })
         
            } catch (error) {
               next(error)
            }
         }
}