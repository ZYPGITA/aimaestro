<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5">
          AiMaestro
        </a-typography-title>
        <icon-menu-fold
            v-if="!topMenu && appStore.device === 'mobile'"
            style="font-size: 22px; cursor: pointer"
            @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu"/>
    </div>
    <ul class="right-side">
      <li>
        <a-button size="mini" class="tech-button" @click="openViewAIAgent">AI Agent</a-button>
      </li>
      <li>
        <a-tooltip
            :content="
            theme === 'light'
              ? 'Click to switch to dark mode'
              : 'Click to switch to bright color mode'
          "
        >
          <a-button
              class="nav-btn"
              type="outline"
              :shape="'circle'"
              @click="handleToggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'"/>
              <icon-sun-fill v-else/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip
            :content="
            isFullscreen
              ? 'Click to exit full screen mode'
              : 'Click to switch to full screen mode'
          "
        >
          <a-button
              class="nav-btn"
              type="outline"
              :shape="'circle'"
              @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen"/>
              <icon-fullscreen v-else/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="click">
          <a-avatar
              :size="32"
              :style="{ marginRight: '8px', cursor: 'pointer', backgroundColor: '#14a9f8' }">
            {{ username }}
          </a-avatar>
          <template #content>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export/>
                <span>
                  Log Out
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, inject} from 'vue';
import {Message} from '@arco-design/web-vue';
import {useDark, useToggle, useFullscreen} from '@vueuse/core';
import {useAppStore, useUserStore} from '@/store';
import useUser from '@/hooks/user';
import Menu from '@/components/menu/index.vue';
import {useRouter} from "vue-router";

const appStore = useAppStore();
const userStore = useUserStore();
const {logout} = useUser();
const {isFullscreen, toggle: toggleFullScreen} = useFullscreen();
const router = useRouter();

const username = computed(() => {
  return userStore.username;
});

const theme = computed(() => {
  return appStore.theme;
});
const topMenu = computed(() => appStore.topMenu && appStore.menu);
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark: boolean) {
    // overridden default behavior
    appStore.toggleTheme(dark);
  },
});
const toggleTheme = useToggle(isDark);
const handleToggleTheme = () => {
  toggleTheme();
};
const setVisible = () => {
  appStore.updateSettings({globalSettings: true});
};
const refBtn = ref();
const triggerBtn = ref();
const setPopoverVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  refBtn.value.dispatchEvent(event);
};
const handleLogout = () => {
  logout();
};
const setDropDownVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  triggerBtn.value.dispatchEvent(event);
};
const switchRoles = async () => {
  const res = await userStore.switchRoles();
  Message.success(res as string);
};
const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;

const openViewAIAgent = () => {
  router.push({name: 'Home'});
}
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.center-side {
  flex: 1;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>

<style scoped>
.tech-button {
  --tech-blue: #00f3ff;
  --deep-blue: #0066ff;
  --neon-glow: rgba(0, 243, 255, 0.4);

  background: linear-gradient(
      135deg,
      var(--deep-blue) 0%,
      #080d3d 50%,
      var(--deep-blue) 100%
  );
  border: none;
  border-radius: 8px;
  color: var(--tech-blue);
  font-family: 'Segoe UI', system-ui;
  font-weight: 600;
  letter-spacing: 0.05em;
  position: relative;
  transition: all 0.3s ease;
  overflow: visible;

  box-shadow: 0 0 20px 5px rgba(0, 99, 255, 0.2),
  inset 0 0 12px rgba(0, 243, 255, 0.3);
}

.tech-button::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: linear-gradient(
      45deg,
      var(--tech-blue) 0%,
      rgba(0, 243, 255, 0) 50%,
      var(--tech-blue) 100%
  );
  border-radius: 12px;
  z-index: -1;
  filter: blur(8px);
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.tech-button:hover {
  transform: translateY(-1px);
  border-radius: 8px;
  box-shadow: 0 0 30px 8px rgba(0, 99, 255, 0.3),
  inset 0 0 15px rgba(0, 243, 255, 0.4);
}

.tech-button:hover::before {
  opacity: 0.6;
  filter: blur(10px);
}

.tech-button:active {
  transform: translateY(1px);
  box-shadow: 0 0 15px 3px rgba(0, 99, 255, 0.2),
  inset 0 0 8px rgba(0, 243, 255, 0.3);
}


@keyframes flow {
  0% {
    transform: rotate(0deg) translate(-25%, -25%);
  }
  100% {
    transform: rotate(360deg) translate(-25%, -25%);
  }
}
</style>