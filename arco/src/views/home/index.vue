<template>
  <div class="container">
    <a-card class="general-card">
      <template #title>
        <span style="font-weight: bold">Hello, I am AiMaestro</span>
      </template>
      <a-row :gutter="24">
        <a-col :span="4">
          <div class="history-panel">
            <a-row>
              <a-button @click="NewChat" class="new-chat-btn">New Chat</a-button>
            </a-row>
            <a-row style="height: 15px"></a-row>
            <a-row style="color: #000000" class="history-title">
              Historical Dialogue
            </a-row>
            <a-row style="height: 15px"></a-row>
            <a-row
                v-for="item in HistoricalDialogue"
                :key="item.dialogue_id"
                class="history-item"
                :class="{ 'active': SelectedDialogue.dialogue_id === item.dialogue_id }"
                @click="GetDialogueMessage(item)">
              <span class="history-title">{{ item.title }}</span>
              <a-button
                  size="mini"
                  type="text"
                  @click.stop="DeleteDialogue(item)"
                  class="delete-btn">
                <icon-delete/>
              </a-button>
            </a-row>
          </div>
        </a-col>
        <a-col :span="20" class="chat-panel">
          <div class="chat-container">

            <div class="message-area" id="messageContainer">
              <div
                  v-for="(item, index) in SelectedDialogueMessage"
                  :key="index"
                  class="message-group">
                <div v-if="item.user_message" class="message-bubble user-message">
                  <div class="message-header">
                    <icon-user class="avatar"/>
                    <span class="time">{{ formatTime(item.create_time) }}</span>
                  </div>
                  <div class="message-content user-content">
                    {{ item.user_message }}
                  </div>
                </div>

                <div v-if="item.chatbot_message" class="message-bubble bot-message">
                  <div class="message-header">
                    <icon-robot class="avatar"/>
                    <span class="time">{{ formatTime(item.update_time) }}</span>
                  </div>
                  <div class="message-content bot-content"
                       v-html="renderMarkdown(item.chatbot_reasoner + '\n' + item.chatbot_message)"/>
                </div>
              </div>
            </div>
            <a-divider></a-divider>

            <div class="input-area">
              <div class="input-container">
                <a-textarea
                    v-model="InputMessage"
                    placeholder="Type your message here..."
                    class="chat-input"
                    :auto-size="{ minRows: 1, maxRows: 4 }"/>
                <a-row style="height: 3px"></a-row>
                <a-row :gutter="24" justify="end">
                  <a-col :span="4">
                    <a-space>
                      <a-button
                          class="model-btn"
                          :type="isR1Selected ? 'outline' : 'dashed'"
                          size="small"
                          @click="toggleR1Model">
                        <template #icon>
                          <icon-relation/>
                        </template>
                        <span>DeepThink (R1)</span>
                      </a-button>
                      <a-button
                          type="primary"
                          shape="circle"
                          size="small"
                          class="send-btn"
                          :disabled="SendBtnDisabled"
                          @click="SendMessage">
                        <template #icon>
                          <icon-send/>
                        </template>
                      </a-button>
                    </a-space>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>


<script lang="ts" setup>
import {nextTick, ref} from 'vue';
import axios from "axios";
import {getToken} from "@/utils/auth";
import {Message} from "@arco-design/web-vue";

import HlJs from 'highlight.js';
import 'highlight.js/styles/github.css';
import {marked} from 'marked';
import DOMPurify from 'dompurify';

/**
 * Markdown Config
 * */
marked.setOptions({
  breaks: true,
  // @ts-ignore
  highlight: (code) => HlJs.highlightAuto(code).value
});


const renderMarkdown = (text: string) => {
  // @ts-ignore
  return DOMPurify.sanitize(marked.parse(text));
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString();
}

interface FmtHistoricalDialogue {
  dialogue_id: string;
  username: string;
  title: string;
}

interface FmtDialogueMessage {
  dialogue_id: string;
  message_id: string;
  username: string;
  user_message: string;
  chatbot_message: string;
  chatbot_reasoner: string;
  create_time: string;
  update_time: string;
}

const SendBtnDisabled = ref(false);

const HistoricalDialogue = ref<FmtHistoricalDialogue[]>([]);
const SelectedDialogueMessage = ref<FmtDialogueMessage[]>([])
const SelectedDialogue = ref<FmtHistoricalDialogue>({
  dialogue_id: '',
  username: '',
  title: '',
});

const NewChat = () => {
  HistoricalDialogue.value.push({
    dialogue_id: '',
    username: '',
    title: 'New Chat',
  })
}

