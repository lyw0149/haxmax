// Invoke 'strict' JavaScript mode
'use strict';

// Create a new 'render' controller method
exports.render = function(req, res) {
	// if(req.user){
	// console.log(JSON.stringify(req.user).permission);
	// }
	// Use the 'response' object to render the 'index' view with a 'title' and a stringified 'user' properties
	if(req.user){
		res.render('controlpanel', {
			title: 'HAXMAX controlpanel',
			user: req.user
		});
		
	}else{
		res.redirect('/signin');	
		
	}
	
};