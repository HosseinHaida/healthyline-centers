<template>
  <q-page class="q-pa-md">
    <q-stepper
      flat
      v-model="step"
      header-nav
      ref="stepper"
      alternative-labels
      color="primary"
      active-icon="none"
      animated
    >
      <q-step :name="1" title="تأیید مشخصات سازمان" prefix="1">
        <OrgsStepOne />
      </q-step>

      <q-step :name="2" title="تأیید پرداخت" prefix="2"> محتوا ۲</q-step>

      <q-step :name="3" title="تأیید معرفی‌نامه" prefix="3"> محتوا ۳</q-step>
      <q-step :name="4" title="تحویل پنل سازمانی" prefix="4"> محتوا ۴</q-step>

      <q-step :name="5" title="تأیید معرفی‌نامه" prefix="5">
        محتوا ۵

        <!-- <q-stepper-navigation>
          <q-btn color="primary" label="Finish" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation> -->
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script setup>
import OrgsStepOne from "./stepOne/IndexPage.vue";

import { ref } from "vue";

const step = ref(1);
</script>

<style lang="scss" scoped></style>
