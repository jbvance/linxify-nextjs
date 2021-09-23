import { getSession } from 'next-auth/client';
import { connectToDatabase } from '../../../lib/db';
import { hashPassword, verifyPassword } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req });
  console.log(req.headers);
  if (!session) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  try {
    const client = await connectToDatabase();
    const usersCollection = client.db().collection('users');
    const user = await usersCollection.findOne({ email: userEmail });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      client.close();
      return;
    }
    const currentPassword = user.password;
    //Verify that the 'old password' entered and the current password in db are the same
    const passwordsAreEqual = await verifyPassword(
      oldPassword,
      currentPassword
    );
    if (!passwordsAreEqual) {
      res.status(422).json({ message: 'Old password does not match' });
      client.close();
      return;
    }
    // Passwords match, update password in db
    const hashedPassword = await hashPassword(newPassword);
    const result = await usersCollection.updateOne(
      { email: userEmail },
      { $set: { password: hashedPassword } }
    );
    client.close();
    res.status(200).json({ message: 'Password updated!' });
  } catch (error) {
    res.status(500).json({
      message: 'Server error updating password. Please try again later'
    });
  }
}

export default handler;
