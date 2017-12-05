import scraperUtilsJW as scraperUtils
import pprint
import datetime

#
# baseUrl = "https://www.kohls.com/product/prd-3011001/star-wars-scatter-print-flannel-sheet-set.jsp?prdPV=33"

#
#
driver = scraperUtils.get_driver()
db = scraperUtils.get_mongo()
jobsCollection = db['jobs']
kohlsCollection = db['kohls']


#
#
#

def get_product_title():
    return driver.execute_script("""return jQuery(".pdp-product-title").text();""")

def get_number_of_sizes():
    return driver.execute_script("""return jQuery(".pdp-waist-size_info").children().length;""")


def select_option(index):
    val = driver.execute_script("""

    var t = jQuery(".pdp-size-swatch")[arguments[0]];
    el = t.attributes[2].value
    jQuery(t).click();
    return el

    """, index)
    scraperUtils.short_timeout()
    return val


def get_product_dict():
    price_dictionary = driver.execute_script("""
    var size = jQuery(".pdp-size-swatch.active").text().trim();
    var colors = jQuery('.pdp-color-swatches-info').children();
    var size_list = [];
    jQuery.each(colors, function (index, value) {
       var color = value.children[0].title;
       size_list.push(color);
     });

    var name = jQuery(".pdp-product-title").text().trim();
    var p = jQuery(".main-price").text();
    var o = jQuery(".regorg-small").text();
    var y = jQuery(".your-price.stacked-purple-color").text().trim();
    var c= jQuery(".your-price-code").text().trim();
    var t= jQuery(".offer-yourPrice").children("p").text().trim();
    var k= jQuery(".your-price-endDate").text().trim();
    var promotion = {
      prom : t + ' off',
      promPrice : y,
      promKey : c,
      promExpiration : k
    }
    var priceObject = {
      size : size,
      colors : size_list,
      product : name,
      main : p,
      original : o,
      promotion : promotion
    };

    return priceObject;

      """)
    return price_dictionary


def resetAllJobsTrue():
    jobsCollection.update_many(
        {'scraped': True},
        {'$set': {"scraped": False}})


# resetAllJobsTrue()


doc = jobsCollection.find_one({'site': 'kohls', 'scraped': False})
while doc is not None:
    price_list = []
    url = doc['url']
    print "Opening Url: " + url
    driver.get(url)
    scraperUtils.short_timeout()
    size_length = get_number_of_sizes()

    for i in range(0, size_length):
        name = select_option(i)
        product = get_product_dict()
        price_list.append(product)

    mongo_dict = {
        'url': url,
        'title': get_product_title(),
        'prices': price_list,
        'time_scraped': datetime.datetime.utcnow()
    }

    kohlsCollection.insert_one(mongo_dict)
    print "successful product insertion"
    jobsCollection.update_one({'_id': doc['_id']}, {"$set": {"scraped": True}}, False)
    print "successful job update"
    scraperUtils.short_timeout()
    price_list = []
    doc = jobsCollection.find_one({'site': 'kohls', 'scraped': False})

driver.quit()
