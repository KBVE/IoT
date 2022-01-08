# Core imports
import sys
import asyncio
import os
import json

# KBVE Imports
sys.path.append(os.path.abspath(os.path.join('..')))
import _init

# Additional Imports
import multiprocessing
from multiprocessing import Process, freeze_support
import threading
from pathlib import Path

#Import PyAutoGUI
import pyautogui


# Restructing the loop. I am just messing around and learning.
# pyMoTW Tutorial on Asyncio Tasks. Going to build off their template. 

#
import base64
def image_to_data_url(filename):
    ext = filename.split('.')[-1]
    prefix = f'data:image/{ext};base64,'
    with open(filename, 'rb') as f:
        img = f.read()
    return prefix + base64.b64encode(img).decode('utf-8')


async def pyag_click(image_path):
    x, y = pyautogui.locateCenterOnScreen(image_path)
    pyautogui.click(x, y)


async def wrapped():
    print('wrapped')
    return 'result' 


async def inner(task):
    print('inner: starting')
    print('inner: waiting for {!r}'.format(task))
    result = await task
    print('inner: task returned {!r}'.format(result))


async def starter():
    print('starter: creating task')
    task = asyncio.ensure_future(wrapped())
    print('starter: waiting for inner')
    await inner(task)
    ## ../../media/images/brave_browser.png
    task1 = asyncio.ensure_future(pyag_click('../../media/images/brave_browser.png'))
    await inner(task1)
    print('starter: inner returned')

    ## Executing this on server alpha

event_loop = asyncio.get_event_loop()
try:
    print('entering event loop')
    result = event_loop.run_until_complete(starter())
finally:
    event_loop.close()