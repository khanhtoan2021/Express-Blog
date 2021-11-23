var postCategoryModel = require('../models/postCategoryModel');
var express = require('express');
var router = express.Router();
router.post('/addCategory',(req,res,next)=>{
	const {body}=req;
	res.send(body);

});

module.exports = router;
