var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('page.hbs', {
    layout: 'layout',
    scripts: ['/assets/js/script.js'],
    data: {
      page: {}
    }
  });
});

module.exports = router;
