const express = require('express');
const router = express.Router();
const Product = require('../models/products');
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 9 } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.json({ products, totalPages: Math.ceil(total / limit), currentPage: page, total });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// GET all products with search and filter
// router.get('/', async (req, res) => {
//   try {
//     const { search, category, page = 1, limit = 9 } = req.query;
    
//     let query = {};
    
//     if (search) {
//       query.name = { $regex: search, $options: 'i' };
//     }
    
//     if (category) {
//       query.category = { $regex: category, $options: 'i' };
//     }
    
//     const total = await Product.countDocuments(query);
//     const products = await Product.find(query)
//       .limit(limit * 1)
//       .skip((page - 1) * limit);
    
//     res.json({
//       products,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = new Product({ name, description, price, image, category, stock });
    await product.save();
    res.status(201).json({ message: 'Product added successfully!', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated!', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;