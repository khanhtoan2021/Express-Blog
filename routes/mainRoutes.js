var express = require('express');
var router = express.Router();
var validator = require('../routes/validatorController');
var fs = require('fs');
var multer = require('multer');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let imgFolder;
		if (file.fieldname==="upload") { //These images from content of Post page
			imgFolder="contents";
		}else if(file.fieldname==="thumbnail") { //These images from content of Post page
			imgFolder="contents/thumbnails";
		}
		else if(file.fieldname==="avatars") { //These images from avarta of User page
			imgFolder="avatars";
		}else{
			imgFolder="temp"; //These images from other pages
		}
		cb(null, process.cwd() + "/public/img/"+imgFolder); //Đường dẫn upload ảnh
	},
	filename: (req, file, cb) => {
		//File lúc này sẽ được lưu vào vùng nhớ tạm thời
		cb(null, Date.now() +"_" +  file.originalname);
	}
});
const upload = multer({ storage: storage });
//Routes for home page
var homesController = require('../controllers/homesController');
router.get('/',homesController.home);

//Routes for user page
var usersController = require('../controllers/usersController');
router.get('/users/login',usersController.getLogin);
router.get('/users/logout',usersController.getLogout);
router.get('/users/register',usersController.getRegister);
router.post('/users/login',validator.validateLogin, usersController.postLogin);
router.post('/users/register',upload.single("avatar"),validator.validateRegister,usersController.postRegister);

//Routes for post page
var postsController = require('../controllers/postsController');
router.get('/posts/listAll',postsController.listAll);
router.get('/posts/detail/:id',postsController.detail);
router.get('/posts/addPost',postsController.addPostForm);
router.post('/posts/uploadImages',upload.single("upload"),postsController.uploadImages);
router.post('/posts/addPost',upload.single("thumbnail"),postsController.addPost);
router.post('/posts/comment/userId/:userId/postId/:postId',upload.single("upload"),postsController.addComment);
// router.post('/posts/reply11',upload.single("upload"),postsController.addReply1);
router.post('/posts/reply',postsController.addReply);

router.get('/posts/testupdate',postsController.testupdate);
module.exports=router;