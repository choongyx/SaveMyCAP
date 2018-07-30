if (Meteor.isServer) {
	Meteor.methods({

		//Method for adding modules
		addModule: function(moduleCode, targetGrade, mc, acadYear) {
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
					acadYear: acadYear,
					actual: '-',
				});

				var getSem;
				//if dont have this year, add it in to collection
				if(getSem = Sem.findOne({acadYear: acadYear, userId: Meteor.userId()})){
					Sem.update(getSem._id, { $inc: {'numOfMods': +1}});
				} else {
					Sem.insert({
						acadYear: acadYear,
						userId: Meteor.userId(),
						numOfMods: 1,
					});
				}
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
					if( totalMark == 0) {
						score = 0;
					}
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

		//Method for editing score
		editScores: function(ca, weightage, mark, totalMark, thisModId, thisCAId) {
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				//update the total Weightage for this module
				var thisCAweightageOld = Scores.findOne({_id: thisCAId}).weightage;
				Modules.update(thisModId, {$inc: {totalWeightage: -thisCAweightageOld}});
				Modules.update(thisModId, {$inc: {totalWeightage: +weightage}});

				var currentMod = Modules.findOne({_id: thisModId});

				//if weightage exceed 100
				if(currentMod.totalWeightage > 100) {
					Modules.update(thisModId, {$inc: {totalWeightage: -weightage}});
					return false;
				} else {

					//get the old score and deduct from the overall accumulated score
					var thisCAscoreOld = Scores.findOne({_id: thisCAId}).score;
					Modules.update(thisModId, { $inc: { accumulatedScore: -thisCAscoreOld}});

					//calculate current score for this mod
					var score = (mark/totalMark)*weightage;
					Modules.update(thisModId, { $inc: { accumulatedScore: +score}});

					Scores.update(thisCAId, {$set: {score: score}});
					Scores.update(thisCAId, {$set: {ca: ca}});
					Scores.update(thisCAId, {$set: {weightage: weightage}});
					Scores.update(thisCAId, {$set: {mark: mark}});
					Scores.update(thisCAId, {$set: {totalMark: totalMark}});
					
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
					userId: Meteor.userId(),
				});
			}
		},

		//Method to initialise user actual CAP collection
		initialiseActualCAP: function(){
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				Actualcap.insert({
					totalMc: 0,
					totalActualCap: 0,
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

			Cap.update(thisUser._id, { $inc: {'numOfMc': +thisMc }});
			Cap.update(thisUser._id, { $inc: {'totalCap': +addToTotalCap }});
		},

		//Method to update user actual CAP
		addActualGrade: function(actualGrade, thisModId) {
			var cap;
			var currentMod = Modules.findOne({_id: thisModId});

			var thisMc = currentMod.mc;
			switch(actualGrade) {
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
				case "-" : cap=0; thisMc = 0; break;
			}

			var addToTotalCap = cap*thisMc;

			//if actual is empty, add cap to overall cap
			if(Modules.findOne({_id: thisModId, userId: Meteor.userId(), actual: '-'})){
				Modules.update(thisModId, {$set: {actual: actualGrade}});

				var thisUser = Actualcap.findOne({userId: Meteor.userId()});

				Actualcap.update(thisUser._id, { $inc: {'totalMc': +thisMc }});
				Actualcap.update(thisUser._id, { $inc: {'totalActualCap': +addToTotalCap }});

			} else { //if actual is not empty, means need to update overall cap
				var thisMod = Modules.findOne({_id: thisModId, userId: Meteor.userId()});
				var oldCap;
				var oldMc = thisMod.mc;;

				switch(thisMod.actual) {
				case "A+": oldCap=5; break;
				case "A": oldCap=5; break;
				case "A-": oldCap=4.5; break;
				case "B+": oldCap=4; break;
				case "B": oldCap=3.5; break;
				case "B-": oldCap=3; break;
				case "C+": oldCap=2.5; break;
				case "C": oldCap=2; break;
				case "D+": oldCap=1.5; break;
				case "D": oldCap=1; break;
				case "F": oldCap=0; break;
				case "CS": oldCap=0; oldMc=0; break;
				case "CU": oldCap=0; oldMc=0; break;
				case "-" : cap=0; thisMc = 0; break;
				}

				Modules.update(thisModId, {$set: {actual: actualGrade}});

				var thisUser = Actualcap.findOne({userId: Meteor.userId()});

				var minusFromTotalCap = oldCap*oldMc;

				Actualcap.update(thisUser._id, { $inc: {'totalMc': -oldMc }});
				Actualcap.update(thisUser._id, { $inc: {'totalActualCap': -minusFromTotalCap }});

				var thisUser = Actualcap.findOne({userId: Meteor.userId()});

				Actualcap.update(thisUser._id, { $inc: {'totalMc': +thisMc }});
				Actualcap.update(thisUser._id, { $inc: {'totalActualCap': +addToTotalCap }});
			}
			
		},

		//Method to delete module from collection
		removeModule: function(moduleId) {
			if (!Meteor.userId()) { //if user not  logged in
				throw new Meteor.Error('not authorised');
				this.stop(); 
			} else { //remove joke based on Id
				var thisMod = Modules.findOne({_id: moduleId});
				var thisSem = Sem.findOne({acadYear: thisMod.acadYear});
				Sem.update(thisSem._id, { $inc: {'numOfMods': -1}});
				var thisSem = Sem.findOne({acadYear: thisMod.acadYear});
				if(thisSem.numOfMods == 0) {
					Sem.remove(thisSem._id);
				}

				Modules.remove(moduleId);
			}
		},

		//Method to delete ca from collection
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
					case "-" : cap=0; thisMc = 0; break;
				}

				var thisUser = Cap.findOne({userId: currentUser});
				var addToTotalCap = cap*thisMc;

				Cap.update(thisUser._id, { $inc: {'numOfMc': -thisMc }});

				Cap.update(thisUser._id, { $inc: {'totalCap': -addToTotalCap }});
			}
		},

		//Method for remove module --> update actual cap score accordingly
		deleteActualCapScore: function(actualGrade, currentUser, mc){
			if(!Meteor.userId()) {
				throw new Meteor.Error('not authorized');
				return false;
			} else {
				//calculate current score for this mod

				var cap;
				var thisMc = parseInt(mc);
				switch(actualGrade) {
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
					case "-" : cap=0; thisMc = 0; break;
				}

				var thisUser = Actualcap.findOne({userId: currentUser});
				var addToTotalCap = cap*thisMc;

				Actualcap.update(thisUser._id, { $inc: {'totalMc': -thisMc }});

				Actualcap.update(thisUser._id, { $inc: {'totalActualCap': -addToTotalCap }});
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

	});
}

