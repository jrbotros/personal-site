import os
from fabric.api import local

s3_path = "s3://www.josephbotros.com/"
default_flags = "--acl public-read"

def deploy(name=None, flags=default_flags):
    if name is None:
        local("aws s3 sync . {0} {1}".format(s3_path, flags))
    else:
        local("aws s3 cp {0} {1} {2}".format(name, os.path.join(s3_path, name), flags))