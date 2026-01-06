import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'houseofsere-admin-secret';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'houseofsere';
let db;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

async function connectDB() {
  if (db) return db;
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    
    const admins = db.collection('admins');
    const existingAdmin = await admins.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'houseofsere2024', 10);
      await admins.insertOne({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: hashedPassword,
        createdAt: new Date()
      });
    }
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const verifyUserToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.post('/api/admin/login', async (req, res) => {
  try {
    await connectDB();
    const { username, password } = req.body;
    
    const admins = db.collection('admins');
    const admin = await admins.findOne({ username });
    
    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/verify', verifyAdminToken, (req, res) => {
  res.json({ message: 'Token valid' });
});

app.post('/api/users/signup', async (req, res) => {
  try {
    await connectDB();
    const { firstName, lastName, email, phone, password } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const users = db.collection('users');
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await users.insertOne({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date()
    });
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const users = db.collection('users');
    const user = await users.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token, 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      message: 'Login successful' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    await connectDB();
    const users = db.collection('users');
    const result = await users.find({}, { projection: { password: 0 } }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await connectDB();
    const users = db.collection('users');
    const result = await users.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    await connectDB();
    const { firstName, lastName, email, phone } = req.body;
    const users = db.collection('users');
    
    const result = await users.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { firstName, lastName, email, phone, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    await connectDB();
    const { userId, product, address, paymentMethod, total } = req.body;
    
    if (!userId || !product || !address || !paymentMethod || !total) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const orders = db.collection('orders');
    
    const result = await orders.insertOne({
      userId,
      product,
      address,
      paymentMethod,
      total,
      status: 'pending',
      createdAt: new Date()
    });
    
    res.status(201).json({ 
      message: 'Order placed successfully',
      orderId: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    await connectDB();
    const orders = db.collection('orders');
    const result = await orders.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders by user
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    await connectDB();
    const orders = db.collection('orders');
    const result = await orders.find({ userId: req.params.userId }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    await connectDB();
    const orders = db.collection('orders');
    const result = await orders.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    await connectDB();
    const { status } = req.body;
    const orders = db.collection('orders');
    
    const result = await orders.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    await connectDB();
    const products = db.collection('products');
    const result = await products.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    await connectDB();
    const { title, category, price, imageUrl, description } = req.body;
    
    if (!title || !category || !price) {
      return res.status(400).json({ message: 'Title, category, and price are required' });
    }
    
    const products = db.collection('products');
    
    const result = await products.insertOne({
      title,
      category,
      price,
      imageUrl: imageUrl || '',
      description: description || '',
      createdAt: new Date()
    });
    
    res.status(201).json({ 
      message: 'Product created successfully',
      productId: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    await connectDB();
    const { title, category, price, imageUrl, description } = req.body;
    const products = db.collection('products');
    
    const result = await products.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, category, price, imageUrl, description, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await connectDB();
    const products = db.collection('products');
    const result = await products.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    await connectDB();
    const categories = db.collection('categories');
    const result = await categories.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/categories/bulk', async (req, res) => {
  try {
    await connectDB();
    const { categories: categoryNames } = req.body;
    
    if (!categoryNames || !Array.isArray(categoryNames) || categoryNames.length === 0) {
      return res.status(400).json({ message: 'Categories array is required' });
    }
    
    const categories = db.collection('categories');
    const categoriesToInsert = [];
    
    for (const name of categoryNames) {
      const trimmedName = name.trim();
      if (trimmedName) {
        const existing = await categories.findOne({ name: trimmedName });
        if (!existing) {
          categoriesToInsert.push({
            name: trimmedName,
            createdAt: new Date()
          });
        }
      }
    }
    
    if (categoriesToInsert.length > 0) {
      await categories.insertMany(categoriesToInsert);
    }
    
    res.status(201).json({ 
      message: `${categoriesToInsert.length} categories saved successfully`,
      savedCount: categoriesToInsert.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category
app.put('/api/categories/:id', async (req, res) => {
  try {
    await connectDB();
    const { name } = req.body;
    const categories = db.collection('categories');
    
    const result = await categories.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    await connectDB();
    const categories = db.collection('categories');
    const result = await categories.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Settings endpoints
app.get('/api/settings', async (req, res) => {
  try {
    await connectDB();
    const settings = db.collection('settings');
    const result = await settings.findOne({}) || {};
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    await connectDB();
    const { shippingCost } = req.body;
    const settings = db.collection('settings');
    
    await settings.replaceOne(
      {},
      { shippingCost, updatedAt: new Date() },
      { upsert: true }
    );
    
    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;