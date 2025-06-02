const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Auth = require('../models/Auth');

async function seedSuperadmin() {
  try {
    // Check if superadmin already exists
    const existingUser = await User.findOne({ email: 'mellal@ocp.ma' });
    if (existingUser) {
      console.log('Superadmin user already exists');
      return;
    }

    // Create superadmin user data
    const hashedPassword = await bcrypt.hash('mellal1234', 10);
    const userData = {
      name: 'Super Admin',
      email: 'mellal@ocp.ma',
      password: hashedPassword, // Store hashed password in User
      phoneNumber: '+1234567890',
      address: 'Complexe Minier Benguerir OCP',
      role: 'superadmin',
      active: true,
    };

    // Save user to database
    const user = await User.create(userData);

    // Create corresponding auth record
    await Auth.create({
      email: userData.email,
      password: hashedPassword, // Same hashed password in Auth
      id_person: user._id,
      id_person_model: 'User',
    });

    console.log('Superadmin user seeded successfully');
  } catch (error) {
    console.error('Error seeding superadmin user:', error);
  }
}

module.exports = seedSuperadmin;