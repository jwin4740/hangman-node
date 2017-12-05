import time
import random
import json
import pprint

from selenium import webdriver



envi = webdriver.FirefoxProfile("/home/jwin4740/selenium")



baseUrl = 'https://www.overstock.com/Bedding-Bath/Becky-Cameron-Luxury-Ultra-Soft-4-piece-Bed-Sheet-Set/9273417/product.html?refccid=QYKLZHXNHW3LUTCF6CTTTTNMII&searchidx=0&keywords=&refinement='


def get_timeout():
    return random.randint(1, 3) + random.random()


def get_product_list():
    price_list = driver.execute_script("""
var choices = jQuery('#addid9273417').children();
  var choice_list = [];
    jQuery.each(choices, function (index, value) {
      let tmp = $(this)[0].text;
      if (tmp != "Options"){
        choice_list.push(tmp)
      }
     });


    return choice_list;

      """)
    return price_list


driver = webdriver.Firefox(envi)
driver.get(baseUrl)

res = get_product_list()
pprint.pprint(res)

# pprint.pprint(json.dumps(priceObject))
# time.sleep(5)

driver.quit()
