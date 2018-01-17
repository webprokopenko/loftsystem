require('../../models/news');
const mongoose = require('mongoose');
const News = mongoose.model('news');
const ctrlUsers = require('./users');
const objectAssignDeep = require(`object-assign-deep`);
const uuidv1 = require('uuid/v1');

getNews = function (req, res) {
    News.find().then(
        items => {
            items.forEach(function(item){
                item.user = ctrlUsers.getUserById(item.userId);
            });
            return res.json(items);
        }
    ).catch(e => {
        console.log(e);
        return res.status(400).json({ err: e.message });
    });
}

module.exports.saveNews = function (req, res) {
    if (!(!!req.body.userId) || !(!!req.body.date) || !(!!req.body.text) || !(!!req.body.theme)) {
        return res.status(400).json({ err: 'Data format is not correct' });
    }

    const newNews = new News({
        userId: req.body.userId,
        date: req.body.date,
        text: req.body.text,
        theme: req.body.theme,
        id: uuidv1()
    });
    try {
        newNews.save().then(item=>{
            getNews(req, res);
        }).catch(e=>{
            res.status(400).json({ err: e.message });
        })
    } catch (error) {
        console.log(error);
    }
}
module.exports.getAllNews = getNews;
module.exports.deleteNews = function(req,res){
    let id = req.params.id;
    News.findOneAndRemove({id:id})
    .then(item => {
      if (!!item) {
        getNews(req,res);
      } else {
        res.status(404).json({ err: 'Cat not found' });
      }
    })
    .catch(e => {
      res.status(400).json({ err: e.message });
    });
}
module.exports.updateNews = function(req,res){
    if (!(!!req.body.date) || !(!!req.body.id) || !(!!req.body.text) || !(!!req.body.theme) || !(!!req.body.userId)) {
        return res.status(400).json({ err: 'Data format is not correct' });
      }
    
      let id = req.params.id;
      let data = {
        date: req.body.date,
        id: req.body.id,
        text: req.body.text,
        theme: req.body.theme,
        userId: req.body.userId
      };
      News.findOneAndUpdate(
        {id:id},
        {
          $set: data
        },
        { new: true }
      )
        .then(item => {
          if (!!item) {
            getNews(req,res);
          } else {
            res.status(404).json({ err: 'Cat not found' });
          }
        })
        .catch(e => {
          res.status(400).json({ err: e.message });
        });
}