const app = require('./app');
const connectDB = require('./config/db');
const seedSuperadmin = require('./seeders/superAdminSeeder'); // Import seeder
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    await seedSuperadmin(); // Run seeder
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();