import { verifyToken, findUserById, upgradeUserPlan } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Activate free trial using the upgrade logic
    const upgradeResult = await upgradeUserPlan(user.id, 'Free Trial');

    res.status(200).json({
      success: true,
      message: upgradeResult.message,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currentPlan: 'Premium'
      }
    });

  } catch (error) {
    console.error('Free trial activation error:', error);
    
    // Handle specific upgrade errors
    if (error.message.includes('Cannot downgrade') || 
        error.message.includes('already on the') ||
        error.message.includes('You are already on the') ||
        error.message.includes('License not activated')) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to activate free trial',
      error: error.message 
    });
  }
} 
