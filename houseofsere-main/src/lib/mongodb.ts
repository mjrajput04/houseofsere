import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'houseofsere';

let client: MongoClient | null = null;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName);
}

export async function initializeAdmin() {
  const db = await connectToDatabase();
  const admins = db.collection('admins');
  
  const existingAdmin = await admins.findOne({ username: 'admin' });
  if (!existingAdmin) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('houseofsere2024', 10);
    
    await admins.insertOne({
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date()
    });
  }
}