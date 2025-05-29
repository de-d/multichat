<script setup lang="ts">
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover'
import CustomButton from './customButton.vue';
import messageIcon from '../assets/message.svg';
import { ScrollArea } from '../components/ui/scroll-area'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <CustomButton label="Новый чат" color="#28d545" :icon="messageIcon" />
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="text-lg font-medium leading-none">
            Новый чат
          </h4>
          <p class="text-sm text-muted-foreground">
            Выберите, кому хотели бы написать
          </p>
        </div>
        <div class="grid gap-2">
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="name">Ник</Label>
            <Input id="name" type="text" class="col-span-2 h-8" placeholder="Ник собеседника" />
          </div>
          <ScrollArea class="h-[200px] w-[290px] rounded-md border border-[#d1d1d1] p-4">

          </ScrollArea>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>