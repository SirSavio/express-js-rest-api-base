const knex = require('../database/connection');
const PasswordToken = require('./PasswordToken');

class User{
    async create(user){
        try {
            await knex.insert({...user, role: 'c'}).table('users');
            return {success: true};
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async findEmail(email){
        try {
            let user = await knex.select().from('users').where({email});
            return user.length ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async findAll(){
        try {
            return await knex.select(['id', 'name', 'email', 'role']).table('users');
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findOne(id){
        try {
            let user =  await knex.select(['id', 'name', 'email', 'role']).where({id}).table('users');
            return user.length ? user[0] : undefined
        } catch (error){
            console.log(error);
            return undefined;
        }
    }

    async findByEmail(email){
        try {
            let user =  await knex.select(['id', 'name', 'email', 'password', 'role']).where({email}).table('users');
            return user.length ? user[0] : undefined
        } catch (error){
            console.log(error);
            return undefined;
        }
    }

    async update(data, id){
        try {
            await knex.update(data).where({id}).table('users')
            return {success: true, message: 'Usuário atualizado!'}
        } catch (error) {
            console.log(error)
            return {success: false, message: error.message}
        }
    }

    async destroy(id){
        try {
            await knex.delete().where({id}).table('users')
            return {success: true, message: 'Deleção sucesso!'}
        } catch (error) {
            return {success: false, message: 'Deleção falhou!'}
        }
    }

    async changePassword(newPassword, id, token){
        try {
            await knex.update({password: newPassword}).where({id}).table('users')
            await PasswordToken.setUsed(token)
            return {success: true, message: 'Senha alterada!'}
        } catch (error) {
            console.log(error)
            return {success: false, message: error.message}
        }
    }


}

module.exports = new User()