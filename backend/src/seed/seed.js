const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Category = require("../models/Category");
const Product = require("../models/Product");
const slugify = require("slugify");
const dotenv = require("dotenv");

dotenv.config();

const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "nexlap2026";

const categories = [
  {
    name: "Laptop Gaming",
    slug: "laptop-gaming",
    description: "Dòng máy chiến game cao cấp, hiệu năng GPU mạnh mẽ"
  },
  {
    name: "Doanh Nhân",
    slug: "doanh-nhan",
    description: "Ultrabook cao cấp dành cho giới văn phòng và doanh nhân"
  },
  {
    name: "Apple Macbook",
    slug: "apple-macbook",
    description: "Hệ sinh thái Apple Silicon mượt mà, pin trâu"
  },
  {
    name: "Workstation",
    slug: "workstation",
    description: "Máy trạm di động cho đồ họa, dựng phim và kỹ thuật"
  }
];

const products = [
  {
    name: "ASUS ROG Zephyrus G16 OLED 2024",
    categorySlug: "laptop-gaming",
    price: 64990000,
    salePrice: 58990000,
    thumbnail: "https://vhx-a.imgix.net/untitled2/assets/5d6c128a-e580-4d98-9a5d-db56d95f67de-70c99abd.png?auto=format%2Ccompress&fit=crop&h=720&w=1280",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAy1IewBV-wluODG_KI3qqnE9CXbDFEH4BtRNnAbz_8zdYsVwHmN_Ln_Yz2b5aWC-IqccWqDh6ZigifansG9eVATAz7BBtK3Y-_npysYNpA_GvMI8v6lZdNqpuyBGqWKTyYgPxA6b202uopFSG_TO4aOt1Q5KZKo95obN3JsXdx0AVC94XF8OfbucYPuxXEoW8Q47PETgh3EftxfpuqY2ZkFdnd4e1e5QmKW0D30myAPUOTJi4TWdPXg"
    ],
    specs: {
      cpu: "Intel Core Ultra 9 185H",
      vga: "NVIDIA RTX 4070 8GB GDDR6",
      ram: "32GB LPDDR5X 7467MHz",
      storage: "1TB NVMe Gen4 M.2",
      screen: "16 inch 2.5K OLED 240Hz 100% DCI-P3"
    },
    description:
      "Cỗ máy gaming siêu mỏng 1.49kg với màn hình ROG Nebula OLED 240Hz. Pin 90Wh, bàn phím RGB và bộ tản nhiệt 2 quạt Arc Flow dành cho game thủ nhiệt thành.",
    stockStatus: "in_stock",
    isFeatured: true
  },
  {
    name: "Dell XPS 16 9640",
    categorySlug: "doanh-nhan",
    price: 68000000,
    salePrice: 62500000,
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE1Y9dkLi7gWQjoF6hNW6yEkh65zqKzXvzMGVeJHrIKSyoEAKuZjYVFUDvBX9nWT-tJHSIxyoRuXfD0q99M_SZ1gMjp0r8ry5SPFuidCoyhAqzrQbWmp9btkorHPj4UTgjnw7wY4G1g5MSlpA_-S1SeeQHIyzpx_y2o7DqwNTffBFI38N06VHX6IJ4ujYc_bWstWzWi6GtjV6GvoNCfbDxtEMZxzLzRlYfLbMrUwN7HQSqVgSutBZ7og",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBE1Y9dkLi7gWQjoF6hNW6yEkh65zqKzXvzMGVeJHrIKSyoEAKuZjYVFUDvBX9nWT-tJHSIxyoRuXfD0q99M_SZ1gMjp0r8ry5SPFuidCoyhAqzrQbWmp9btkorHPj4UTgjnw7wY4G1g5MSlpA_-S1SeeQHIyzpx_y2o7DqwNTffBFI38N06VHX6IJ4ujYc_bWstWzWi6GtjV6GvoNCfbDxtEMZxzLzRlYfLbMrUwN7HQSqVgSutBZ7og"
    ],
    specs: {
      cpu: "Intel Core Ultra 7 155H",
      vga: "NVIDIA RTX 4060 60W",
      ram: "32GB LPDDR5x",
      storage: "1TB NVMe PCIe 4.0",
      screen: "16.3 inch 4K+ OLED Touch (3840x2400)"
    },
    description:
      "Laptop mỏng nhẹ cao cấp với vỏ nhôm CNC nguyên khối, màn hình OLED 4K+ và các sân ga chủ vị doanh nhân. Touchpad haptic 4 chế độ điều khiển.",
    stockStatus: "in_stock",
    isFeatured: true
  },
  {
    name: "MacBook Pro 14 M3 Pro",
    categorySlug: "apple-macbook",
    price: 52990000,
    salePrice: 49990000,
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYSh_ma5BfMq0xUDZvXu8qs1kzRHjd77bXSVxf3D27WON4qG48InrctcbzQExbQS61FQH6W9Cz2TVNN64A6sgvixCBc0u5oMncQSi0eIM6TwKWQHO03n1awL0sNkhpaOCIX91f2GklzDCweNJgJwCBwfm-m_-m7eNAENzlNOUKCbIDWt7WK1Nosjj2bZGrZSofR96koMdd_sJNLanzoQlL0CN_aMGA1hPUXjjxnhr0pNI57XubMx9YWw",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYSh_ma5BfMq0xUDZvXu8qs1kzRHjd77bXSVxf3D27WON4qG48InrctcbzQExbQS61FQH6W9Cz2TVNN64A6sgvixCBc0u5oMncQSi0eIM6TwKWQHO03n1awL0sNkhpaOCIX91f2GklzDCweNJgJwCBwfm-m_-m7eNAENzlNOUKCbIDWt7WK1Nosjj2bZGrZSofR96koMdd_sJNLanzoQlL0CN_aMGA1hPUXjjxnhr0pNI57XubMx9YWw"
    ],
    specs: {
      cpu: "Apple M3 Pro (11-core CPU)",
      vga: "Apple M3 Pro (14-core GPU)",
      ram: "18GB Unified Memory",
      storage: "512GB NVMe PCIe 4.0",
      screen: "14.2 inch Liquid Retina XDR (3024x1964) 120Hz"
    },
    description:
      "Chip M3 Pro mang lại hiệu năng đồ họa và máy học vượt trội, pin tới 18 giờ. Space Black phiên bản độc quyền năm 2024.",
    stockStatus: "in_stock",
    isFeatured: true
  },
  {
    name: "Lenovo Legion Pro 5 16IRX9",
    categorySlug: "laptop-gaming",
    price: 38990000,
    salePrice: 0,
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB09Kn6TzoMYtP7hxy7M8CYISdgphsXsxSnHHckBKNqeu5nmWdHhrHlsH6bVWdaavqLwGWigWJ5VGTRUTz6ykr3uAdPXuC-Kwbz0IN2sGW0ghTiYuwhOhY2fgYkvGqu-1nmaDMkmlgWoFYW17Rwv1nJ56GdNFbqZh0LNTtF_ErSb790hXKZbbYDdl5idJ5FKfMPDfS4s_jmY1VzhPuyoo83_nm--zleH_jBEqrERg3aAN5mCTyU04YoVA",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB09Kn6TzoMYtP7hxy7M8CYISdgphsXsxSnHHckBKNqeu5nmWdHhrHlsH6bVWdaavqLwGWigWJ5VGTRUTz6ykr3uAdPXuC-Kwbz0IN2sGW0ghTiYuwhOhY2fgYkvGqu-1nmaDMkmlgWoFYW17Rwv1nJ56GdNFbqZh0LNTtF_ErSb790hXKZbbYDdl5idJ5FKfMPDfS4s_jmY1VzhPuyoo83_nm--zleH_jBEqrERg3aAN5mCTyU04YoVA"
    ],
    specs: {
      cpu: "Intel Core i7-14700HX (20 Cores)",
      vga: "NVIDIA RTX 4060 140W TGP",
      ram: "16GB DDR5 5600MHz",
      storage: "1TB NVMe Gen4 M.2",
      screen: "16 inch WQXGA 240Hz 100% sRGB"
    },
    description:
      "Cỗ máy game giá trị với GPU RTX 4060 140W đầy đủ TGP, khung máy chắc chắn theo chuẩn quân đội MIL-STD-810H.",
    stockStatus: "in_stock",
    isFeatured: false
  },
  {
    name: "Lenovo ThinkPad P16s Gen 2",
    categorySlug: "workstation",
    price: 44900000,
    salePrice: 0,
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvafaKTl0g2VV4pmPgWtKsdk17-KQoRytAiNIBe56JQGB_Y0_GOLt_98pyeBgspEhS6dPPzVFE8KeEeccLhZFeNie3k2sM05kUWsRGrMgq40IAXGjY2kzrtECJ-lVm5J2KZ97uS4aAR11l-jwCCiCr_f8OfntVd0aChwwUgZZo4UM5suk_MUXLtxmnyK0ZGRoNkNv-vAvm7892qe8qJ7zLC-OdThIaF-iqDyo8b8SxmPEW4vYCMDW6DA",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvafaKTl0g2VV4pmPgWtKsdk17-KQoRytAiNIBe56JQGB_Y0_GOLt_98pyeBgspEhS6dPPzVFE8KeEeccLhZFeNie3k2sM05kUWsRGrMgq40IAXGjY2kzrtECJ-lVm5J2KZ97uS4aAR11l-jwCCiCr_f8OfntVd0aChwwUgZZo4UM5suk_MUXLtxmnyK0ZGRoNkNv-vAvm7892qe8qJ7zLC-OdThIaF-iqDyo8b8SxmPEW4vYCMDW6DA"
    ],
    specs: {
      cpu: "Intel Core i7-1370P",
      vga: "NVIDIA RTX A500 4GB",
      ram: "32GB LPDDR5x ECC",
      storage: "1TB NVMe Gen4",
      screen: "16 inch UHD+ 500 nits 100% DCI-P3"
    },
    description:
      "Máy trạm di động ThinkPad với GPU ISV-certified RTX A500, bàn phím TrackPoint huyền thoại cho các kỹ sư và nhà thiết kế.",
    stockStatus: "in_stock",
    isFeatured: false
  },
  {
    name: "Acer Predator Helios Neo 16",
    categorySlug: "laptop-gaming",
    price: 27990000,
    salePrice: 0,
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIUV9uQ1LllPe1i-Uw4KbrAUo4w4ExVxg1aeKam4CQcL13jBOeWwZq5GZ_moqHHhkduzlPDyXcIGXoNg5UFLmPNQxKofr-foUGOa3c8atgP1pQ6dVPhgPHHvfq2R-Hxo6cJPzAa5F84avRwgWuIMxc0g8wWEkHjKua_eugyYeZnQpns0ksMDKFBn8rBeyecZhHTFyTOt3iMu5ApBmaVtodf9HpgMDBoOGzSVQyu-KV5uuJ8Uoiz9hphg",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIUV9uQ1LllPe1i-Uw4KbrAUo4w4ExVxg1aeKam4CQcL13jBOeWwZq5GZ_moqHHhkduzlPDyXcIGXoNg5UFLmPNQxKofr-foUGOa3c8atgP1pQ6dVPhgPHHvfq2R-Hxo6cJPzAa5F84avRwgWuIMxc0g8wWEkHjKua_eugyYeZnQpns0ksMDKFBn8rBeyecZhHTFyTOt3iMu5ApBmaVtodf9HpgMDBoOGzSVQyu-KV5uuJ8Uoiz9hphg"
    ],
    specs: {
      cpu: "Intel Core i5-14500HX",
      vga: "NVIDIA RTX 4050 6GB 140W",
      ram: "16GB DDR5 5600MHz",
      storage: "512GB NVMe Gen4",
      screen: "16 inch WUXGA 165Hz, bàn phím 4 vùng RGB"
    },
    description:
      "Máy gaming tầm trung giá tốt với tản nhiệt 2 quạt 5 ống đồng, chassis tương lai khắc họa hoa văn cyber.",
    stockStatus: "out_of_stock",
    isFeatured: false
  }
];

