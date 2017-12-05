import datetime
import pprint
from pymongo import MongoClient

client = MongoClient('localhost', 27017)

db = client['kohlsDB']

collection = db.trial

pprint.pprint(collection.find_one())

post = {"author": "James",
        "text": "first post",
        "tags": ["mongodb", "python", "pymongo"],
        "date": datetime.datetime.utcnow()}
posts = db.posts
post_id = posts.insert_one(post).inserted_id

pprint.pprint(post_id)
