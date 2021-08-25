const bcrypt = require("bcrypt");
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const express = require("express");
const router = express.Router();
const User = require('../models/user');
const auth = require("../middleware/auth");


router.post("/login", async (req, res) => {
  try {
    let reqBody  = req.body
    const validReqform = reqBody.mobile && reqBody.password;
    if (!validReqform) return res.status(500).send("Invalid Request");

    let user = await User.findOne({ mobile: reqBody.mobile }).lean();
    if (!user) return res.status(400).send("No user found");

    let validUser = await bcrypt.compare(reqBody.password, user.password);
    if (!validUser) return res.status(401).send("Access denied. Incorrect Password.");

    delete user.password
    const token = User.generateAuthToken(user);
    res.header("x-auth-token", token).json({
        "token": token, user: user
    });
  } catch (e) {
      console.log("Exception in loggingIn user:", e);
      res.status(500).send("Internal server error");
  }
});

router.post("/registerUser", async (req, res) => {
  try {
    let reqBody  = req.body;
    console.log(reqBody)
    const validReqform = reqBody.mobile && reqBody.password && reqBody.name;
    if (!validReqform) return res.status(500).send("Invalid Request/please enter all name,email,password");

    let user = await User.findOne({ mobile: reqBody.mobile });
    if (user) return res.status(400).send("User already Exist");

    let encyptPassword = await bcrypt.hash(reqBody.password, 5)
    let finalUserDet = {
      name: reqBody.name,
      password: encyptPassword,
      mobile : reqBody.mobile
    }
    const userRes  = await User.create(finalUserDet)
    return res.json({ user:userRes});
  } catch (e) {
      console.log("Exception in loggingIn user:", e);
      res.status(500).send("Internal server error");
  }
});

router.post("/registerAdmin", async (req, res) => {
  try {
    let reqBody  = req.body;
    const validReqform = reqBody.mobile && reqBody.password && reqBody.name && reqBody.email;
    if (!validReqform) return res.status(500).send("Invalid Request/please enter all name,email,password");

    let user = await User.findOne({ mobile: reqBody.mobile });
    if (user) return res.status(400).send("User already exist");

    let userAd = await User.findOne({ userType: 'admin' });
    if (userAd) return res.status(400).send("Admin already exist",user.name);

    let encyptPassword = await bcrypt.hash(reqBody.password, 5)
    let finalUserDet = {
      name: reqBody.name,
      password: encyptPassword,
      mobile : reqBody.mobile,
      email : reqBody.email,
      userType: 'admin'
    }
    const userRes  = await User.create(finalUserDet)
    // delete userRes.password;
    // let userDup =  JSON.parse(JSON.stringify(userDup))
    // delete userDup.password
    res.json({user:userRes });
  } catch (e) {
      console.log("Exception in loggingIn user:", e);
      res.status(500).send("Internal server error");
  }
});

router.get("/fetchAll",  async (req, res) => {
  try {
    let page = req.query.page || 0
    let users = await User.find({}, {password:0,__v:0,createdAt:0}).sort({$natural : -1}).skip(page*10).limit(10)
    return res.json(users)
  } catch (e) {
      console.log(e);
      return res.status(500).send("Internal Server Error, Please try after sometime.");
  }
});

router.patch("/editUser", auth, async (req, res) => {
  try {
    var reqBody = req.body
    const user = req.user;
    if(user.userType !== 'admin') return res.status(400).send("Unauthorized, only Admin can delete/update user");

    var isExist = await User.findOne({_id: ObjectId(req.body.userId)})   
    if(!isExist) return res.status(400).send("user with this Id does not exist")
    let thisUser = {}
    for (var prop in reqBody) thisUser[prop] = reqBody[prop];
    var updatedUser =  await User.findOneAndUpdate({_id: ObjectId(req.body.userId)},thisUser,{new:true})   
    return res.json({user:updatedUser });    
  } catch (e) {
      console.log("Exception in deleteUser:", e);
      res.status(500).send("Internal server error");
  }
});

router.delete("/deleteUser/:id", auth, async (req, res) => {
  try {
    const user = req.user;
    if(user.userType !== 'admin') return res.status(400).send("Unauthorized, only Admin can delete/update user");
  if(user.userType !== 'admin') return res.status(400).send("Unauthorized, only Admin can delete/update user");

   var isExist = await User.findOne({_id: req.params.id})
   if(!isExist) return res.status(400).send("user with this mobile does not exist")
    await User.remove({_id: req.params.id})
    res.json("User successfully deleted");
  } catch (e) {
      console.log("Exception in deleteUser:", e);
      res.status(500).send("Internal server error");
  }
});

module.exports = router;

