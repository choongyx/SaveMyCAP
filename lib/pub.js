if (Meteor.isServer) {
	Meteor.publish('Users', function() { //follow collections
		if(!this.userId) {
			return false;
			throw new Meteor.Error('not authorised');
		} else {
			return Meteor.users.find();
		}
	});

	Meteor.publish('Modules', function() { //follow collections
		if(!this.userId) {
			return false;
			throw new Meteor.Error('not authorised');
		} else {
			return Modules.find();
		}
	});
	
	Meteor.publish('Scores', function() { //follow collections
		if(!this.userId) {
			return false;
			throw new Meteor.Error('not authorised');
		} else {
			return Scores.find();
		}
	});
	
}