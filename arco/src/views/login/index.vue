<template>
  <div class="login-wrapper">
    <a-card class="login-container">
      <div class="login-header">
        <h1>Welcome to aimaestro</h1>
        <p>Login to continue accessing the management backend</p>
      </div>

      <a-form :model="LoginPayload" auto-label-width>
        <a-form-item
            field="username"
            :rules="[{ required: true, message: 'Username is required' }]"
        >
          <a-input
              v-model="LoginPayload.username"
              placeholder="Username"
              class="custom-input"
          >
            <template #prefix>
              <icon-user/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
            field="password"
            :rules="[{ required: true, message: 'Password is required' }]"
        >
          <a-input-password
              v-model="LoginPayload.password"
              placeholder="Password"
              class="custom-input"
          >
            <template #prefix>
              <icon-lock/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-button
            type="primary"
            html-type="submit"
            class="login-btn"
            :loading="loading"
            @click="handleSubmit"
        >
          Continue
        </a-button>

        <div class="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div class="social-login">
          <a-button shape="circle" class="social-icon">
            <template #icon>
              <icon-github/>
            </template>
          </a-button>
          <a-button shape="circle" class="social-icon">
            <template #icon>
              <icon-google/>
            </template>
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {
  IconUser,
  IconLock,
  IconGithub,
  IconGoogle
} from '@arco-design/web-vue/es/icon'


import {useRouter} from 'vue-router';
import {useUserStore} from '@/store';
import useLoading from '@/hooks/loading';
import {LoginData} from "@/api/user";
import {Message} from '@arco-design/web-vue'

const router = useRouter();
const errorMessage = ref('');
const userStore = useUserStore();
const {loading, setLoading} = useLoading();


const LoginPayload = ref<LoginData>({
  username: '',
  password: ''
})


const handleSubmit = async () => {
  setLoading(true);
  try {
    await userStore.login(LoginPayload.value);
    const {redirect, ...othersQuery} = router.currentRoute.value.query;
    router.push({
      name: (redirect as string) || 'home',
      query: {
        ...othersQuery,
      },
    });
    Message.success('Login successful!');
  } catch (err) {
    errorMessage.value = (err as Error).message;
  } finally {
    setLoading(false);
  }
}

</script>
<script lang="ts">
export default {
  name: 'Login',
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fa;
}

.login-container {
  width: 420px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-border);
  margin: 20px;
}

.login-container {
  width: 420px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-border);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 32px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 8px;
}

.login-header p {
  color: var(--color-text-3);
  font-size: 15px;
}

.custom-input {
  height: 48px;
  border-radius: 6px;
  padding-left: 40px;
}

:deep(.arco-input-prefix) {
  margin-right: 12px;
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 6px;
  margin-top: 15px;
  font-size: 16px;
}

.divider {
  margin: 30px 0;
  border-bottom: 1px solid var(--color-border);
  position: relative;
  text-align: center;
}

.divider span {
  position: relative;
  top: -10px;
  background: var(--color-bg-2);
  padding: 0 15px;
  color: var(--color-text-3);
  font-size: 13px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-2);
}

.social-icon:hover {
  background-color: var(--color-bg-3);
}
</style>


