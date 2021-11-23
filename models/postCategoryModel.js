require('../configDatabase/connectDb');//chèn model database vào đế kết nối db
var mongoose = require('mongoose');
var MySchema = mongoose.Schema;
var postCategory = new MySchema({
  article: String,
  created:Date,
  modified:Date
}, {
	collection: 'postCategories'
});

var postCategoryModel = mongoose.model('postCategories', postCategory);

module.exports = postCategoryModel; //lệnh exports để xuất (public) ra, cho bên bên ngoài module có thể dùng được db
