const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");


const app = express();

const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://admin:admin1234@gysodb.nijqxz1.mongodb.net/Blog-Application?retryWrites=true&w=majority&appName=gysoDB');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log(`We're now connected to MongoDb Atlas`));

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comment");

app.use("/blogs", blogRoutes);
app.use("/users", userRoutes);
app.use("/comments", commentRoutes);

if(require.main === module) {
	app.listen(process.env.PORT || port, () => console.log(`API is now online on port ${process.env.PORT || port}`))
}

module.exports = {app, mongoose}