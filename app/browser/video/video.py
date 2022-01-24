# Core imports
import sys
import asyncio
import os
import json
import io

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

# Image Structures
import base64
from PIL import Image
from PIL import ImageGrab
from functools import partial
ImageGrab.grab = partial(ImageGrab.grab, all_screens=True)

# Browser
import webbrowser


def image_to_data_url(filename):
    ext = filename.split('.')[-1]
    prefix = f'data:image/{ext};base64,'
    with open(filename, 'rb') as f:
        img = f.read()
    return prefix + base64.b64encode(img).decode('utf-8')

def b64_to_image(string):
    return Image.open(io.BytesIO(base64.b64decode(str(string))))

async def pyag_click(image_path, delay):
    x, y = pyautogui.locateCenterOnScreen(image_path, grayscale=False , confidence=0.8)
    while x == None or y == None:
        #x, y = pyag_click(image_path, delay)
        await asyncio.sleep(delay)
        print("still looking for the image")

    pyautogui.click(x, y)
    await asyncio.sleep(delay)
    return 'result'

async def wrapped():
    print('wrapped')
    return 'result' 


async def open_brave():
    webbrowser.open('https://kbve.com/')
    print('Openning the Browser')
    return 'results'
    #await pyag_click(Image.open(io.BytesIO(base64.b64decode(str('iVBORw0KGgoAAAANSUhEUgAAAAoAAAARCAYAAADkIz3lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHESURBVChThZJPSFRRFIe/98qZbERiBA0XEUEZZItQCISiFkqLqCgCU1oEtQwtCNpEO8VoF7gUgojaJhVk0cYoZKxMaGNOkKShomGNwxvH+XXevT5018e9PDjn986fe06gjiYRlWBXFuobYb0CP/KwtADhNqiphcIfAuXeitIaNJhoTxPIhFNfYX4OqlJQVw8LcyY0+B8mCXTvnEhnoK0Tjpyy1GUYeQavh2G1AIdboPOqCafGxOeXkJ+E60PmXIWebjh6Ao61w/5DkKmJoxq/pqXnD6SoKBULUt8taWnRuRJCV0N+HFJp2F4FO3bC3xUYHXGuBC8cfQyloq+vFPkfBvudyzH8ZCN1fly60Spd2C11NEqXjkuTZovJvZNaG+SFMb/npTvnpd7T0vKW+j6+l5prN2qMWbPpxOnL9i3bABIONPuHV6ViXX+Tblu69pTUlpGuWdSZ7z7i0yHpYLUCDZwVK4vQcgZOXrGGbFCPBuHNC8jWwZccLJtfXWlp4pVc5K1MjLkmtNfasBu62h7ehBlbhIRPH6D3st+gmMCOLuKXIrsPuu9DZNtztwdmfzpzwqbQAhNV2+7ZY8/aZNad1ROG/APhvRyyGir2tgAAAABJRU5ErkJggg==')))),2)
    #return await pyag_click(b64_to_image('iVBORw0KGgoAAAANSUhEUgAAAAoAAAARCAYAAADkIz3lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHESURBVChThZJPSFRRFIe/98qZbERiBA0XEUEZZItQCISiFkqLqCgCU1oEtQwtCNpEO8VoF7gUgojaJhVk0cYoZKxMaGNOkKShomGNwxvH+XXevT5018e9PDjn986fe06gjiYRlWBXFuobYb0CP/KwtADhNqiphcIfAuXeitIaNJhoTxPIhFNfYX4OqlJQVw8LcyY0+B8mCXTvnEhnoK0Tjpyy1GUYeQavh2G1AIdboPOqCafGxOeXkJ+E60PmXIWebjh6Ao61w/5DkKmJoxq/pqXnD6SoKBULUt8taWnRuRJCV0N+HFJp2F4FO3bC3xUYHXGuBC8cfQyloq+vFPkfBvudyzH8ZCN1fly60Spd2C11NEqXjkuTZovJvZNaG+SFMb/npTvnpd7T0vKW+j6+l5prN2qMWbPpxOnL9i3bABIONPuHV6ViXX+Tblu69pTUlpGuWdSZ7z7i0yHpYLUCDZwVK4vQcgZOXrGGbFCPBuHNC8jWwZccLJtfXWlp4pVc5K1MjLkmtNfasBu62h7ehBlbhIRPH6D3st+gmMCOLuKXIrsPuu9DZNtztwdmfzpzwqbQAhNV2+7ZY8/aZNad1ROG/APhvRyyGir2tgAAAABJRU5ErkJggg=='),2)

