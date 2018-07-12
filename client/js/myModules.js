Template.myModules.rendered = function() {
	$("#myModules-link").addClass('selected');
	$("#profile-link").removeClass('selected');
	$("#login-link").removeClass('selected');
	$("#add-link").removeClass('selected');
}

Template.myModules.events({
	"submit .add-module": function() {
		var moduleCode = event.target.moduleCode.value;
		var mc = event.target.mc.value;
		var targetGrade = event.target.targetGrade.value;
		var currentUser = Meteor.userId();

		if (isNotEmpty(moduleCode) &&
			isNotEmpty(targetGrade) &&
			isNotEmpty(mc)) {
			
			Meteor.call('addModule', moduleCode, targetGrade, mc);
			Meteor.call('updateCAP', targetGrade, currentUser, mc);

			event.target.moduleCode.value ="";
			event.target.mc.value ="";
			event.target.targetGrade.value ="";
			
			Bert.alert("Your Module Was Added!", "success", "growl-top-right");


		} else {
			Bert.alert("Something went wrong", "danger", "growl-top-right");
		}
		return false;
	}
});

Template.myModules.helpers({
	module: function() {
		var username = Meteor.user().username;
		var userId = Meteor.userId();
		//get the jokes that belong to this user, sort by latest ones appear first
		
		var module = Modules.find({userId: userId}, {sort: {createdAt: -1}});
		return module;
	}
});

Template.myModules.helpers({
	score: function() {
		var username = Meteor.user().username;
		var userId = Meteor.userId();
		var thisMod = Modules.findOne({_id: this._id})._id;
		//get the scores whose key is same as this current module id 

		var score = Scores.find({key: thisMod}, {sort: {createdAt: -1}});
		return score;
	}
});

Template.myModules.events({
	"click #delete-ca": function() {
		var thisCAscore = Scores.findOne({_id: this._id}).score;
		var thisCAweightage = Scores.findOne({_id: this._id}).weightage;
		var thisCAkey = Scores.findOne({_id: this._id}).key;
		var thisMod = Modules.findOne({_id: thisCAkey})._id;
		Meteor.call("removeCA", this._id);
		Meteor.call("deleteScores", thisCAscore, thisCAweightage ,thisMod);
		
		Bert.alert("CA Component deleted", "success", "growl-top-right");
		return false;
	},

});


Template.myModules.events({
	'submit .update-form': function(){

	    event.preventDefault();

	   	// Get input value
	    var ca = event.target.ca.value;
	    var weightage = event.target.weightage.value;
	    var mark = event.target.mark.value;
	    var totalMark = event.target.totalMark.value;    

	    var thisMod = Modules.findOne({_id: this._id})._id;
	    var currentMod = Modules.findOne({_id: thisMod});

	    //check if current total weightages all add up to already 100
	    if(currentMod.totalWeightage == 100) {
	    	Bert.alert("All weightages already added up to 100%. Cannot add more CA Components.", "danger", "growl-top-right");
	    	return false;
	    } 

		if (isNotEmpty(ca) &&
			isNotEmpty(weightage) &&
		    isNotEmpty(mark) &&
		    isNotEmpty(totalMark) && markIsNotGreaterThanTotalMark(mark, totalMark)) {

		    Meteor.call('addScores', ca, weightage, mark, totalMark, thisMod, (error, response) => {
		    	if(!response){
		    		Bert.alert("Weightage cannot be greater than 100%", "danger", "growl-top-right");
		    		return false;
		      	} 
		    });

		    // Clear form
		    event.target.ca.value ="";
		    event.target.weightage.value ="";
			event.target.mark.value ="";
			event.target.totalMark.value ="";
				
			Bert.alert("Your score was updated!", "success", "growl-top-right");	
		}

	    return false;
	},

});

// Validation rules

var isNotEmpty = function(value){
	if(value && value != ''){
		return true;
	}
	Bert.alert("Please fill in all fields", "danger", "growl-top-right");
	return false;
}

var markIsNotGreaterThanTotalMark = function(mark, totalMark) {
	var markNum = parseInt(mark);
	var totalMarkNum = parseInt(totalMark);
	if(markNum <= totalMarkNum) {
		return true;
	}
	Bert.alert("Marks obtained cannot be greater than total mark.", "danger", "growl-top-right");
	return false;	
}