var MongoClient = require('mongodb').MongoClient;


var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

nextPart('https://www.overstock.com/Bedding-Bath/Eddie-Bauer-Novelty-Cotton-Percale-Sheet-Sets/11148768/product.html?refccid=3KMLSQCSUJ4KRN2D4Q6AF3ICFM&searchidx=22&keywords=&refinement=');
driver.quit();

function nextPart(url) {
    driver.get(url);
    driver.wait(until.elementLocated(By.className('overstock-logo-text')), 20000);
    driver.sleep(2000);

    driver.executeScript(function () {

        function trimString(inputString) {
            return inputString.replace(/ /g, "").replace(/\n/g, "").replace(/,/g, "").replace(/$/g, "");
        };

        var priceObj = {
            itemNo: $('.item-number').text(),
            maker: $('#brand-name').text(),
            productName: $('.product-title h1').text(),
            url: "",
            date: new Date().toString(),
            onSale: $('#site-sale-countdown').text(),
            reviews: $('.count').text(),
            reviewAvg: trimString($('.overall-rating').text()),
            sizeColorPrice: []
        };

        if(!(typeof os.optionBreakout.options == "undefined")){
            $.each(os.optionBreakout.options, function(index, value){
                priceObj.sizeColorPrice.push(value);
            });
        }else{
            $.each($('.options-dropdown option'), function(index, value){
                priceObj.sizeColorPrice.push(trimString($(value).text()));
            });
        }

        return priceObj;

    }).then(function (res) {
        MongoClient.connect("mongodb://localhost:27017/exampleDb", function (err, db) {
            if (err) {
                console.log(err);
                return;
            }

            res.url = url;

            console.log(res);
            var collection = db.collection('testpart');
            collection.insert(res, {w: 1}, function (err, result) {
                if (err) {
                    console.log(result);
                }
                process.exit();
            });

        });
    });
}


