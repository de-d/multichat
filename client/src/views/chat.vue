<script setup lang="ts">
import ChatIntro from "../components/chatWindow/ChatIntro.vue";
import ChatWindow from "../components/chatWindow/ChatWindow.vue";
import SideBar from "../components/sideBar/sideBar.vue";
import { useChatStore } from "../stores/chat";

const chat = useChatStore();
</script>


<template>
  <div class="flex flex-row rounded-[20px] shadow-[0_6px_50px_rgba(255,255,255,0.1)] bg-[#252525]">
    <SideBar />
    <template v-if="chat.activeChatId > 0">
      <ChatWindow />
    </template><template v-else>
      <ChatIntro />
    </template>
  </div>
</template>
