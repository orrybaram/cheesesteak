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
        
        tests = ABTestModel.all().order('date_updated').fetch(100)
        
        for test in tests:
            values.append(test.serializable());

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

    def post(self):
        data = json.loads(self.request.body)
        test = ABTestModel()

        logging.info(data.get('B_image'))

        test.A_name = data.get('A_name')
        test.B_name = data.get('B_name')
        test.A_image = db.Blob(str(data.get('A_image')))
        test.B_image = db.Blob(str(data.get('B_image')))

        test.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(test.serializable()))

class ABTestModel(db.Model):
    date_created = db.DateTimeProperty(auto_now_add=True)
    date_updated = db.DateTimeProperty(auto_now=True)
    product_name = db.StringProperty()
    product_description = db.StringProperty()
    A_name = db.StringProperty()
    A_image = db.BlobProperty()
    B_name = db.StringProperty()
    B_image = db.BlobProperty()

    def serializable(self):
        result = {}
        result['date_created'] = '%s+00:00' % self.date_created.isoformat()
        result['date_created'] = '%s+00:00' % self.date_updated.isoformat()
        result['A_name'] = self.A_name
        result['A_image'] = self.A_image
        result['B_name'] = self.B_name
        result['B_image'] = self.B_image
        
        return result

# class ImageHandler(webapp2.RequestHandler):
#     def get(self):
#         test = db.get(self.request.get('img_id'))
#         if greeting.avatar:
#             self.response.headers['Content-Type'] = 'image/png'
#             self.response.out.write(greeting.avatar)
#         else:
#             self.response.out.write('No image')


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/tests/?', ABTests),
], debug=True)
