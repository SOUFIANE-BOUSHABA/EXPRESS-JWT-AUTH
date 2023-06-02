const joi = require('@hapi/joi')

const authSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
})

module.exports = {
    authSchema,
}