<template>
  <div
    class="row items-center justify-center q-mb-lg cursor-pointer rounded-borders img-picker-placeholder relative-position text-primary text-weight-medium text-subtitle1"
    @click="onClickToPick()"
  >
    <q-btn
      round
      dense
      class="absolute-top-left"
      size="sm"
      style="top: -10px; right: -10px; z-index: 2"
      icon="clear"
      color="primary"
      @click.stop="onClear"
      v-if="selectedFile"
    />
    <span class="text-center" v-if="!localImgSrc">
      {{ label }} {{ selectedFile ? `(${selectedFile.name})` : "" }}
    </span>
    <q-img
      v-if="localImgSrc"
      :src="localImgSrc"
      fit="contain"
      style="max-height: 95%; max-width: 95%"
    />
    <q-icon
      :name="icon"
      size="lg"
      color="primary"
      class="absolute-bottom-right q-px-sm q-py-xs"
      style="z-index: 2"
    />
    <q-file
      v-model="model"
      :ref="(el) => (pickerRef = el)"
      class="hidden"
      filled
      :accept="acceptedTypes"
      @rejected="onImgRejected"
      @update:model-value="onFileSelected"
    />
  </div>
</template>

<script setup>
import { messages } from "src/stores/messages";
import { notifError } from "src/util/notify";
import { ref } from "vue";

const props = defineProps({
  icon: { default: "file" },
  label: { default: "انتخاب فایل" },
  acceptedTypes: { default: ".jpg, image/*" },
});
const emit = defineEmits(["onFileSelected"]);

const model = ref(null);
const pickerRef = ref(null);
const localImgSrc = ref(null);
const selectedFile = ref(null);

const onClickToPick = () => {
  pickerRef.value.pickFiles();
};

const onImgRejected = () => {
  notifError(messages.notAnImage);
};

const onFileSelected = (file) => {
  if (props["acceptedTypes"] === ".jpg, image/*") {
    localImgSrc.value = URL.createObjectURL(file);
    URL.revokeObjectURL(file);
  }

  selectedFile.value = file;
  emit("onFileSelected", file);
};

const onClear = () => {
  localImgSrc.value = null;
  selectedFile.value = null;
  emit("onFileSelected", null);
};
</script>

<style lang="sass" scoped>
.img-picker-placeholder
  height: 23rem
  background-color: white
  opacity: 0.8
  background-image: radial-gradient($primary 0.5px, white 0.5px)
  background-size: 5px 5px
</style>
