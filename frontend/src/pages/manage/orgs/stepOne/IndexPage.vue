<template>
  <div class="container">
    <div
      class="row items-center q-py-sm q-mb-lg justify-between"
      style="border-bottom: 1px solid #f2f2f2; border-top: 1px solid #f2f2f2"
    >
      <div class="col-xs-12" v-if="!selectedOrg">
        <div class="row justify-between items-center">
          <div class="flex q-gutter-sm items-center">
            <div>نمایش:</div>
            <q-btn
              outline
              dense
              class="q-px-sm q-py-none"
              label="همه موارد"
              color="info"
              @click="fetchList(null)"
            />
            <q-btn
              unelevated
              dense
              class="q-px-sm q-py-none"
              :label="manageOrgStatus.needs_edit.label"
              :color="manageOrgStatus.needs_edit.color"
              @click="fetchList('needs_edit')"
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
            @click="selectedOrg = null"
            icon-right="keyboard_backspace"
            label="بازگشت"
          />
        </div>
      </div>
    </div>

    <OrgsList
      v-if="!selectedOrg"
      @on-select-org="selectedOrg = $event"
      :list="list"
    />
    <ApproveOrgForm
      v-else
      :org="list.filter((item) => selectedOrg === item.id)[0]"
      @on-update-org="fetchList"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { manageOrgStatus } from "src/stores/states";
import { e2p } from "src/stores/helpers";
import axios from "axios";

import OrgsList from "./OrgsList.vue";
import ApproveOrgForm from "./ApproveOrgForm.vue";

import { apiUrl } from "src/stores/variables";
import { useUserStore } from "src/stores/users-store";
import { catchError } from "src/stores/action-helpers";

const userStore = useUserStore();

const selectedOrg = ref(null);
const list = ref([]);

const fetchList = async (status) => {
  selectedOrg.value = null;
  let url = `/manage/orgs/list`;
  if (status) url = url + `/${status}`;
  await axios
    .get(apiUrl + url, {
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

<style lang="sass" scoped></style>
