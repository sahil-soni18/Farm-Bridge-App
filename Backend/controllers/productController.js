import Product from '../models/Product.js'; // Import the Product model
import User from '../models/User.js'; // Import the User model


// Create Product

export const createProduct = async (req, res) => {
    console.log('Creating Product, req.user is: ' + req.user);
  const { userId } = req.user; // Extract userId from authenticated user
  const { name, price, quantity, description } = req.body;

  try {
    // Validate input
    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'Name, price, and quantity are required.' });
    }

    // Fetch the user's role from the database
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user is a Farmer
    if (!user.isFarmer) {
      return res.status(403).json({ message: 'Only farmers are allowed to create products.' });
    }

    // Create the product
    const product = await Product.create({
      name,
      price,
      quantity,
      description,
      user_id: userId,
    });

    res.status(201).json({ message: 'Product created successfully.', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};


// Get All Products

export const getAllProducts = async ( req, res ) => {
    try {
        const allProducts = await Product.findAll();
        if ( allProducts ) {
            res.json( allProducts );
        } 
    } catch ( err ) {
        console.error( err );
        res.status(500).json({ message: 'Something went wrong'});
    }
}
