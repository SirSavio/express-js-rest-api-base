class HomeController {

    async index(req, res) {
        res.send("APP EXPRESS! - Guia do programador");
    }

    async teste(request, response) {
        

    }

}

module.exports = new HomeController();