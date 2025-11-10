import crypto from 'crypto';
import dbClient from '../utils/db.js';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Validation
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    try {
      // Check if user already exists
      const existingUser = await dbClient.collection('users').findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Already exist' });

      // Hash password using SHA1
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      // Insert new user
      const result = await dbClient.collection('users').insertOne({ email, password: hashedPassword });

      return res.status(201).json({ id: result.insertedId, email });
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;
