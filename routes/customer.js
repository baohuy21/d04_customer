var express = require('express');
var router = express.Router();
const customerModel = require('../model/customerModel')
const multer = require('multer')

//multer setting
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
  }
})
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', async function (req, res, next) {
  let customers = await customerModel.find()
  res.render('customer/index', { customers: customers });
});

router.get('/create', (req, res, next) => {
  res.render('customer/create')
})

router.post('/create', upload.single('image'), async (req, res) => {
  const body = req.body;
  const file = req.file;
  let cust = new customerModel({
    fullname: body.fullname,
    email: body.email,
    password: body.password,
    image: file.filename
  });
  await cust.save();
  res.redirect('/customer');
})

router.get('/update/:id', async (req, res) => {
  const customer = await customerModel.findById(req.params.id)
  res.render('customer/update', { customer: customer })
})

router.post('/update/:id', upload.single('image'), async (req, res) => {
  const body = req.body;
  const file = req.file;
  let cust = new customerModel({
    fullname: body.fullname,
    email: body.email,
    password: body.password,
    image: file.filename
  })
  await customerModel.findByIdAndUpdate(req.body._id, cust)
  res.redirect('/customer');
})
module.exports = router;
