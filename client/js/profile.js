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
		var userId = Meteor.userId();
		var thisUser = Cap.findOne({userId: userId});
		var targetCAP = thisUser.totalCap/thisUser.numOfMc;

		//zero modules
		if(thisUser.numOfMc == 0) {
			targetCAP = 0;
		}
		
		return targetCAP;
	},

	actualCAP: function() {
		var userId = Meteor.userId();
		var thisUser = Actualcap.findOne({userId: userId});
		var actualCAP = thisUser.totalActualCap/thisUser.totalMc;

		//zero modules
		if(thisUser.totalMc == 0) {
			actualCAP = 0;
		}
		
		return actualCAP;
	},

	module: function() {
		var userId = Meteor.userId();
		var thisYear = Sem.findOne({_id: this._id});
		
		var module = Modules.find({userId: userId, acadYear: thisYear.acadYear}, {sort: {createdAt: -1}});
		return module;
		
	},

	academicYear: function() {
		var userId = Meteor.userId();

		var academicYear = Sem.find({userId: userId}, {sort: {acadYear: -1}});

		return academicYear;
	}
});

Template.profile.events({
	"click #delete-mod": function() {
		var thisMod = Modules.findOne({_id: this._id});
		
		Meteor.call("deleteCapScore", thisMod.targetGrade, Meteor.userId(), thisMod.mc);
		Meteor.call("deleteActualCapScore", thisMod.actual, Meteor.userId(), thisMod.mc);
		Meteor.call("removeModule", this._id);
		Bert.alert("Your module was deleted", "success", "growl-top-right");
		return false;
	}

});