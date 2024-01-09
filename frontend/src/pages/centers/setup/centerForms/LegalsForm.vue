<template>
  <q-page class="q-px-sm" style="padding-bottom: 8rem">
    <q-form @submit="onSubmit" @reset="onReset" class="row q-pt-lg">
      <div class="col-12 q-mb-lg">
        <div class="row items-center">
          <div class="text-h5 text-grey-8 q-pl-lg">
            <span v-if="!isFormPrePopulated">ثبت</span>
            اطلاعات حقوقی
          </div>
        </div>
      </div>

      <div
        class="col-xs-12 col-md-2 flex q-pt-lg justify-center gt-sm"
        style="border-top: 1px solid #f2f2f2"
      >
        <div class="column">
          <div class="text-h6 text-grey-5">کلی</div>
          <div class="text-caption text-grey-5 q-mb-md">نام و نشان</div>
        </div>
      </div>

      <div
        class="col-xs-12 col-md-7 q-px-lg q-pt-lg rounded-borders"
        style="background: #fcfcfc"
      >
        <div class="lt-md">
          <div class="text-h6 text-grey-5">کلی</div>
          <div class="text-caption text-grey-5 q-mb-md">نام و نشان</div>
        </div>

        <div class="col-xs-12">
          <q-input
            outlined
            v-model="formData.firstName"
            label="نام"
            :readonly="isFormPrePopulated"
            lazy-rules
            :rules="[(val) => val && val.length > 0]"
          />
          <q-input
            outlined
            v-model="formData.lastName"
            label="نام خانوادگی"
            :readonly="isFormPrePopulated"
            lazy-rules
            :rules="[(val) => val && val.length > 0]"
          />
          <q-select
            class="q-mb-lg"
            outlined
            v-model="formData.gender"
            :options="['مرد', 'زن', 'غیره']"
            label="جنسیت"
            :readonly="isFormPrePopulated"
          />
          <q-input
            class="q-mb-lg q-mt-xl"
            outlined
            v-model="formData.rank"
            label="سمت (وضعیت)"
            hint="مدیر ..."
            :readonly="isFormPrePopulated"
          />
          <q-input
            dir="ltr"
            class="q-mb-lg q-mt-xl"
            outlined
            v-model="formData.phone"
            label="شماره موبایل"
            hint="0913xxxxxxx"
            :readonly="isFormPrePopulated"
          />
        </div>
      </div>

      <div class="col-3 gt-sm" />

      <div
        class="col-xs-12 col-md-2 flex q-pt-lg justify-center gt-sm"
        style="border-top: 1px solid #f2f2f2"
      >
        <div class="column">
          <div class="text-h6 text-grey-5">احراز هویت</div>
          <div class="text-caption text-grey-5 q-mb-md">
            <span v-if="!isFormPrePopulated"> بارگزاری </span>
            عکس پروفایل و تصویر مجوز
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-md-7 q-px-lg q-pt-lg rounded-borders">
        <div class="lt-md">
          <div class="text-h6 text-grey-5">احراز هویت</div>
          <div class="text-caption text-grey-5 q-mb-md">
            <span v-if="!isFormPrePopulated"> بارگزاری </span>
            عکس پروفایل و تصویر مجوز
          </div>
        </div>

        <div class="col-xs-12">
          <div class="row items-center">
            <div class="col-xs-12 col-md-6 q-pr-md">
              <div style="height: 23rem" v-if="isFormPrePopulated">
                <q-badge class="q-px-sm q-py-xs">عکس پروفایل</q-badge>
                <q-img
                  fit="contain"
                  style="max-height: 23rem; width: 23rem"
                  :src="fetchedPhotoUrl"
                />
              </div>

              <FilePicker
                v-else
                @on-file-selected="formData.photo = $event"
                icon="person_outline"
                label="انتخاب عکس"
              />
            </div>
            <div class="col-xs-12 col-md-6 q-pl-md">
              <div style="height: 23rem" v-if="isFormPrePopulated">
                <q-badge class="q-px-sm q-py-xs">تصویر مجوز</q-badge>
                <q-img
                  fit="contain"
                  style="max-height: 23rem; width: 23rem"
                  :src="fetchedCertPhotoUrl"
                />
              </div>
              <FilePicker
                v-else
                @on-file-selected="formData.certPhoto = $event"
                icon="badge"
                label="انتخاب تصویر مجوز"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="fixed-bottom q-pa-md row justify-between q-gutter-sm bg-slate"
      >
        <q-btn
          label="لیست اطلاعات ثبت شده"
          type="submit"
          color="primary"
          icon="history"
          flat
          outline
          :loading="pending"
          to="/center/legals"
        />
        <div v-if="!isFormPrePopulated">
          <q-btn
            label="ثبت اطلاعات حقوقی"
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
  </q-page>
</template>

<script>
import axios from "axios";
import { catchError } from "src/stores/action-helpers";
import { messages } from "src/stores/messages";
import { useUserStore } from "src/stores/users-store";
import { apiUrl } from "src/stores/variables";
import { notifError, notifPrimary } from "src/util/notify";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import FilePicker from "src/components/FilePicker.vue";
import { useQuasar } from "quasar";
import { watch } from "vue";

const initialState = {
  firstName: "",
  lastName: "",
  gender: null,
  rank: "",
  phone: "",
  photo: null,
  certPhoto: null,
};

export default {
  components: { FilePicker },
  setup() {
    const $q = useQuasar();

    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();

    const isFormPrePopulated = ref(false);
    const pending = ref(false);
    const formData = ref(initialState);

    const fetchedPhotoUrl = ref("");
    const fetchedCertPhotoUrl = ref("");

    const onReset = () => (formData.value = initialState);

    const onSubmit = async () => {
      if (
        !formData.value.firstName ||
        !formData.value.lastName ||
        !formData.value.gender ||
        !formData.value.rank ||
        !formData.value.phone ||
        !formData.value.photo ||
        !formData.value.certPhoto
      )
        return notifError(messages.emptyFields, "warning");

      const standardFormData = new FormData();
      Object.entries(formData.value).forEach(([k, v]) => {
        standardFormData.append(k, v);
      });

      pending.value = true;
      await axios
        .post(apiUrl + "/centers/legals/new", standardFormData, {
          headers: { token: userStore.t },
        })
        .then(
          (res) => {
            notifPrimary(messages.legalsAdded, "done");
            router.push({ name: "index" });
            onReset();
          },
          (error) => {
            pending.value = false;
            return catchError(error);
          }
        );
    };

    const fetchItem = async (id) => {
      $q.loading.show();
      await axios
        .get(apiUrl + `/centers/legals/${id}`, {
          headers: { token: userStore.t },
        })
        .then(
          (res) => {
            $q.loading.hide();
            if (res.data.item) {
              formData.value = res.data.item;
              fetchedPhotoUrl.value = `data:${res.data.item.photoType};base64,${res.data.item.photoBase64}`;
              fetchedCertPhotoUrl.value = `data:${res.data.item.certPhotoType};base64,${res.data.item.certPhotoBase64}`;
            }
          },
          (err) => {
            $q.loading.hide();
            return catchError(err);
          }
        );
    };

    watch(
      route,
      async () => {
        if (route.params.id) {
          isFormPrePopulated.value = true;
          fetchItem(route.params.id);
        }
      },
      { immediate: true }
    );

    return {
      isFormPrePopulated,
      pending,
      formData,

      fetchedPhotoUrl,
      fetchedCertPhotoUrl,

      onReset,
      onSubmit,
    };
  },
};
</script>

<style lang="sass" scoped></style>
