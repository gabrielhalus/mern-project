const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const {signUpErrors, signInErrors} = require('../utils/errors.utils')

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn: '3d'})
}

module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body

    try {
        const user = await UserModel.create({pseudo, email, password})
        res.status(201).json({ user: user._id })
    }
    catch(err) {
        const errors = signUpErrors(err)
        res.status(500).send({ errors })
    }
}

module.exports.signin = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await UserModel.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: (3 * 24 * 60 * 60)})
        res.status(200).json({ user : user._id })
    }
    catch(err) {
        const errors = signInErrors(err)
        res.status(500).send({ errors })
    }
}

module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 0.001 })
    res.redirect('/')
}