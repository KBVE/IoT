# Imports
import asyncio
import sys
import os
from pathlib import Path


# Currently Fixing .env and .kbve files for Python.

sys.path.append("C:\Python38\Lib\site-packages")

from pywizlight import wizlight, PilotBuilder, discovery


#from dotenv import load_dotenv
#dotenv_path = Path('../../../.env')
#load_dotenv(dot_env_path=dotenv_path)





async def hex_to_rgb(hexvalue):
    hexvalue = hexvalue.lstrip("-#")
    hexvalue = tuple(int(hexvalue[i:i+2], 16) for i in (0, 2, 4))
    print(hexvalue)
    return hexvalue

# Code Based Upon Sbidy's Example
async def main():
    command = sys.argv[1]
    if "-#" in command:
        color = await hex_to_rgb(command)
        bulbs = await discovery.discover_lights(broadcast_space="192.168.1.255")
        for bulb in bulbs: light = await wizlight(bulb.ip).turn_on(PilotBuilder(rgb = color))

    if "-off" in command:
        bulbs = await discovery.discover_lights(broadcast_space="192.168.1.255")
        for bulb in bulbs: light = await wizlight(bulb.ip).turn_off()
    

        


loop = asyncio.get_event_loop()
loop.run_until_complete(main())