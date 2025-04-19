# -*- encoding: utf-8 -*-
import os
from aimaestro import *

from test_service import test_service1

ROOT_PATH = os.path.dirname(__file__)


class TestUtils:

    def __init__(self):
        config_path = os.path.join(ROOT_PATH, 'config.yaml')
        self.am = AiMaestro(config_file=config_path, current_dir=ROOT_PATH)

    def registry_services(self):
        return self.am.registry_services(
            services=[
                test_service1
            ]
        )

    def start(self):
        self.am.start_services()
        loguru().info("start services success")


if __name__ == '__main__':
    obj = TestUtils()
    obj.registry_services()
    obj.start()
    while True:
        pass
