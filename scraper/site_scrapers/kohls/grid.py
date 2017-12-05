import datetime
import time
import sys
from pymongo import MongoClient
import random
import pprint
from selenium import webdriver
sys.path.append('../')
import scraperUtilsJW as scraperUtils


base = 'https://www.kohls.com/catalog/sheets-bedding-bed-bath.jsp?CN=Product:Sheets+Category:Bedding+Department:Bed%20%26%20Bath&PPP=60&WS='


driver = scraperUtils.get_driver()

db = scraperUtils.get_mongo()

jobsCollection = db['jobs']


links = []


def insert_links(links):
    print "inserting " + str(len(links)) + " links"
    for l in range(0, len(links)):
        job = {
            "site": "kohls",
            "url": links[l],
            "gridUrl": scraperUtils.get_current_url(driver),
            "dateAdded": datetime.datetime.utcnow(),
            "scraped": False
        }
        jobsCollection.insert_one(job)


def get_product_links():
    price_list = driver.execute_script("""

        var linkArray = []
        var obj = jQuery(".prod_img_block").children("a");
        jQuery.each(obj, function (index, value) {
           var link = value.href;
           linkArray.push(link);
         });
        return linkArray;

      """)
    return price_list



def start_sequence(base_url):
    driver.get(base_url)
    scraperUtils.short_timeout()
    link_list = get_product_links()
    print len(link_list)

    if len(link_list) > 0:
        links.extend(link_list)
        return False
    else:
        insert_links(links)
        return True


# def insert_into_mongo(dict):
#     db[mong_table].insert(dict)
#     print("done with insertion")
#     client.close()


def controller(url, page):
    page_num = page
    curr_url = url + str(page_num)
    print curr_url

    status = start_sequence(curr_url)
    scraperUtils.long_timeout()
    t = page_num + 60
    if status is False:
        controller(url, t)
    else:
        print("grid scraper done")
        driver.quit()
        return


controller(base, 0)
