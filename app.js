
/**
 * Module dependencies.
 */

var express = require('express');
var partials = require('express-partials');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(partials());
app.use(express.cookieParser());
app.use(express.cookieSession({
	secret: settings.cookieSecret,
	key: settings.db,
	cookie: {maxAge:1000*60*60*24*30}
	/*proxy: new MongoStore({
		db: settings.db
	})*/
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

/*app.dynamicHelpers({
	user:function(req,res){
		return req.session.user;
	},
	error: function(req,res){
		var err = req.flash('error');
		if(err.length)
			return err;
		else
			return null;
	}, 
	success: function(req,res){
		var succ = req.flash('success');
		if(succ.length){
			return succ;
		}else{
			return null;
		}
	}
})*/

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


routes(app);
/*app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.get('/post',routes.post);
app.get('/reg',routes.reg);
app.post('/reg',routes.doReg);
app.get('/login',routes.login);
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
