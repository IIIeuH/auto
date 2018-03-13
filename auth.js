const   passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        crypto = require('./crypto');

passport.use('login', new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback : true
    },
    async function(req, username, password, done) {
        try{
            let user = await db.collection('users').findOne({ username: username });
            if (!user) {
                return done(null, false, req.flash('message', 'Неверный логин'));
            }
            if (!crypto.decrypt(password, user.password)) {
                return done(null, false, req.flash('message', 'Неверный пароль'));
            }
            return done(null, user);
        }catch(err){
            console.log(err);
            if (err) { return done(err); }
        }
    }
));


passport.serializeUser( (user, done) => {
    done(null, user._id);
});

passport.deserializeUser( (id, done) => {
        db.collection('users').findOne({_id: ObjectId(id)}, (err, user) => {
            if(err) done(err, null);
            done(null, user);
        });
});

module.exports = passport;