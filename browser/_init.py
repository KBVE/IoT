# Core Imports
import sys
import asyncio
import os
import json

# Additional Imports
import multiprocessing
from multiprocessing import Process, freeze_support
import threading
from pathlib import Path

# Extra Imports
from random import randint

# KBVE Imports
sys.path.append(os.path.abspath(os.path.join('..')))
import kbve

# Selenium Imports
from selenium import webdriver
import undetected_chromedriver as uc
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC



async def api_data(driver, userid):
    driver.get("https://kbve.com/c/api/users/" + userid)
    await asyncio.sleep(1)
    _api_data = json.loads(driver.find_element_by_tag_name('body').text)
    return _api_data

async def click_xPATH(driver, url, stringXPATH):
    driver.get(url)
    await asyncio.sleep(1)
    element = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, stringXPATH))
        )
    element.click()
    await asyncio.sleep(1)




async def main():    
    options = uc.ChromeOptions()
    options.add_argument('--no-first-run')
    driver = uc.Chrome(options=options)
    driver.get("https://kbve.com/c/")
    await asyncio.sleep(1)
    await click_xPATH(driver, 'https://kbve.com/c/', '//a[contains(@class, "DiscussionListItem-main") and contains(., "Selenium")]')
    
    
    




if __name__ == "__main__":
    freeze_support()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())




