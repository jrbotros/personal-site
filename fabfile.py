from fabric.api import local

s3_path = "s3://www.josephbotros.com/"

def deploy():
    local("aws s3 sync . {0}".format(s3_path))