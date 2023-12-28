<template>
  <div class="row q-gutter-sm justify-center">
    <div
      class="flex items-center"
      :style="{ 'margin-right': step.offset + 'px' }"
    >
      <q-icon
        v-if="step.isNext"
        size="md"
        color="primary"
        name="chevron_left"
      />
      <q-icon
        v-if="step.type === 'hl'"
        :name="step.complete ? 'done_all' : step.isNext ? 'schedule' : ''"
        size="sm"
        color="primary"
        class="q-mr-sm"
      />
      <q-btn
        :to="step.to"
        :size="step.type === 'hl' ? 'md' : 'lg'"
        round
        :disable="!step.complete && !step.isNext"
        :color="
          !step.complete && !step.isNext
            ? 'grey'
            : step.type === 'center'
            ? 'positive'
            : 'primary'
        "
        push
      >
        <q-tooltip v-if="step.tooltip"> {{ step.tooltip }}</q-tooltip>
        <q-icon v-if="step.type !== 'hl'" :name="step.icon" />
        <span class="text-bold">
          {{ step.type === "hl" ? "HL" : "" }}
        </span>
      </q-btn>
    </div>

    <q-chat-message
      v-if="step.type === 'center'"
      class="q-pl-sm"
      text-color="initial"
      bg-color="green-1"
    >
      <div>
        <div :class="!step.isNext ? 'light-dimmed' : ''">
          {{ step.label }}
        </div>
        <div>
          <q-icon
            name="done"
            size="xs"
            class="q-mt-xs"
            color="positive"
            v-if="step.complete"
          />
        </div>
      </div>
    </q-chat-message>
  </div>
</template>

<script setup>
const props = defineProps(["step"]);
</script>

<style lang="scss" scoped></style>
