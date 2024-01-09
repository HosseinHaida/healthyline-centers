<template>
  <q-page class="q-pa-sm">
    <q-stepper
      flat
      v-model="step"
      header-nav
      ref="stepper"
      alternative-labels
      color="primary"
      animated
      active-icon="none"
    >
      <q-step :name="1" title="مراکز تخصصی طب کار" icon="grid_view">
        <CentersList @on-new-org="step = 2" :list="list" />
      </q-step>

      <q-step :name="2" title="ایجاد پنل مرکز جدید" icon="add">
        <CreateCenterForm @new-panel-created="fetchList" />
      </q-step>
    </q-stepper>

    <!-- <q-btn color="primary" outline @click="showForm = true">
      <div class="column items-center no-wrap">
        <q-icon left name="add" />
        <div class="text-center">ایجاد پنل مرکز</div>
      </div>
    </q-btn> -->
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

import { catchError } from "src/stores/action-helpers";
import { apiUrl } from "src/stores/variables";
import { useUserStore } from "src/stores/users-store";

import CreateCenterForm from "./CreateCenterForm.vue";
import CentersList from "./CentersList.vue";

const userStore = useUserStore();

const step = ref(1);
const list = ref([]);

const fetchList = async () => {
  step.value = 1;
  await axios
    .get(apiUrl + "/manage/centers/list", {
      headers: { token: userStore.t },
    })
    .then(
      (res) => {
        if (res.data.list) list.value = res.data.list;
      },
      (err) => {
        return catchError(err);
      }
    );
};

onMounted(() => {
  fetchList();
});
</script>

<style lang="scss" scoped></style>
