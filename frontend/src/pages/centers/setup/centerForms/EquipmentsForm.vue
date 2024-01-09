<template>
  <q-page class="q-px-sm q-pt-lg q-pb-xl">
    <q-form @submit="onSubmit" @reset="onReset" class="row">
      <div class="q-px-md col-xs-12 col-sm-6">
        <q-input
          filled
          v-model="formData.name"
          label="نام"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
      </div>
      <div class="q-px-md col-xs-12 col-sm-6">
        <q-input
          filled
          v-model="formData.brand"
          label="برند تجهیز"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
      </div>
      <div class="q-px-md col-xs-12 col-sm-6">
        <q-input
          class="q-mb-lg"
          filled
          v-model="formData.usage"
          label="کاربری"
        />
      </div>

      <div class="q-px-md col-xs-12 col-md-6">
        <div class="row">
          <div class="col-xs-12 col-md-6 q-pr-md">
            <FilePicker
              @on-file-selected="formData.catalog = $event"
              icon="person_outline"
              label="انتخاب کاتالوگ دستگاه"
              accepted-types=".jpg, .pdf, image/*"
            />
          </div>

          <div class="col-xs-12 col-md-6 q-pl-md">
            <FilePicker
              @on-file-selected="formData.photo = $event"
              icon="text_snippet"
              label="انتخاب عکس محیطی"
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
import FilePicker from "src/components/FilePicker.vue";

const initialState = {
  name: "",
  brand: "",
  usage: "",
  catalog: null,
  photo: null,
};

export default {
  components: { FilePicker },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    const pending = ref(false);
    const formData = ref(initialState);

    const onReset = () => (formData.value = initialState);

    const onSubmit = async () => {
      if (
        !formData.value.name ||
        !formData.value.brand ||
        !formData.value.usage ||
        !formData.value.catalog ||
        !formData.value.photo
      )
        return notifError(messages.emptyFields, "warning");

      const standardFormData = new FormData();
      Object.entries(formData.value).forEach(([k, v]) => {
        standardFormData.append(k, v);
      });

      pending.value = true;
      await axios
        .post(apiUrl + "/centers/equipments/new", standardFormData, {
          headers: { token: userStore.t },
        })
        .then(
          (res) => {
            notifPrimary(messages.equipmentAdded, "done");
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
