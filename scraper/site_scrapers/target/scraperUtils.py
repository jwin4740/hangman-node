import random
import time
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


# In the future this object will manage requests on each proxy to balance them
class DriverManager:
    number_Scrapes = 0

    def __init__(self):
        self.data = []

    def check_driver(self, driver):
        if self.number_Scrapes < 10:
            self.number_Scrapes += 1
            return driver
        else:
            driver = None
            return get_driver()


def get_mongo():
    client = MongoClient('localhost', 27017)
    db = client['textile_analytics_data']
    return db


def get_driver(local=True, ip_address='localhost', port=4444):
    if local:
        driver = webdriver.Chrome("../../chromedriver")
    else:
        driver = webdriver.Remote(
            command_executor='http://'+ip_address+':'+port+'/wd/hub',
            desired_capabilities=DesiredCapabilities.CHROME)
    return driver


def long_timeout():
    time.sleep(random.randint(2, 4) + random.random())


def short_timeout():
    time.sleep(random.randint(2, 4) + random.random())


def get_current_url(driver):
    return driver.execute_script("""
        return window.location.href
    """)

