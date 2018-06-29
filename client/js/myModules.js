Template.myModules.rendered = function() {
	$("#myModules-link").addClass('selected');
	$("#profile-link").removeClass('selected');
	$("#login-link").removeClass('selected');
	$("#add-link").removeClass('selected');
	$("#mod1-link").removeClass('selected');
	$("#mod3-link").removeClass('selected');
	$("#mod2-link").removeClass('selected');
	$("#mod4-link").removeClass('selected');
	$("#mod5-link").removeClass('selected');
}

/** IGNORE THIS WHOLE PART ITS A FAILED ATTEMPT HAHAH, I keep it here to show that this doesnt work and dont try this in the future
Template.myModules.helpers({
	scores: function() {

		//go to collection jokes and find the jokes
		//db.coll.find({"mykey":{'$exists': 1}})
		//var mod = Meteor.call('getMod');

		//var tmpl = UI._templateInstance();
        //var mod= tmpl.moduleCode;
        //var mod = template.find('key');

		//instance = Template.instance();
	    //instance_reactive_data_context = this; // or = Template.currentData();
	    // instance_nonreactive_data_context = it can't be accessed as a non-reactive source. 
	    //When you'll need something like this, most likely because the helper is running too many times, 
	    //look into the [meteor-computed-field][1] package
	    // to access or modify the reactive-var attached to the template:
	    //console.log(Template.instance().reactive_variable.get());
	    //Template.instance().reactive_variable.set('new value');
	    // to access or modify one of the reactive-dictionaries attached to the template:
	    //console.log(Template.instance().reactive_dictionaries.get('attachedDict_2'));
	    //Template.instance().reactive_dictionaries.set('attachedDict_2', 'new value here');
	    // obviously since you declared instance on the first line, you'd actually use everywhere "instance." instead of "Template.instance()."
	    //var moduleCode = Template.instance().reactive_variable.get();


		var scores = Scores.find({}, {sort: {createdAt: -1}});
		return scores;
	}
});

Template.myModules.onCreated(function () {
  instance = this; // or = Template.instance();
  // instance_reactive_data_context = no point in having a reactive data context since this function is only executed once
  instance_nonreactive_data_context = this.data;
  // now in order to attach a reactive variable to the template:
  let varInitialValue = module;
  instance.reactive_variable = new ReactiveVar(varInitialValue);
  // and now let's attach two reactive dictionaries to the template: 
  //let dictInitialValue_1 = { first }
  //let dictInitialValue_2 = [ second]
  //instance.reactive_dictionaries = new ReactiveDict();
  //instance.reactive_dictionaries.set('attachedDict_1', dictInitialValue_1);
  //instance.reactive_dictionaries.set('attachedDict_2', dictInitialValue_2);
});
*/

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


    if (isNotEmpty(ca) &&
      isNotEmpty(weightage) &&
      isNotEmpty(mark) &&
      isNotEmpty(totalMark) ) {
      
      Meteor.call('addScores', ca, weightage, mark, totalMark, thisMod);

      // Clear form
      event.target.ca.value ="";
      event.target.weightage.value ="";
      event.target.mark.value ="";
      event.target.totalMark.value ="";

      Bert.alert("Your score was updated!", "success", "growl-top-right");

  	} else {
      Bert.alert("Please input all fields", "danger", "growl-top-right");
    }

    return false;
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

