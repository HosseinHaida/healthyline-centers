<template>
  <q-page class="q-px-sm q-pt-lg" style="padding-bottom: 100px">
    <q-form @submit="onSubmit" @reset="onReset" class="row">
      <div class="q-px-md col-xs-12 col-md-6">
        <q-input
          filled
          v-model="formData.registrationName"
          label="نام ثبتی مرکز"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
        <q-input
          filled
          v-model="formData.brandName"
          label="نام برند"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
        <q-input
          dir="ltr"
          class="q-mb-lg"
          filled
          v-model="formData.website"
          label="وبسایت"
          lazy-rules
        />

        <q-input
          v-for="(phone, i) in formData.phoneEntries"
          :key="i"
          label="شماره تلفن مرکز"
          filled
          v-model="formData.phoneEntries[i]"
          type="number"
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
              />
              <q-btn
                v-if="formData.phoneEntries.length > 1"
                icon="remove"
                flat
                class="full-height"
                @click="formData.phoneEntries.splice(i, 1)"
              />
            </div>
          </template>
        </q-input>
      </div>

      <div class="q-px-md col-xs-12 col-md-6">
        <q-input
          filled
          v-model="formData.postalCode"
          type="number"
          label="کد پستی"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />
        <q-input
          filled
          v-model="formData.exactAddress"
          label="نشانی دقیق"
          lazy-rules
          :rules="[(val) => val && val.length > 0]"
        />

        <div
          class="full-width row items-center justify-center relative-position"
          style="background: lightyellow; height: 25rem"
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
import { notifPrimary } from "src/util/notify";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import L from "leaflet";

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
    const router = useRouter();
    const usersStore = useUserStore();

    const map = ref();
    const mapMarker = ref();
    const mapContainer = ref();
    const pending = ref(false);
    const formData = ref(initialState);

    const onReset = () => (formData.value = initialState);

    const onSubmit = async () => {
      pending.value = true;
      await axios
        .post(apiUrl + "/centers/initials/new", formData.value, {
          headers: { token: usersStore.t },
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
          map.value.setView(formData.value.gis, 13);
        });
      }
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
    });

    return {
      map,
      mapContainer,
      pending,
      formData,

      onReset,
      onSubmit,
      getCurrentLocation,
    };
  },
};
</script>

<style lang="scss" scoped></style>
