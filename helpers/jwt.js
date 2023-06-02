const jwt = require('jsonwebtoken')
const createError= require('http-errors')



module.exports  = { 
    signAccesToken: (userId) =>{
        return new Promise((resolve, reject) =>{
            const payload ={ aud: userId , iss:"pickurpage.com" }
            const secret = "2ffa9883d1fb3df235005910c798409bb6baaaa964f0ef7c50c65ed22113b17a"
            const options = {
                expiresIn: "30s"
            }
            jwt.sign(payload , secret , options, (err, token)=>{
                if(err) {
                    console.log(err.message)
                    
               reject(createError.InternalServerError())
                }
                
                resolve(token)
            })
        })
    },


    verifyAccessToken: (req, res, next)=>{
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const autHeader = req.headers['authorization']
        const bearerToken = autHeader.split(' ')
        const token = bearerToken[1]
        const secret= "2ffa9883d1fb3df235005910c798409bb6baaaa964f0ef7c50c65ed22113b17a"
        jwt.verify(token, secret, (err, payload)=>{
            if(err){
                return next(createError.Unauthorized())
            }
            req.payload = payload
            next()
        })
    },



    signRefreshToken: (userId) =>{
        return new Promise((resolve, reject) =>{
            const payload ={ aud: userId , iss:"pickurpage.com" }
            const secret = process.env.REFRESH_TOKEN_SECRET
             const options = {
                expiresIn: "1y"
            }
            jwt.sign(payload , secret , options, (err, token)=>{
                if(err) {
                    console.log(err.message)
                    
               reject(createError.InternalServerError())
                }
                
                resolve(token)
            })
        })
    },

    verifyRefreshToken:(refreshToken) =>{
        return new Promise((resolve, reject)=>{
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload)=>{
                if(err) return reject(createError.Unauthorized())
                const userId = payload.aud
                resolve(userId)
            })
        })
    }
}













