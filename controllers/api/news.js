require('../../models/news');
const mongoose = require('mongoose');
const News = mongoose.model('news');
const ctrlUsers = require('./users');
const objectAssignDeep = require(`object-assign-deep`);
const uuidv1 = require('uuid/v1');

getNews = function (req, res) {
    console.log('getAllNews');
    News.find().then(
        items => {
            let prepare = [];
            items.forEach(function(item){
                prepare.push(item);
            });
            let p = prepare.map(function (item, i, arr) {
                return ctrlUsers.getUserById(item.userId);
            });
            Promise.all(p)
                .then(data => {
                    for(let i in prepare){
                       
                        
                        //prepare[j].user = data[j];
                    }
                    console.log(typeof data);
                    try{

                    prepare[0].text = 'test';

                    }catch(e){
                        console.log(e);
                    }
                    try{
                        Object.defineProperty(prepare[0],'user',{value:'test',writable:true});
                    }catch(e){
                        console.log(e);
                    }
                    
                    console.log( prepare[0]);
                    //console.log(prepare);
                    // let prepareItems = items.map(function (item, i, arr) {
                    //     //console.log(item);
                    //     let obj = item;
                    //     for (let j in data[i]) {
                    //         if(data[i].hasOwnProperty(j))
                    //             obj.user[j] = data[i][j];
                    //     }
                    //     console.log(obj);
                    //     return obj;
                    // });
                    res.json(prepareItems);
                }).catch(e=>{
                    console.log(e);
                })

        }
    ).catch(e => {
        console.log(e);
        res.status(400).json({ err: e.message });
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
        newNews.save();
        return getNews(req, res);
    } catch (error) {
        console.log(error);
    }
}
module.exports.getAllNews = getNews;