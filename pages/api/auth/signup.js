import { createUser, initDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Initialize database tables
    await initDatabase();

    // Create user
    const user = await createUser(name, email, password);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message === 'Email already exists') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to create account',
      error: error.message 
    });
  }
} 