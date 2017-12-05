import sys
sys.path.append('../')
from scraperlib import base_scraper


class TargetPartScraper(base_scraper.BaseScraper):
    
    def __init__(self):
        base_scraper.BaseScraper.__init__(self)

    def get_sizes(self):
        return self.sm.driver.execute_script("""
            return $('.variator--option.variator--option-size').find('.sbc-variator-options').length
        """)
    
    def get_colors(self):
        return self.sm.driver.execute_script("""
            return $('.variator--option--swatch--arc').length
        """)
    
    def select_size(self, index):
        print "select size " + str(index)
        self.sm.driver.execute_script("""
            $($('.variator--option.variator--option-size').find('.sbc-variator-options')[arguments[0]]).click()
        """, index)
        self.su.short_timeout()
    
    def select_color(self, index):
        print "size color " + str(index)
        self.sm.driver.execute_script("""
            $($('.variator--option--swatch--arc')[arguments[0]]).click()
        """, index)
        self.su.short_timeout()
    
    def get_basic_info(self):
        return self.sm.driver.execute_script("""
        return {
            'url': window.location.href,
            'title': $('.title-product').find('span').text(),
            'rating': $('#stickySidebar').find('.ratings-score').find('span').text(),
            'details': $('#tab-content-details').text(),
            'only_at_target': $('#stickySidebar').find(".h-sr-only:contains('only at  Target')").text().length != 0,
            'price': []
        }
        """)
    
    def get_price_obj(self, size_number):
        return self.sm.driver.execute_script("""
        return {
            'color': $('.selImgCol.sbc-prim-text-hook').text(),
            'size': $($('.variator--option.variator--option-size').find('.sbc-variator-options')[arguments[0]]).text(),
            'price': $('#stickySidebar').find('.price').text() 
            }
        """, size_number)
    
    def run_scraper(self):
        doc = self.sm.get_next_scrape(self.sm.jobs)
        while doc is not None:
            url = doc['url']
            print "Opening Url: " + url
            self.sm.driver.get(url)
            self.su.short_timeout()
        
            sizes = self.get_sizes()
            colors = self.get_colors()
        
            details = self.get_basic_info()
        
            if sizes == 0 and colors == 0:
                details['price'].append(self.get_price_obj(0))
                continue
        
            print "colors: " + str(colors) + " sizes: " + str(sizes)
        
            for i in range(0, sizes, 1):
                self.select_size(i)
                for j in range(0, colors, 1):
                    self.select_color(j)
                    details['price'].append(self.get_price_obj(i))
            self.sm.price.insert_one(details)
        
            self.su.long_timeout()
            self.sm.driver = self.sm.driverManager.check_driver(self.sm.driver)
            doc = self.sm.get_next_scrape(self.sm.jobs)
            self.sm.update_next_scrape(self.sm.jobs, doc)
            
        self.sm.driver.quit()

TargetPartScraper().run_scraper()

