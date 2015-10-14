import os
from fabric.api import local

s3_path = 's3://www.jrbotros.com/'
default_flags = '--acl public-read'


def deploy(name=None, flags=default_flags):
    if name is None:
        local(('aws s3 sync site/ {0} {1} --exclude *.pyc'
               '--exclude */.DS_Store --exclude *.css.map')
              .format(s3_path, flags))
    else:
        local('aws s3 cp {0} {1} {2}'
              .format(name, os.path.join(s3_path, name), flags))
