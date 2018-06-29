//not using
Template.mod1.rendered = function() {
	$("#mod1-link").addClass('selected');
	$("#myModules-link").removeClass('selected');
	$("#profile-link").removeClass('selected');
	$("#login-link").removeClass('selected');
	$("#add-link").removeClass('selected');
	$("#mod3-link").removeClass('selected');
	$("#mod2-link").removeClass('selected');
	$("#mod4-link").removeClass('selected');
	$("#mod5-link").removeClass('selected');
}

//var modIndex='1';

Template.mod1.helpers({
	mod1: function() {
		//var moduleCode= Meteor.call('getModuleCode');
		//go to collection jokes and find the jokes
		var mod1 = Modules.find({}, {sort: {createdAt: -1}});
		//modIndex++;

		return mod1;
	}
});