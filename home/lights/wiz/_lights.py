import asyncio
import sys
sys.path.append("C:\Python38\Lib\site-packages")

from pywizlight import wizlight, PilotBuilder, discovery

async def main():
    """Sample code to work with bulbs."""
    print(f"Testing Code for _lights.py")
    # Discover all bulbs in the network via broadcast datagram (UDP)
    # function takes the discovery object and returns a list with wizlight objects.
    bulbs = await discovery.discover_lights(broadcast_space="192.168.1.255")
    # Print the IP address of the bulb on index 0
    print(f"Bulb IP address: {bulbs[0].ip}")

    # Iterate over all returned bulbs
    for bulb in bulbs:
        print(bulb.__dict__)


loop = asyncio.get_event_loop()
loop.run_until_complete(main())