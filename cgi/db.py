# -*- coding: utf-8 -*-
#!usr/bin/python3
# ubuntu16.04LTS

import sqlite3

def dbtest():
    conn = sqlite3.connect("/home/zx/projects/easyMeeting/cgi/test.db")
    cursor = conn.cursor()

    # get all table name in database
    cursor.execute("SELECT NAME FROM sqlite_master WHERE TYPE='table'")
    table_list = [name[0] for name in cursor.fetchall()]
    
    if not 'test' in table_list:
        cursor.execute("""CREATE TABLE test
                 (ID INT PRIMARY KEY NOT NULL,
                  NAME TEXT NOT NULL);""")
        cursor.execute("""INSERT INTO test (ID, NAME) VALUES (001, "zx")""")
        conn.commit()

    cursor.execute("SELECT * FROM test")
    user =  cursor.fetchone()
    conn.close()
    return user


if __name__ == '__main__':
    print(dbtest())
