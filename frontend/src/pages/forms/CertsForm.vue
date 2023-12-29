<template>
  <q-page class="q-px-sm q-pt-lg q-pb-xl">
    <q-form @submit="onSubmit" @reset="onReset" class="row">
      <div class="q-px-md col-xs-12 col-sm-6">
        <q-input
          filled
          v-model="formData.name"
          label="نام مجوز"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
      </div>

      <div class="q-px-md col-xs-12 col-sm-6">
        <q-input
          filled
          v-model="formData.type"
          label="نوع مجوز"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
      </div>

      <div class="q-px-md col-xs-12 col-md-6">
        <FilePicker
          @on-file-selected="formData.photo = $event"
          icon="card_membership"
          label="انتخاب تصویر مجوز"
        />
      </div>

      <div class="q-px-md col-xs-12 col-md-6">
        <q-date
          v-model="formData.expires_at"
          default-view="Years"
          style="height: 23rem"
          subtitle="تاریخ انقضا"
          calendar="persian"
        />
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
            label="ثبت اطلاعات مجوز"
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

export default {
  components: { FilePicker },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    const pending = ref(false);
    const formData = ref({
      name: "",
      type: "",
      photo: null,
      expires_at: null,
    });

    const onReset = () => {
      formData.value = {
        name: "",
        type: "",
        photo: null,
        expires_at: null,
      };
    };

    const onSubmit = async () => {
      if (
        !formData.value.name ||
        !formData.value.type ||
        !formData.value.photo ||
        !formData.value.expires_at
      )
        return notifError(messages.emptyFields, "warning");

      const standardFormData = new FormData();
      Object.entries(formData.value).forEach(([k, v]) => {
        standardFormData.append(k, v);
      });

      pending.value = true;
      await axios
        .post(apiUrl + "/centers/certs/new", standardFormData, {
          headers: { token: userStore.t },
        })
        .then(
          (res) => {
            notifPrimary(messages.certsAdded, "done");
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
