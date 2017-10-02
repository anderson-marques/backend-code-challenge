(function () {
    'use strict';

    function transactionsAPI(app) {

        const TRANSACTIONS = app.route('/transactions');

        TRANSACTIONS.post(logTransaction);

        function logTransaction (req, res) {
            let transaction = req.body;

            // Validates the amount
            if (transaction.amount == undefined || transaction.amount == null) {
                res.statusCode = 400;
                res.json({'error': 'invalid transaction. Amount value not sent.'});
            }

            // validates the timestamp
            if (transaction.timestamp == undefined || transaction.timestamp == null) {
                res.statusCode = 400;
                res.json({'error': 'invalid transaction. Timestamp value not sent.'});
            }

            let now = new Date().getTime();
            let delayMillisseconds = now - transaction.timestamp;
            let dalaySeconds = delayMillisseconds / 1000;

            if (dalaySeconds > 60) {
                res.statusCode = 204;
            } else {
                // Add the transaction to transactions list
                app.emit('events:add-transaction', transaction);
                res.statusCode = 201;
            }

            // Ends the request
            res.end();
        };

        return {
            logTransaction : logTransaction
        }
    }

    module.exports = transactionsAPI;

})();

