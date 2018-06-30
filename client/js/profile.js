Template.profile.rendered = function() {
	$("#profile-link").addClass('selected');
	$("#myModules-link").removeClass('selected');
	$("#login-link").removeClass('selected');
	$("#add-link").removeClass('selected');
	$("#mod1-link").removeClass('selected');
	$("#mod3-link").removeClass('selected');
	$("#mod2-link").removeClass('selected');
	$("#mod4-link").removeClass('selected');
	$("#mod5-link").removeClass('selected');
}

Template.profile.helpers({
	email: function() {
		if(!Meteor.user()) {
			Bert.alert("You are not logged in, permission denied", "danger", "growl-top-right");
			return false;
		} else {
			return Meteor.user().emails[0].address;
		}

	},

	username: function() {
		if(!Meteor.user()) {
			Bert.alert("You are not logged in, permission denied", "danger", "growl-top-right");
			return false;
		} else {
			return Meteor.user().username;
		}
	},
	
	targetCAP: function() {
		return Meteor.user().profile.finalCap;
	},
	/**
	userJokes: function() {
		var username = Meteor.user().username;
		var userId = Meteor.userId();
		//get the jokes that belong to this user, sort by latest ones appear first
		var userJokes = Jokes.find({userId: userId}, {sort: {createdAt: -1}});
		return userJokes;
	}, 

	userLaughScore: function() {
		return Meteor.user().profile.laughScore;
	},

	userFrownScore: function() {
		return Meteor.user().profile.frownScore;
	},

	userPukeScore: function() {
		return Meteor.user().profile.pukeScore;
	},
	*/

	module: function() {
		var username = Meteor.user().username;
		var userId = Meteor.userId();
		//get the jokes that belong to this user, sort by latest ones appear first
		
		var module = Modules.find({userId: userId}, {sort: {createdAt: -1}});
		return module;
	}
});

Template.profile.events({
	"click #delete-mod": function() {
		Meteor.call("removeModule", this._id);
		Bert.alert("Your module was deleted", "success", "growl-top-right");
	}

});