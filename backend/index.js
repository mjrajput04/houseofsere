import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'houseofsere-admin-secret';

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'houseofsere';
let db;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static('uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'hero-video' + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    
    // Initialize admin user
    await initializeAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Initialize admin user
async function initializeAdmin() {
  const admins = db.collection('admins');
  const existingAdmin = await admins.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'houseofsere2024', 10);
    await admins.insertOne({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: hashedPassword,
      createdAt: new Date()
    });
    console.log('Admin user created');
  }
}

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admins = db.collection('admins');
    const admin = await admins.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify admin token middleware
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Verify user token middleware
const verifyUserToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected admin routes
app.get('/api/admin/verify', verifyAdminToken, (req, res) => {
  res.json({ message: 'Token valid' });
});

// Protected user routes
app.get('/api/users/verify', verifyUserToken, async (req, res) => {
  try {
    const { ObjectId } = await import('mongodb');
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(req.userId) });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('User verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
app.get('/api/users', async (req, res) => {
  try {
    const users = db.collection('users');
    const result = await users.find({}, { 
      projection: { password: 0 } // Exclude password field
    }).toArray();
    res.json(result);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only)
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone } = req.body;
    const { ObjectId } = await import('mongodb');
    
    const users = db.collection('users');
    
    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          firstName,
          lastName,
          email,
          phone,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 1) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ObjectId } = await import('mongodb');
    const users = db.collection('users');
    
    const result = await users.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Orders routes
app.post('/api/orders', async (req, res) => {
  try {
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
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = db.collection('orders');
    const result = await orders.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = db.collection('orders');
    const result = await orders.find({ userId }).toArray();
    res.json(result);
  } catch (error) {
    console.error('User orders fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ObjectId } = await import('mongodb');
    const orders = db.collection('orders');
    
    const result = await orders.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Order deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User signup route
app.post('/api/users/signup', async (req, res) => {
  try {
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
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login route
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const users = db.collection('users');
    const user = await users.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Categories routes
app.post('/api/categories/bulk', async (req, res) => {
  try {
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
    console.error('Bulk category creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = db.collection('categories');
    const result = await categories.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ObjectId } = await import('mongodb');
    const categories = db.collection('categories');
    
    const result = await categories.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Category deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Products routes
app.post('/api/products', async (req, res) => {
  try {
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
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = db.collection('products');
    const result = await products.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ObjectId } = await import('mongodb');
    const products = db.collection('products');
    
    const result = await products.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, price, imageUrl, description } = req.body;
    const { ObjectId } = await import('mongodb');
    
    if (!title || !category || !price) {
      return res.status(400).json({ message: 'Title, category, and price are required' });
    }
    
    const products = db.collection('products');
    
    const result = await products.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          category,
          price,
          imageUrl: imageUrl || '',
          description: description || '',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 1) {
      res.json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Settings routes
app.get('/api/settings', async (req, res) => {
  try {
    const settings = db.collection('settings');
    const result = await settings.findOne({ type: 'global' });
    
    if (!result) {
      // Return default settings if none exist
      return res.json({
        shippingCost: '0.00',
        heroVideo: null
      });
    }
    
    res.json({
      shippingCost: result.shippingCost || '0.00',
      heroVideo: result.heroVideo || null
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/settings', upload.single('heroVideo'), async (req, res) => {
  try {
    const { shippingCost } = req.body;
    const settings = db.collection('settings');
    
    const updateData = {
      shippingCost,
      updatedAt: new Date()
    };
    
    if (req.file) {
      updateData.heroVideo = req.file.filename;
    }
    
    const result = await settings.updateOne(
      { type: 'global' },
      { $set: updateData },
      { upsert: true }
    );
    
    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Settings save error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/settings/delete-video', async (req, res) => {
  try {
    const settings = db.collection('settings');
    
    // Get current video filename to delete file
    const currentSettings = await settings.findOne({ type: 'global' });
    if (currentSettings?.heroVideo) {
      const filePath = path.join('uploads', currentSettings.heroVideo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Remove video from database
    await settings.updateOne(
      { type: 'global' },
      { $unset: { heroVideo: '' }, $set: { updatedAt: new Date() } }
    );
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Video deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});