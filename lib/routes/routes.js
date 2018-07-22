Router.configure({
    layoutTemplate: 'main_layout'
});

//For edit page
Router.route('/edit:_id', function(){
    this.render('edit',  {
        data: function() {
            return Scores.findOne({_id: this.params._id}); 
        }
    });
});

Router.map(function(){
  //My Modules
    this.route('myModules', {
        path: '/myModules',
        template: 'myModules'
    });


    //Login
    this.route('login', {
        path: '/',
        template: 'login'
    });

    //Signup
    this.route('signup', {
        path: '/signup',
        template: 'signup'
    });

    //Profile
    this.route('profile', {
        path: '/profile',
        template: 'profile'
    });

    //Add module page
    this.route('add', {
        path: '/add',
        template: 'add'
    });

    //Edit
    this.route('edit', {
        path: '/edit',
        template: 'edit'
    });
});