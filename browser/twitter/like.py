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

async def main():
    driver = await _init.browser_()
    await _init.c_X(driver, 'https://kbve.com/c/', '//a[contains(@class, "DiscussionListItem-main") and contains(., "Selenium")]')



if __name__ == "__main__":
    freeze_support()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())