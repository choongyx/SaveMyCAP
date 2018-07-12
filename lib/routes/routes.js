Router.configure({
    layoutTemplate: 'main_layout'
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

    //Add
    /**
    this.route('add', {
        path: '/add',
        template: 'add'
    });
    */
});