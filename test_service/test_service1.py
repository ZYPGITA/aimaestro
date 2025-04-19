# -*- encoding: utf-8 -*-
import traceback

from aimaestro.taskflux import *


class RpcFunction(ServiceConstructor):
    """
    Class Name Not modifiable, Define RPC functions
    """
    service_name = 'test_service1'

    def get_service_name(self):
        return {"service_name": self.service_name}


class WorkerFunction(WorkerConstructor):
    """
    Class Name Not modifiable, Work Code
    """

    worker_name = 'test_service1'

    def run(self, data):
        self.logger.info(f"worker_name: {self.worker_name} data: {data}")
