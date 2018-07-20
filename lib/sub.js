if (Meteor.isClient) {
	Meteor.subscribe('Modules');  //follow Collections
	Meteor.subscribe('Users');
	Meteor.subscribe('Scores');
	Meteor.subscribe('Cap');
	Meteor.subscribe('Sem');
}