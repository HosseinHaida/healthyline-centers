<template>
  <q-select
    outlined
    :model-value="props.modelValue"
    @update:model-value="(value) => emits('update:modelValue', value)"
    use-input
    input-debounce="0"
    label="استان"
    :options="provinceOptions"
    @filter="filterProvinces"
    behavior="menu"
    clearable
    :rules="[(val) => val && val.length > 0]"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> نتیجه‌ای یافت نشد </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref } from "vue";
import { allProvinces } from "src/stores/cities";

const props = defineProps(["modelValue"]);
const emits = defineEmits(["update:modelValue"]);

const provinceOptions = ref(allProvinces);

const filterProvinces = (val, update) => {
  if (val === "") {
    update(() => {
      provinceOptions.value = allProvinces;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    provinceOptions.value = allProvinces.filter((v) => v.indexOf(needle) > -1);
  });
};
</script>

<style lang="scss" scoped></style>
