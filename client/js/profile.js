Template.profile.rendered = function() {
	$("#profile-link").addClass('selected');
	$("#myModules-link").removeClass('selected');
	$("#login-link").removeClass('selected');
	$("#add-link").removeClass('selected');
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
		var username = Meteor.user().username;
		var userId = Meteor.userId();
		var targetCAP = Cap.findOne({userId: userId}).finalCap;
		return targetCAP;
	},


	module: function() {
		var username = Meteor.user().username;
		var userId = Meteor.userId();
		
		var module = Modules.find({userId: userId}, {sort: {createdAt: -1}});
		return module;
	}
});

Template.profile.events({
	"click #delete-mod": function() {
		var thisMod = Modules.findOne({_id: this._id});
		
		Meteor.call("deleteCapScore", thisMod.targetGrade, Meteor.userId());
		Meteor.call("removeModule", this._id);
		Bert.alert("Your module was deleted", "success", "growl-top-right");
		return false;
	}

});