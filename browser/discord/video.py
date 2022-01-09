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

#Import Base64
import base64


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


async def pyag_click(image_path, delay):
    x, y = pyautogui.locateCenterOnScreen(image_path)
    await asyncio.sleep(delay)
    pyautogui.click(x, y)
    await asyncio.sleep(delay)
    return 'result'

async def wrapped():
    print('wrapped')
    return 'result' 


async def open_brave():
    print('Open Browser')
    await pyag_click(base64.decodebytes('iVBORw0KGgoAAAANSUhEUgAAAAoAAAARCAYAAADkIz3lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHESURBVChThZJPSFRRFIe/98qZbERiBA0XEUEZZItQCISiFkqLqCgCU1oEtQwtCNpEO8VoF7gUgojaJhVk0cYoZKxMaGNOkKShomGNwxvH+XXevT5018e9PDjn986fe06gjiYRlWBXFuobYb0CP/KwtADhNqiphcIfAuXeitIaNJhoTxPIhFNfYX4OqlJQVw8LcyY0+B8mCXTvnEhnoK0Tjpyy1GUYeQavh2G1AIdboPOqCafGxOeXkJ+E60PmXIWebjh6Ao61w/5DkKmJoxq/pqXnD6SoKBULUt8taWnRuRJCV0N+HFJp2F4FO3bC3xUYHXGuBC8cfQyloq+vFPkfBvudyzH8ZCN1fly60Spd2C11NEqXjkuTZovJvZNaG+SFMb/npTvnpd7T0vKW+j6+l5prN2qMWbPpxOnL9i3bABIONPuHV6ViXX+Tblu69pTUlpGuWdSZ7z7i0yHpYLUCDZwVK4vQcgZOXrGGbFCPBuHNC8jWwZccLJtfXWlp4pVc5K1MjLkmtNfasBu62h7ehBlbhIRPH6D3st+gmMCOLuKXIrsPuu9DZNtztwdmfzpzwqbQAhNV2+7ZY8/aZNad1ROG/APhvRyyGir2tgAAAABJRU5ErkJggg=='),2)
    print('Close Tab')
    await pyag_click(base64.decodebytes('iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACeSURBVChTtZExEoMgFEQ/mVTmRFrHW3CCWMMhoDaHkZ4LEWuT3fAdmTQ2eTPCn91Fl9GUUjY5yaXup2DYWisxRgpHoMFTGO77QZYlNQcwQ4OnXLFM00PW9UVTwTyOd3pKc8EQgqSEA4ZB7/3XqDQXNMZg/TxbnVtYA2hHvBFoJeccd8DwPD/34PHT0LrutvdmjZzzTxAzNHjKv/6gyBtte0ZzL/PJwgAAAABJRU5ErkJggg=='),2)
    print('Open Tab')
    await pyag_click('../../media/images/brave_close_tab.png',2)


async def inner(task):
    print('inner: starting')
    print('inner: waiting for {!r}'.format(task))
    result = await task
    print('inner: task returned {!r}'.format(result))


async def starter():
    print('starter: creating task')
    task = asyncio.create_task(wrapped())
    print('starter: waiting for inner')
    await inner(task)
    ## ../../media/images/brave_browser.png
    task1 = asyncio.create_task(
        open_brave()
        )

    await inner(task1)
    print('starter: inner returned')

    ## Executing this on server alpha

event_loop = asyncio.get_event_loop()
try:
    print('entering event loop')
    result = event_loop.run_until_complete(starter())
finally:
    event_loop.close()