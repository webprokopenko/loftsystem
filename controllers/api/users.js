require('../../models/users');
const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const User = mongoose.model('users');
const jwt = require("jwt-simple");
require('../../config/passport-config');

module.exports.getUserById = function(userId){
    let id = userId;
    return new Promise((resolve,reject)=>{
        User.findOne({id:userId})
        .then(item=>{
            resolve(item);
        })
        .catch(e=>{reject(e);})
    });
    

};
module.exports.saveUsers = function (req, res) {

    if (!req.body.username || !req.body.password || !req.body.firstName) {
        return res.json({ msg: 'Все поля нужно заполнить!', status: 'Error' });
    }

    try {
        const newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            surName: req.body.surName,
            access_token: uuidv1(),
            img: '',
            id: uuidv1(),
            permission: req.body.permission
        });
        newUser.setPassword(req.body.password);
        User.findOne({ username: req.body.username }).then(u => {
            if (u) {
                console.log('User exist');
                return res.json({ msg: 'Пользователь с таким именем уже существует', status: 'Error' });
            }
            console.log('NOt exist');
            try {
                newUser.save();
                console.log("Save done");
                return res.json(newUser);
            } catch (error) {
                console.log(error);
            }
        });

    } catch (error) {
        console.log(error);
    }
}
module.exports.loginUser = function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.json({ msg: 'Все поля нужно заполнить!', status: 'Error' });
    }
    try {
        User.findOne({ username: req.body.username })
            .then(user => {
                if (user) {
                    if (user.validPassword(req.body.password)) {
                        return res.json(user);
                    } else {
                        return res.json({ msg: 'Логин или пароль неверен', status: 'Error' });
                    }
                } else {
                    return res.json({ msg: 'Такого пользователя не существует', status: 'Error' });
                }
            });
    } catch (error) {
        console.log(error);
    }
}
module.exports.authFromToken = function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.json({ msg: 'Все поля нужно заполнить!', status: 'Error' });
    }

    app.use(passport.initialize({ userProperty: 'payload' }));
    app.use(passport.session());

    passport.authenticate('loginUsers', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({ status: 'Укажите правильный логин и пароль!' });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            var payload = {
                id: user.id
            };
            var token = jwt.encode(payload, 'secret'); // line 10 passport-config
            res.json({
                token: token
            });
        });
    })(req, res, next);
}
module.exports.updateUser = function (req, res) {
    if (!(!!req.body.name) || !(!!req.body.age)) {
        return res.status(400).json({ err: 'Data format is not correct' });
    }

    let id = req.params.id;
    let data = {
        username: req.body.username,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        surName: req.body.surName,
    };

    User.findByIdAndUpdate(
        id,
        {
            $set: data
        },
        { new: true }
    ).then(item => {
        if (!!item) {
            res.json(item);
        } else {
            res.status(404).json({ err: 'Cat not found' });
        }
    }).catch(e => {
        res.status(400).json({ err: e.message });
    });
}