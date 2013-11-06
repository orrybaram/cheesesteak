from google.appengine.ext import db
from google.appengine.api import users

from datetime import datetime, timedelta

from models import *

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
        current_user = users.get_current_user()
        values = {}

        ip = self.request.remote_addr
        log = Log()
        log.ip_address = ip
        log.put()
        
        if current_user:
            values["logout_url"] = users.create_logout_url('/')
            
            user = UserModel.all().filter('userid =', current_user.user_id()).get()

            if not user:
                user = UserModel()
                user.name = str(current_user)
                user.userid = current_user.user_id()
                user.put()
            
            values["user"] = user

        else:
            values["login_url"] = users.create_login_url('/')
        
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render(values))

class Tests(webapp2.RequestHandler):
    def get(self, test_key=None):        
        if users.get_current_user():
            user = UserModel.all().filter('userid =', users.get_current_user().user_id()).get()

        # Test Page
        if test_key:
            test = TestModel.get(test_key)

            _votes = []
            votes = test.get_votes()

            for vote in votes:
                logging.info(vote)
                _votes.append(vote)

            test.votes = _votes

            values = test.serializable()
        else:
            values = []
            # Admin Page
            if user.is_admin:    
                tests = TestModel.all().order('date_updated').fetch(100)
            
            # Get User's Tests
            else:
                tests = TestModel.all().filter('user =', users.get_current_user()).fetch(100)
                logging.info(user.name)
            
            for test in tests:
                values.append(test.serializable());

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

class PublicTests(webapp2.RequestHandler):
    def get(self):
        values = []
        tests = TestModel.all().filter('is_public = ', True).fetch(100)
        for test in tests:
            values.append(test.serializable());
        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(values))

class CreateTest(webapp2.RequestHandler):
    def post(self, test_key=None):
        if test_key:
            test = TestModel.get(test_key)
        else:
            test = TestModel()

        data = json.loads(self.request.body)

        test.title = data.get('title')
        test.user = users.get_current_user()
        test.is_public = data.get('is_public')
        
        test.A_name = data.get('A_name')
        test.A_image = db.Blob(str(data.get('A_image')))
        
        test.B_name = data.get('B_name')
        test.B_image = db.Blob(str(data.get('B_image')))

        test.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(test.serializable()))

class Vote(webapp2.RequestHandler):
    def post(self, test_key):
        data = json.loads(self.request.body)
        user_key = data.get('user_key')
        
        vote = VoteModel()
        vote.test = TestModel.get(test_key)
        
        if user_key:
            vote.user = UserModel.get()
        else:
            vote.user = None

        vote.ip_address = self.request.remote_addr

        if data.get('voted_for') == 'A':        
            vote.voted_for = 'A'
        if data.get('voted_for') == 'B':
            vote.voted_for = 'B'

        vote.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(vote.serializable()))


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/tests/?', Tests),
    ('/tests/public/?', PublicTests),
    ('/tests/create/?', CreateTest),
    ('/tests/(?P<test_key>[^/]+)/?', Tests),
    ('/tests/(?P<test_key>[^/]+)/update/?', CreateTest),
    ('/tests/(?P<test_key>[^/]+)/vote/?', Vote),
    
    
], debug=True)
