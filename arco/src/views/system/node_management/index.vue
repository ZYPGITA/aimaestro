<template>
  <div class="container">
    <Breadcrumb items="System / NodeManagement"/>
    <a-card title="NodeManagement" class="general-card">
      <a-row>
        <a-col :flex="1">
          <a-form
              :label-col-props="{ span: 6 }"
              :model="queryData"
              :wrapper-col-props="{ span: 18 }"
              label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="ipaddr" hide-label>
                  <a-input v-model="queryData.ipaddr" placeholder="Please enter the query parameters">
                    <template #prefix>IP Addr</template>
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
                  @click="FuncViewDetails(record)">
                ViewDetails
              </a-button>
            </a-col>
          </a-row>
        </template>
      </a-table>

      <a-modal v-model:visible="ViewDetails" v-if="ViewDetails" width="85%" :footer="false">
        <template #title>NodeDetails</template>
        <pre>{{ formattedJson }}</pre>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import axios from "axios";

const queryData = reactive({
  ipaddr: '',
  page: 1,
  page_size: 10,
  total: 0
});

const pagination = reactive({
  ...queryData,
});


const columns = [
  {title: 'ipaddr', dataIndex: 'ipaddr'},
  {title: 'name', dataIndex: 'platform.name'},
  {title: 'release', dataIndex: 'platform.release'},
  {title: 'version', dataIndex: 'platform.version'},
  {title: 'machine', dataIndex: 'platform.machine'},
  {title: 'processor', dataIndex: 'platform.processor'},
  {title: 'operations', dataIndex: 'operations', slotName: 'operations', width: 200}
]

const renderData = ref([]);


const FuncSearchFor = () => {
  const url = `/api/node/list`;
  axios.get(url, {params: queryData}).then((res: any) => {
    renderData.value = res.data;
    pagination.total = res.total;
  })
}

const FuncSearchReset = () => {
  queryData.page = 1;
  queryData.page_size = 10;
  queryData.total = 0;
  queryData.ipaddr = '';
  FuncSearchFor();
}

const FuncOnPageChange = (page: number) => {
  queryData.page = page;
  FuncSearchFor();
};


const ViewDetails = ref(false);
const formattedJson = ref();
const FuncViewDetails = (record: any) => {
  formattedJson.value = JSON.stringify(record, null, 2);
  ViewDetails.value = true;
}

FuncSearchFor();
</script>

<script lang="ts">
export default {
  name: 'SystemNodeManagement',
};
</script>

<style scoped>
.container {
  padding: 20px;
  height: 800px;
}
</style>