# -*- coding: utf-8 -*-
#!/usr/bin/python3
# ubuntu16.04LTS

import json

if __name__ == '__main__':
    import db
else:
    from cgi import db


def handleSignup(environ):
    json_body_length = int(environ['CONTENT_LENGTH'])
    json_body = environ['wsgi.input'].read(json_body_length).decode('utf-8')
    # json format- {name: xx, password: xx, verify: xx}
    json_body = json.loads(json_body)

    new_user = db.createUser(json_body['name'], json_body['password'], json_body['verify'])
    return json.dumps(new_user)

def handleSignin(environ):
    json_body_length = int(environ['CONTENT_LENGTH'])
    json_body = environ['wsgi.input'].read(json_body_length).decode('utf-8')
    # json format- {name: xx, password: xx, verify: xx}
    json_body = json.loads(json_body)

    new_user = db.loginUser(json_body['name'], json_body['password'])
    return json.dumps(new_user)
    
def showEnviron(environ):
    html = "<table>\n"		
    for k, v in environ.items():		
        html += "<tr><td>{}</td><td>{}</td></tr>\n".format(k, v)
    html += "</table>\n"
    return html

def application(environ, start_response):
    url = environ['PATH_INFO']
    if url == "/signup":
        start_response('200 OK', [('Content-Type','application/json;charset="utf-8"')])
        body = handleSignup(environ)
        #html += showEnviron(environ)
        return [body.encode("utf-8")]
    elif url == "/signin":
        start_response('200 OK', [('Content-Type','application/json;charset="utf-8"')])
        body = handleSignin(environ)
        #html += showEnviron(environ)
        return [body.encode("utf-8")]

if __name__ == '__main__':
    print(handleSignup({'QUERY_STRING': 'username=zx123&password=1234&re-password=1234'}))
