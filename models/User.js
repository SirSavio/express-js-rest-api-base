const knex = require('../database/connection');

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
            return user.length ? user : undefined
        } catch (error){
            console.log(error);
            return undefined;
        }
    }

    async update(id, email, name, role){
        const user = this.findOne(id)
        let data = {}

        if(user){
            if(email && email != user.email){
                let existsEmail = await this.findEmail(email)
                if(!existsEmail) data.email = email
                else return {success: false, message: 'Email já cadastrado!'}
            }
        }else return {success: false, message: 'Usuário não existe!'}

        if(name) data.name = name
        if(role) data.role = role

        try {
            await knex.update(data).where({id}).table('users')
            return {success: true, message: 'Usuário atualizado!'}
        } catch (error) {
            console.log(error)
            return {success: false, message: error.message}
        }
        
        
    }
}

module.exports = new User()