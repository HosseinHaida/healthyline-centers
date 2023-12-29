<template>
  <q-page class="q-px-sm q-pt-lg q-pb-xl">
    <q-form @submit="onSubmit" @reset="onReset" class="row">
      <div class="q-px-md col-xs-12 col-sm-6">
        <q-input
          filled
          v-model="formData.firstName"
          label="نام"
          :readonly="isFormPrePopulated"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
        <q-input
          filled
          v-model="formData.lastName"
          label="نام خانوادگی"
          :readonly="isFormPrePopulated"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
        <q-select
          class="q-mb-lg"
          filled
          v-model="formData.gender"
          :options="['مرد', 'زن', 'غیره']"
          label="جنسیت"
          :readonly="isFormPrePopulated"
        />
        <q-input
          class="q-mb-lg"
          filled
          v-model="formData.rank"
          label="سمت (وضعیت)"
          :readonly="isFormPrePopulated"
        />
        <q-input
          dir="ltr"
          class="q-mb-lg"
          filled
          v-model="formData.phone"
          label="شماره موبایل"
          :readonly="isFormPrePopulated"
        />
      </div>

      <div class="q-px-md col-xs-12 col-md-6">
        <div class="row">
          <div class="col-xs-12 col-md-6 q-pr-md">
            <q-img v-if="isFormPrePopulated" :src="fetchedPhotoUrl">
              <q-badge>عکس پروفایل</q-badge>
            </q-img>
            <FilePicker
              v-else
              @on-file-selected="formData.photo = $event"
              icon="person_outline"
              label="انتخاب عکس"
            />
          </div>

          <div class="col-xs-12 col-md-6 q-pl-md">
            <q-img v-if="isFormPrePopulated" :src="fetchedCertPhotoUrl">
              <q-badge>تصویر مجوز</q-badge>
            </q-img>
            <FilePicker
              v-else
              @on-file-selected="formData.certPhoto = $event"
              icon="badge"
              label="انتخاب تصویر مجوز"
            />
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
          to="/legals"
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
              // Create Photo URL
              let decodedPhoto = atob(res.data.item.photoBase64);
              let photoBlob = new Blob([decodedPhoto], {
                type: res.data.item.photoType,
              });
              let photoUrl = URL.createObjectURL(photoBlob);
              fetchedPhotoUrl.value = photoUrl;
              // Create Cert Photo URL
              let decodedCertPhoto = atob(res.data.item.certPhotoBase64);
              let certPhotoBlob = new Blob([decodedCertPhoto], {
                type: res.data.item.certPhotoType,
              });
              let certPhotoUrl = URL.createObjectURL(certPhotoBlob);
              fetchedCertPhotoUrl.value = certPhotoUrl;
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
