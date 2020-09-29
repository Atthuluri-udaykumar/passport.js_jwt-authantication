const Joi = require("@hapi/joi");

const signUpValidaton = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}

const signInValidaton = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}

module.exports.signUpValidaton = signUpValidaton
module.exports.signInValidaton = signInValidaton
