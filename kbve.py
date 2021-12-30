import sys
import os
from pathlib import Path
import json

# Credit to Hacker&Slacker For Function
def json_extract(obj, key):
    arr = []
    def extract(obj, arr, key):
        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, (dict, list)):
                    extract(v, arr, key)
                elif k == key:
                    arr.append(v)
        elif isinstance(obj, list):
            for item in obj:
                extract(item, arr, key)
        return arr
    values = extract(obj, arr, key)
    return values

# Load System Path for Python Libs

def load_PATH():
    _data = json.load(open('kbve.json'))
    sys.path.append(json_extract(_data['var'], 'PYTHONPATH'))

# Load User Data into the Environment Data
def load_USER():
    _data = json.load(open('kbve.json'))
    os.environ['email'] = json_extract(_data['var'], 'EMAIL')
    os.environ['username'] = json_extract(_data['var'], 'USERNAME')

