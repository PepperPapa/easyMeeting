# -*- coding: utf-8 -*-
#!usr/bin/python3
# ubuntu16.04LTS

import sqlite3

def connectDatabase():
    conn = sqlite3.connect("/home/zx/projects/easyMeeting/cgi/easymeeting.db")
    return (conn, conn.cursor())
    
def createUserTable():
    conn, cursor = connectDatabase()
    
    # get all table name in database
    cursor.execute("SELECT NAME FROM sqlite_master WHERE TYPE='table'")
    table_list = [name[0] for name in cursor.fetchall()]
    
    if not 'users' in table_list:
        cursor.execute("""CREATE TABLE users
                 (NAME TEXT PRIMARY KEY NOT NULL,
                  PASSWORD TEXT NOT NULL);""")
    return (conn, cursor)


def createUser(name, pwd, repeate_pwd):
    # 如果users不存在则首先创建表users
    conn, cursor = createUserTable()

    # TODO: 用户名格式和密码格式校验, 密码重复验证
    # TODO: 密码的加密处理
    # 检查name是否存在，不存在才能插入值
    cursor.execute("SELECT NAME FROM users WHERE NAME='{}'".format(name))
    if (not cursor.fetchall()):
        cursor.execute("""INSERT INTO users (NAME, PASSWORD)
                       VALUES ('{}', '{}')""".format(name, pwd))
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE NAME='{}'".format(name))
        user = cursor.fetchone()
        conn.close()
        # s_: 表示已经加密处理
        return {'name': user[0], 's_password': user[1]}

def loginUser(name, pwd):
    conn, cursor = connectDatabase()
    cursor.execute("SELECT * FROM users WHERE NAME='{}'".format(name))
    query_user = cursor.fetchone()
    if query_user:
        if (name == query_user[0] and pwd == query_user[1]):
            return {'name': query_user[0], 's_password': query_user[1]}
    
if __name__ == '__main__':
    print(createUser("zx", "1234", "1234"))
