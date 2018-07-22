Template.edit.events({
	'submit .edit-form': function(){

	    event.preventDefault();

	   	// Get input value
	   	var caEdited = event.target.caEdited.value;
	    var weightageEdited = event.target.weightageEdited.value;
	    var markEdited = event.target.markEdited.value;
	    var totalMarkEdited = event.target.totalMarkEdited.value;    

	    var thisCAscore = Scores.findOne({_id: this._id}).score;
		var thisCAweightage = Scores.findOne({_id: this._id}).weightage;
		var thisCAkey = Scores.findOne({_id: this._id}).key;
		var thisCAId = Scores.findOne({_id: this._id})._id;
		var thisModId = Modules.findOne({_id: thisCAkey})._id;
		var currentMod = Modules.findOne({_id: thisModId});

		if (isNotEmpty(caEdited) &&
			isNotEmpty(weightageEdited) &&
		    isNotEmpty(markEdited) &&
		    isNotEmpty(totalMarkEdited) && markIsNotGreaterThanTotalMark(markEdited, totalMarkEdited)) {

		    Meteor.call('editScores', caEdited, weightageEdited, markEdited, totalMarkEdited, thisModId, thisCAId, (error, response) => {
		    	if(!response){
		    		Bert.alert("Weightage cannot be greater than 100%", "danger", "growl-top-right");
		    		return false;
		      	} 
		    });

		    // Clear form
		    event.target.caEdited.value ="";
		    event.target.weightageEdited.value ="";
			event.target.markEdited.value ="";
			event.target.totalMarkEdited.value ="";

			Router.go('/myModules');
				
			Bert.alert("CA Component edited", "success", "growl-top-right");	
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