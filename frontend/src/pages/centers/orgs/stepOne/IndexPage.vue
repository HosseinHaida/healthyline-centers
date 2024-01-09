<template>
  <div class="container">
    <div
      class="row items-center q-py-sm q-mb-lg justify-between"
      style="border-bottom: 1px solid #f2f2f2; border-top: 1px solid #f2f2f2"
    >
      <div class="col-xs-12" v-if="!showForm">
        <div class="row justify-between items-center">
          <div class="flex q-gutter-sm items-center">
            <div>نمایش:</div>
            <q-btn
              outline
              dense
              class="q-px-sm q-py-none"
              label="همه موارد"
              color="info"
            />

            <q-btn
              unelevated
              dense
              class="q-px-sm q-py-none"
              :label="orgStatus.pending.label"
              :color="orgStatus.pending.color"
            />
            <q-btn
              unelevated
              dense
              class="q-px-sm q-py-none"
              :label="orgStatus.needs_edit.label"
              :color="orgStatus.needs_edit.color"
            />
          </div>

          <div>
            تعداد درخواست‌ها
            <q-chip dense square>
              {{ e2p(list.length) }}
            </q-chip>
          </div>
        </div>
      </div>
      <div class="col-xs-12" v-else>
        <div class="row items-center justify-end">
          <q-btn
            flat
            dense
            class="q-px-sm"
            @click="showForm = false"
            icon-right="keyboard_backspace"
            label="بازگشت"
          />
        </div>
      </div>
    </div>

    <OrgsList v-if="!showForm" :list="list" @on-new-org="showForm = true" />
    <NewOrgForm @new-org-created="onNewOrgCreated" v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { orgStatus } from "src/stores/states";
import { e2p } from "src/stores/helpers";
import axios from "axios";

import NewOrgForm from "./NewOrgForm.vue";
import OrgsList from "./OrgsList.vue";

import { apiUrl } from "src/stores/variables";
import { useUserStore } from "src/stores/users-store";
import { catchError } from "src/stores/action-helpers";

const userStore = useUserStore();

const showForm = ref(false);

const list = ref([]);

const fetchList = async () => {
  await axios
    .get(apiUrl + "/centers/orgs/list", {
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

const onNewOrgCreated = () => {
  showForm.value = false;
  fetchList();
};

onMounted(() => {
  fetchList();
});
</script>

<style lang="sass" scoped></style>
