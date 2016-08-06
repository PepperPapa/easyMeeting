# -*- coding: utf-8 -*-
#!usr/bin/python3
# ubuntu16.04LTS

import sqlite3

def dbtest():
    conn = sqlite3.connect("/home/zx/projects/easyMeeting/cgi/test.db")
    conn.execute("""CREATE TABLE test
                 (ID INT PRIMARY KEY NOT NULL,
                  NAME TEXT NOT NULL);""")
    conn.execute("""INSERT INTO test (ID, NAME) VALUES (001, "zx")""")
    conn.commit()
    cursor = conn.execute("SELECT * FROM test")
    user =  cursor.fetchone()
    conn.close()
    return user


if __name__ == '__main__':
    print(dbtest())
