'use strict';

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res) {
      res.status(200).send('done')
    });

};
