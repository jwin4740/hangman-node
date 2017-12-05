import sys
import json, ast

sys.path.append('../')
from scraperlib import base_scraper


class TriviaCatScraper(base_scraper.BaseScraper):

    def __init__(self):
        base_scraper.BaseScraper.__init__(self)

    def get_categories(self):
        cats = self.sm.driver.execute_script("""
        
        let arr = []
        let q = document.getElementsByClassName('views-field');
        
        let leng = q.length;
        for (var i = 0; i < leng; i++){
            var ob = {
              category_name: q[i].children[0].innerText,
              category_url: q[i].children[0].href
            }
            arr.push(ob);
        }
        
        return arr
   
        
        
        """)

        return cats

    def dumper(obj):
        try:
            return obj.toJSON()
        except:
            return obj.__dict__

    def run_scraper(self):
        self.sm.driver.get('http://trivia.fyi/categories')
        self.su.short_timeout()

        for n in self.get_categories():
            t = ast.literal_eval(json.dumps(n))
            # print type(t)
            post = self.su.create_category_object(t["category_url"], t["category_name"])
            self.sm.categories.insert_one(post).inserted_id

        self.sm.driver.quit()


TriviaCatScraper().run_scraper()
