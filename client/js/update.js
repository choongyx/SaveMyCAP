//NOT USING THIS FILE
Template.update.rendered = function() {

}

Template.update.helpers({
  scores: function() {
    //db.coll.find({"mykey":{'$exists': 1}})
    //var mod = Meteor.call('getMod');

    //var tmpl = UI._templateInstance();
        //var mod= tmpl.moduleCode;
        //var mod = template.find('key');

    //instance = Template.instance();
      //instance_reactive_data_context = this; // or = Template.currentData();
      // instance_nonreactive_data_context = it can't be accessed as a non-reactive source. 
      //When you'll need something like this, most likely because the helper is running too many times, 
      //look into the [meteor-computed-field][1] package
      // to access or modify the reactive-var attached to the template:
      //console.log(Template.instance().reactive_variable.get());
      //Template.instance().reactive_variable.set('new value');
      // to access or modify one of the reactive-dictionaries attached to the template:
      //console.log(Template.instance().reactive_dictionaries.get('attachedDict_2'));
      //Template.instance().reactive_dictionaries.set('attachedDict_2', 'new value here');
      // obviously since you declared instance on the first line, you'd actually use everywhere "instance." instead of "Template.instance()."
      //var moduleCode = Template.instance().reactive_variable.get();
    var scores = Scores.find({}, {sort: {createdAt: -1}});
    return scores;
  }
});



Template.update.events({
  'submit .add-CA': function(){
    //event.preventDefault();

   // Get input value
    var ca = event.target.ca.value;
    var weightage = event.target.weightage.value;
    var mark = event.target.mark.value;
    var totalMark = event.target.totalMark.value;
    var mod = event.target.mod.value;
    //var moduleCode = this._id;

    if (isNotEmpty(ca) &&
      isNotEmpty(weightage) &&
      isNotEmpty(mark) &&
      isNotEmpty(totalMark) &&
      isNotEmpty(mod)) {
      
      Meteor.call('addScores', ca, weightage, mark, totalMark, mod);

      // Clear form
      event.target.ca.value ="";
      event.target.weightage.value ="";
      event.target.mark.value ="";
      event.target.totalMark.value ="";
      event.target.mod.value ="";


      Bert.alert("Your Score Was Updated!", "success", "growl-top-right");

          //added to allow helpers to access template data
    //instance = template;
    //instance_reactive_data_context = Template.currentData();
    //instance_nonreactive_data_context = template.data;
    //event_data_context = event.currentTarget;
    
    // to access or modify the reactive-var attached to the template:
    //console.log(template.reactive_variable.get());
    //template.reactive_variable.set('new value');
    // to access or modify one of the reactive-dictionaries attached to the template:
    //console.log(template.reactive_dictionaries.get('attachedDict_2'));
    //template.reactive_dictionaries.set('attachedDict_2', { newkey: 'new value', somearray: ['a', 'b'] });

    } else {
      Bert.alert("Please input all fields", "danger", "growl-top-right");
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