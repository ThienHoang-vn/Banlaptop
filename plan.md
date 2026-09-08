1. Tổng Quan Kiến Trúc Dự ÁnTên dự án: Website Giới thiệu & Kinh doanh Laptop (NexLap Store)Mô hình: Client - Server (Decoupled Architecture)Tech Stack:Frontend: Next.js 14+ (App Router), Tailwind CSS, AxiosBackend: Node.js, ExpressJS (JavaScript)Database & ODM: MongoDB, MongooseXác thực: JWT (JSON Web Token) cho phân hệ AdminLưu trữ ảnh: Cloudinary (qua Multer)2. Cấu Trúc Thư Mục Source CodePlaintextBanlaptop/
├── UI/                     # Tài nguyên giao diện HTML/CSS mẫu từ Stitch
├── backend/                # Node.js + ExpressJS + MongoDB API
│   ├── src/
│   │   ├── config/         # Cấu hình MongoDB, Cloudinary
│   │   │   ├── db.js
│   │   │   └── cloudinary.js
│   │   ├── controllers/    # Logic xử lý nghiệp vụ
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   ├── productController.js
│   │   │   ├── leadController.js
│   │   │   └── uploadController.js
│   │   ├── middlewares/    # Middlewares (Auth JWT, Upload, Error)
│   │   │   ├── authMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/         # Mongoose Schemas
│   │   │   ├── Admin.js
│   │   │   ├── Category.js
│   │   │   ├── Product.js
│   │   │   └── Lead.js
│   │   ├── routes/         # Khai báo Endpoints API
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── leadRoutes.js
│   │   │   └── uploadRoutes.js
│   │   ├── utils/          # Helper (generateToken, slugify, formatters)
│   │   │   ├── generateToken.js
│   │   │   └── helpers.js
│   │   └── app.js          # Khởi tạo App & Middleware toàn cục
│   ├── .env                # Biến môi trường Backend
│   ├── .gitignore
│   ├── package.json
│   └── server.js           # Entry point chạy Server
│
└── frontend/               # Next.js 14+ Frontend Application
    ├── public/             # File tĩnh (Logo, favicon)
    ├── src/
    │   ├── app/            # App Router Routing
    │   │   ├── (public)/   # Layout công khai (Client/Guest)
    │   │   │   ├── page.jsx                 # Trang chủ & Danh sách sản phẩm + Bộ lọc
    │   │   │   ├── products/[slug]/page.jsx # Trang chi tiết laptop & Lead Form
    │   │   │   └── layout.jsx
    │   │   ├── admin/      # Layout & Trang Quản trị
    │   │   │   ├── login/page.jsx           # Đăng nhập Admin
    │   │   │   ├── dashboard/page.jsx       # Thống kê tổng quan
    │   │   │   ├── products/page.jsx        # Quản lý Sản phẩm (CRUD, Modal)
    │   │   │   ├── categories/page.jsx      # Quản lý Danh mục
    │   │   │   ├── leads/page.jsx           # Quản lý Đăng ký tư vấn
    │   │   │   └── layout.jsx
    │   │   ├── globals.css
    │   │   └── layout.jsx
    │   ├── components/     # UI Components ghép từ thư mục /UI
    │   │   ├── common/     # Header, Footer, FloatingCTA, Modal
    │   │   ├── client/     # ProductCard, FilterSidebar, LeadForm
    │   │   └── admin/      # AdminSidebar, AdminTable, ProductModal
    │   ├── services/       # Client gọi API Backend
    │   │   ├── api.js      # Axios instance (có đính kèm Bearer Token)
    │   │   ├── productService.js
    │   │   ├── categoryService.js
    │   │   ├── leadService.js
    │   │   └── authService.js
    │   ├── context/        # React Auth Context cho Admin
    │   │   └── AuthContext.jsx
    │   └── utils/          # Helper format giá VND, validate
    │       └── formatters.js
    ├── .env.local          # Biến môi trường Client
    ├── tailwind.config.js
    ├── package.json
    └── next.config.js
3. Danh Sách Chi Tiết Router API (/api/v1)🔑 Authentication (Admin)POST /api/v1/admin/auth/login - Đăng nhập tài khoản Admin $\rightarrow$ Trả về JWT Token.GET /api/v1/admin/auth/me - Kiểm tra token hợp lệ & lấy thông tin Admin hiện tại [Auth].📂 Danh Mục (Categories)GET /api/v1/categories - Lấy danh sách tất cả danh mục (Công khai).POST /api/v1/admin/categories - Tạo danh mục mới [Auth].PUT /api/v1/admin/categories/:id - Cập nhật thông tin danh mục [Auth].DELETE /api/v1/admin/categories/:id - Xóa danh mục [Auth].💻 Sản Phẩm (Products)GET /api/v1/products - Danh sách sản phẩm public (Hỗ trợ params: page, limit, category, search, minPrice, maxPrice, cpu, ram, sort).GET /api/v1/products/:slug - Lấy chi tiết 1 sản phẩm theo Slug (Công khai).POST /api/v1/admin/products - Thêm mới laptop (Bao gồm specs JSON) [Auth].PUT /api/v1/admin/products/:id - Cập nhật thông tin laptop [Auth].DELETE /api/v1/admin/products/:id - Xóa laptop [Auth].📩 Đăng Ký Tư Vấn / LeadsPOST /api/v1/leads - Khách gửi thông tin tư vấn / báo giá (Công khai).GET /api/v1/admin/leads - Lấy danh sách khách đăng ký tư vấn [Auth].PUT /api/v1/admin/leads/:id - Cập nhật trạng thái xử lý (pending, contacted, done) [Auth].DELETE /api/v1/admin/leads/:id - Xóa lead tư vấn [Auth].🖼 Upload Hình ẢnhPOST /api/v1/admin/upload - Upload danh sách ảnh sản phẩm lên Cloudinary [Auth].4. Kế Hoạch Triển Khai Giai Đoạn 3 (Lập Trình)Bước 3.1: Khởi tạo Backend ServerSetup project backend, cài đặt dependencies (express, mongoose, dotenv, cors, jsonwebtoken, bcryptjs, slugify, multer, cloudinary).Viết kết nối MongoDB (config/db.js) và Mongoose Models.Bước 3.2: Lập trình API EndpointsLần lượt hoàn thiện Controller & Route cho Auth, Category, Product, Lead, Upload.Thử nghiệm và kiểm tra toàn bộ API bằng Postman/Thunder Client.Bước 3.3: Dựng Frontend Next.jsKhởi tạo project frontend với Next.js App Router & Tailwind CSS.Tích hợp các file thiết kế trong thư mục /UI thành các Reusable Components.Ghép API Service vào các trang Client và trang Admin.