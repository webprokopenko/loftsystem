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
router.get('/api/getUsers', ctrlUsers.getAllUsers);
router.delete('/api/deleteUser/:id', ctrlUsers.deleteUser);
router.put('/api/updateUserPermission/:id', ctrlUsers.updatePermission);

router.post('/api/newNews', ctrlNews.saveNews);
router.get('/api/getNews', ctrlNews.getAllNews);
router.delete('/api/deleteNews/:id',ctrlNews.deleteNews);
router.put('/api/updateNews/:id', ctrlNews.updateNews);
module.exports = router;