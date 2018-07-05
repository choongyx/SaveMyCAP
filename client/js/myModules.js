Template.myModules.rendered = function() {
	$("#myModules-link").addClass('selected');
	$("#profile-link").removeClass('selected');
	$("#login-link").removeClass('selected');
	$("#add-link").removeClass('selected');
}

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
		var thisCAkey = Scores.findOne({_id: this._id}).key;
		var thisMod = Modules.findOne({_id: thisCAkey})._id;
		Meteor.call("removeCA", this._id);
		Meteor.call("deleteScores", thisCAscore, thisMod);
		
		Bert.alert("CA Component deleted", "success", "growl-top-right");
		return false;
	},

});


Template.myModules.events({
	'submit .update-form': function(){

	    //event.preventDefault();

	   	// Get input value
	    var ca = event.target.ca.value;
	    var weightage = event.target.weightage.value;
	    var mark = event.target.mark.value;
	    var totalMark = event.target.totalMark.value;    
	    var thisMod = Modules.findOne({_id: this._id})._id;
	    var currentMod = Modules.findOne({_id: thisMod});

	    //var newWeightage = currentMod.totalWeightage + weightage;

	    //check if wil exceed 100
	    /*
	    if( newWeightage > 100) {
	    	console.log(newWeightage);
	    	Bert.alert("Weightage cannot be greater than 100%", "danger", "growl-top-right");
	    	return false;
	    }
	    */

	    //check if current total weightages all add up to already 100
	    if(currentMod.totalWeightage == 100) {
	    	Bert.alert("All weightages already added up to 100%. Cannot add more CA Components.", "danger", "growl-top-right");
	    	return false;
	    } else {

		    if (isNotEmpty(ca) &&
		      isNotEmpty(weightage) &&
		      isNotEmpty(mark) &&
		      isNotEmpty(totalMark)) {
		    	
		    	if (!Meteor.call('addScores', ca, weightage, mark, totalMark, thisMod)) {
		    		Bert.alert("Weightage cannot be greater than 100%", "danger", "growl-top-right");
		    		return false;
		    	}

		    	// Clear form
		    	event.target.ca.value ="";
		      	event.target.weightage.value ="";
		      	event.target.mark.value ="";
		      	event.target.totalMark.value ="";

		      	Bert.alert("Your score was updated!", "success", "growl-top-right");

		  	} else {
		      	Bert.alert("Please input all fields", "danger", "growl-top-right");
		    }
		}

	    //return false;
	},

});

	/* FROM ORIGINAL CODE, I KEEP THIS HERE FOR REFERENCE

	"click #frown": function() {
		var thisUser = Meteor.userId();
		var thisJoke = Jokes.findOne({_id: this._id})._id;
		var jokeAuthor = Jokes.findOne({_id: this._id}).userId;
		var Name = Meteor.user().username;
		var thisJokesVotes = Jokes.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

		if (thisJokesVotes.indexOf(Name) > -1) { //if there are votes in this joke > -1, cannot vote twice
			Bert.alert("You cannot vote twice", "danger", "growl-top-right");
			//In the array, meaning user has voted
		} else {
			//Not in the Array, do stuff
			Meteor.call("countVote", thisJoke, Name);
			Meteor.call("userPointFrown", jokeAuthor);
			Meteor.call("frownVote", thisUser, thisJoke);
			Bert.alert("Your vote was placed", "success", "growl-top-right");
		}

		if (Name == thisJokesVotes) {
			Bert.alert("You cannot vote for your own joke", "danger", "growl-top-right");
		}
	},
		
	"click #puke": function() {
		var thisUser = Meteor.userId();
		var thisJoke = Jokes.findOne({_id: this._id})._id;
		var jokeAuthor = Jokes.findOne({_id: this._id}).userId;
		var Name = Meteor.user().username;
		var thisJokesVotes = Jokes.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

		if (thisJokesVotes.indexOf(Name) > -1) { //if there are votes in this joke > -1, cannot vote twice
			Bert.alert("You cannot vote twice", "danger", "growl-top-right");
			//In the array, meaning user has voted
		} else {
			//Not in the Array, do stuff
			Meteor.call("countVote", thisJoke, Name);
			Meteor.call("userPointPuke", jokeAuthor);
			Meteor.call("pukeVote", thisUser, thisJoke);
			Bert.alert("Your vote was placed", "success", "growl-top-right");
		}

		if (Name == thisJokesVotes) {
			Bert.alert("You cannot vote for your own joke", "danger", "growl-top-right");
		}		
	},
	
});
*/


// Validation rules

var isNotEmpty = function(value){
	if(value && value != ''){
		return true;
	}
	Bert.alert("Please fill in all fields", "danger", "growl-top-right");
	return false;
}