const { Router } = require("express");
const Blog = require("../models/blog")
const multer = require("multer");
const { storage } = require("../storage/storage");

const upload = multer({ storage });
const router = Router();

router.get("/add-new", (req,res) => {
  return res.render('addBlog', {
    user: req.user
  })
})

router.get('/:id', async (req, res) =>{
  const blog = await Blog.findById(req.params.id).populate("createdBy")
  // console.log("Blog", blog)
  return res.render("blog",{
    user: req.user,
    blog,
  });
})

router.post("/",upload.single("coverImage"), async (req,res) => {
  // console.log(req.file);
  const { title, body} = req.body
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: req.file.path,
  })
  // console.log("Storage Path: ",req.file.path);
  return res.redirect(`/blog/${blog._id}`)
})

module.exports = router;