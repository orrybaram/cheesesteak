from google.appengine.ext import db
from datetime import datetime, timedelta

import webapp2
import os
import jinja2
import logging
import urlparse
import json

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        tests = ABTestModel.all().order('-date_updated').fetch(100)

        logging.info("")
        logging.info("")
        logging.info("")
        logging.info("")

        logging.info(tests)

        values = {
           'tests': tests
        }
        template = JINJA_ENVIRONMENT.get_template('main.html')
        self.response.write(template.render(values))

    def post(self):
    	values = {}

    	nameA = self.request.get('nameA')
    	nameB = self.request.get('nameB')

    	test = {
    		'nameA': nameA,
    		'nameB': nameB
    	}

    	ABTestModel.add(test)

    	template = JINJA_ENVIRONMENT.get_template('main.html')
        self.response.write(template.render(values))


class ABTestModel(db.Model):
    date_created = db.DateTimeProperty(auto_now_add=True)
    date_updated = db.DateTimeProperty(auto_now=True)
    nameA = db.StringProperty()
    nameB = db.StringProperty()

    @classmethod
    def add(self, obj):

    	logging.info(self)
    	logging.info(obj)

    	test = ABTestModel()
    	test.nameA = obj['nameA']
    	test.nameB = obj['nameB']

    	test.put()



app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
