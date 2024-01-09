<template>
  <q-card class="q-pa-lg">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="row items-center">
            <div class="col text-h6">
              {{ props.org.name }}
              <q-icon
                size="sm"
                class="q-ml-sm"
                name="open_in_new"
                v-if="props.org.website"
              />
            </div>

            <div class="col-auto">
              {{ props.org.registration_name }}
              <q-icon name="handshake" size="md" color="grey-7 q-ml-sm" />
            </div>
          </div>

          <div class="row items-center q-mt-lg">
            <div class="col-xs-6 col-md-4 col-lg-2 text-subtitle1 text-grey-7">
              کد سازمان
            </div>
            <div class="col-auto text-subtitle2">
              {{ props.org.main_org_code }}
            </div>
          </div>

          <div class="row" v-if="props.org.other_codes.length > 0">
            <div class="col-xs-6 col-md-4 col-lg-2 text-subtitle1 text-grey-7">
              سایر کدها
            </div>
            <div class="col-auto text-subtitle2 text-italic column">
              <div v-for="(code, i) in props.org.other_codes" :key="i">
                {{ code }}
              </div>
            </div>
          </div>

          <q-separator class="q-my-sm" />

          <div class="row items-center">
            <div class="col-xs-6 col-md-4 col-lg-2 text-subtitle1 text-grey-7">
              ابعاد
            </div>
            <div class="col-auto text-subtitle2">
              {{ props.org.size }}
            </div>
          </div>

          <q-separator class="q-my-sm" />

          <div class="row">
            <div class="col-xs-6 col-md-4 col-lg-2 text-subtitle1 text-grey-7">
              مشخصات نماینده
            </div>
            <div class="col-auto text-subtitle2">
              <div>
                <q-icon
                  :name="props.org.login_gender == 'زن' ? 'woman' : 'person'"
                  color="grey-7"
                  class="q-mr-xs"
                />
                {{
                  props.org.login_first_name + " " + props.org.login_last_name
                }}
              </div>
              <div class="q-mt-xs">
                <q-icon name="phone" color="grey-7" class="q-mr-xs" />
                {{ props.org.login_phone }}
              </div>
            </div>
          </div>

          <q-separator class="q-my-sm" />

          <div class="row items-center">
            <span class="col-xs-6 col-md-4 col-lg-2 text-subtitle1 text-grey-7">
              مکان
            </span>
            <span class="text-subtitle2" dir="ltr">
              {{ props.org.province }} - {{ props.org.city }}
            </span>
          </div>

          <q-separator class="q-my-sm" />

          <div class="row items-center">
            <span class="col-xs-6 col-md-4 col-lg-2 text-subtitle1 text-grey-7">
              تاریخ ایجاد
            </span>
            <span class="text-subtitle2" dir="ltr">
              {{ getDate(props.org.created_at) }}
            </span>
          </div>

          <q-separator class="q-my-sm" />
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="text-h6 q-mb-md">ملاحضات</div>
      <div class="column">
        <div class="row">
          <q-list class="col-auto q-mb-sm">
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-checkbox
                  v-model="formData.hasContractsRecently"
                  color="positive"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  آیا در یکسال اخیر، قرارداد بین مرکز و سازمان بوده است؟
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section avatar top>
                <q-checkbox
                  v-model="formData.isCenterUnique"
                  color="positive"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >آیا فقط این مرکز با سازمان کار میکند؟</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-checkbox v-model="formData.isCodeSync" color="positive" />
              </q-item-section>
              <q-item-section>
                <q-item-label> یکسان سازی کدینگ انجام شد؟ </q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-checkbox
                  v-model="formData.isLoginInfoCorrect"
                  color="positive"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  اطلاعات تماس نماینده سازمان صحیح است؟
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-input
          v-model="formData.adminComment"
          outlined
          clearable
          type="textarea"
          label="توضیح اصلاحی"
        />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions class="row justify-end">
      <q-btn
        @click="onSubmit('approved')"
        label="ارسال به گام بعد"
        color="positive"
        :loading="formData.status === 'approved' && loading"
      />
      <q-btn
        @click="onSubmit('needs_edit')"
        :label="manageOrgStatus.needs_edit.label"
        :color="manageOrgStatus.needs_edit.color"
        :loading="formData.status === 'needs_edit' && loading"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { manageOrgStatus } from "src/stores/states";
import { getDate } from "src/stores/helpers";
import axios from "axios";
import { apiUrl } from "src/stores/variables";
import { notifPrimary } from "src/util/notify";
import { messages } from "src/stores/messages";
import { useUserStore } from "src/stores/users-store";
import { catchError } from "src/stores/action-helpers";

const userStore = useUserStore();

const props = defineProps(["org"]);
const emits = defineEmits(["on-update-org"]);

const loading = ref(false);
const formData = ref({
  org_id: props.org.id,
  hasContractsRecently: props.org.has_contracts_recently,
  isCenterUnique: props.org.is_center_unique,
  isCodeSync: props.org.is_code_sync,
  isLoginInfoCorrect: props.org.is_login_info_correct,
  adminComment: props.org.admin_comment,
  status: props.org.status,
});

const onSubmit = async (status) => {
  formData.value.status = status;
  loading.value = true;
  await axios
    .post(apiUrl + "/manage/orgs/status/update", formData.value, {
      headers: { token: userStore.t },
    })
    .then(
      (res) => notifPrimary(messages.orgUpdated, "save"),
      (err) => catchError(err)
    )
    .finally(() => {
      loading.value = false;
      emits("on-update-org");
    });
};
</script>

<style lang="scss" scoped></style>
