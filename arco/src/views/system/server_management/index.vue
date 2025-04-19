<template>
  <div class="container">
    <Breadcrumb items="System / ServerManagement"/>
    <a-card title="ServerManagement" class="general-card">
      <a-row>
        <a-col :flex="1">
          <a-form
              :label-col-props="{ span: 6 }"
              :model="queryData"
              :wrapper-col-props="{ span: 18 }"
              label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="service_ipaddr" hide-label>
                  <a-input v-model="queryData.service_ipaddr" placeholder="Please enter the query parameters">
                    <template #prefix>IP Addr</template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="service_name" hide-label>
                  <a-input v-model="queryData.service_name" placeholder="Please enter the query parameters">
                    <template #prefix>Service Name</template>
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider direction="vertical" style="height: 84px"/>
        <a-col :flex="'100px'" style="text-align: right">
          <a-space :size="18" direction="vertical">
            <a-button v-permission="['admin']" type="primary" @click="FuncSearchFor">
              <template #icon>
                <icon-search/>
              </template>
              Search
            </a-button>
            <a-button v-permission="['admin']" @click="FuncSearchReset">
              <template #icon>
                <icon-refresh/>
              </template>
              SearchReset
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0"/>
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-tooltip content="Refresh">
            <div class="action-icon" @click="FuncSearchReset">
              <icon-refresh size="18"/>
            </div>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
          row-key="id"
          :pagination="pagination"
          :columns="columns"
          :data="renderData"
          :bordered="false"
          size="small"
          @page-change="FuncOnPageChange">
        <template #operations="{ record }">
          <a-row>
            <a-col :span="8">
              <a-button
                  v-permission="['admin']"
                  type="outline" size="mini" status="success"
                  @click="FuncOpenUpdateMaxWorkerView(record)">
                ViewDetails
              </a-button>
            </a-col>
          </a-row>
        </template>
        <template #worker_run_process="{ record }">
          {{ record.worker_run_process.length }}
        </template>
      </a-table>

      <a-modal v-model:visible="ViewUpdateMaxWorker"
               v-if="ViewUpdateMaxWorker" width="85%" :on-before-ok="FuncUpdateMaxWorker">
        <template #title>UpdateMaxWorker</template>
        <a-input v-model:model-value="UpdateData.worker_max_process"></a-input>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import axios from "axios";

const queryData = reactive({
  service_ipaddr: '',
  service_name: '',
  page: 1,
  page_size: 10,
  total: 0
});

const pagination = reactive({
  ...queryData,
});


const columns = [
  {title: 'service_name', dataIndex: 'service_name'},
  {title: 'service_ipaddr', dataIndex: 'service_ipaddr'},
  {title: 'service_version', dataIndex: 'service_version'},
  {title: 'max_process', dataIndex: 'worker_max_process'},
  {title: 'run_process', dataIndex: 'worker_run_process', slotName: 'worker_run_process'},
  {title: 'operations', dataIndex: 'operations', slotName: 'operations', width: 200}
]

const renderData = ref([]);


const FuncSearchFor = () => {
  const url = `/api/service/list`;
  axios.get(url, {params: queryData}).then((res: any) => {
    renderData.value = res.data;
    pagination.total = res.total;
  })
}

const FuncSearchReset = () => {
  queryData.page = 1;
  queryData.total = 0;
  queryData.page_size = 10;

  queryData.service_ipaddr = '';
  queryData.service_name = '';
  FuncSearchFor();
}

const FuncOnPageChange = (page: number) => {
  queryData.page = page;
  FuncSearchFor();
};


const ViewUpdateMaxWorker = ref(false);
const UpdateData = ref({
  worker_name: '',
  worker_ipaddr: '',
  worker_max_process: 10
})
const FuncOpenUpdateMaxWorkerView = (record: any) => {
  UpdateData.value.worker_name = record.worker_name;
  UpdateData.value.worker_ipaddr = record.worker_ipaddr;
  ViewUpdateMaxWorker.value = true;
}

const FuncUpdateMaxWorker = () => {
  const url = `/api/service/update_max_process`;
  axios.post(url, UpdateData.value).then((res: any) => {
    ViewUpdateMaxWorker.value = false;
    FuncSearchFor();
  })
}

FuncSearchFor();
</script>

<script lang="ts">
export default {
  name: 'ServerManagement',
};
</script>

<style scoped>
.container {
  padding: 20px;
  height: 800px;
}
</style>