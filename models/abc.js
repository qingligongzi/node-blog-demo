var abc = function ABC(abc){
	this.name = abc.name,
	this.password = abc.password
};

module.exports = abc;

abc.prototype.get = function get(username){
	console.log(username);
}