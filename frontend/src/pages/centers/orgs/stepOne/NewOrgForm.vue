<template>
  <q-form @submit="onSubmit" @reset="onReset" class="row q-pt-lg">
    <div class="col-xs-12 col-md-2 flex q-pt-lg q-pl-md gt-sm" />
    <div
      class="col-xs-12 col-md-8 q-px-lg q-pt-lg rounded-borders"
      style="background: #fcfcfc"
    >
      <div class="col-xs-12">
        <div class="row">
          <q-icon
            name="emergency"
            style="opacity: 0.5"
            class="col-auto q-mt-xs q-mr-md"
          />
          <p class="col">
            با ثبت این درخواست،تأیید می‌نمایم که معاینات سلامت شغلی سازمان معرفی
            شده در سال جاری بر عهده این مرکز بوده و قرارداد همکاری منهقد شده
            است. در صورت وجود هرگونه مغایرت، سامانه Healthy Line مسئولیتی در این
            خصوص نخواهد داشت و کلیه پیامدهای احتمالی بر هعده مدیریت مرکز تخصصی
            طب کار خواهد بود.
          </p>
        </div>
      </div>
    </div>

    <div class="col-2 gt-sm" />

    <div
      class="col-xs-12 col-md-2 flex q-pt-lg q-pl-md gt-sm"
      style="border-top: 1px solid #f2f2f2"
    />

    <div class="col-xs-12 col-md-8 q-px-lg q-pt-lg" style="background: #fcfcfc">
      <div class="col-xs-12">
        <q-input
          outlined
          v-model="formData.orgCode"
          label="کد سازمان در سامانه"
          :readonly="isFormPrePopulated"
          class="q-mb-md"
          hint="در صورتی که برای این سازمان، یک یا چند کد دیگر پرونده تشکیل شده است، سایر این کدها را در ادامه ثبت نمایید"
        />

        <q-expansion-item
          dense-toggle
          expand-separator
          label="ثبت کدهای دیگر"
          class="q-mb-lg"
          header-class="bg-grey-2"
        >
          <q-card>
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm text-grey-7">
                تیم پشتیبانی سامانه، همه پرونده‌ها با سایر کدهای نادرست را به کد
                صحیح منتقل خواهد کرد. لطفاً به دو نکته توجه فرمایید:
                <ul>
                  <li>
                    کدهای نادرست را به دقت ثبت نمایید. در صورت انتقال پرونده‌ها،
                    این فرایند قابل بازگشت نیست.
                  </li>
                  <li>
                    از این پس، صرفاً با کد صحیح سازمان پرونده جدید تشکیل شود.
                  </li>
                </ul>
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                v-for="(code, i) in formData.otherCodes"
                :key="i"
                label="کد دیگر سازمان"
                outlined
                v-model="formData.otherCodes[i]"
                :readonly="isFormPrePopulated"
                class="q-mb-lg col-12"
              >
                <template v-slot:after>
                  <div class="full-height">
                    <q-btn
                      v-if="i === formData.otherCodes.length - 1"
                      icon="add"
                      flat
                      class="full-height"
                      @click="formData.otherCodes.push('')"
                      :disable="isFormPrePopulated"
                    />
                    <q-btn
                      v-if="formData.otherCodes.length > 1"
                      icon="remove"
                      flat
                      class="full-height"
                      @click="formData.otherCodes.splice(i, 1)"
                      :disable="isFormPrePopulated"
                    />
                  </div>
                </template>
              </q-input>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-input
          outlined
          v-model="formData.name"
          label="نام سازمان ثبت شده در سازمان"
          :readonly="isFormPrePopulated"
          class="q-mb-lg"
          hint="در صورتی که نام سازمان نیاز به ویرایش دارد، نام صحیح آن را ثبت نمایید."
        />

        <q-select
          class="q-mb-lg"
          outlined
          v-model="formData.size"
          :options="[
            'کمتر از ۵۰ نفر',
            '۵۰ تا ۲۰۰ نفر',
            '۲۰۰ تا ۵۰۰ نفر',
            '۵۰۰ تا ۱۰۰۰ نفر',
            'بیشتر از ۱۰۰۰ نفر',
          ]"
          label="تعداد پرسنل سازمان"
          :readonly="isFormPrePopulated"
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
        <div class="text-h6 text-grey-5">نماینده</div>
        <div class="text-caption text-grey-5 q-mb-md">
          اطلاعات نماینده سازمان
        </div>
      </div>
    </div>

    <div class="col-xs-12 col-md-8 q-pa-lg" style="background: #fcfcfc">
      <div class="lt-md">
        <div class="text-h6 text-grey-5">نماینده</div>
        <div class="text-caption text-grey-5 q-mb-md">
          اطلاعات نماینده سازمان
        </div>
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
          label="ثبت سازمان"
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
const emits = defineEmits(["new-org-created"]);

const initialState = {
  orgCode: "",
  name: "",
  otherCodes: [""],
  size: "",
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
const formData = ref({ ...initialState });

const onReset = () => {
  Object.assign(formData.value, initialState);
  formData.value.otherCodes = [null];
};
const onSubmit = async () => {
  if (
    !formData.value.orgCode ||
    !formData.value.name ||
    !formData.value.size ||
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
    .post(apiUrl + "/centers/orgs/new", formData.value, {
      headers: { token: userStore.t },
    })
    .then(
      (res) => {
        notifPrimary(messages.orgInitialized, "done");
        pending.value = false;
        emits("new-org-created");
      },
      (error) => {
        pending.value = false;
        return catchError(error);
      }
    );
};

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
