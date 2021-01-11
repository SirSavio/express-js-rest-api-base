const jwt = require('jsonwebtoken');
const secret = 'ajisdbnisofubnsagmtwebhkomnpksaodnvbaesvuiosagvbuisaob'

module.exports = function(request, response, next){
    const authToken = request.headers['authorization']
    if(authToken){
        const bearer = authToken.split(' ')
        const token = bearer[1]

        const decod = jwt.verify(token, secret)
        if(decod.role == 'a') next()
        else response.status(403).send({success: false, message: 'Você não tem permissão!'})
    }else{
        response.status(403).send({success: false, message: 'Token inválido'})
    }
}