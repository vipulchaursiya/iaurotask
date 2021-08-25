const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

var newSchema = new mongoose.Schema({
  
  name: { type:'string', required: true, trim : true },

  EANCode : { type:'string', default : "", trim : true },

  description: {type:'string', default : ""},

  images: {type:Array,default:[]},

  mrp: {type:'Number', default : 0},

  price: {type:'Number', default : 0},

  isAvailable: {type:'Boolean', default : true},

  discount: {type:'Number', default : 0},

  createdAt : { type: 'date', default:Date.now() },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  updatedAt : { type: 'date', default:Date.now() },

  active : { type : Boolean, default : true },
  
  ratings:{ type : Number }

});

newSchema.pre('save', function(next){
  if (!this.createdAt) this.createdAt = new Date();
  next();
});

newSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

newSchema.pre('findOneAndUpdate', function() {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

module.exports = mongoose.models.Product || mongoose.model('Product', newSchema);
