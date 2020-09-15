const express = require("express");
const app = express();
const cors = require('cors')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs')


//db connection
require("./mongo")

//Models
require("./model/Post")
require("./model/User")
const auth = require("./middleware/auth")

//Middleware
app.use(cors())
app.use(bodyParser.json())
const Post = mongoose.model("Post")
const User = mongoose.model("User")


app.post("/users", async (req, res) => {
    // Create a new user
    try {
      const user = new User(req.body)
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token })
  } catch (error) {
      res.status(400).send(error)
  }
})


app.post("/users/login", async (req, res) => {
   //Login a registered user
   try {    
    // const { email, password } = req.body
    // console.log("password=>",password);
    // const user = await User.findByCredentials(email, password)
    // if (!user) {
    //     return res.status(401).send({error: 'Login failed! Check authentication credentials'})
    // }
    // const token = await user.generateAuthToken()
    // res.send({ user, token })

  const  email = req.body.email
  const  password = req.body.password
  const user = await User.findOne({email})
  if (!user) {
    res.send({ error: 'Login failed! Check authentication credentials' })
      // throw new Error({ error: 'Login failed! Check authentication credentials' })
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
     res.send({ error: 'Invalid login credentials' })
  }
    const token = await user.generateAuthToken()
    res.send({ user, token })


} catch (error) {
    res.status(400).send(error)
}
})


app.get('/users/me', auth, async (req, res) => {
// View logged in user profile
res.send(req.user)
})


app.post('/users/me/logout', auth, async (req, res) => {
  // Log user out of the application
  try {
      req.user.tokens = req.user.tokens.filter((token) => {
          return token.token != req.token
      })
      await req.user.save()
      res.send()
  } catch (error) {
      res.status(500).send(error)
  }
})

app.post('/users/me/logoutall', auth, async(req, res) => {
  // Log user out of all devices
  try {
      req.user.tokens.splice(0, req.user.tokens.length)
      await req.user.save()
      res.send()
  } catch (error) {
      res.status(500).send(error)
  }
})
 








//  Below Routes for Create, Get , Delete and Update Note
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({})
    debugger;
    res.send(posts)
  } catch (error) {
    debugger;
    res.status(500)
  }
})

app.post("/posts", async (req, res) => {
  try {
    const post = new Post();
    post.title = req.body.title;
    post.description = req.body.description;
    post.date = req.body.date;
    post.color = req.body.color;

    await post.save();
    res.send(post)
  } catch (error) {
    res.status(500)
  }
})

app.put("/posts/:postId", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate({
      _id:req.params.postId
    }, req.body, {
      new:true,
      runValidators:true
    })

    res.send(post)
  } catch (error) {
    res.status(500)
  }
})

app.delete("/posts/:postId", async (req, res) => {
  try {
  const post = await Post.findByIdAndRemove({
    _id:req.params.postId
  })

    res.send(post)
  } catch (error) {
    res.status(500)
  }
})
//  Above Routes for Create, Get , Delete and Update Note



app.listen(3002, function () {
  console.log("Server is running on port 3002")
})