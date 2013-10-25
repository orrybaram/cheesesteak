from google.appengine.ext import db

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
        values = {}
        template = JINJA_ENVIRONMENT.get_template('main.html')
        self.response.write(template.render(values))

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
