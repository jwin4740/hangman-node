var webdriver = require('selenium-webdriver'),
    driver,
    chrome = require('selenium-webdriver/chrome');;
var util = require('util');

var opts = new chrome.Options();
var builder = new webdriver.Builder().forBrowser('chrome'); //.usingServer('http://localhost:4444/wd/hub');
opts.setChromeBinaryPath('/usr/bin/chromium-browser')
builder.setChromeOptions(opts);
driver = builder.build();


// driver = new webdriver.Builder('/usr/bin/chromium-browser').withCapabilities({
//     'browserName': 'chrome',
//     'platform': 'Windows XP',
//     'version': '43.0'
// }).build();


console.log("here local");
// var arg = {
//     index: 1,
//     color: "Red"
// };

var arg = ["test", "test_2"];

driver.get("http://www.seleniumhq.org/").then(function (res) {
    driver.executeScript(function (arguments) {
        console.log("---------------");
        console.log(typeof arguments);
        console.log(arguments);
        console.log("---------------");
        return;
    }, arg).then(function (res) {
    });
});


