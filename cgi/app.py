# -*- coding: utf-8 -*-
#!/usr/bin/python3
# ubuntu16.04LTS

if __name__ == '__main__':
    import db
else:
    from cgi import db

def handleSignup(environ):
    query_string = environ['QUERY_STRING']
    user_info = [item.split('=')[1] for item in query_string.split('&')]
    new_user = db.insertNewUser(user_info[0], user_info[1], user_info[2])
    if new_user:
        return "sucess, name is %s" % new_user[0]
    else:
        return "user already exist!"

def showEnviron(environ):
    html = "<table>\n"		
    for k, v in environ.items():		
        html += "<tr><td>{}</td><td>{}</td></tr>\n".format(k, v)
    html += "</table>\n"
    return html

def application(environ, start_response):
    start_response('200 OK', [('Content-Type','text/html')])

    url = environ['PATH_INFO']
    if url == "/signup":
        html = handleSignup(environ)
        html += showEnviron(environ)

    return [html.encode("utf-8")]

if __name__ == '__main__':
    print(handleSignup({'QUERY_STRING': 'username=zx123&password=1234&re-password=1234'}))
