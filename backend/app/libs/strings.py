"""
libs.strings

By default, uses `en-gb.json` file inside the `strings` top-level folder.

If language changes, set `libs.strings.default_locale` and run `libs.strings.refresh()`.
"""
import json
import os

default_locale = "en-gb"
cached_strings = {}


def refresh():
    print("Refreshing...")
    global cached_strings
    print(os.getcwd())
    with open(f'./app/strings/{default_locale}.json') as f:
        cached_strings = json.load(f)


def gettext(name) -> str:
    return cached_strings[name]


refresh()
