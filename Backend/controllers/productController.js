import Product from '../models/Product.js'; // Import the Product model
import User from '../models/User.js'; // Import the User model


// Create Product

export const createProduct = async (req, res) => {
    console.log('Creating Product, req.user is: ' + req.user);
  const { userId } = req.user; // Extract userId from authenticated user
  const { name, category, price, quantity, description } = req.body;

  try {
    // Validate input
    if (!name || !category || !price || !quantity) {
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
      category,
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

// Get Product By Farmer Id

export const getProductById =  async ( req, res ) => {
  const { userId, isFarmer } = req.user;

  try {
    if ( isFarmer ) {
      const product = await Product.findAll( {
        where: {
          user_id: userId,
        }
      });
      if ( product ) {
        res.json(product);
      }
    } else {
      res.status(403).json({ message: 'Only farmers are allowed to view their products.' });
    }
  } catch ( err ) {
    console.error( err );
    res.status(500).json({ message: 'Something went wrong.' });
  }
}


// Get Products By Category

export const getProductByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.findAll( {
      where: {
        category: category
      }
    });
    if ( products ) {
      res.json(products);
    } else {
      res.status(404).json({ message: 'No products found for the given category.' });
    }
  } catch ( error ) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

// Update Product

export const updateProduct = async ( req, res ) => {
  const { userId, isFarmer } = req.user;
  const { productId } = req.params;
  const { name, category, price, quantity, description } = req.body;

  try {
    if ( isFarmer ) {
      const product = await Product.findByPk( productId);
      if (!product ) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      if ( product.user_id === userId ) {
        await product.update({ name, category, price, quantity, description });
        res.json({ message: 'Product updated successfully.' });
      } else {
        res.status(403).json({ message: 'Only the product owner can update the product.' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

// Delete Product

export const deleteProduct = async (req, res ) => {
  const { userId, isFarmer } = req.user;
  const { productId } = req.params;

  try {
    if ( isFarmer ) {
      const product = await Product.findByPk( productId);
      if (!product ) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      if ( product.user_id === userId ) {
        await product.destroy();
        res.json({ message: 'Product deleted successfully.' });
      } else {
        res.status(403).json({ message: 'Only the product owner can delete the product.' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

// Get Product By Product ID
export const getProductByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};
