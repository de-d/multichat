<script setup lang="ts">
import ChatWindow from "../components/chatWindow/ChatWindow.vue";
import SideBar from "../components/sideBar/sideBar.vue";

</script>

<template>
  <div class="flex flex-row rounded-[20px] shadow-[0_6px_50px_rgba(255,255,255,0.1)] bg-[#252525]">
    <SideBar />
    <ChatWindow />
  </div>
</template>
