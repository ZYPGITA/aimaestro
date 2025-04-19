# -*- encoding: utf-8 -*-
import os
import json
from aimaestro import *

ROOT_PATH = os.path.dirname(__file__)


class TestTask:

    def __init__(self):
        config_path = os.path.join(ROOT_PATH, 'config.yaml')
        self.am = AiMaestro(config_file=config_path, current_dir=ROOT_PATH)

    def test_selenium_automation(self):
        json_path = os.path.join(ROOT_PATH, 'test_data', 'web_automation', 'selenium_automation.json')
        databases_submit_task(
            queue='web_automation',
            message={
                'task_id': '1897558497262116864',  # Not required, automatically generate snowflake ID
                'primary_classification': 'selenium_automation',  # Required, Software Type
                'secondary_classification': 'test',  # Invalid parameter, station symbol
                'all_save_screenshot': True,  # Whether to save screenshots of each step
                'browser': 'chrome',  # browser type
                'wait_time': 30,  # Default waiting time
                'width': 2560,  # Browser Window width
                'height': 1600,  # Browser Window height
                'params': ['--lang=zh-CN.UTF-8', '--force-device-scale-factor=0.90'],  # Other web driver parameters
                'operations': json.load(open(json_path, 'r', encoding='utf-8'))  # testing procedure
            }
        )

    def test_management(self):
        self.am.start_management()

    def test_service(self):
        databases_submit_task(
            queue='test_service1',
            message={
                'task_id': '1897558497262116864',
                'primary_classification': 'test_service',
                'secondary_classification': 'test_service',
                'crate': time.time(),
            }
        )


if __name__ == '__main__':
    o = TestTask()
    # o.test_selenium_automation()
    # o.test_management()
    o.test_service()

    """
    sudo rabbitmqctl add_user scheduleAdmin scheduleAdminPassword
    sudo rabbitmqctl set_user_tags scheduleAdmin administrator &&
    sudo rabbitmqctl set_permissions -p "/" scheduleAdmin ".*" ".*" ".*"
    
    db.createUser({
      user: "scheduleAdmin",
      pwd: "scheduleAdminPassword",
      roles: [ { role: "root", db: "admin" } ]
    })
    
    db.changeUserPassword("scheduleAdmin", "scheduleAdminPassword")
    
    python setup.py sdist bdist_wheel
    twine upload dist/*
    """
