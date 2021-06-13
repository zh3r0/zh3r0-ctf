from flask import *
import requests
import re
def filter_zyper(inputs,blacklist):
 f=0
 for i in blacklist:
   if i in inputs.lower():
     f=1
 print(f)
 return f 
r=requests
app=Flask(__name__)

@app.route("/",methods=['GET'])
def home():
    return render_template("index.html")

@app.route("/request",methods= ['POST','GET'])
def vuln_ssrf():
 if request.method == 'POST':
  url=request.form['url']
  print(url)
  blacklist=["127.0.0.1","localhost","0.0.0.0","[::]","127","ffff","2130706433"]
  if filter_zyper(str(url),blacklist):
   op="Please dont try to heck me sir..."
  else:
   try:
    op=r.get(url,allow_redirects=True)
    print(op.history)
    op=op.headers
   except:
    op="Learn about URL's First"
 else:
  op="Invalid URL"
 return render_template("requests.html",op=op)
  
if __name__ == '__main__':
  app.run()