const scrollToBottom = async () => {
  await nextTick();
  const container = document.getElementById('messageContainer');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

const GetDialogueMessage = (item: any) => {
  const url = `/api/aiagent/dialogue_message?dialogue_id=${item.dialogue_id}`;
  SelectedDialogue.value = item;
  axios.get(url).then((res: any) => {
    SelectedDialogueMessage.value = res.data;
    scrollToBottom();
  })
}


interface ResponseJson {
  type: string;
  msg: string;
  data: {
    reasoning_content?: string;
    chatbot_message?: string;
    title?: string;
    dialogue_id?: string;
    update_time?: string;
    create_time?: string;
  };
}

const SelectedModel = ref<'deepseek-chat' | 'deepseek-reasoner'>('deepseek-chat');

const SelectR1Model = () => {
  console.log('SelectR1Model 1 == ', SelectedModel.value);

  if (SelectedModel.value === 'deepseek-chat') {
    SelectedModel.value = 'deepseek-reasoner';
  } else {
    SelectedModel.value = 'deepseek-chat';
  }
  console.log('SelectR1Model 2 == ', SelectedModel.value);
}

const isR1Selected = ref(false);

const toggleR1Model = () => {
  isR1Selected.value = !isR1Selected.value;
  SelectR1Model();
};


const initWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';

  const ip = window.location.host.split(':')[0];

  const ws = new WebSocket(`${protocol}${ip}:15673/ai_dialogue`);

  ws.onopen = () => {
    const wsJson = {
      "token": getToken(),
      "dialogue_id": SelectedDialogue.value.dialogue_id,
      "user_message": InputMessage.value,
      "model": SelectedModel.value,
    }
    console.log('Send wsJson == ', wsJson);
    ws.send(JSON.stringify(wsJson));
    InputMessage.value = '';
  };

  ws.onmessage = (event: any) => {
    const ResponseData: any = event.data;
    const wsJson: ResponseJson = JSON.parse(ResponseData);

    console.log('Receive wsJson == ', wsJson);

    const {type: messageType, data} = wsJson;

    if (messageType === 'dialogueInit') {
      const {title, dialogue_id: dialogueId} = data;
      const item = HistoricalDialogue.value[HistoricalDialogue.value.length - 1]

      // @ts-ignore
      item.title = title;
      // @ts-ignore
      item.dialogue_id = dialogueId;
      SelectedDialogue.value = item;
    }

    if (messageType === 'chatbotMessage') {
      const {
        chatbot_message: chatbotMessage,
        reasoning_content: reasoningContent,
        update_time: updateTime,
        create_time: createTime,
      } = data;
      const item = SelectedDialogueMessage.value[SelectedDialogueMessage.value.length - 1]

      // @ts-ignore
      item.update_time = updateTime;
      // @ts-ignore
      item.create_time = createTime
      // @ts-ignore
      item.chatbot_message = chatbotMessage;
      // @ts-ignore
      item.chatbot_reasoner = reasoningContent;
      SendBtnDisabled.value = false;
      scrollToBottom();
    }
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
    SendBtnDisabled.value = false;
  };
};

const InputMessage = ref('');
const SendMessage = () => {
  SendBtnDisabled.value = true;
  if (SelectedDialogue.value.dialogue_id === '') {
    NewChat();
  }

  const tempMessage: any = {
    dialogue_id: SelectedDialogue.value.dialogue_id,
    username: '',
    user_message: InputMessage.value,
    chatbot_message: '',
    chatbot_reasoner: 'thinking about it',
    create_time: '',
    update_time: '',
  }
  SelectedDialogueMessage.value.push(tempMessage);
  scrollToBottom();
  initWebSocket();
}

const GetHistoricalDialogue = () => {
  const url = '/api/aiagent/dialogues';
  axios.get(url).then((res) => {
    HistoricalDialogue.value = res.data;
  })
}

const DeleteDialogue = (item: any) => {
  const url = `/api/aiagent/dialogues?dialogue_id=${item.dialogue_id}`;
  axios.delete(url).then((res: any) => {
    Message.success(res.msg);
    GetHistoricalDialogue();
  })
}

GetHistoricalDialogue();

</script>

<script lang="ts">
export default {
  name: 'Home',
};
</script>

<style scoped>
.container {
  padding: 20px;
  height: 800px;
}

.history-panel {
  padding: 16px;
  border-right: 1px solid var(--color-border);
}

.new-chat-btn {
  width: 100%;
  margin-bottom: 16px;
}

.history-title {
  color: var(--color-text-2);
  font-weight: 500;
  margin-bottom: 12px;
}

.history-item {
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  background-color: var(--color-bg-3);
}

.history-item.active {
  background-color: var(--color-primary-light-2);
  font-weight: 500;
  border-left: 4px solid var(--color-primary-light-2);
}

.delete-btn {
  color: red;
  padding: 0;
  margin-left: auto;
}

.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.message-area {
  height: 630px;
  padding: 20px;
  overflow-y: auto;
  background: var(--color-bg-2);
}

.message-group {
  margin-bottom: 24px;
}

.message-bubble {
  max-width: 75%;
  padding: 16px 20px;
  border-radius: 16px;
  margin: 8px 0;
  position: relative;
}

.user-message {
  margin-left: auto;
  background: var(--color-primary-light-1);
  border: 1px solid var(--color-primary-light-3);
}

.bot-message {
  margin-right: auto;
  background: var(--color-bg-3);
  border: 1px solid var(--color-border);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--color-text-3);
}

.avatar {
  font-size: 16px;
}

.message-content {
  line-height: 1.6;
  word-break: break-word;
}

.user-content {
  color: #000000;
  white-space: pre-wrap;
  word-break: break-word;
}

.bot-content {
  color: var(--color-text-1);
}

.message-content ::v-deep pre {
  background: var(--color-bg-4);
  padding: 16px;
  border-radius: 12px;
  overflow-x: auto;
  margin: 12px 0;
}

.message-content ::v-deep code {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
}

.message-content ::v-deep ul {
  padding-left: 24px;
}

.time {
  margin-left: auto;
  color: var(--color-text-3);
}

</style>