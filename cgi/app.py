# -*- coding: utf-8 -*-
#!/usr/bin/python3
# ubuntu16.04LTS

import json
import time
import datetime

if __name__ == '__main__':
    import db
else:
    from cgi import db

"""
用户登录、注册相关
"""
def newCookieExpires(exdays):
    t = time.time() + exdays * 24 * 60 * 60
    return time.strftime("%A, %d-%b-%y %H:%M:%S GMT", time.localtime(t))

def handleSignup(environ):
    json_body_length = int(environ['CONTENT_LENGTH'])
    json_body = environ['wsgi.input'].read(json_body_length).decode('utf-8')
    # json format- {name: xx, password: xx, verify: xx}
    json_body = json.loads(json_body)

    new_user = db.createUser(json_body['name'],
                             json_body['password'],
                             json_body['verify'])
    return json.dumps(new_user)

def handleSignin(environ):
    json_body_length = int(environ['CONTENT_LENGTH'])
    json_body = environ['wsgi.input'].read(json_body_length).decode('utf-8')
    # json format- {name: xx, password: xx, verify: xx}
    json_body = json.loads(json_body)

    # TODO: 返回值需要重新考虑
    new_user = db.loginUser(json_body['name'], json_body['s_password'])
    if new_user:
        return json_body

"""
预定会议室相关
"""
def handleAddMeeting(environ):
    json_body_length = int(environ['CONTENT_LENGTH'])
    json_body = environ['wsgi.input'].read(json_body_length).decode('utf-8')
    # json format-
    #      {timestamp: xx, title: xx, room: xx, start: xx, end: xx}
    json_body = json.loads(json_body)
    new_meeting = db.addMeeting(json_body["timestamp"],
                                json_body["title"],
                                json_body["room"],
                                json_body["start"],
                                json_body["end"])
    return new_meeting

def showEnviron(environ):
    html = "<table>\n"
    for k, v in environ.items():
        html += "<tr><td>{}</td><td>{}</td></tr>\n".format(k, v)
    html += "</table>\n"
    return html


def application(environ, start_response):
    url = environ['PATH_INFO']
    if url == "/signup":
        start_response('200 OK',
                       [('Content-Type','application/json;charset="utf-8"')])
        body = handleSignup(environ)
        #html += showEnviron(environ)
        return [body.encode("utf-8")]
    elif url == "/signin":
        body = handleSignin(environ)
        #html += showEnviron(environ)

        # 登录成功则发送cookie到client保存用户名和密码信息
        # TODO: 密码需加密处理
        headers = [('Content-Type','application/json;charset="utf-8"')]
        if body:
            if body["rember_me"]:
                headers.append(('Set-Cookie',
                                'name={};Expires={}'
                                .format(body['name'], newCookieExpires(30))))
                headers.append(('Set-Cookie',
                                's_password={};Expires={}'
                                .format(body['s_password'], newCookieExpires(30))))
            else:
                headers.append(('Set-Cookie', 'name={}'.format(body['name'])))
                headers.append(('Set-Cookie', 's_password={}'.format(body['s_password'])))

        start_response('200 OK', headers)
        body = json.dumps(body)
        return [body.encode("utf-8")]
    elif url == "/addmeeting":
        start_response('200 OK',
                       [('Content-Type','application/json;charset="utf-8"')])
        body = handleAddMeeting(environ)
        #html += showEnviron(environ)
        return [json.dumps(body).encode("utf-8")]

if __name__ == '__main__':
    print(newCookieExpires(30))
    print(newCookieExpires(-1))
