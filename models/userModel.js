require('../configDatabase/connectDb');//chèn model database vào đế kết nối db
var mongoose = require('mongoose');
var MySchema = mongoose.Schema;
var user = new MySchema({
	fullName: String,
	email: String,
	password: String,
  age: Number,
  phone: String,
  gender: String,
  avatar:String,
  created:Date,
  modified:Date
}, {
	collection: 'users'
});
var userModel = mongoose.model('users', user);
// exports.createdDate=(data)=>{
//     for(let key in data){
//         if (key===_id) {
//             let newDate=ObjectId(data.key).getTimestamp();
//             data.push({ngaymoi:newDate});
//         }
//     }
//     console.log(data);
//     return data;
// }

module.exports = userModel; //lệnh exports để xuất (public) ra, cho bên bên ngoài module có thể dùng được db
