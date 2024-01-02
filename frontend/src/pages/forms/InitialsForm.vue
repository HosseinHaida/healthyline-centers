<template>
  <q-page class="q-px-sm" style="padding-bottom: 8rem">
    <q-form @submit="onSubmit" @reset="onReset" class="row q-pt-lg">
      <div class="col-12 q-mb-lg">
        <div class="row items-center">
          <div class="text-h5 text-grey-8 q-pl-lg">
            <span v-if="!isFormPrePopulated">ثبت</span>
            اطلاعات مرکز
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
            filled
            v-model="formData.registrationName"
            label="نام ثبتی مرکز"
            :readonly="isFormPrePopulated"
            lazy-rules
            :rules="[(val) => val && val.length > 0]"
          />
          <q-input
            filled
            v-model="formData.brandName"
            label="نام برند"
            :readonly="isFormPrePopulated"
            lazy-rules
            :rules="[(val) => val && val.length > 0]"
          />
          <q-input
            dir="ltr"
            class="q-mb-lg"
            filled
            v-model="formData.website"
            :readonly="isFormPrePopulated"
            label="وبسایت"
            lazy-rules
          />
        </div>
      </div>

      <div class="col-3 gt-sm" />

      <div
        class="col-xs-12 col-md-2 flex q-pt-lg justify-center gt-sm"
        style="border-top: 1px solid #f2f2f2"
      >
        <div class="column">
          <div class="text-h6 text-grey-5">تماس</div>
          <div class="text-caption text-grey-5 q-mb-md">شماره تماس و آدرس</div>
        </div>
      </div>

      <div class="col-xs-12 col-md-7 q-pa-lg" style="background: #fcfcfc">
        <div class="col-xs-12">
          <div class="lt-md">
            <div class="text-h6 text-grey-5">تماس</div>
            <div class="text-caption text-grey-5 q-mb-md">
              شماره تماس و نشانی
            </div>
          </div>

          <div class="q-mb-md">
            <q-input
              dir="ltr"
              v-for="(phone, i) in formData.phoneEntries"
              :key="i"
              label="شماره تلفن مرکز"
              filled
              v-model="formData.phoneEntries[i]"
              type="number"
              :readonly="isFormPrePopulated"
              lazy-rules
              :rules="[(val) => val && val.length > 0]"
            >
              <template v-slot:after>
                <div class="full-height">
                  <q-btn
                    v-if="i === formData.phoneEntries.length - 1"
                    icon="add"
                    flat
                    class="full-height"
                    @click="formData.phoneEntries.push('')"
                    :disable="isFormPrePopulated"
                  />
                  <q-btn
                    v-if="formData.phoneEntries.length > 1"
                    icon="remove"
                    flat
                    class="full-height"
                    @click="formData.phoneEntries.splice(i, 1)"
                    :disable="isFormPrePopulated"
                  />
                </div>
              </template>
            </q-input>
          </div>
          <q-input
            filled
            v-model="formData.postalCode"
            type="number"
            label="کد پستی"
            :readonly="isFormPrePopulated"
            lazy-rules
            :rules="[(val) => val && val.length > 0]"
          />
          <q-input
            filled
            v-model="formData.exactAddress"
            label="نشانی دقیق"
            :readonly="isFormPrePopulated"
            lazy-rules
            :rules="[(val) => val && val.length > 0]"
          />
        </div>

        <div class="text-caption text-grey-7 q-pa-sm">
          موقعیت مکانی
          <span v-if="isFormPrePopulated">مشخص شده.</span>
          <span v-else> را مشخص کنید.</span>
        </div>

        <div
          class="full-width row items-center justify-center relative-position rounded-borders"
          style="height: 25rem"
          ref="mapContainer"
        >
          <q-btn
            @click.stop="getCurrentLocation"
            color="primary"
            style="z-index: 405"
            class="absolute-bottom-left q-ml-md q-mb-lg"
            icon="my_location"
            push
            dense
            round
          />
        </div>
      </div>

      <!-- <q-toggle v-model="formData.accept" label="I accept the license and terms" /> -->

      <div
        class="fixed-bottom q-pa-md row justify-end bg-slate"
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
    </q-form>
  </q-page>
</template>

<script>
import axios from "axios";
import { catchError } from "src/stores/action-helpers";
import { messages } from "src/stores/messages";
import { useUserStore } from "src/stores/users-store";
import { apiUrl } from "src/stores/variables";
import { notifPrimary, notifError } from "src/util/notify";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import L from "leaflet";
import { useQuasar } from "quasar";

const initialState = {
  registrationName: "",
  brandName: "",
  website: "",
  postalCode: null,
  exactAddress: "",
  phoneEntries: [null],
  gis: [0, 0],
};

export default {
  setup() {
    const $q = useQuasar();

    const router = useRouter();
    const userStore = useUserStore();

    const map = ref();
    const mapMarker = ref();
    const mapContainer = ref();

    const isFormPrePopulated = ref(false);
    const pending = ref(false);
    const formData = ref(initialState);

    const tryFetchingCenter = async () => {
      $q.loading.show();
      await axios
        .get(apiUrl + "/centers/initials", {
          headers: { token: userStore.t },
        })
        .then(
          (res) => {
            $q.loading.hide();
            if (res.data.center) {
              isFormPrePopulated.value = true;
              formData.value = res.data.center;
              setMapMarker(res.data.center.gis[0], res.data.center.gis[1]);
              map.value.setView(res.data.center.gis, 17);
            }
          },
          (err) => {
            $q.loading.hide();
            return catchError(err);
          }
        );
    };

    const onReset = () => (formData.value = initialState);
    const onSubmit = async () => {
      if (
        !formData.value.registrationName ||
        !formData.value.brandName ||
        !formData.value.postalCode ||
        !formData.value.exactAddress ||
        formData.value.phoneEntries.length < 1 ||
        (formData.value.gis[0] === 0 && formData.value.gis[1] === 0)
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
            router.push({ name: "index" });
          },
          (error) => {
            pending.value = false;
            return catchError(error);
          }
        );
    };

    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          formData.value.gis = [pos.coords.latitude, pos.coords.longitude];
          map.value.setView(formData.value.gis, 18);
        });
      } else notifPrimary(messages.geolocationNotSupported, "circle");
    };

    const setMapMarker = (lat, lng) => {
      formData.value.gis = [lat, lng];
      mapMarker.value.setLatLng([lat, lng]);
    };

    onMounted(() => {
      map.value = L.map(mapContainer.value).setView([32, 53], 5);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.value);
      mapMarker.value = L.marker([0, 0]).addTo(map.value);
      map.value.on("click", (e) => setMapMarker(e.latlng.lat, e.latlng.lng));

      tryFetchingCenter();
    });

    return {
      map,
      mapContainer,

      isFormPrePopulated,
      pending,
      formData,

      tryFetchingCenter,
      onReset,
      onSubmit,
      getCurrentLocation,
    };
  },
};
</script>

<style lang="scss" scoped></style>
