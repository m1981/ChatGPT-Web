import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from '../../config/passport';
import { getServerSideConfig } from "../../config/server";

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
  });
});

const nextHandler = handler;
export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return nextHandler(req, res);
}
