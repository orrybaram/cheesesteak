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
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render())

class ABTests(webapp2.RequestHandler):
    def get(self):        
        values = []
        
        tests = ABTestModel.all().order('-date_updated').fetch(100)
        
        for test in tests:
            values.append(test.serializable());

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

    def post(self):
        data = json.loads(self.request.body)
        test = ABTestModel()

        test.nameA = data.get('nameA')
        test.nameB = data.get('nameB')

        test.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(test.serializable()))

class ABTestModel(db.Model):
    date_created = db.DateTimeProperty(auto_now_add=True)
    date_updated = db.DateTimeProperty(auto_now=True)
    nameA = db.StringProperty()
    nameB = db.StringProperty()

    # @classmethod
    # def add(self, obj):

    #     logging.info(self)
    #     logging.info(obj)

    #     test = ABTestModel()
    #     test.nameA = obj['nameA']
    #     test.nameB = obj['nameB']

    #     test.put()

    def serializable(self):
        result = {}
        result['date_created'] = '%s+00:00' % self.date_created.isoformat()
        result['date_created'] = '%s+00:00' % self.date_updated.isoformat()
        result['nameA'] = self.nameA
        result['nameB'] = self.nameB
        
        return result


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/tests/?', ABTests),
], debug=True)
