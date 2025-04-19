<template>
  <div class="container">
    <Breadcrumb items="System / TaskManagement"/>
    <a-card title="TaskManagement" class="general-card">
      <a-row>
        <a-col :flex="1">
          <a-form
              :label-col-props="{ span: 6 }"
              :model="queryData"
              :wrapper-col-props="{ span: 18 }"
              label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="task_id" hide-label>
                  <a-input v-model="queryData.task_id" placeholder="Please enter the query parameters">
                    <template #prefix>Task ID</template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="queue_name" hide-label>
                  <a-input v-model="queryData.queue_name" placeholder="Please enter the query parameters">
                    <template #prefix>Queue Name</template>
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="weight" hide-label>
                  <a-input v-model="queryData.weight" placeholder="Please enter the query parameters">
                    <template #prefix>Weight</template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" hide-label>
                  <a-input v-model="queryData.status" placeholder="Please enter the query parameters">
                    <template #prefix>Status</template>
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
          <a-space>
            <a-button
                v-permission="['admin']"
                type="outline" size="mini" status="danger"
                @click="FuncTaskStop(record)">
              Stop
            </a-button>
            <a-button
                v-permission="['admin']"
                type="text" size="mini" status="warning"
                @click="FuncTaskRetry(record)">Retry
            </a-button>
          </a-space>
        </template>
      </a-table>

    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import axios from "axios";
import {Message} from "@arco-design/web-vue";

const queryData = reactive({
  task_id: '',
  status: '',
  weight: '',
  queue_name: '',
  page: 1,
  page_size: 10,
  total: 0
});

const pagination = reactive({
  ...queryData,
});


const columns = [
  {title: 'task_id', dataIndex: 'task_id'},
  {title: 'status', dataIndex: 'status'},
  {title: 'weight', dataIndex: 'weight'},
  {title: 'queue_name', dataIndex: 'queue_name'},
  {title: 'worker_pid', dataIndex: 'worker_pid'},
  {title: 'create_time', dataIndex: 'create_time'},
  {title: 'end_time', dataIndex: 'end_time'},
  {title: 'operations', dataIndex: 'operations', slotName: 'operations', width: 200}
]

const renderData = ref([]);


const FuncSearchFor = () => {
  const url = `/api/task/list`;
  axios.get(url, {params: queryData}).then((res: any) => {
    renderData.value = res.data;
    pagination.total = res.total;
  })
}

const FuncSearchReset = () => {
  queryData.page = 1;
  queryData.page_size = 10;
  queryData.total = 0;
  queryData.task_id = '';
  queryData.status = '';
  queryData.weight = '';
  queryData.queue_name = '';
  FuncSearchFor();
}

const FuncOnPageChange = (page: number) => {
  queryData.page = page;
  FuncSearchFor();
};


const FuncTaskStop = (record: any) => {
  const url = `/api/task/stop`;
  axios.post(url, {task_id: record.task_id}).then((res: any) => {
    Message.success(res.msg);
    FuncSearchFor();
  })
}

const FuncTaskRetry = (record: any) => {
  const url = `/api/task/retry`;
  axios.post(url, {task_id: record.task_id}).then((res: any) => {
    Message.success(res.msg);
    FuncSearchFor();
  })
}

FuncSearchFor();
</script>

<script lang="ts">
export default {
  name: 'TaskManagement',
};
</script>

<style scoped>
.container {
  padding: 20px;
  height: 800px;
}
</style>