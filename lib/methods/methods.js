if (Meteor.isServer) {
	Meteor.methods({

		//Method for adding modules
		addModule: function(moduleCode, targetGrade, mc) {
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
					mc: mc,
					date: date,
					createdAt: new Date(),
					userId: Meteor.userId(),
					accumulatedScore: 0,
					totalWeightage: 0,
				});
			}
		},

		//Method for adding score
		addScores: function(ca, weightage, mark, totalMark, thisMod) {
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				//update the total Weightage for this module
				Modules.update(thisMod, {$inc: {totalWeightage: +weightage}});

				var currentMod = Modules.findOne({_id: thisMod});

				//if weightage exceed 100
				if(currentMod.totalWeightage > 100) {
					Modules.update(thisMod, {$inc: {totalWeightage: -weightage}});
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
					return true;
				}
			}
		},

		//Method to initialise user target CAP collection
		initialiseCAP: function(){
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				Cap.insert({
					numOfMc: 0,
					totalCap: 0,
					finalCap:0,
					userId: Meteor.userId(),
				});
			}
		},

		//Method to update user target CAP
		updateCAP: function(targetGrade, currentUser, mc) {
			var cap;
			var thisMc = parseInt(mc);
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
				case "CS": cap=0; thisMc=0; break;
				case "CU": cap=0; thisMc=0; break;
			}

			var thisUser = Cap.findOne({userId: currentUser});
			var addToTotalCap = cap*thisMc;

			var newfinalCap = (thisUser.totalCap + addToTotalCap)/(thisUser.numOfMc + thisMc);
			Cap.update(thisUser._id, { $inc: {'numOfMc': +thisMc }});
			Cap.update(thisUser._id, { $inc: {'totalCap': +addToTotalCap }});
			Cap.update(thisUser._id, { $set: {'finalCap': newfinalCap }});
		},

		//method to delete module from collection
		removeModule: function(moduleId) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { //remove joke based on Id
				Modules.remove(moduleId);
			}
		},

		//method to delete ca from collection
		removeCA: function(caId) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { //remove ca based on Id
				Scores.remove(caId);
			}
		},

		//Method for remove module --> update cap score accordingly
		deleteCapScore: function(targetGrade, currentUser, mc){
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				//calculate current score for this mod

				var cap;
				var thisMc = parseInt(mc);
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
					case "CS": cap=0; thisMc=0; break;
					case "CU": cap=0; thisMc=0; break;
				}

				var thisUser = Cap.findOne({userId: currentUser});
				var addToTotalCap = cap*thisMc;

				var newfinalCap = (thisUser.totalCap- addToTotalCap)/(thisUser.numOfMc-thisMc);
				Cap.update(thisUser._id, { $inc: {'numOfMc': -thisMc }});

				Cap.update(thisUser._id, { $inc: {'totalCap': -addToTotalCap }});
				Cap.update(thisUser._id, { $set: {'finalCap': newfinalCap }});
				var thisUser = Cap.findOne({userId: currentUser});

				//zero modules
				if(thisUser.numOfMc == 0) {
					Cap.update(thisUser._id, { $set: {'finalCap': 0 }});
				}
			}
		},

		//Method for remove CA --> delete scores
		deleteScores: function(thisCAscore, thisCAweightage, thisMod) {
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				Modules.update(thisMod, { $inc: { accumulatedScore: -thisCAscore}});
				Modules.update(thisMod, { $inc: { totalWeightage: -thisCAweightage}});
			}
		},

/* ORGINAL CODE: KEPT HERE FOR REFERENCE
		
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

