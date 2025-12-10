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

mongoose.
  connect(process.env.MONGODB_URI)
  .then((e) => console.log("MongoDB connected"))

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
app.get('/', async (req,res) => {
  const allBlogs = await Blog.find({})
  res.render("home" , {
    user: req.user,
    blogs: allBlogs,
  });
})

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT} `))