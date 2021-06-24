import os
import re
from typing import Union

from flask_uploads import UploadSet, IMAGES
from werkzeug.datastructures import FileStorage

IMAGE_SET = UploadSet("images", IMAGES)  # name and available extensions


def save_image(image: FileStorage, folder: str = None, name: str = None) -> str:
    """
    Takes FileStorage and saves it to a folder
    """
    return IMAGE_SET.save(image, folder, name)


def get_path(filename: str = None, folder: str = None) -> str:
    """
    Takes image name and folder and return full path
    :param filename: name of the file
    :param folder: path of the image
    """
    return IMAGE_SET.path(filename, folder)


def find_image_any_format(filename: str, folder: str) -> Union[str, None]:
    """
    Takes a filename and returns an image on any of the accepted format
    """
    for _format in IMAGES:
        image = f"{filename}.{_format}"
        image_path = IMAGE_SET.path(filename=filename, folder=folder)
        if os.path.isfile(image_path):
            return image_path
    return None


def _retrieve_filename(file: Union[str, FileStorage]) -> str:
    """
    Takes FileStorage and return the file name.
    Allow our functions to call this with both file names and FileStorage and always gets back a file name
    """
    if isinstance(file, FileStorage):
        return file.filename
    return file


def is_filename_save(file: Union[str, FileStorage]) -> bool:
    """
    Check our regex and return whether the string matches or not
    """
    filename = _retrieve_filename(file)
    allowed_format = "|".join(IMAGES)
    regex = f"^[a-zA-Z0-9][a-zA-Z0-9_()-\.]*\.({allowed_format})$"
    return re.match(regex, filename) is not None


def get_basename(file: Union[str, FileStorage]) -> str:
    """
    Return full name of image in the path
    get_basename('some/folder/image.jpg') returns 'image.jpg'

    :return: full name of image in the path
    """
    filename = _retrieve_filename(file)
    return os.path.split(filename)[1]


def get_extension(file: Union[str, FileStorage]) -> str:
    """
    Return file extension
    get_extension('image.jpg') returns '.jpg'
    :return: file extension
    """
    filename = _retrieve_filename(file)
    return os.path.splitext(filename)[1]
