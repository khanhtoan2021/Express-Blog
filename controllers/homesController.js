var express = require('express');
var router = express.Router();
var postModel = require('../models/postModel');
var commentModel = require('../models/commentModel');
var userModel = require('../models/userModel');
var mongoose = require("mongoose");
var moment = require('moment');//format datetime vd: moment().format("YYYY-MM-DD HH:mm:ss");
module.exports.home = async (req,res,next)=>{
	let detailPost=await postModel.postModel.aggregate([{$match: {_id: new mongoose.Types.ObjectId(req.params.id)}},
		{$lookup:{
			from:"users",
			localField:"users_id",
			foreignField:"_id",
			as:"user"
		}},
		{$lookup:{
			from:"postCategories",
			localField:"postCategories_id",
			foreignField:"_id",
			as:"postCategory"
		}},
		{$lookup:{
			from:"comments",
			localField:"_id",
			foreignField:"posts_id",
			as:"comments"
		}},
		{$lookup:{
			from:"users",
			localField:"comments.users_id",
			foreignField:"_id",
			as:"commentUsers"
		}}])
	//res.send(detailPost);
	console.log(req.session.user);
	res.render('Homes/home',{val:detailPost,session:req.session.user[0],moment})
  //res.render('Homes/home',{session:req.session.userID});
};
