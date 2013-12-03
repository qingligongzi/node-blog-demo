
/*
 * GET home page.
 */

 var crypto = require('crypto');
 var User = require('../models/user.js');
 var Post = require('../models/post.js');
 var A = require('../models/abc.js');

module.exports = function(app){
	
	app.get('/',function(req,res){
		Post.get(null,function(err,posts){
			if(err){
				posts = [];
			}
			res.render('index',{
				title: '首页',
				posts: posts,
				user: req.session.user,
				success: req.flash('success'),
				error: req.flash('error')
			})
		});
		/*if(req.session.user){
			req.session.user = req.session.user;
		}*/
		/*res.render('index',{
			title: '首页',
			user: req.session.user,
			success: req.flash('success'),
			error: req.flash('error')
		});*/
	});

	app.get('/reg',checkNotLogin);
	app.get('/reg',function(req,res){
		res.render('reg',{
			title: '用户注册',
			user: req.session.user,
			success: req.flash('success'),
			error: req.flash('error')
		});
	});

	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res){
		if(req.body['password-repeat'] != req.body['password']){
			req.flash('error','两次输入的口令不一致');
			return res.redirect('/reg');
		}

		//生成口令的加密值
		var md5 = crypto.createHash('md5');
		var psw = md5.update(req.body.password).digest('base64');

		var abc = new A({
			name : "abc",
			password : "123"
		})

		abc.get("aaa");

		var newUser = new User({
			name : req.body.username,
			password : psw
		})

		//检查用户名是否已经存在
		User.get(newUser.name,function(err,user){
			if(user){
				err = 'Username already exists';
			}
			if(err){
				req.flash('error',err);
				return res.redirect('/reg');
			}
			//如果不存在则新增
			newUser.save(function(err){
				if(err){
					req.flash('error',err);
					return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success','注册成功');
				res.redirect('/');
			});
		});
	});

	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{
			title: '用户登录',
			user : req.session.user,
			success: req.flash('success'),
			error: req.flash('error')
		})
	});

	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var pwd = md5.update(req.body.password).digest('base64');

		User.get(req.body.username,function(err,user){
			if(!user){
				req.flash('error','用户不存在');
				return res.redirect('/login');
			}
			if(user.password != pwd){
				req.flash('error','用户口令错误');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success','登录成功');
			res.redirect('/');
		});
	});

	app.get('logout',checkLogin);
	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.flash('success', '登出成功');
		res.redirect('/');
	});

	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
		var currentUser = req.session.user;
		var post = new Post(currentUser.name,req.body.post);
		post.save(function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success','发表成功');
			res.redirect('/u/'+currentUser.name);
		});
	});

	app.get('/u/:user',function(req,res){
		User.get(req.params.user,function(err,user){
			if(!user){
				req.flash('error','用户不存在');
				return res.redirect('/');
			}
			Post.get(user.name,function(err,posts){
				if(err){
					req.flash('error',err);
					return res.redirect('/');
				}
				res.render('user',{
					title:user.name,
					posts: posts,
					user:req.session.user,
					success:null,
					error:null
				})
			})
		})
	})

	function checkLogin(req,res,next){
		if(!req.session.user){
			req.flash('error','用户未登录');
			return res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req,res,next){
		if(req.session.user){
			req.flash('error','用户已登录');
			return res.redirect('/');
		}
		next();
	}
};

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.user = function(req,res){

};

exports.post = function(req,res){

};

exports.reg = function(req,res){

};

exports.doReg = function(req,res){

};

exports.login = function(req,res){

};

exports.doLogin = function(req,res){

};

exports.logout = function(req,res){

};*/