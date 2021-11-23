var postModel = require('../models/postModel');
var commentModel = require('../models/commentModel');
var userModel = require('../models/userModel');
const mongoose = require("mongoose");
var postCategoryModel = require('../models/postCategoryModel');
var moment = require('moment');//format datetime vd: moment().format("YYYY-MM-DD HH:mm:ss");

var express = require('express');
var router = express.Router();

module.exports.listAll = async (req,res,next)=>{
	let detailPost=await postModel.postModel.aggregate([
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
		}}])
	res.render('Posts/listAll',{val:detailPost,session:req.session.user[0],moment})
};
module.exports.addPostForm = (req,res,next)=>{
	postCategoryModel.find({},'article').then((val)=>{
    res.render('Posts/addPost',{Category:val,session:req.session.user[0]});
  })
};
module.exports.addPost= (req,res,next)=>{
	const{body,file}=req;
  let dateTime=moment().format("YYYY-MM-DD HH:mm:ss");
	body.thumbnail=file.filename;
	body.users_id=req.session.user[0]._id;
	body.created=dateTime;
	delete body.article;
	postModel.postModel.create(body).then((val)=>{
		res.redirect('/posts/listAll');
	}).catch((err)=>{
		res.send(err);
	});
};
module.exports.uploadImages = (req,res,next)=>{
	const {file}=req;
	let str={
		fileName:file.filename,
		uploaded:1,
		url: `/img/contents/`+file.filename
	}
	res.json(str);
};
module.exports.detail = async (req,res,next)=>{
	let detailPost = await postModel.getPostDetail(req.params.id);
	//let detailPost = await postModel.getPostDetailNew(req.params.id);
	res.render('Posts/detail',{kq:detailPost,session:req.session.user[0],moment})
	//res.send(detailPost);
};
module.exports.addComment = async (req,res,next)=>{
	const {body}=req;
  let dateTime=moment().format("YYYY-MM-DD HH:mm:ss");
  let maxParent=await postModel.getMaxParent();
  //let maxChild=await postModel.getMaxChild(1);
	let addComment=await commentModel.create({
		content:body.content,
		users_id:req.params.userId,
		posts_id:req.params.postId,
		path:maxParent+1,
		created:dateTime
	})
	.then(val=>{
		//console.log(val);
		res.json(JSON.stringify({val,session:req.session.user[0]}));
	}).catch(err=>{res.send(er)});
};
module.exports.testupdate = (req,res,next)=>{
	let a=0;
	let id=a+'\\.';
	let reg=new RegExp(id,"g");
	console.log(reg);
	commentModel.aggregate(
		[
			{$match: { path:reg}},
			{$project:{
				path:1,
				created:1
			}},
			{$sort:{created:-1}},
			{ $limit: 1 }
		]
	)
	.then(val=>{
		// let kq=val[0].path.split('.');
		// console.log(parseInt(kq[1]));
		res.send(val);
	})

	// commentModel.aggregate(
	// 	[
	// 		{$match: { path:{$not:/\./} }},
	// 		{$project:{
	// 			path:1,
	// 			created:1
	// 		}},
	// 		{$sort:{created:-1}},
	// 		{ $limit: 1 }
	// 	]
	// )
	// .then(val=>{
	// 	console.log(parseInt(val[0].path));
	// 	res.send(val);
	// })
	
}
module.exports.addReply = async (req,res,next)=>{
	const {body}=req;
	//console.log(body);
	let dateTime=moment().format("YYYY-MM-DD HH:mm:ss");
	let id=body.reply_id.split('_');// id includes: users_id, posts_id, commentPath
  let maxChild=await postModel.getMaxChild(id[2]);
	commentModel.create({
		content:body.content,
		users_id:id[0],
		posts_id:id[1],
		path:`${id[2]}.${maxChild+1}`,
		created:dateTime
	}).then(val=>{
		console.log(val);
		//res.json({'id':'ok'});
		res.json(JSON.stringify({val,session:req.session.user[0]}));
	})
};

