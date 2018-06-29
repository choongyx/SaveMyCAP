Template.sidebar.rendered = function(){

}

Template.sidebar.events({
	"click .logout": function(event){
		Meteor.logout(function(err){
			if(err) {
				Bert.alert(err.reason, "danger", "growl-top-right");
			} else {
				Router.go('/');
				Bert.alert("You are now logged out", "success", "growl-top-right");
			}
		});
	},

});

/**This is needed only if I want each module to have a sidebar icon
Template.sidebar.helpers({
	module: function() {
		//go to collection jokes and find the jokes
		var module = Modules.find({}, {sort: {createdAt: -1}});
		return module;
	}
});
*/