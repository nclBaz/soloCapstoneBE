const passport = require('passport');
const UserModel = require('../profile/schema');
const {createToken  } = require("../midlewares/utilities");
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(
    'linkedin',
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_ID,
        clientSecret: process.env.LINKEDIN_SECRET,
        callbackURL: process.env.LINKEDIN_REDIRECT2,
        scope: [ 'r_liteprofile','r_emailaddress'],
      },
      async (accessToken, refreshToken, profile, done) => {
          
        const User = {
          linkedinId: profile.id,
          name: profile.name.givenName,
          surname: profile.name.familyName,
          image: profile.photos[3].value,
          password:   profile.name.givenName.toLocaleLowerCase() +
            profile.name.familyName.toLocaleLowerCase().slice(0, 1),
          email: profile.emails[0].value,
          username:profile.name.givenName.toLocaleLowerCase() +
          profile.name.familyName.toLocaleLowerCase().slice(0, 1),          
        };

  
        try {
            console.log(profile)
          const findUser = await UserModel.findOne({ linkedinId: profile.id });
          if (findUser) {
            const token = await createToken(findUser);
            done(null, { token: token.token, email: findUser.email });
          } else {
            const checkUser = await UserModel.findOne({
              email: User.email,
            });
  
            if (checkUser) {
              checkUser.linkedinId = User.linkedinId;
              await checkUser.save({ validateBeforeSave: false });
  
              const token = await createToken(checkUser);
              done(null, {
                token: token.token,
                email: checkUser.email,
              });
            } else {
              const createUser = new UserModel(User);
              const user = await createUser.save();
              const token = await createToken(user);
              done(null, { token: token.token, email: user.email });
            }
          }
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
  
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });