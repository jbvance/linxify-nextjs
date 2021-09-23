import urlRegex from 'url-regex';
import mongoose from 'mongoose';
import { getSession } from 'next-auth/client';
import { getTitle, getLogo, promiseTiemout } from '../../../lib/utils';
import Links from '../../../models/links';
import Category from '../../../models/category';
import User from '../../../models/user';
import dbConnect from '../../../lib/dbConnect';

export default async function handler(req, res) {
  const { method } = req;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const email = session.user.email;
  const db = await dbConnect();

  // first, get the user id from MongoDB, which will be used to create/get records
  const user = await User.findOne({ email });
  const userId = user._id;

  switch (method) {
    case 'GET':
      try {
        const userLinks = await Links.find({
          user: userId
        })
          .populate('category')
          .lean()
          .populate('user', '_id username firstName lastName')
          .sort({ createdAt: -1 });
        return res.status(200).json({
          data: userLinks
        });
      } catch (error) {
        return res.status(500).json({
          code: 500,
          reason: 'ValidationError',
          message,
          location: 'Get Links'
        });
      }

      break;
    default:
      res.status(400).json({ success: false });
  }
}
