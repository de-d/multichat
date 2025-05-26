import { defineStore } from "pinia";
import { ref } from "vue";

export const useChatStore = defineStore("chat", () => {
  const activeChatId = ref<number>(0);
  const activeChatterAvatar = ref<string>("");
  const activeChatterName = ref<string>("");
  const activeChatterStatus = ref<boolean>(false);

  const setActiveChatId = (chatId: number) => {
    activeChatId.value = chatId;
  };

  const setActiveChatterAvatar = (avatar: string) => {
    activeChatterAvatar.value = avatar;
  };

  const setActiveChatterName = (name: string) => {
    activeChatterName.value = name;
  };

  const setActiveChatterStatus = (status: boolean) => {
    activeChatterStatus.value = status;
  };

  return {
    activeChatId,
    setActiveChatId,
    activeChatterAvatar,
    setActiveChatterAvatar,
    activeChatterName,
    setActiveChatterName,
    activeChatterStatus,
    setActiveChatterStatus,
  };
});
