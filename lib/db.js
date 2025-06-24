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