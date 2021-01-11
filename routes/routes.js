var express = require("express")
var app = express();
var router = express.Router();

const HomeController = require("../controllers/HomeController");
const UserController = require('../controllers/UserController');
const PasswordTokenController = require("../controllers/PasswordTokenController");
const AdminAuth = require('../middleware/AdminAuth')

router.get('/', HomeController.index);

router.post('/user', UserController.create)
router.get('/user', AdminAuth, UserController.index)
router.get('/user/:id', UserController.show)
router.put('/user', UserController.update)
router.delete('/user/:id', UserController.destroy)

router.post('/recover', PasswordTokenController.create)
router.post('/changepassword', UserController.changePassword)

router.post('/login', UserController.login)
router.post('/validate', AdminAuth, HomeController.validate)
module.exports = router;