const run = async () => {
  try {
    const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/banlaptop_db";
    await mongoose.connect(dbUrl);
    console.log("MongoDB Connected: localhost");

    await Admin.deleteOne({ username: ADMIN_USERNAME });
    await Admin.create({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    console.log(`Created admin: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);

    let createdCategories = 0;
    for (const cat of categories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        createdCategories += 1;
      }
    }
    console.log(`Categories: ${createdCategories} created, ${categories.length - createdCategories} existed`);

    const categoryDocs = {};
    for (const cat of categories) {
      categoryDocs[cat.slug] = await Category.findOne({ slug: cat.slug });
    }

    let createdProducts = 0;
    for (const product of products) {
      const slug = slugify(product.name, { lower: true, strict: true });
      const exists = await Product.findOne({ slug });
      if (!exists) {
        await Product.create({
          name: product.name,
          slug,
          category: categoryDocs[product.categorySlug]._id,
          price: product.price,
          salePrice: product.salePrice,
          thumbnail: product.thumbnail,
          images: product.images,
          specs: product.specs,
          description: product.description,
          stockStatus: product.stockStatus,
          isFeatured: product.isFeatured
        });
        createdProducts += 1;
      }
    }
    console.log(`Products: ${createdProducts} created, ${products.length - createdProducts} existed`);

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

run();