async def close_tab():
    x, y = pyautogui.locateCenterOnScreen(b64_to_image(), grayscale=False , confidence=0.8)
    while x == None or y == None:
        #x, y = pyag_click(image_path, delay)
        await asyncio.sleep(1)
        print("still looking for the image")
    pyautogui.rightClick(x,y)
    await asyncio.sleep(1)
    return 'result'

    print('Close Tab')
    return await pyag_click(b64_to_image('iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC3SURBVChTjZA9DoJAFIRngbsosDRqS7yB0UbU03Aa/yrDJQwRbAxXwEoaErAx6KwsjTH6bbJvMu9l32RFWZYNfmA+IMI8v8KTbmu92ez2OEQRxr4PQzouTkmqTA01PfaINZtOUN9rZWqoR8MB2CNdpvV2hyQ9K5MDq0WgNDHaCiGEqs3raK2xeOkMfIHo1ctgrqppOzI8xnG3wpMSt6JQq6uqht3vwbhk2UcGanrskb8+swv+HeAJZ3lPrqNVFPEAAAAASUVORK5CYII='), 2)

async def close_other_tab():
    print('Close Other Tab')
    return await pyag_click(b64_to_image('iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC3SURBVChTjZA9DoJAFIRngbsosDRqS7yB0UbU03Aa/yrDJQwRbAxXwEoaErAx6KwsjTH6bbJvMu9l32RFWZYNfmA+IMI8v8KTbmu92ez2OEQRxr4PQzouTkmqTA01PfaINZtOUN9rZWqoR8MB2CNdpvV2hyQ9K5MDq0WgNDHaCiGEqs3raK2xeOkMfIHo1ctgrqppOzI8xnG3wpMSt6JQq6uqht3vwbhk2UcGanrskb8+swv+HeAJZ3lPrqNVFPEAAAAASUVORK5CYII='), 2)



async def open_powershell():
    print('Open Powershell')
#    await pyag_click(b64_to_image('iVBORw0KGgoAAAANSUhEUgAAAAwAAAASCAYAAABvqT8MAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIXSURBVDhPdVFNaBNREP7ebv5s2ma32USaBluFVIqih3ryKF7suVa8eNCjN08ei3jyIp48FKkVxEOhFBUE8aYtWMS/6EHiQS1pNTYpdBOS3WT3OfM2G6vVWYb3zcz3zczbJ+5v2PJ6qYZKqw34PiAlBJ9drFxhzkloZ/cncWUshSiCougR9pIZa2+qNmaG+3EpP4h9An+SmRiSu1hfO31h9qDWwbkxC5m4jpWtBjwW/dU5ENBKZU/HtVIVn2s7mBkZxMVR479kxhrv3N/Xhzp0lTscpWLbCciK+JvMLq4WN+X5fAqGBtxd+4DlLxWsJy1Aj+wlExblhiPtloPZJyt4se2glRkBBN3+H2R1Pv70Td5cfY+PfgJHRvNIaEzmdSQ6RCjVbNhuJ2jAgkO3H0p7II0E3ePRqQkcSMbp3wZmOy4uP32Nlztur4mwFl8R0mikD8Nzode3qROxqSipox2Jox2lJizgCUfvPaMKq7s7qwK/+K64lyfB3NIyQ4pZFxQU5p1C3I2rPyvQ0pks0lYGQ2lLOccnJycxXhjH5vcfEPR7U+YQBlL0oGSR+YUFBULLZbPITE+j0WziXbGIt+SxaBRTU2fUJHHrwaIaGI6OaBq2KvR45TKGczmYpolYLIZEPI5mvQ6x9HyVeJLu4ysBn47rwvM81ZmtSdM21r+iUJiAuDF3R90vNBYFJugLjDOGYeLY8RP4BRpqaWXD6M+3AAAAAElFTkSuQmCC'),2)
    return await pyag_click('../../media/images/power_shell.png',2)



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
    #task2 = asyncio.create_task(close_tab())
    #await inner(task2)
    ## Executing this on server alpha


event_loop = asyncio.get_event_loop()
try:
    print('entering event loop')
    result = event_loop.run_until_complete(starter())
finally:
    event_loop.close()