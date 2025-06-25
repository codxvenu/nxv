import { createReview, verifyToken } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get token from cookies
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const { name, deviceModel, rating, feedback } = req.body;

    // Validate input
    if (!name || !deviceModel || !rating || !feedback) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    if (feedback.length < 10) {
      return res.status(400).json({ success: false, message: 'Feedback must be at least 10 characters long' });
    }

    // Create review
    const reviewId = await createReview(decoded.userId, name, deviceModel, rating, feedback);

    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully! It will be reviewed before publishing.',
      reviewId,
      review: {
        id: reviewId,
        name,
        deviceModel,
        rating,
        feedback,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
} 