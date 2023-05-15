// passport.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getServerSideConfig } from "./server";

const config = getServerSideConfig();

passport.use(new LocalStrategy(
  function(username, password, done) {
    // todo: Replace this with your own authentication logic
    const hashedAccessCode = bcrypt.hashSync(password, 10);
    if (config.codes.has(hashedAccessCode)) {
      return done(null, { username });
    } else {
      return done(null, false, { message: 'Incorrect access code.' });
    }
  }
));

export default passport;
