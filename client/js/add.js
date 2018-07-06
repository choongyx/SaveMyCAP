Template.add.rendered = function() {
	$("#add-link").addClass('selected');
	$("#myModules-link").removeClass('selected');
	$("#profile-link").removeClass('selected');
	$("#login-link").removeClass('selected');
}

Template.add.events({
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


// Validation rules
var isNotEmpty = function(value){
	if(value && value != ''){
		return true;
	}
	Bert.alert("Please fill in all fields", "danger", "growl-top-right");
	return false;
}