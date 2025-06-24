import Razorpay from 'razorpay';
import { verifyToken, findUserById, createPayment, updateUserPlan } from '../../lib/db';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    const { plan, amount, currency = 'INR' } = req.body;

    // Validate plan and amount
    const validPlans = {
      'Free Trial': 0,
      'Basic': 299,
      'Pro': 499,
      'Premium': 999
    };

    if (!validPlans[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // For free trial, update user plan and return success
    if (plan === 'Free Trial') {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + 1); // 1 hour trial

      await updateUserPlan(user.id, plan, startDate, endDate);
      const updatedUser = await findUserById(user.id);

      return res.status(200).json({
        success: true,
        message: 'Free trial activated successfully!',
        plan: plan,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          currentPlan: updatedUser.current_plan,
          planStartDate: updatedUser.plan_start_date,
          planEndDate: updatedUser.plan_end_date
        }
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `nxv_reflect_${plan.toLowerCase().replace(' ', '_')}_${Date.now()}`,
      notes: {
        plan: plan,
        user_id: user.id,
        customer_email: user.email,
        customer_name: user.name
      }
    };

    const order = await razorpay.orders.create(options);

    // Store payment record in database
    await createPayment(user.id, order.id, amount, plan);

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: plan,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create payment order',
      error: error.message 
    });
  }
} 