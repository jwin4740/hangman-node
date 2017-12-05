import sys

import json
import ast

sys.path.append('../')
from scraperlib import base_scraper


class TriviaGridScraper(base_scraper.BaseScraper):

    def __init__(self):
        base_scraper.BaseScraper.__init__(self)

    def grab_data(self):
        return self.sm.driver.execute_script("""
           var q = document.getElementsByClassName('title')[0].children[0].innerText;
           var answer = document.getElementsByClassName('spoiler-content')[0].innerText;
           
           let t = {
                question : q,
                answer : answer}
            return t;
        """)

    def insert_links(self, q):
        t = ast.literal_eval(json.dumps(q))
        job = self.su.create_job_object(t["question"], t["answer"])
        self.sm.jobs.insert_one(job)

    def next_page_disabled(self):
        return self.sm.driver.execute_script("""
            return $('.pagination').find('.btn')[1] == null || $($('.pagination').find('.btn')[1]).hasClass('is-disabled')
        """)

    def click_next(self):
        self.sm.driver.execute_script("""
        document.getElementsByClassName('pager-next')[0].children[0].click();
        """)
        self.su.long_timeout()

    def run_scraper(self):

        doc = self.sm.get_next_scrape(self.sm.categories)
        print doc

        while doc is not None:
            url = doc["category_url"]
            print url
            self.sm.driver.get(url)
            self.su.short_timeout()
            self.insert_links(self.grab_data())
            while self.next_page_disabled() is False:
                self.click_next()
                self.su.short_timeout()
                self.insert_links(self.grab_data())
                self.su.short_timeout()

            doc = self.sm.get_next_scrape(self.sm.categories)
            self.sm.update_next_scrape(self.sm.categories, doc)

        self.sm.driver.quit()


TriviaGridScraper().run_scraper()
