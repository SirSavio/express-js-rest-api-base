const validator = require('validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
        let result = await User.update(id, email, name, role)
        return result.success ? response.status(200).send(result) : result.status(406).send(result)
    }

}

module.exports = new UserController