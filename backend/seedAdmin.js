import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'houseofsere';

async function seedAdmin() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const admins = db.collection('admins');
    
    // Check if admin already exists
    const existingAdmin = await admins.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'houseofsere2024', 10);
    
    // Insert admin user
    const result = await admins.insertOne({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin user created successfully:', result.insertedId);
    
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

seedAdmin();