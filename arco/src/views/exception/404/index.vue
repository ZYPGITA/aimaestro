<template>
  <div class="container">
    <Breadcrumb items="exception / 404"/>
    <div class="content">
      <a-result
          class="result"
          status="404"
          subtitle="The resource does not exist"
      >
      </a-result>
      <div class="operation-row">
        <a-button key="back" type="primary">
          Back
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router';

const router = useRouter();
const back = () => {
  // warning： Go to the node that has the permission
  router.push({name: 'Welcome'});
};
</script>

<script lang="ts">
export default {
  name: '404',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  height: calc(100% - 40px);

  :deep(.content) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    background-color: var(--color-bg-1);
    border-radius: 4px;
  }
}
</style>
