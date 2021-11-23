const {check,validationResult} = require('express-validator');
var userModel = require('../models/userModel');
var validateRegister=[
	check('fullName')
		.isLength({min:3}).withMessage('Fullname must have at least 3 characters!')
		.isLength({max:20}).withMessage('Fullname must have at most 20 characters!'),
	check('email')
		.isEmail().withMessage('The Email is invalid!')
		.custom(userEmail=>{
	  	return new Promise((resolve, reject) => {
	  		userModel.findOne({email:userEmail}).then((emailExist)=>{
	  			if(emailExist !== null){
            reject(new Error('Email already exists!'))
          }else{
            resolve(true)
          }	
	  		})
	  	})
		}),
	check('password')
		.isLength({min:6})
		.withMessage('Password must have at least 6 characters!'),
	check('passwordConfirm')
		.custom((value,{ req })=>{
			if (value !== req.body.password) {
		    throw new Error('Password confirmation does not match password');
		  }
		  // Indicates the success of this synchronous custom validator
		  return true;
		}),
	check('age').isInt({min:0}).withMessage('Age must be more than 0!')
		.isInt({max:150}).withMessage('Age must be less than 150!'),
];
var validateLogin=[
	check('email').isEmail().withMessage('The Email is invalid!')
	  .custom(userEmail=>{
	  	return new Promise((resolve, reject) => {
	  		userModel.findOne({email:userEmail}).then((emailExist)=>{
	  			if(emailExist){
            resolve(true)
          }else{
            reject(new Error('Email have not registered'))
          }	
	  		})
	  	})
		}),
	check('password').isLength({min:6}).withMessage('Password must have at least 6 characters!')
];

module.exports={validateRegister,validateLogin};