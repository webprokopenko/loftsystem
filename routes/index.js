const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/index');
const ctrlUsers = require('../controllers/api/users');
const ctrlNews = require('../controllers/api/news');

router.get('/', ctrlHome.getIndex);
router.post('/api/saveNewUser', ctrlUsers.saveUsers);

router.post('/api/login', ctrlUsers.loginUser);
router.post('/api/authFromToken', ctrlUsers.authFromToken);
router.put('/api/updateUser/:id', ctrlUsers.updateUser);

router.post('/api/newNews', ctrlNews.saveNews);
router.get('/api/getNews', ctrlNews.getAllNews);
router.post('/api/test', function(req,res){
    console.log('text');
    res.json = {ok:'Done'};
})
module.exports = router;