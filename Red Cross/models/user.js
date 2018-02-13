
var mongoose = require('mongoose');
let bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    uid: String,
    username: String,
    password: String,
    access: String  
});

/*
userSchema.pre('save', function(next){
  var user = this;
  bcrypt.genSalt(10, function(err, salt){
    if(err){
      return next(err);
    }
    
    bcrypt.hash(user.password, salt, function(err, hash){
      if(err){
        return next(err);
      }
      user.password = hash;
      console.log(hash);
      next();
    });
  });
});


userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){
      return callback(err);
    }
    callback(undefined, isMatch);
  })
}
*/

var User = mongoose.model('User', userSchema, 'Users');
module.exports = User;