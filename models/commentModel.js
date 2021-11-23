require('../configDatabase/connectDb');//chèn model database vào đế kết nối db
var mongoose = require('mongoose');
var MySchema = mongoose.Schema;
var comment = new MySchema({
	content: String,
	posts_id: { type: mongoose.Types.ObjectId, ref: 'posts' },
	users_id: { type: mongoose.Types.ObjectId, ref: 'users' },
	path: String,
	created:Date,
	modified:Date
}, {
	collection: 'comments'
});

// post.virtual("test",{
// 	from:"users",
// 	localField:"users_id",
// 	foreignField:"_id"
// })

var commentModel = mongoose.model('comments', comment);

module.exports = commentModel; //lệnh exports để xuất (public) ra, cho bên bên ngoài module có thể dùng được db
