import crypto from 'crypto';
import { verifyToken, findUserById, updatePaymentStatus, upgradeUserPlan } from '../../lib/db';

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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      });
    }

    // Update payment status in database
    await updatePaymentStatus(razorpay_order_id, razorpay_payment_id, 'completed');

    // Upgrade user plan using the new logic
    const upgradeResult = await upgradeUserPlan(user.id, plan);

    res.status(200).json({
      success: true,
      message: upgradeResult.message,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      plan: plan,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currentPlan: plan
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
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
      message: 'Failed to verify payment',
      error: error.message 
    });
  }
} 