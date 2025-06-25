import { pool } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { reviewId } = req.body;

    if (!reviewId) {
      return res.status(400).json({ success: false, message: 'Review ID is required' });
    }

    // Update review status to approved
    await pool.execute(
      'UPDATE reviews SET status = "approved" WHERE id = ?',
      [reviewId]
    );

    res.status(200).json({ 
      success: true, 
      message: 'Review approved successfully'
    });

  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
} 