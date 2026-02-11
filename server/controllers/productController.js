import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const file = req.file;
    const { name, description, price, category, imageUrl } = req.body;

    // Accept either a file OR a URL
    if (!file && !imageUrl) {
      return res.status(400).json({ message: "Either an image file or image URL is required" });
    }

    let imageFile;

    if (file) {
      // Upload file to Cloudinary as before
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "restaurant web 1" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await streamUpload(req);
      imageFile = result.secure_url;
    } else {
      // Use the URL directly — no Cloudinary upload needed
      imageFile = imageUrl;
    }

    const product = new Product({ name, description, price, category, image: imageFile });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let imageFile = product.image;

    // Handle file upload
    if (req.file) {
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "restaurant web 1" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await streamUpload(req);
      imageFile = result.secure_url;
    } 
    // Handle URL input
    else if (req.body.imageUrl) {
      imageFile = req.body.imageUrl;
    }

    // Update fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.image = imageFile;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
