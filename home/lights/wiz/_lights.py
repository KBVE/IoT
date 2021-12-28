# Imports
import asyncio
import sys
import os
from pathlib import Path
import json


#Extract Nested Values from a JSON Tree - HackersAndSlackers.com 
def json_extract(obj, key):
    """Recursively fetch values from nested JSON."""
    arr = []

    def extract(obj, arr, key):
        """Recursively search for values of key in JSON tree."""
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
_data = json.load(open('../../../kbve.json'))
sys.path.append(json_extract(_data['var'], 'PYTHON_3_PATH'))


from pywizlight import wizlight, PilotBuilder, discovery


#from dotenv import load_dotenv
#dotenv_path = Path('../../../.env')
#load_dotenv(dot_env_path=dotenv_path)


















async def hex_to_rgb(hexvalue):
    hexvalue = hexvalue.lstrip("-#")
    hexvalue = tuple(int(hexvalue[i:i+2], 16) for i in (0, 2, 4))
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

    if "-warm" in command:
        bulbs = await discovery.discover_lights(broadcast_space="192.168.1.255")
        for bulb in bulbs: light = await wizlight(bulb.ip).turn_on(PilotBuilder(warm_white = 255))

        


loop = asyncio.get_event_loop()
loop.run_until_complete(main())