(function () {
    'use strict';

    const express = require('express');
    const bodyParser = require('body-parser');
    const transactionsAPI = require('./api/transactions-api');
    const statisticsAPI = require('./api/statistics-api');

    let app = express();

    // Enable to receive and to send http bodies in JSON format
    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        // Allow CORS
        res.header('Access-Control-Allow-Origin', '*');

        // Default Content-Type
        res.header('Content-Type', 'application/json; charset=utf-8');

        // CORS allowed headers
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        return next();
    });

    var transactions = [];

    app.set('transactions', transactions);

    // Create the apis
    transactionsAPI(app);
    statisticsAPI(app);

    app.on('events:add-transaction', (transaction)=>{
        app.get('transactions').push(transaction);
    });

    // Clear old entries each 65 seconds to avoid remove live transactions
    setInterval(clearOldEntries,65000);
    function clearOldEntries() {
        app.get('transactions').forEach((item, index) => {
            var transaction = item;

            let now = new Date().getTime();
            let delayMillisseconds = now - transaction.timestamp;
            let dalaySeconds = delayMillisseconds / 1000;

            if (dalaySeconds > 70) {  // Transactions stay 10 seconds after timelimit 60
                // Remove old entry
                app.get('transactions').splice(index, 1)
            }
        });
    };

    // Starts Server
    var API_PORT = 3000;
    app.listen(API_PORT, () => {
        console.log('Server listening on port %d', API_PORT);
    });

})();

