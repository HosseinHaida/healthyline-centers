<template>
  <q-page class="q-px-lg q-pt-lg q-pb-xl">
    <q-list bordered class="rounded-borders">
      <q-item-label header class="row justify-between">
        <div>لیست اطلاعات حقوقی ثبت شده</div>
        <div class="q-mr-md">تعداد: {{ e2p(list.length) }}</div>
      </q-item-label>

      <q-item
        :to="'/legals/' + item.id"
        clickable
        v-for="(item, i) in list"
        :key="i"
      >
        <q-item-section avatar top>
          <q-icon name="person_4" color="primary" size="34px" />
          <q-badge align="top" class="q-px-sm q-py-xs">
            {{ item.rank }}
          </q-badge>
        </q-item-section>

        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">
            {{ item.firstName }} {{ item.lastName }}
          </q-item-label>
          <div class="q-mt-sm text-caption text-grey-8">
            {{ item.phone }}
          </div>
        </q-item-section>

        <q-item-section center />

        <q-item-section side>
          {{ getDate(item.created_at) }}
        </q-item-section>

        <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn size="12px" flat dense round icon="more_vert" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="fixed-bottom q-pa-md row justify-between q-gutter-sm bg-slate">
      <q-btn
        label="ثبت اطلاعات حقوقی جدید"
        type="submit"
        color="primary"
        class="text-bold"
        to="/legals/new"
      />
    </div>
  </q-page>
</template>

<script setup>
import axios from "axios";
import { apiUrl } from "src/stores/variables";
import { onMounted, ref } from "vue";
import { useUserStore } from "src/stores/users-store";
import { catchError } from "src/stores/action-helpers";
import { useQuasar } from "quasar";
import { getDate } from "src/stores/helpers";
import { e2p } from "src/stores/helpers";

const $q = useQuasar();
const userStore = useUserStore();

const list = ref([]);

const fetchItems = async () => {
  $q.loading.show();
  await axios
    .get(apiUrl + "/centers/legals", {
      headers: { token: userStore.t },
    })
    .then(
      (res) => {
        if (res.data.list) list.value = res.data.list;
        $q.loading.hide();
      },
      (err) => {
        $q.loading.hide();
        catchError(err);
      }
    );
};

onMounted(() => {
  fetchItems();
});
</script>

<style lang="scss" scoped></style>
