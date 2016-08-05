# -*- coding: utf-8 -*-
# python3.5
# ubuntu16.04LTS
import cgi

def application(environ, start_response):
    start_response('200 OK', [('Content-Type','text/html')])
    html = "<h1>Hello World From Python</h1>\n"
    html += "<table>\n"
    for k, v in environ.items():
        html += "<tr><td>{}</td><td>{}</td></tr>\n".format(k, v)
    html += "</table>\n"

    html += "<form>\n"
    html += "<input name=txt>\n"
    html += "<input type=submit value=echo>\n"
    html += "</form>\n"

    form  = cgi.FieldStorage(environ = environ)
    print(form, type(form))
    if 'txt' in form:
        html += "<hr><p>You said: <b>{}</b></p>".format(form['txt'].value)

    return [html.encode("utf-8")]
