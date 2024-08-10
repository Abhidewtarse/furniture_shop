
var express = require("express");
var router = express.Router();
var exe = require("./../connection");



router.get("/", function (req, res) {
  res.render("./login.ejs");
});

router.post("/do_login", async function (req, res) {
  var d = req.body;
  var sql = `SELECT * FROM admin_info WHERE admin_email='${d.admin_email}' AND password='${d.password}'`;
  var data = await exe(sql);
  if (data.length > 0) {
    res.redirect("/product")
  }
  else {
    res.send("<script>alert('Invalid Details'); history.back(); clearForm();</script>")
  }
})



router.get("/product", async function (req, res) {
  var types = await exe("SELECT * FROM product_types")
  var products = await exe("SELECT * FROM products , product_types WHERE products.product_type_id = product_types.product_type_id")
  var obj = {
    "products": products,
    "types": types
  };
  res.render("./Product.ejs", obj);
});

router.post("/save_product", async function (req, res) {
  if (req.files.image[0]) {
    var file_names = [];
    for (var i = 0; i < req.files.image.length; i++) {
      var fn = new Date().getTime() + req.files.image[i].name;
      req.files.image[i].mv("public/uploads/" + fn);
      file_names.push(fn);
    }
    var file_name = file_names.join(",");
  }
  else {
    var file_name = new Date().getTime() + req.files.image.name;
    req.files.image.mv("public/uploads/" + file_name);
  }

  var d = req.body;
  d.details = d.details.replaceAll("'", "^");
  var sql = `INSERT INTO products(product_type,name,price,size,color,details,material,image)VALUES('${d.type}','${d.name}','${d.price}','${d.size}','${d.color}','${d.details}','${d.material}','${file_name}')`;
  var data = await exe(sql);
  res.redirect("/product");
})



router.get("/delete_product/:id", async function (req, res) {
  var sql = `DELETE FROM products WHERE product_id = '${req.params.id}'`;
  var data = await exe(sql);
  res.redirect("/product");
});

router.get("/edit_product/:id", async function (req, res) {
  var types = await exe("SELECT * FROM product_types")
  var product = await exe(`SELECT * FROM products WHERE product_id = '${req.params.id}'`);
  var obj = {
    "product": product[0],
    "types": types
  };
  res.render("./edit_product.ejs", obj)
})

router.post("/update_product", async function (req, res) {
  var d = req.body;
  if (req.files) {
    if (req.files.image[0]) {
      var file_names = [];
      for (var i = 0; i < req.files.image.length; i++) {
        var fn = new Date().getTime() + req.files.image[i].name;
        req.files.image[i].mv("public/uploads/" + fn);
        file_names.push(fn);
      }
      var file_name = file_names.join(",");
    }
    else {
      var file_name = new Date().getTime() + req.files.image.name;
      req.files.image.mv("public/uploads/" + file_name);
    }
    var sql = `UPDATE products SET image = '${file_name}' WHERE product_id = '${d.product_id}' `;
    var data = await exe(sql);
  }
  var sql = `UPDATE products SET product_type_id= '${d.product_type}', name = '${d.name}',price = '${d.price}', size = '${d.size}',color = '${d.color}', details = '${d.details}', material = '${d.material}' WHERE product_id = '${d.product_id}'`;
  var data = await exe(sql);
  res.redirect("/product");
})


router.get('/product2k', async function (req, res) {
  var products = await exe("SELECT * FROM productsunder2k")
  var obj = {
    "products": products
  };
  res.render("./product2k.ejs", obj);
});

router.post('/save_product_under2k', async function (req, res) {
  if (req.files.image[0]) {
    var file_names = [];
    for (var i = 0; i < req.files.image.length; i++) {
      var fn = new Date().getTime() + req.files.image[i].name;
      req.files.image[i].mv("public/uploads/" + fn);
      file_names.push(fn);
    }
    var file_name = file_names.join(",");
  }
  else {
    var file_name = new Date().getTime() + req.files.image.name;
    req.files.image.mv("public/uploads/" + file_name);
  }

  var d = req.body;
  d.details = d.details.replaceAll("'", "^");
  var sql = `INSERT INTO productsunder2k(product_type,name,price,size,color,details,material,image)VALUES('${d.type}','${d.name}','${d.price}','${d.size}','${d.color}','${d.details}','${d.material}','${file_name}')`;
  var data = await exe(sql);
  res.redirect("/product2k")
});



router.get('/productdata', async function (req, res) {
  var sql = `SELECT * FROM products `;
  var data = await exe(sql);
  res.send(data);
});


router.get('/productdata/homeobj', async function (req, res) {

  var sql = `SELECT * FROM productsunder2k  ORDER BY RAND ( ) LIMIT 4  `;
  var data = await exe(sql);
  res.send(data);
});


router.get('/productdata/home', async function (req, res) {
  var sql = `SELECT * FROM products  ORDER BY RAND ( ) LIMIT 3  `;
  var data = await exe(sql);
  res.send(data);
});

router.get('/productdata/gallery', async function (req, res) {
  var sql = `SELECT * FROM products ORDER BY RAND ( )  
 `;
  var data = await exe(sql);
  res.send(data);
});

router.get('/productdata/:id', async function (req, res) {

  var sql = `SELECT * FROM products WHERE product_id = '${req.params.id}' `;
  var data = await exe(sql);
  res.send(data);
});

// router.get('/productdata/homeobj/:id', async function (req, res) {
//   var sql = `SELECT * FROM productsunder2k  WHERE products_id = ${req.params.id}  `;
//   var data = await exe(sql);
//   res.send(data);
// });


module.exports = router;
