const path = require("path")
const dotenv = require("dotenv")
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

dotenv.config()

const Blog = require("./models/blog")

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express()
const PORT = 8000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    // console.log("Connected DB:", mongoose.connection.name);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
connectDB()
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

// middleware to handle form data 
app.use(express.urlencoded({extended: false}));

// cookie-parser is also a middleware
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))

// middleware which express can use as this is static 
app.use(express.static(path.resolve("./public")))

// routes
app.get('/', async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render("home", { user: req.user, blogs: allBlogs });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT} `))