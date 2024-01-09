<template>
  <q-form @submit="onSubmit" @reset="onReset" class="row q-pt-lg">
    <div class="col-xs-12 col-md-2 flex q-pt-lg q-pl-md gt-sm" />
    <div
      class="col-xs-12 col-md-8 q-px-lg q-pt-lg rounded-borders"
      style="background: #fcfcfc"
    >
      <div class="col-xs-12">
        <q-input
          outlined
          v-model="formData.registrationName"
          label="نام مرکز"
          :readonly="isFormPrePopulated"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
      </div>
    </div>

    <div class="col-2 gt-sm" />

    <div
      class="col-xs-12 col-md-2 flex q-pt-lg q-pl-md gt-sm"
      style="border-top: 1px solid #f2f2f2"
    >
      <div class="column">
        <div class="text-h6 text-grey-5">موقعیت</div>
        <div class="text-caption text-grey-5 q-mb-md">اطلاعات جغرافیایی</div>
      </div>
    </div>

    <div class="col-xs-12 col-md-8 q-px-lg q-pt-lg" style="background: #fcfcfc">
      <div class="col-xs-12">
        <div class="lt-md">
          <div class="text-h6 text-grey-5">موقعیت</div>
          <div class="text-caption text-grey-5 q-mb-md">اطلاعات جغرافیایی</div>
        </div>
        <SelectProvinceInput v-model="formData.province" />
        <SelectCityInput
          v-model="formData.city"
          :province="formData.province"
          :disable="!formData.province"
        />
      </div>
    </div>

    <div class="col-2 gt-sm" />

    <div
      class="col-xs-12 col-md-2 flex q-pt-lg q-pl-md gt-sm"
      style="border-top: 1px solid #f2f2f2"
    >
      <div class="column">
        <div class="text-h6 text-grey-5">مدیر</div>
        <div class="text-caption text-grey-5 q-mb-md">اطلاعات مدیر</div>
      </div>
    </div>

    <div class="col-xs-12 col-md-8 q-pa-lg" style="background: #fcfcfc">
      <div class="lt-md">
        <div class="text-h6 text-grey-5">مدیر</div>
        <div class="text-caption text-grey-5 q-mb-md">اطلاعات مدیر</div>
      </div>
      <div class="q-mb-md">
        <q-input
          outlined
          v-model="formData.loginFirstName"
          label="نام"
          :readonly="isFormPrePopulated"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
        <q-input
          outlined
          v-model="formData.loginLastName"
          label="نام خانوادگی"
          :readonly="isFormPrePopulated"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
        <q-select
          class="q-mb-lg"
          outlined
          v-model="formData.loginGender"
          :options="['مرد', 'زن', 'غیره']"
          label="جنسیت"
          :readonly="isFormPrePopulated"
        />
        <q-input
          dir="ltr"
          label="شماره موبایل"
          outlined
          v-model="formData.loginPhone"
          type="number"
          :readonly="isFormPrePopulated"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
      </div>
    </div>

    <div class="col-2 gt-sm" />
    <div class="col-2 gt-sm" />

    <!-- <q-toggle v-model="formData.accept" label="I accept the license and terms" /> -->
    <div class="col-xs-12 col-md-8" style="background: #fcfcfc">
      <div
        class="q-pa-md row justify-end"
        style="z-index: 400"
        v-if="!isFormPrePopulated"
      >
        <q-btn
          label="ثبت مرکز"
          type="submit"
          color="primary"
          class="text-bold"
          :loading="pending"
        />
        <q-btn
          label="پاکسازی"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import axios from "axios";
import { catchError } from "src/stores/action-helpers";
import { messages } from "src/stores/messages";
import { useUserStore } from "src/stores/users-store";
import { apiUrl } from "src/stores/variables";
import { notifPrimary, notifError } from "src/util/notify";
import { onMounted, ref } from "vue";

import SelectCityInput from "src/components/SelectCityInput.vue";
import SelectProvinceInput from "src/components/SelectProvinceInput.vue";

// import { useQuasar } from "quasar";
const emits = defineEmits(["new-panel-created"]);

const initialState = {
  registrationName: "",
  province: "",
  city: "",
  loginFirstName: "",
  loginLastName: "",
  loginGender: null,
  loginPhone: null,
};

// const $q = useQuasar();
const userStore = useUserStore();

const isFormPrePopulated = ref(false);
const pending = ref(false);
const formData = ref(initialState);

const onReset = () => (formData.value = initialState);
const onSubmit = async () => {
  if (
    !formData.value.registrationName ||
    !formData.value.province ||
    !formData.value.city ||
    !formData.value.loginFirstName ||
    !formData.value.loginLastName ||
    !formData.value.loginGender ||
    !formData.value.loginPhone
  )
    return notifError(messages.emptyFields, "warning");

  pending.value = true;
  await axios
    .post(apiUrl + "/centers/initials/new", formData.value, {
      headers: { token: userStore.t },
    })
    .then(
      (res) => {
        notifPrimary(messages.centerInitialized, "done");
        pending.value = false;
        emits("new-panel-created");
      },
      (error) => {
        pending.value = false;
        return catchError(error);
      }
    );
};

// const tryFetchingCenter = async () => {
//   $q.loading.show();
//   await axios
//     .get(apiUrl + "/centers/initials", {
//       headers: { token: userStore.t },
//     })
//     .then(
//       (res) => {
//         $q.loading.hide();
//         if (res.data.center) {
//           isFormPrePopulated.value = true;
//           formData.value = res.data.center;
//           setMapMarker(res.data.center.gis[0], res.data.center.gis[1]);
//           map.value.setView(res.data.center.gis, 17);
//         }
//       },
//       (err) => {
//         $q.loading.hide();
//         return catchError(err);
//       }
//     );
// };

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
