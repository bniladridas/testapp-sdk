import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool, initDatabase } from '../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const pool = getPool();
  const client = await pool.connect();
  try {
    await initDatabase();

    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword],
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: '24h',
      },
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}
