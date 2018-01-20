require('../../models/users');
const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const User = mongoose.model('users');
const jwt = require("jwt-simple");
require('../../config/passport-config');
const bCrypt = require('bcryptjs');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

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
module.exports.saveImage = function (req, res) {
    let id = req.params.id;
    let form = new formidable.IncomingForm();
    let upload = 'public/upload';
    let fileName;

    form.uploadDir = path.join(process.cwd(), upload);
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res.json({ msg: 'Проект не загружен Ошибка!', status: 'Error' });
        }

        if (files[id]['name'] === '' || files[id]['size'] === 0) {
            return res.json({ msg: 'Проект не загружен Ошибка!', status: 'Error' });
        }

        fileName = path.join(upload, id + files[id]['name']);
        fileNamedb = path.join('upload', id + files[id]['name']);

        fs.rename(files[id]['path'], fileName, function (err) {
            if (err) {
                console.error(err);
                fs.unlink(fileName);
                fs.rename(iles[id]['path'], fileName);
            }
            let dir = fileName.substr(fileName.indexOf('\\'));
            User.findOneAndUpdate(
                { id: id },
                { image: fileNamedb },
                { new: true }
            ).then(item => {
                if (item) {
                    res.json({ path: fileName });
                } else {
                    res.status(404).json({ err: 'User not save' });
                }

            }).catch(e => {
                console.log(e);
            });
        });
    });
};
module.exports.updateUser = function (req, res) {
    let id = req.params.id;
    let data = {};
    User.findOne({ id: id }).then((item) => {
        if (req.body.firstName) { data.firstName = req.body.firstName } else data.firstName = item.firstName;
        if (req.body.middleName) { data.middleName = req.body.middleName } else data.middleName = item.middleName;
        if (req.body.surName) { data.surName = req.body.surName } else data.surName = item.surName;
        if (req.body.oldPassword && item.validPassword(req.body.oldPassword) && req.body.password) {
            data.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
        }
        User.findOneAndUpdate(
            { id: id },
            {
                $set: data
            },
            { new: true }
        ).then(item => {
            if (item) {
                res.json(item);
            } else {
                res.status(404).json({ err: 'User not found' });
            }
        }).catch(e => {
            res.status(400).json({ err: e.message });
        });
    }).catch(e => {
        console.log(e);
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
            for (let prop in permission.chat) {
                item.permission.chat[prop] = permission.chat[prop];
            };
            for (let prop in permission.setting) {
                item.permission.setting[prop] = permission.setting[prop];
            };
            for (let prop in permission.news) {
                item.permission.news[prop] = permission.news[prop];
            };
        
            item.save(function(err,res){
                if(err) console.log(err);
            });
        })
        .catch(e => { console.log(e); })
}