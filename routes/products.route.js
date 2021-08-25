var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const express = require("express");
const Product = require('../models/product');
const router = express.Router();
const auth = require("../middleware/auth");


router.post("/addProduct", auth, async (req, res) => {
  try {
      const reqBody = req.body;
      const user = req.user;
      if(user.userType !== 'user') return res.status(400).send("Unauthorized, only user can add products");
      let thisProduct = {
        _createdBy : user._id,
        name: reqBody.name,
        discount: reqBody.discount ?reqBody.discount : 0  ,
        price: reqBody.price,
        mrp: reqBody.mrp,
        // active: false,
        images: reqBody.images ? reqBody.images : [],
        description: reqBody.description ? reqBody.description  : '' ,
        EANCode: reqBody.EANCode ? reqBody.EANCode : 0,
        ratings : reqBody.ratings ? reqBody.ratings : 0
      };
      thisProduct = await Product.create(thisProduct);
      return res.json(thisProduct)
  } catch (e) {
      console.log(e);
      return res.status(500).send("Internal Server Error, Please try after sometime.");
  }
});


router.get("/fetchAll",  async (req, res) => {
  try {
    let page = req.query.page || 0
    let query = {isAvailable : true}
    let products = await Product.find(query, {name : 1, description:1, EANCode : 1, images : 1, price : 1, mrp : 1, discount : 1}).sort({$natural : -1}).skip(page*5).limit(5)
    return res.json(products)
  } catch (e) {
      console.log(e);
      return res.status(500).send("Internal Server Error, Please try after sometime.");
  }
});

router.patch("/editProduct",auth, async (req, res) => {
  try {
    var reqBody = req.body
    const user = req.user;
    if(user.userType !== 'admin') return res.status(400).send("Unauthorized, only Admin can delete/update products");
    var isExist = await Product.findOne({_id:req.body._id})   
    if(!isExist) return res.status(400).send("Prodcut with this id does not exist")
    let thisProduct = {}
    for (var prop in reqBody) thisProduct[prop] = reqBody[prop];
    var updatedProduct =  await Product.findOneAndUpdate({_id:req.body._id},thisProduct,{new:true})   
    return res.json({user: updatedProduct});    
  } catch (e) {
      console.log("Exception in deleteUser:", e);
      res.status(500).send("Internal server error");
  }
});

router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const user = req.user;
    if(user.userType !== 'admin') return res.status(400).send("Unauthorized, only Admin can delete/update products");
    var isExist = await Product.findOne({_id: req.params.id})
    if(!isExist) return res.status(400).send("Product does not exist")
    await Product.remove({_id: req.params.id})
    res.json("Product successfully deleted");
  } catch (e) {
      console.log("Exception in deleteUser:", e);
      res.status(500).send("Internal server error");
  }
});

module.exports = router;
