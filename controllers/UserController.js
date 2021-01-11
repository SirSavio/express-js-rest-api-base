const validator = require('validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const PasswordToken = require('../models/PasswordToken');
const jwt = require('jsonwebtoken');

const secret = 'ajisdbnisofubnsagmtwebhkomnpksaodnvbaesvuiosagvbuisaob'

class UserController{
    async index(request, response){
        response.json(await User.findAll())
    }

    async create(request, response){
        const {email, name, password} = request.body
        if(!email 
            || !name 
            || !password 
            || !validator.isEmail(email)
            || !validator.isLength(password, {min: 6})
            || !validator.isLength(name, {min: 6})) response.status(400).send({error: "Dados inválidos"})
        else{
            let existEmail = await User.findEmail(email)
            if(existEmail){
                response.status(406).send({error: "Email já cadastrado!"})
                return
            }

            const hash = await bcrypt.hash(password, 10)
            const success = await User.create({email, name, password: hash})
            success.success ? response.status(200).send({message: "Cadastrado com sucesso!"}) : response.status(400).send({message: success.message})
        }
    }

    async show(request, response){
        const id = request.params.id;
        let user = await User.findOne(id);
        user ? response.status(200).send({user}) : response.status(404).send({massage: 'Usuário não encontrado!'})
    }

    async update(request, response){
        const {id, name, email, role} = request.body;
        let data = {}
        const user = await User.findOne(id)

        if(user){
            if(email && email != user.email){
                let existsEmail = await User.findEmail(email)
                if(!existsEmail) data.email = email
                else return {success: false, message: 'Email já cadastrado!'}
            }
        }else return {success: false, message: 'Usuário não existe!'}

        if(name) data.name = name
        if(role) data.role = role


        let result = await User.update(data, id)
        return result.success ? response.status(200).send(result) : response.status(406).send(result)
    }

    async destroy(request, response){
        const id = request.params.id
        const user = await User.findOne(id)

        if(!user) {
            response.status(400).send({success: false, message: 'Usuário não existe'})
            return
        }

        let result = await User.destroy(id)
        result.success ? response.send(result) : response.status(400).send(result)
    }

    async recoverPassword(request, response){
        const email = request.body.email
        const result = await PasswordToken.create(email)
        result.success ? response.send(result) : response.status(400).send(result)
    }

    async changePassword(request, response){
        const {token, password} = request.body;
        const isValid = await PasswordToken.validate(token);

        if(isValid.success){
            const hash = await bcrypt.hash(password, 10)
            const result = await User.changePassword(hash, isValid.token.user_id, isValid.token.token)

            result.success ? response.status(200).send(result) : response.status(400).send(results)
        }else response.status(406).send({success: false, message: 'Token inválido'})
    }

    async login(request, response){
        const {email, password} = request.body;
        const user = await User.findByEmail(email);

        if(user){
            let isValid = await bcrypt.compare(password, user.password)
            if(isValid){
                const token = jwt.sign({email: user.email, role: user.role}, secret)
                response.status(200).send({success: true, token})
            }else response.status(401).send({sucess: false, message: 'Senha inválida!'})
        }else response.status(400).send({success: false, message: 'E-mail não cadastrado!'})
    }
}

module.exports = new UserController