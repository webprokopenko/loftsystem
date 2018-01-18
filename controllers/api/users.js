require('../../models/users');
const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const User = mongoose.model('users');
const jwt = require("jwt-simple");
require('../../config/passport-config');

module.exports.getUserById = function (userId) {
    let id = userId;
    return new Promise((resolve, reject) => {
        User.findOne({ id: userId })
            .then(item => {
                resolve(item);
            })
            .catch(e => { reject(e); })
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
getAllUsers = function (req, res) {
    User.find().then(
        items => {
            return res.json(items);
        }
    ).catch(e => {
        console.log(e);
        return res.status(400).json({ err: e.message });
    });
}
module.exports.deleteUser = function (req, res) {
    let id = req.params.id;
    User.findOneAndRemove({ id: id })
        .then(item => {
            if (!!item) {
                getAllUsers(req, res);
            } else {
                res.status(404).json({ err: 'Cat not found' });
            }
        })
        .catch(e => {
            res.status(400).json({ err: e.message });
        });
}
module.exports.getAllUsers = getAllUsers;
module.exports.updatePermission = function (req, res) {
    let permissionId = req.body.permissionId;
    let permission = req.body.permission;
    let data = {};
    User.findOne({ permissionId: permissionId })
        .then(item => {
            if (typeof permission.setting.C !== 'undefined') item.permission.setting.C = permission.setting.C; 
            if (typeof permission.setting.R !== 'undefined') item.permission.setting.R = permission.setting.R;
            if (typeof permission.setting.U !== 'undefined') item.permission.setting.U = permission.setting.U;
            if (typeof permission.setting.D !== 'undefined') item.permission.setting.D = permission.setting.D;

            if (typeof permission.news.C !== 'undefined') item.permission.news.C = permission.news.C;
            if (typeof permission.news.R !== 'undefined') item.permission.news.R = permission.news.R;
            if (typeof permission.news.U !== 'undefined') item.permission.news.U = permission.news.U;
            if (typeof permission.news.D !== 'undefined') item.permission.news.D = permission.news.D;

            if (typeof permission.chat.C !== 'undefined') item.permission.chat.C = permission.chat.C;
            if (typeof permission.chat.R !== 'undefined') item.permission.chat.R = permission.chat.R;
            if (typeof permission.chat.U !== 'undefined') item.permission.chat.U = permission.chat.U;
            if (typeof permission.chat.D !== 'undefined') item.permission.chat.D = permission.chat.D;

            try {
                User.findOneAndUpdate(
                    { permissionId: permissionId },
                    {
                        permission: item.permission
                    },
                    { new: true }
                );
            } catch (error) {
                console.log(error);
            };

        })
        .catch(e => { console.log(e); })
}