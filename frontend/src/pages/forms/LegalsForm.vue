<template>
  <q-page class="q-px-sm q-pt-lg q-pb-xl">
    <q-form @submit="onSubmit" @reset="onReset" class="row">
      <div class="q-px-md col-xs-12 col-sm-6">
        <q-input
          filled
          v-model="formData.firstName"
          label="نام"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
        <q-input
          filled
          v-model="formData.lastName"
          label="نام خانوادگی"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
        <q-input
          class="q-mb-lg"
          filled
          v-model="formData.gender"
          label="جنسیت"
          lazy-rules
        />
        <q-input
          class="q-mb-lg"
          filled
          v-model="formData.rank"
          label="سمت (وضعیت)"
          lazy-rules
        />
        <q-input
          dir="ltr"
          class="q-mb-lg"
          filled
          v-model="formData.phone"
          label="شماره موبایل"
          lazy-rules
        />
      </div>

      <div class="q-px-md col-xs-12 col-md-6">
        <div class="row">
          <div class="col-xs-12 col-md-6 q-pr-md">
            <ImagePicker
              @on-file-selected="formData.photo = $event"
              icon="person_outline"
              label="انتخاب عکس"
            />
          </div>

          <div class="col-xs-12 col-md-6 q-pl-md">
            <ImagePicker
              @on-file-selected="formData.certPhoto = $event"
              icon="badge"
              label="انتخاب تصویر مجوز"
            />
          </div>
        </div>
      </div>

      <div class="fixed-bottom q-pa-md row justify-between bg-slate">
        <q-btn
          label="نمایش تاریخچه"
          type="submit"
          color="primary"
          icon="history"
          outline
          :loading="pending"
        />
        <div>
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
import { useRouter } from "vue-router";
import ImagePicker from "src/components/ImagePicker.vue";

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
  components: { ImagePicker },
  setup() {
    const router = useRouter();
    const usersStore = useUserStore();

    const pending = ref(false);
    const formData = ref(initialState);

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
          headers: { token: usersStore.t },
        })
        .then(
          (res) => {
            notifPrimary(messages.legalsAdded, "done");
            router.push({ name: "index" });
          },
          (error) => {
            pending.value = false;
            return catchError(error);
          }
        );
    };
    return {
      pending,
      formData,

      onReset,
      onSubmit,
    };
  },
};
</script>

<style lang="sass" scoped></style>
