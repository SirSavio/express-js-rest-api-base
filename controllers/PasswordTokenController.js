const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');

class PasswordTokenController{
    async create(request, response){
        const email = request.body.email
        const user = await User.findByEmail(email);
        if(user){
            let result = await PasswordToken.create(user.id)
            result.success ? response.send(result) : response.status(400).send(result)
        }else response.status(400).send({success: false, message: 'Usuário não cadastrado'})
    }
}

module.exports = new PasswordTokenController()