from google.appengine.ext import db
from google.appengine.api import users

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
        current_user = users.get_current_user()
        values = {}
        
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
        user = UserModel.all().filter('userid =', users.get_current_user().user_id()).get()

        values = []
        if test_key:
            test = TestModel.get(test_key)
            values = test.serializable()
        else:
            if user.is_admin:    
                tests = TestModel.all().order('date_updated').fetch(100)
            else:
                tests = TestModel.all().filter('user =', users.get_current_user()).fetch(100)
                logging.info(user.name)
            
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
        
        test.A_name = data.get('A_name')
        test.A_image = db.Blob(str(data.get('A_image')))
        
        test.B_name = data.get('B_name')
        test.B_image = db.Blob(str(data.get('B_image')))

        test.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(test.serializable()))

class Vote(webapp2.RequestHandler):
    def post(self, test_key):
        test = TestModel.get(test_key)

        data = json.loads(self.request.body)

        if data.get('vote') == 'A':        
            test.A_votes += 1
        if data.get('vote') == 'B':
            test.B_votes += 1

        test.put()

        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(json.dumps(test.serializable()))

class UserModel(db.Model):
    userid = db.StringProperty()
    name = db.StringProperty()
    is_admin = db.BooleanProperty(default=False)

    def serializable(self):
        result = {}
        result["key"] = str(self.key())
        result["name"] = self.name
        result["userid"] = self.userid

class TestModel(db.Model):
    date_created = db.DateTimeProperty(auto_now_add=True)
    date_updated = db.DateTimeProperty(auto_now=True)
    title = db.StringProperty()
    user = db.UserProperty()
    
    A_name = db.StringProperty()
    A_image = db.BlobProperty()
    A_votes = db.IntegerProperty(default=0)
    
    B_name = db.StringProperty()
    B_image = db.BlobProperty()
    B_votes = db.IntegerProperty(default=0)

    def serializable(self):
        result = {}
        result['key'] = str(self.key())
        result['date_created'] = '%s+00:00' % self.date_created.isoformat()
        result['date_created'] = '%s+00:00' % self.date_updated.isoformat()
        result['title'] = self.title
        result['user'] = str(self.user)
        
        result['A_name'] = self.A_name
        result['A_image'] = self.A_image
        result['A_votes'] = self.A_votes
        
        result['B_name'] = self.B_name
        result['B_image'] = self.B_image
        result['B_votes'] = self.B_votes

        return result

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/tests/?', Tests),
    ('/tests/create/?', CreateTest),
    ('/tests/(?P<test_key>[^/]+)/?', Tests),
    ('/tests/(?P<test_key>[^/]+)/update/?', CreateTest),
    ('/tests/(?P<test_key>[^/]+)/vote/?', Vote),
    
    
], debug=True)
