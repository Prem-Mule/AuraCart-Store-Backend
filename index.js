const express = require(`express`);
const app = express();
const mongoose = require(`mongoose`);
const jwt = require(`jsonwebtoken`);
const multer = require(`multer`);
const path = require(`path`);
const cors = require(`cors`);
const port = process.env.PORT || 4000;
const uploadPath = path.join(__dirname, "upload/images");

require("dotenv").config({ path: "./.env" });
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
// Serve static files from the 'Assets' directory

//Database Connection with MongoDB
mongoose.connect(process.env.MONGODB_URL);

//API Creation

app.get("/", (req, res) => {
  res.send("Express app is running");
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

app.use(`/images`, express.static("upload/images"));
app.post("/upload", upload.single(`product`), (req, res, next) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
    Details: req.file,
  });
});

//Schema for creating products
const productSchema = {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
};
const products = mongoose.model("Product", productSchema);

// API for adding product from database
app.post(`/addproduct`, async (req, res) => {
  const prev_products = await products.find();
  let id = 1;
  if (prev_products.length > 1) {
    let lastproductArray = prev_products.slice(-1);
    let lastproduct = lastproductArray[0];
    id = lastproduct.id + 1;
  }
  const product = new products({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  await product.save();
  console.log("product added successfully");
  res.json({ success: true, name: req.body.name, msg: "Added successfully" });
});

// API for deleting product from database
app.post("/removeproduct", async (req, res) => {
  await products.findOneAndDelete({ id: req.body.id });
  console.log("product removed successfully");
  res.json({ success: true, name: req.body.name, msg: "Removed successfully" });
});

// API to fetch all products from database
app.get("/allproducts", async (req, res) => {
  let all_products = await products.find();
  console.log("All products fetched");
  res.send(all_products);
});

// Endpoint for popular products
app.get("/popularproducts", async (req, res) => {
  let allproducts = await products.find({ category: "women" });
  let popularproducts = allproducts.slice(-8);
  console.log("popular collection fetched");
  console.log(popularproducts);
  res.send(popularproducts);
});

// Endpoint for new collections
app.get("/newcollections", async (req, res) => {
  let allproducts = await products.find({});
  let newcollections = allproducts.slice(-8);
  console.log("new collection fetched");
  console.log("newcollectins", newcollections);
  res.send(newcollections);
});

//creating middleware
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      console.log("data", data);
      req.user = data.user;

      next();
    } catch (error) {
      res.status(401).send({ error: "Please autheticate using valid token" });
    }
  }
};

//Endpoint to addcartitems
app.post("/addtocart", fetchuser, async (req, res) => {
  // console.log("req.body", req.body);
  // console.log("req.user", req.user);
  let user = await Users.findOne({ _id: req.user.id });
  user.cartitems[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartitems: user.cartitems }
  );

  res.send({ msg: "Added" });
});

//Endpoint to remove product from cart
app.post("/removefromcart", fetchuser, async (req, res) => {
  let user = await Users.findOne({ _id: req.user.id });
  if (user.cartitems[req.body.removeitemid] > 0) {
    console.log("if condition");
    user.cartitems[req.body.removeitemid] -= 1;
  }
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartitems: user.cartitems }
  );
  res.send({ msg: "removed" });
});

//Endpoint to get cart items
app.get("/getcart", fetchuser, async (req, res) => {
  console.log("Get Cart");
  let user = await Users.findOne({ _id: req.user.id });
  res.json({ cartdata: user.cartitems });
});
// app.post("/getcart", fetchuser, async (req, res) => {
//   console.log("Get Cart");
//   let user = await Users.findOne({ _id: req.user.id });
//   res.json({ cartdata: user.cartitems });
// });
//Schema for user model
const userschema = {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartitems: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
};
const Users = mongoose.model("Users", userschema);
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    console.log(check);
    console.log("check", check.id);

    return res.status(400).json({
      success: false,
      error: "user already found with this email please login directly",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cartitems: cart,
  });
  await user.save();

  console.log("prem", user.id);
  let data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  return res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    let passcompare = user.password == req.body.password;
    if (!passcompare) {
      return res
        .status(402)
        .json({ success: false, error: "invalid password" });
    }
    const data = {
      user: { id: user.id },
    };
    const token = jwt.sign(data, "secret_ecom");
    return res
      .status(200)
      .json({ success: true, msg: "Login Successfull", token });
  } else {
    return res
      .status(400)
      .json({ success: false, error: "Account not found plz create One" });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log(`Server running on port ${port}`);
  } else {
    console.log(`Error ${error}`);
  }
});
