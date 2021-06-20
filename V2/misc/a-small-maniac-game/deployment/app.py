#!/usr/bin/python3

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import os
from time import sleep
import base64
import time
import random
from flask import Flask
from flask import request
import string
import json
from collections import Counter

def gen_rand_name():
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(10))

app = Flask(__name__)
@app.route('/submit', methods = ['POST','GET'])
def check():
    if request.method == 'POST':
        print("request received")
        # server = "https://bhavye-malhotra.github.io/aGsgbWFkYXJjaG9k/"
        server = "http://127.0.0.1:80/"
        initial_lmao = dict(request.form.to_dict())
        try:
            asm_progress = next(iter(initial_lmao))
        except:
            return "<script> alert('You have to solve all the levels before submitting'); window.location.replace('/'); </script>"
        levels_passed = Counter(asm_progress.replace('{','').replace('}','').replace(',',':').split(":"))['true']
        print(levels_passed)
        if levels_passed != 13:
            return "<script> alert('You have to solve all the levels before submitting'); window.location.replace('/'); </script>"
        # asm_progress = '{"0.0.1":{"0":{"lines":2,"cycles":10,"solution":["MOVE -4 0","MOVE  4 1 "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],"unlocked":true},"1":{"lines":null,"cycles":null,"solution":[],"unlocked":true},"2":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"3":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"4":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"5":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"6":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"7":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"8":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"9":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"10":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"11":{"lines":null,"cycles":null,"solution":[],"unlocked":false},"12":{"lines":15,"cycles":282,"solution":["MOVE 1 0 "," ","READ [1] ","READ [2]","SUB [1] [1] 1","SUB [2] [1] 1","JMPZ 11 [2]","JMPZ 11 [2]","JMP 14"," ","MOVE 1 1 ","MOVE -1 1 "," ","READ [4]","JMPZ 12 [4]","JMPN 5 [4] ","SUB [4] [4] [1]","JMP 15"," "," "," "," "," "],"unlocked":true}}}'
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-gpu")
        options.add_argument("--remote-debugin-port=9222")
        dk = webdriver.Chrome(chrome_options=options)
        print("browser executed")
        dk.get(server)
        sleep(2)
        dk.execute_script(f"localStorage.setItem('asm_progress', '{asm_progress}');")
        dk.execute_script(f"localStorage.setItem('asm_loaded', 'true');")
        dk.refresh()
        sleep(2)
        canvas = dk.find_element_by_id("game")
        drawing = ActionChains(dk)\
            .send_keys("START 12\n")
        drawing.perform()
        sleep(40)
        print("sleep done")
        flag_path = '/tmp/' + gen_rand_name() + ".png"
        dk.save_screenshot(flag_path)
        flag_data = open(flag_path, 'rb').read()
        flag_data = base64.b64encode(flag_data)
        dk.close()
        os.system(f"rm -f {flag_path}")
        return f"<img src='data:image/png;base64, {flag_data.decode('utf-8')}' alt='result' />"
    else:
        return "working"
if __name__ == '__main__':
    app.run()
