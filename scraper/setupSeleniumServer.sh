# https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-3.4.10.tgz
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1404-3.4.10.tgz &&
sudo apt-get remove default-jre default-jdk &&
sudo apt-get install oracle-java8-installer &&
java -jar -Dwebdriver.chrome.driver=./chromedriver selenium-server-standalone-3.6.0.jar