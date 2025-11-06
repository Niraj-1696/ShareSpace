#!/usr/bin/env node

/**
 * ShareSpace - Setup & Test Script
 * Run this to verify your environment setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 ShareSpace Setup & Test Script\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Please create a .env file based on .env.example');
  console.log('   Copy: cp .env.example .env');
  console.log('   Then edit .env with your actual values\n');
} else {
  console.log('✅ .env file found');
}

// Check required environment variables
require('dotenv').config();

const requiredVars = ['MONGO_URL', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASSWORD'];
let missingVars = [];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('❌ Missing environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Please add these to your .env file\n');
} else {
  console.log('✅ All required environment variables are set');
}

// Test MongoDB connection
if (process.env.MONGO_URL) {
  console.log('\n🔌 Testing MongoDB connection...');
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connection successful');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message);
  });
}

console.log('\n📧 Email Configuration Guide:');
console.log('For Gmail:');
console.log('1. Enable 2-Factor Authentication');
console.log('2. Generate an App Password');
console.log('3. Use the App Password as EMAIL_PASSWORD');
console.log('4. Use your Gmail address as EMAIL_USER\n');

console.log('🚀 To start the application:');
console.log('Backend: npm run dev (or node server.js)');
console.log('Frontend: cd client && npm start');