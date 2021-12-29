# Imports
import asyncio
import sys


from pywizlight import wizlight, PilotBuilder, discovery

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