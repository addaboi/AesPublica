import os
basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'mysql://eow:eow@localhost/evecalc_dev?charset=utf8'
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'migrations')
SQLALCHEMY_TRACK_MODIFICATIONS = False

WTF_CSRF_ENABLED = True
SECRET_KEY = 'replace with env variable'