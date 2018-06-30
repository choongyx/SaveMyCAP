if (Meteor.isServer) {
	Meteor.methods({

		//Method for adding modules
		addModule: function(moduleCode, targetGrade) {
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				var year = new Date().getFullYear();
				var month = new Date().getMonth() + 1; 
				var day = new Date().getDate();
				var date = (day + "/" + month +"/" + year).toString();

				Modules.insert({
					moduleCode: moduleCode,
					targetGrade: targetGrade,
					date: date,
					createdAt: new Date(),
					userId: Meteor.userId(),
					accumulatedScore: 0,
				});
			}
		},

		//Method for adding score
		addScores: function(ca, weightage, mark, totalMark, thisMod) {
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				//calculate current score for this mod
				var score = (mark/totalMark)*weightage;
				Modules.update(thisMod, { $inc: { accumulatedScore: +score}});

				Scores.insert({
					score: score,
					ca: ca,
					weightage: weightage,
					mark: mark,
					totalMark: totalMark,
					key: thisMod,
				});
			}
		},

		//Method to update user target CAP
		updateCAP: function(targetGrade, currentUser) {
			var cap;
			switch(targetGrade) {
				case "A+": cap=5; break;
				case "A": cap=5; break;
				case "A-": cap=4.5; break;
				case "B+": cap=4; break;
				case "B": cap=3.5; break;
				case "B-": cap=3; break;
				case "C+": cap=2.5; break;
				case "C": cap=2; break;
				case "D+": cap=1.5; break;
				case "D": cap=1; break;
				case "F": cap=0; break;
			}


			Meteor.users.update(currentUser, { $inc: {'profile.numOfMod': +1 }});
			Meteor.users.update(currentUser, { $inc: {'profile.finalCap': +cap }});
			
			/*var username = Meteor.user().username;
			var userId = Meteor.userId();
			Meteor.users.update(
   				{ userId: userId },
   				{ $push: {'profile.totalCap': cap } }
			)*/
			

			/** This doesnt work cos it doesnt treat currentNumOfMod/currentCap as numbers, end up getting NaN
			var currentProfile = Meteor.users.find({userId: id}, {});
			var currentNumOfMod = Meteor.users.find({userId: id}, {'profile.numOfMod': 1, _id:0});
			var currentCap = Meteor.users.find({userId: id}, {'profile.finalCap': 1, _id:0});
			var latestCap = (currentCap + cap)/currentNumOfMod;
			*/

			//The following had some prob i dunno why;(
			//Meteor.users.update(currentUser, { $divide: {'$profile.finalCap', 'profile.numOfMod' }});

			/** PROBLEM HERE, I cannot get profile.finalCap to divide by numOfModules to get the ave cap, 
			currently this statement is just adding 'cap' to profile.finalCap*/
			//note that i created the fields numOfMod and finalCap when i created the account, can see signup.js 
			
			
		},

		removeModule: function(moduleId) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { //remove joke based on Id
				Modules.remove(moduleId);
			}
		},

		removeCA: function(caId) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { //remove joke based on Id
				Scores.remove(caId);
			}
		},


		//Method for remove CA --> delete scores
		deleteScores: function(thisCAscore, thisMod) {
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				//calculate current score for this mod
				Modules.update(thisMod, { $inc: { accumulatedScore: -thisCAscore}});
			}
		},

/* ORGINAL CODE: KEPT HERE FOR REFERENCE
		//Method for adding jokes

		addJokes: function(jokeName, jokePost) {
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				var username = Meteor.user().username;
				var year = new Date().getFullYear();
				var month = new Date().getMonth() + 1; 
				var day = new Date().getDate();
				var date = (day + "/" + month +"/" + year).toString();


				Jokes.insert({
					jokeName: jokeName,
					jokePost: jokePost,
					author: username,
					date: date,
					createdAt: new Date(),
					laughScore: 0,
					frownScore: 0,
					pukeScore: 0,
					voted: [username],
					userId: Meteor.userId(),
				});

			}
		},

		removeJoke: function(jokesId) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { //remove joke based on Id
				Jokes.remove(jokesId);
			}
		},
		*/

		
		
		/*
		countVote: function(thisJoke, Name) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { 
				Jokes.update(thisJoke, { $addToSet: { voted: Name}});
			}			

		},

		userPointLaugh: function(jokeAuthor) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { 
				//going into users collections and update that user laugh score
				Meteor.users.update(jokeAuthor, { $inc: {'profile.laughScore': +1 }});
			}				
		},

		laughVote: function(thisUser, thisJoke) {
			if(!thisUser) {
				throw new Meteor.Error('not authorised');
				return false;
			} else {
				Jokes.update(thisJoke, {$inc: {laughScore: +1}});
			}
		},

		userPointFrown: function(jokeAuthor) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { 
				//going into users collections and update that user laugh score
				Meteor.users.update(jokeAuthor, { $inc: {'profile.frownScore': +1 }});
			}				
		},

		frownVote: function(thisUser, thisJoke) {
			if(!thisUser) {
				throw new Meteor.Error('not authorised');
				return false;
			} else {
				Jokes.update(thisJoke, {$inc: {frownScore: +1}});
			}
		},

		userPointPuke: function(jokeAuthor) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { 
				//going into users collections and update that user laugh score
				Meteor.users.update(jokeAuthor, { $inc: {'profile.pukeScore': +1 }});
			}			
		},

		pukeVote: function(thisUser, thisJoke) {
			if(!thisUser) {
				throw new Meteor.Error('not authorised');
				return false;
			} else {
				Jokes.update(thisJoke, {$inc: {pukeScore: +1}});
			}
		},
		*/

	});
}