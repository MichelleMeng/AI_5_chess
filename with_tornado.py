# coding: utf-8
import sys
print(sys.path)
# sys.path.append('/usr/local/lib/python2.7/site-packages/')

import tornado.ioloop
import tornado.web
import os

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    # "cookie_secret": "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
    # "login_url": "/login",
    # "xsrf_cookies": True,
}

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler), 
    ], **settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(8816)
    tornado.ioloop.IOLoop.current().start()