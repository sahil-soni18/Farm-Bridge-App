import User from '../models/User.js';
import FarmerProfile from '../models/Farmer.js';

export const updateUserDetails = async (req, res) => {
  const { userId } = req.user; // Extract userId from authenticated user
  const { name, email, password } = req.body;

  try {
    // Fetch the user from the database
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update basic user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Hashing should be applied before saving

    await user.save();

    // If the user is a farmer, update FarmerProfile
    if (user.isFarmer) {
      const { farm_location, products_grown } = req.body;
      let farmerProfile = await FarmerProfile.findOne({ where: { userId } });

      if (!farmerProfile) {
        // If FarmerProfile doesn't exist, create one
        farmerProfile = await FarmerProfile.create({ userId, farm_location, products_grown });
      } else {
        // Update existing FarmerProfile
        if (farm_location) farmerProfile.farm_location = farm_location;
        if (products_grown) farmerProfile.products_grown = products_grown;

        await farmerProfile.save();
      }
    }

    res.status(200).json({ message: 'User details updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};


// Get Profile
export const getProfile = async (req, res) => {

  const { userId } = req.user;

  try {
    // Fetch user without password
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Exclude the password field
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch farmer profile if user is a farmer
    const farmerProfile = await FarmerProfile.findOne({ where: { userId } });

    if (farmerProfile) {
      res.status(200).json({ user, farmerProfile });
    } else {
      res.status(200).json({ user });
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};


