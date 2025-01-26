import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
    const { userId } = req.user;
    const { name, product_id, quantity } = req.body;

    try {
        if (!name || !product_id || !quantity) {
            return res.status(400).json({ message: "Name, product_id, and quantity are required." });
        }


        const existingCartItem = await Cart.findOne({
            where: {
                userId,
                product_id,
            },
        });

        if (existingCartItem) {

            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.json({ message: "Product quantity updated in cart!", existingCartItem }); 
        }


        const productInCart = await Cart.create({
            userId,
            name,
            product_id,
            quantity,
        });

        res.status(201).json({ message: "Product has been added to the cart!", productInCart });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Something went wrong..." });
    }
};

// Get Cart Items

export const getCartItems = async (req, res) => {
    const { userId } = req.user;

    try {
        const cartItems = await Cart.findAll({
            where: {
                userId,
            },
            include: {
                model: Product,
                attributes: ["_id", "name", "price"],
            },
        });

        res.status(200).json(cartItems);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Something went wrong..." });
    }
};

// update the cart

export const updateCart = async ( req, res ) => {
    const { userId } = req.user;
    const { cartId } = req.params;
    const { quantity } = req.body;

    try {
        const cartItem = await Cart.findOne({
            where: { _id: cartId }, // Querying by primary key
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }
        if (cartItem.userId!== userId) {
            return res.status(403).json({ message: 'Only the cart owner can update the cart.' });
        }
        await cartItem.update({ quantity });
        res.status(200).json({ message: 'Cart updated successfully.', cartItem });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong'});
    }
}

// delete the cart

export const deleteCart = async (req, res) => {
    const { userId } = req.user;
    const { cartId } = req.params;

    try {
        const cartItem = await Cart.findOne({
            where: { _id: cartId }, // Querying by primary key
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }
        if (cartItem.userId !== userId) {
            return res.status(403).json({ message: 'Only the cart owner can delete the cart.' });
        }
        await cartItem.destroy();
        const updatedCart = await Cart.findAll({
            where: { userId },
            include: {
                model: Product,
                attributes: ['_id', 'name', 'price'],
            },
        });
        res.status(200).json({ message: 'Cart item deleted successfully.', cartItem: updatedCart });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
}