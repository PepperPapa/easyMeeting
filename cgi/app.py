# -*- coding: utf-8 -*-
#!/usr/bin/python3
# ubuntu16.04LTS

from cgi import db

def application(environ, start_response):
    start_response('200 OK', [('Content-Type','text/html')])

    user = db.dbtest()
    
    html = "<h1>{}</h1><p>{}</p>".format(user[0], user[1])

    return [html.encode("utf-8")]

