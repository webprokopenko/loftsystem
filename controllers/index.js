module.exports.getIndex = function (req, res) {
    res.render('index.html', { title: 'Main' });
  }
  
  module.exports.sendData = function (req, res) {
    res.json({ title: 'Main' });
  }