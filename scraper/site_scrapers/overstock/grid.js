var MongoClient = require('mongodb').MongoClient;

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

var url = 'https://www.overstock.com/Bedding-Bath/Sheets-Pillowcases/459/dept.html?index=' + '1';

nextGridPage(url);
driver.quit();


function nextGridPage(url) {
    driver.get(url);
    driver.wait(until.elementLocated(By.className('overstock-logo-text')), 20000);
    driver.sleep(2000);


    driver.executeScript(function () {
        var jobs = [];

        $.each($('.product-link'), function (index, value) {
            jobs.push({
                site: "overstock",
                url: "https:" + $(value).attr('href'),
                gridUrl: "",
                date: new Date().toString(),
                scraped: false,
                position: index
            });
        });

        return jobs;

    }).then(function (res) {
        MongoClient.connect("mongodb://localhost:27017/exampleDb", function (err, db) {
            if (err) {
                console.log(err);
                return;
            }
            res.forEach(function (value) {
                value.gridUrl = url;
            });

            var collection = db.collection('test');
            collection.insert(res, {w: 1}, function (err, result) {
                if (err) {
                    console.log(result);
                }
                process.exit();
            });
        });
    });

}
