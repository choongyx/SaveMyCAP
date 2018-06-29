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
    this.route('add', {
        path: '/add',
        template: 'add'
    });

    /** NOT USING

    //Mod 1
    this.route('mod1', {
        path: '/mod1',
        template: 'mod1'
    });

    //Mod 2
    this.route('mod2', {
        path: '/mod2',
        template: 'mod2'
    });

    //Mod 3
    this.route('mod3', {
        path: '/mod3',
        template: 'mod3'
    });

    //Mod 4
    this.route('mod4', {
        path: '/mod4',
        template: 'mod4'
    });

    //Mod 5
    this.route('mod5', {
        path: '/mod5',
        template: 'mod5'
    });
    */

});