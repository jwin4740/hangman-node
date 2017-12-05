import sys
sys.path.append('../')
from scraperlib import base_scraper


class TargetCatScraper(base_scraper.BaseScraper):

    def __init__(self):
        base_scraper.BaseScraper.__init__(self)

    def get_categories(self):
        cats = self.sm.driver.execute_script("""
        var links = [];
    
        $.each($($('.categories')[0]).find('a'),function(index, val){
          links.push("https://www.target.com" + $(val).attr('href'))
        });
    
        return links;
        """)
        return cats

    def run_scraper(self):
        self.sm.driver.get('https://www.target.com/c/bedding-home/-/N-5xtv4')
        self.su.short_timeout()

        for n in self.get_categories():
            print type(n)
            print type('hello')
            post = self.su.create_category_object(n)
            self.sm.categories.insert_one(post).inserted_id

        self.sm.driver.quit()


TargetCatScraper().run_scraper()
