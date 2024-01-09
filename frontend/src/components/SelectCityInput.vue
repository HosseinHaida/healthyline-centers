<template>
  <q-select
    outlined
    :model-value="props.modelValue"
    @update:model-value="(value) => emits('update:modelValue', value)"
    use-input
    input-debounce="0"
    label="شهر"
    :disable="props.disable"
    :options="cityOptions"
    @filter="filterCities"
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
import { computed, ref } from "vue";
import { allCitiesIn } from "src/stores/cities";

const props = defineProps(["modelValue", "province", "disable"]);
const emits = defineEmits(["update:modelValue"]);

const allCitiesInSelectedProvince = computed(() => allCitiesIn(props.province));
const cityOptions = ref();

const filterCities = (val, update) => {
  if (val === "") {
    update(() => {
      cityOptions.value = allCitiesInSelectedProvince.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    cityOptions.value = allCitiesInSelectedProvince.value.filter(
      (v) => v.indexOf(needle) > -1
    );
  });
};
</script>

<style lang="scss" scoped></style>
