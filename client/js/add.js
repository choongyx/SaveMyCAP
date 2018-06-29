Template.add.rendered = function() {
	$("#add-link").addClass('selected');
	$("#myModules-link").removeClass('selected');
	$("#profile-link").removeClass('selected');
	$("#login-link").removeClass('selected');
	$("#mod1-link").removeClass('selected');
	$("#mod3-link").removeClass('selected');
	$("#mod2-link").removeClass('selected');
	$("#mod4-link").removeClass('selected');
	$("#mod5-link").removeClass('selected');
}

//global var to keep track of mod? Dunno if this works
//var modIndex=0;

Template.add.events({
	"submit .add-module": function() {
		var moduleCode = event.target.moduleCode.value;
		var targetGrade = event.target.targetGrade.value;
		var currentUser = Meteor.userId();

		if (isNotEmpty(moduleCode) &&
			isNotEmpty(targetGrade)) {
			
			Meteor.call('addModule', moduleCode, targetGrade);
			Meteor.call('updateCAP', targetGrade, currentUser);

			event.target.moduleCode.value ="";
			event.target.targetGrade.value ="";
			

			//db.createCollection(moduleCode);
			Bert.alert("Your Module Was Added!", "success", "growl-top-right");

			//modIndex++;

		} else {
			Bert.alert("Something went wrong", "danger", "growl-top-right");
		}
		return false;
	}
});


// Validation rules

var isNotEmpty = function(value){
	if(value && value != ''){
		return true;
	}
	Bert.alert("Please fill in all fields", "danger", "growl-top-right");
	return false;
}