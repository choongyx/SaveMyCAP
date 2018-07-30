Template.add.rendered = function() {
	$("#add-link").addClass('selected');
	$("#myModules-link").removeClass('selected');
	$("#login-link").removeClass('selected');
	$("#profile-link").removeClass('selected');
}

Template.add.events({
	"submit .add-module": function() {
		var moduleCode = event.target.moduleCode.value;
		var mc = event.target.mc.value;
		var targetGrade = event.target.targetGrade.value;
		var acadYear = event.target.acadYear.value;
		var currentUser = Meteor.userId();

		if (isNotEmpty(moduleCode) &&
			isNotEmpty(targetGrade) &&
			isNotEmpty(mc) && 
			isNotEmpty(acadYear)) {
			
			Meteor.call('addModule', moduleCode.toUpperCase(), targetGrade, mc, acadYear);
			Meteor.call('updateCAP', targetGrade, currentUser, mc);

			//clear form
			event.target.moduleCode.value ="";
			event.target.mc.value ="";
			event.target.targetGrade.value ="";
			event.target.acadYear.value ="";
			
			Bert.alert("Your module was added!", "success", "growl-top-right");

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