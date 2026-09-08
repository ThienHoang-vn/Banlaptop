const Product = require("../models/Product");
const Category = require("../models/Category");
const slugify = require("slugify");

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      stockStatus,
      page = 1,
      limit = 10
    } = req.query;

    const queryObject = {};

    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (stockStatus) {
      queryObject.stockStatus = stockStatus;
    }

    if (category) {
      const isObjectId = category.match(/^[0-9a-fA-F]{24}$/);

      if (isObjectId) {
        queryObject.category = category;
      } else {
        const categoryDoc = await Category.findOne({ slug: category });

        if (!categoryDoc) {
          return res.status(200).json({ products: [], pagination: null });
        }

        queryObject.category = categoryDoc._id;
      }
    }

    if (minPrice || maxPrice) {
      queryObject.price = {};

      if (minPrice) {
        queryObject.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        queryObject.price.$lte = Number(maxPrice);
      }
    }

    let sortOptions = { createdAt: -1 };

    if (sort === "price-asc") {
      sortOptions = { price: 1 };
    } else if (sort === "price-desc") {
      sortOptions = { price: -1 };
    } else if (sort === "newest") {
      sortOptions = { createdAt: -1 };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Product.countDocuments(queryObject);

    const products = await Product.find(queryObject)
      .populate("category", "name slug")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      products,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).populate(
      "category",
      "name slug"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      salePrice,
      thumbnail,
      images,
      specs,
      description,
      stockStatus,
      isFeatured
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, category and price are required"
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    const product = await Product.create({
      name,
      slug,
      category,
      price,
      salePrice: salePrice || 0,
      thumbnail: thumbnail || "",
      images: images || [],
      specs: specs || {},
      description: description || "",
      stockStatus: stockStatus || "in_stock",
      isFeatured: isFeatured || false
    });

    const populatedProduct = await Product.findById(product._id).populate(
      "category",
      "name slug"
    );

    res.status(201).json(populatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price,
      salePrice,
      thumbnail,
      images,
      specs,
      description,
      stockStatus,
      isFeatured
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }

    if (category) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(400).json({ message: "Category not found" });
      }

      product.category = category;
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (salePrice !== undefined) {
      product.salePrice = salePrice;
    }

    if (thumbnail !== undefined) {
      product.thumbnail = thumbnail;
    }

    if (images !== undefined) {
      product.images = images;
    }

    if (specs !== undefined) {
      product.specs = specs;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (stockStatus !== undefined) {
      product.stockStatus = stockStatus;
    }

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured;
    }

    const updatedProduct = await product.save();

    const populatedProduct = await Product.findById(
      updatedProduct._id
    ).populate("category", "name slug");

    res.status(200).json(populatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};