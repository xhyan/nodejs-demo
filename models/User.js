/**
 * User 实体，储存用户相关信息
 * Created by xhyan_000 on 2015/7/11.
 */

var mongodb = require('./db');

function User(user) {
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
}
module.exports = User;
//保存用户信息
User.prototype.save = function (callback) {
    var user = {
        username: this.username,
        password: this.password,
        email: this.email
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//返回错误信息
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将用户数据插入users集合
            collection.insert(user, {
                safe: true
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回err信息
                }
                callback(null, user.ops[0]);//成功，不返回错误信息，返回用户信息
            });
        });
    });
};

//读取用户信息
User.get = function (username, callback) {
    mongodb.open(function (err, db) {
        //open db
        if (err) {
            return callback(err);
        }
        //get users
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//error, return err info
            }

            //query user by username
            collection.findOne({
                username: username
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//failure, return err info
                }
                callback(null, user);//success, return user info
            });
        });
    });
};
//var Schema = mongodb.mongoose.Schema;
//
//var UserSchema = new Schema({
//    username    : {type : String},                  //用户名
//    password    : {type : String},                  //密码
//    sex         : {type : Boolean},                 //性别
//    age         : {type : Number},                  //年龄
//    gmtCreate   : {type : Date, default : Date.now} //创建日期
//});
//
//var User = mongodb.mongoose.model("User", UserSchema);
//var UserDao = function(){};
//model.exports = new UserDao();