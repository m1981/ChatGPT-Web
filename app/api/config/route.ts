// create a Next.js API route handler that authenticates the user using Passport.js and returns a JSON object containing configuration data.
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from '../../config/passport';
import { getServerSideConfig } from "../../config/server"; // Changed from "../../config/passport"

const config = getServerSideConfig();

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(passport.initialize());

handler.post(passport.authenticate('local', { session: false }), (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  res.status(200).json({
    needCode: config.needCode,
    // Return any other necessary data, but make sure not to expose sensitive information
  });
});

export default handler;

