<template>
  <q-page class="q-px-sm" style="padding-bottom: 8rem">
    <q-form @submit="onSubmit" @reset="onReset" class="row q-pt-lg">
      <div class="col-12 q-mb-lg">
        <div class="row items-center">
          <div class="text-h5 text-grey-8 q-pl-lg">
            <!-- <span v-if="!isFormPrePopulated">ثبت</span> -->
            <!-- <span v-else>اطلاعات</span> -->
            ثبت مجوز
          </div>
        </div>
      </div>

      <div
        class="col-xs-12 col-md-2 flex q-pt-lg justify-center gt-sm"
        style="border-top: 1px solid #f2f2f2"
      />

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
            v-model="formData.name"
            label="نام مجوز"
            lazy-rules
            :rules="[(val) => val && val.length > 0]"
          />
          <q-input
            outlined
            v-model="formData.type"
            label="نوع مجوز"
            lazy-rules
            :rules="[(val) => val && val.length > 0]"
          />
        </div>
      </div>

      <div class="col-3 gt-sm" />

      <div
        class="col-xs-12 col-md-2 flex q-pt-lg justify-center gt-sm"
        style="border-top: 1px solid #f2f2f2"
      >
        <div class="column">
          <div class="text-h6 text-grey-5">عکس مدرک</div>
          <div class="text-caption text-grey-5 q-mb-md">
            <!-- <span v-if="!isFormPrePopulated"> بارگزاری </span> -->
            تصویر مجوز و تاریخ اعتبار
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-md-7 q-px-lg q-pt-lg rounded-borders">
        <div class="lt-md">
          <div class="text-h6 text-grey-5">عکس مدرک</div>
          <div class="text-caption text-grey-5 q-mb-md">
            <!-- <span v-if="!isFormPrePopulated"> بارگزاری </span> -->
            تصویر مجوز و تاریخ اعتبار
          </div>
        </div>

        <div class="col-xs-12">
          <div class="row justify-center">
            <div class="col-xs-12 col col-md-6">
              <!-- <div style="height: 23rem" v-if="isFormPrePopulated">
                <q-badge class="q-px-sm q-py-xs">تصویر مجوز</q-badge>
                <q-img
                  fit="contain"
                  style="max-height: 23rem; width: 23rem"
                  :src="fetchedCertPhotoUrl"
                />
              </div> -->
              <FilePicker
                @on-file-selected="formData.photo = $event"
                icon="card_membership"
                label="انتخاب تصویر مجوز"
              />
            </div>
            <div class="col-xs-12 col-md-auto q-pl-md">
              <q-date
                v-model="formData.expires_at"
                default-view="Years"
                style="height: 23rem"
                subtitle="تاریخ انقضا"
                calendar="persian"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="fixed-bottom q-pa-md row justify-between bg-slate">
        <q-btn
          label="نمایش مجوزها"
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
