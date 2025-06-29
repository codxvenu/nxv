import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database tables
export async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        api_key VARCHAR(64) UNIQUE,
        current_plan ENUM('Free Trial', 'Basic', 'Pro', 'Premium') DEFAULT 'Free Trial',
        plan_start_date DATETIME,
        plan_end_date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        razorpay_order_id VARCHAR(255) NOT NULL,
        razorpay_payment_id VARCHAR(255),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        plan VARCHAR(50) NOT NULL,
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create reviews table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        device_model VARCHAR(255) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        feedback TEXT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// User management functions
export async function createUser(name, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const apiKey = generateApiKey();
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, api_key) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, apiKey]
    );
    
    return {
      id: result.insertId,
      name,
      email,
      apiKey
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export async function findUserByEmail(email) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}

export async function findUserById(id) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, api_key, current_plan, plan_start_date, plan_end_date, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}

export async function updateUserPlan(userId, plan, startDate, endDate) {
  try {
    await pool.execute(
      'UPDATE users SET current_plan = ?, plan_start_date = ?, plan_end_date = ? WHERE id = ?',
      [plan, startDate, endDate, userId]
    );
  } catch (error) {
    throw error;
  }
}

// New function to handle plan upgrades with business logic
export async function upgradeUserPlan(userId, newPlan) {
  try {
    console.log(`[UPGRADE] User ${userId} attempting to upgrade to ${newPlan}`);
    
    // Get current user data
    const [userRows] = await pool.execute(
      'SELECT current_plan, plan_start_date, plan_end_date FROM users WHERE id = ?',
      [userId]
    );
    
    if (userRows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = userRows[0];
    const currentPlan = user.current_plan;
    const currentEndDate = user.plan_end_date;
    
    console.log(`[UPGRADE] Current plan: ${currentPlan}, Current end date: ${currentEndDate}`);
    
    // Check if user is already on the same plan
    if (currentPlan === newPlan) {
      console.log(`[UPGRADE] User already on ${newPlan} plan`);
      throw new Error(`You are already on the ${newPlan} plan.`);
    }
    
    // Define plan hierarchy (higher index = higher tier)
    const planHierarchy = ['Free Trial', 'Basic', 'Pro', 'Premium'];
    const currentPlanIndex = planHierarchy.indexOf(currentPlan);
    const newPlanIndex = planHierarchy.indexOf(newPlan);
    
    console.log(`[UPGRADE] Plan hierarchy check - Current: ${currentPlanIndex}, New: ${newPlanIndex}`);
    
    // Check if user is trying to downgrade
    if (newPlanIndex < currentPlanIndex) {
      console.log(`[UPGRADE] Downgrade attempt blocked - from ${currentPlan} to ${newPlan}`);
      throw new Error(`Cannot downgrade from ${currentPlan} to ${newPlan}. Upgrades must be to higher-tier plans only.`);
    }
    
    // Check if user has a paid plan but no end date (license not activated)
    if (currentPlan && currentPlan !== 'Free Trial' && !currentEndDate) {
      console.log(`[UPGRADE] License not activated - user has ${currentPlan} but no end date`);
      throw new Error('License not activated. Please activate your current plan in the desktop app before purchasing a new plan.');
    }
    
    let newStartDate = null;
    let newEndDate = null;
    
    // If user has no plan or is on Free Trial, don't set dates (handled by desktop app)
    if (!currentPlan || currentPlan === 'Free Trial' || currentPlan === null) {
      newStartDate = null;
      newEndDate = null;
      console.log(`[UPGRADE] New user or Free Trial - no dates set`);
    } else {
      // User has an existing paid plan
      if (currentEndDate) {
        // Extend existing plan by 30 days
        newEndDate = new Date(currentEndDate);
        newEndDate.setDate(newEndDate.getDate() + 30);
        newStartDate = user.plan_start_date; // Keep existing start date
        console.log(`[UPGRADE] Extending existing plan by 30 days - New end date: ${newEndDate}`);
      } else {
        // No end date exists, set to 30 days from now
        newStartDate = new Date();
        newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + 30);
        console.log(`[UPGRADE] Setting new plan dates - Start: ${newStartDate}, End: ${newEndDate}`);
      }
    }
    
    // Update the user's plan
    await pool.execute(
      'UPDATE users SET current_plan = ?, plan_start_date = ?, plan_end_date = ? WHERE id = ?',
      [newPlan, newStartDate, newEndDate, userId]
    );
    
    console.log(`[UPGRADE] Successfully upgraded user ${userId} to ${newPlan}`);
    
    return {
      success: true,
      newPlan,
      newStartDate,
      newEndDate,
      message: newStartDate ? `Plan upgraded to ${newPlan} with 30-day extension` : `Plan activated: ${newPlan}`
    };
  } catch (error) {
    console.error(`[UPGRADE] Error upgrading user ${userId} to ${newPlan}:`, error.message);
    throw error;
  }
}

export async function createPayment(userId, orderId, amount, plan) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO payments (user_id, razorpay_order_id, amount, plan) VALUES (?, ?, ?, ?)',
      [userId, orderId, amount, plan]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

export async function updatePaymentStatus(orderId, paymentId, status) {
  try {
    await pool.execute(
      'UPDATE payments SET razorpay_payment_id = ?, status = ? WHERE razorpay_order_id = ?',
      [paymentId, status, orderId]
    );
  } catch (error) {
    throw error;
  }
}

// Review management functions
export async function createReview(userId, name, deviceModel, rating, feedback) {
  try {
    const [result] = await pool.execute(
      'INSERT INTO reviews (user_id, name, device_model, rating, feedback) VALUES (?, ?, ?, ?, ?)',
      [userId, name, deviceModel, rating, feedback]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

export async function getApprovedReviews() {
  try {
    const [rows] = await pool.execute(
      'SELECT name, device_model, rating, feedback, created_at FROM reviews WHERE status = "approved" ORDER BY created_at DESC LIMIT 3'
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function getPendingReviews() {
  try {
    const [rows] = await pool.execute(
      'SELECT name, device_model, rating, feedback, created_at FROM reviews WHERE status = "pending" ORDER BY created_at DESC LIMIT 3'
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function getUserReview(userId) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}

// Utility functions
function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export { pool }; 