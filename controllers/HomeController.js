class HomeController {

    async index(req, res) {
        res.send("APP EXPRESS! - Guia do programador");
    }

    async validate(request, response) {
        response.send({success: true, message: 'Token válido!'})
    }

}

module.exports = new HomeController();