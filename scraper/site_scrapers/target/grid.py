import sys
sys.path.append('../')
from scraperlib import base_scraper


class TargetGridScraper(base_scraper.BaseScraper):

    def __init__(self):
        base_scraper.BaseScraper.__init__(self)

    def scan_links(self):
        return self.sm.driver.execute_script("""
            var links = [];
            $.each($('.products--list').find('.details--title'), 
            function(index, value){
                links.push({'index': index, 'url' : "https://www.target.com" + $(value).find('a').attr('href')})
            })
            return links;
        """)

    def set_grid_to_max(self):
        self.sm.driver.execute_script("""
            $('a[data-value=96]').click()
        """)
        self.su.long_timeout()

    def insert_links(self, links):
        print "inserting " + str(len(links)) + " links"
        for l in links:
            job = self.su.create_job_object(l['url'], self.su.get_current_url(self.sm.driver))
            self.sm.jobs.insert_one(job)

    def next_page_disabled(self):
        return self.sm.driver.execute_script("""
            return $('.pagination').find('.btn')[1] == null || $($('.pagination').find('.btn')[1]).hasClass('is-disabled')
        """)

    def click_next(self):
        self.sm.driver.execute_script("""$($('.pagination').find('.btn')[1]).click()""")
        self.su.long_timeout()

    def run_scraper(self):

        doc = self.sm.get_next_scrape(self.sm.categories)
        while doc is not None:
            url = doc["category_url"]
            print url
            self.sm.driver.get(url)
            self.su.short_timeout()
            self.set_grid_to_max()
            self.insert_links(self.scan_links())
            while self.next_page_disabled() is False:
                self.click_next()
                print self.su.get_current_url(self.sm.driver)
                self.insert_links(self.scan_links())
                self.su.long_timeout()

            doc = self.sm.get_next_scrape(self.sm.categories)
            self.sm.update_next_scrape(self.sm.categories, doc)

        self.sm.driver.quit()


TargetGridScraper().run_scraper()

