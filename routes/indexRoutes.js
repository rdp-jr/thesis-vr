const express = require('express')
const router = express.Router()

router.get('/', function(req, res) {
  res.render('index')
})

router.get('/get-started', function(req, res) {
  res.render('get-started')
})

router.get('/about', function(req, res) {
  res.render('about')
})

router.get('/manuscript', function(req, res) {
  res.render('manuscript')
})

router.get('/contact', function(req, res) {
  res.render('contact')
})

module.exports = router