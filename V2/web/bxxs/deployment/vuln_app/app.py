from flask import *
import os
app=Flask(__name__)

@app.route('/',methods=['GET'])
def asd():
    return render_template("index.html")

@app.route("/feedback",methods=['POST','GET'])
def mains():
    if request.method=="POST":
        fb=request.form.get("feedback")
        f=open("temp.txt","w")
        f.write(fb)
        f.close()
        os.system("node bot/visit.js http://0.0.0.0:8080/Secret_admin_cookie_panel &")
        return render_template("feedback.html",out="Your feedback has been sent!!!")
    else:
        return render_template("feedback.html")


@app.route("/flag")
def lols():
    if request.cookies.get('cookie')=="zyperxsecret_cookiehahah":
        return "zh3r0{{Ea5y_bx55_ri8}}"
    else:
        return "only admin can visit this page"


@app.route("/Secret_admin_cookie_panel")
def bxss():
    if os.stat("temp.txt").st_size !=0:
        f=open("temp.txt").read()
        ht="<html><body>{}</body></html>".format(f)
        response = Response(ht)
        response.headers["Set-Cookie"] = "cookie=zyperxsecret_cookiehahah; HttpOnly"
        return response

if __name__=="__main__":
    app.run(debug="True")

