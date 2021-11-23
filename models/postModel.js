require('../configDatabase/connectDb');//chèn model database vào đế kết nối db
var mongoose = require('mongoose');
var MySchema = mongoose.Schema;
var commentModel = require('../models/commentModel');
var post = new MySchema({
	title: String,
	content: String,
	thumbnail:String,
	postCategories_id: { type: mongoose.Types.ObjectId, ref: 'postCategories' },
	users_id: { type: mongoose.Types.ObjectId, ref: 'users' },
	created:Date,
	modified:Date
}, {
	collection: 'posts'
});
var postModel = mongoose.model('posts', post);
var getPostDetailNew = (postId) => {
	return new Promise((resolve, reject) => {
		postModel.aggregate([{$match: {_id: new mongoose.Types.ObjectId(postId)}},
			{$lookup:{
				from:"users",
				localField:"users_id",
				foreignField:"_id",
				as:"postUserInfor"
			}},
			{$lookup:{
				from:"postCategories",
				localField:"postCategories_id",
				foreignField:"_id",
				as:"postCategory"
			}},
			{$lookup:{
				from:"comments",
				let: {postId: "$_id"},
				
				pipeline: [{
					$match: {
						$expr:{
							$eq: ["$$postId","$posts_id"]
						}
					}
				},{$sort:{path:1}},
				{
					$lookup:{
					from:"users",
					localField:"users_id",
					foreignField:"_id",
					as:"commentUserInfor"
				}}],
				as:"commentList"
			}}
		]).then(detailPost => {
			return resolve(detailPost);
		}).catch(err => {
			return reject(err);
		})
	});
}
var getPostDetail = (postId) => {
	return new Promise((resolve, reject) => {
		postModel.aggregate([{$match: {_id: new mongoose.Types.ObjectId(postId)}},
			{$lookup:{
				from:"users",
				localField:"users_id",
				foreignField:"_id",
				as:"postUserInfor"
			}},
			{$lookup:{
				from:"postCategories",
				localField:"postCategories_id",
				foreignField:"_id",
				as:"postCategory"
			}},
			{$lookup:{
				from:"comments",
				let: {postId: "$_id"},
				pipeline: [{
					$match: {
						$expr:{
							$eq: ["$$postId","$posts_id"]
						}
					}
				},{$sort:{path:1}},
				{
					$lookup:{
					from:"users",
					localField:"users_id",
					foreignField:"_id",
					as:"commentUserInfor"
				}}],
				as:"commentList"
			}}
		]).then(detailPost => {
			return resolve(detailPost);
		}).catch(err => {
			return reject(err);
		})
	});
}
var getPostDetail2 = (postId) => {
	return new Promise((resolve, reject)=>{
		postModel.aggregate([{$match: {_id: new mongoose.Types.ObjectId(postId)}},
			{$lookup:{
				from:"users",
				localField:"users_id",
				foreignField:"_id",
				as:"postUserInfor"
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
				as:"commentList"
			}},
			{$lookup:{
				from:"users",
				localField:"commentList.users_id",
				foreignField:"_id",
				as:"commentUserInfor"
			}}]).then(detailPost=>{
				for( let val of detailPost[0].commentList){
					for (let info of detailPost[0].commentUserInfor){
						if (mongoose.Types.ObjectId(val.users_id).toString()===mongoose.Types.ObjectId(info._id).toString()) {
							val.commentUserInfor=info;
						}
					}
				}
      	return resolve(detailPost);
			})
    });
}
var getMaxParent = ()=>{
	return new Promise((resolve, reject) => {
		commentModel.aggregate([
			{$match: { path:{$not:/\./} }},
			{$project:{
				path:1,
				created:1
			}},
			{$sort:{created:-1}},
			{ $limit: 1 }
		])
		.then(val=>{
			if (val.length>0) {
				return resolve(parseInt(val[0].path));
			}else{
				return resolve(0);
			}
		})
		.catch(err=>{
			return reject(err);
		})		
	});
}
var getMaxChild = (commentPath)=>{
	return new Promise((resolve, reject) => {
		let str=commentPath+'\\.';
		let reg=new RegExp(str,"g");
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
		.then(child=>{
			if (child.length>0) {
				let kq=child[0].path.split('.');
				return resolve(parseInt(kq[1]));
			}else{
				return resolve(0);
			}
		})	
		.catch(err=>{
			return reject(err);
		})	
	});
}
module.exports = {postModel, getPostDetail,getPostDetailNew, getMaxParent,getMaxChild}; //lệnh exports để xuất (public) ra, cho bên bên ngoài module có thể dùng được db
