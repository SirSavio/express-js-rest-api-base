const bcrypt = require('bcrypt');
const knex = require('../database/connection');

class PasswordToken {
    async create(user_id) {
        const token = Date.now()
        try {
            await knex.insert({
                user_id,
                used: 0,
                token
            }).table('password_tokens')
            return { success: true, message: 'Token gerado!', token }
        } catch (error) {
            console.log(error)
            return { success: false, message: 'Falha ao gerar código!' }
        }
    }

    async validate(token){
        try {
            const result = await knex.select().where({token}).table('password_tokens')
            if(result.length){
                const tk = result[0]
                if(!tk.used) return {success: true, token: tk, message: 'Token válido'}
                else return {success: false, message: 'Token inválido'}
            }else return {success: false, message: 'Token inválido'}
        } catch (error) {
            console.log(error)
            return {success: false, message: error.message}
        }
       
    }

    async setUsed(token){
        await knex.update({used: 1}).where({token}).table('password_tokens')
    }
}

module.exports = new PasswordToken()