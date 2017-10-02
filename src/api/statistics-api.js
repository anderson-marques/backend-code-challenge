(function () {
    'use strict';

    function statisticsAPI(app) {

        const STATISTICS = app.route('/statistics');

        STATISTICS.get(function (req, res) {
            var response = {
                sum: 0.0,
                avg: 0.0,
                max: 0.0,
                min: 0.0,
                count: 0
            };

            var minMaxInitialized = false;

            app.get('transactions')
                .slice() // Always make a copy of transactions
                .forEach((item) => {
                    var transaction = item;

                    let now = new Date().getTime();
                    let delayMillisseconds = now - transaction.timestamp;
                    let dalaySeconds = delayMillisseconds / 1000;

                    if (dalaySeconds <= 60) {
                        if (!minMaxInitialized) {
                            response.max = Number.MIN_VALUE;
                            response.min = Number.MAX_VALUE;
                            minMaxInitialized = true;
                        }

                        response.sum += transaction.amount;
                        response.max = response.max < transaction.amount ? transaction.amount : response.max;
                        response.min = response.min > transaction.amount ? transaction.amount : response.min;
                        response.count++;
                    }

                    // calculate the average
                    response.avg = response.sum / response.count;
                });

            // Response format
            response.sum = parseFloat(Number(response.sum).toFixed(2));
            response.max = parseFloat(Number(response.max).toFixed(2));
            response.min = parseFloat(Number(response.min).toFixed(2));
            response.avg = parseFloat(Number(response.avg).toFixed(2));

            // Response
            res.json(response);
        });
    }

    module.exports = statisticsAPI;

})();

