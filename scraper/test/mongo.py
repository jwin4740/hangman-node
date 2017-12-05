from selenium import webdriver
import time

driver = webdriver.Chrome()
driver.get("https://www.wayfair.com/bed-bath/pdp/savin-quilt-set-lfmf1539.html")
driver.execute_script(""" 
                jQuery('.PdpOptionSelect-field').on("click mousedown mouseup focus blur keydown change",function(e){
                     console.log(e);
                }); 
""")
time.sleep(20)
driver.execute_script(""" 
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('mousedown', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            jQuery('.PdpOptionSelect-field')[0].dispatchEvent(evt);
 """)
driver.find_elements_by_class_name("PdpOptionSelect-field")[0].click()

time.sleep(20)

