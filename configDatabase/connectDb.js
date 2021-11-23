const mongoose = require('mongoose');
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useNewUrlParser: true, 
		useUnifiedTopology: true
	})
	.then(() => console.log("Successfully connect to MongoDB."))
	.catch(err => console.error("Connection error", err));
module.exports = mongoose; 
