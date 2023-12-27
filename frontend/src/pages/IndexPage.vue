<template>
  <q-page class="container q-py-lg q-px-md">
    <div class="row">
      <div class="col-xs-12 col-md-6 col-lg-4 q-px-sm">
        <q-card class="my-card text-white">
          <q-card-section>
            <div class="text-h5">پیش ثبت‌نام مرکز تخصصی طب کار</div>
          </q-card-section>
          <q-card-section>
            <div class="row items-center">
              <p class="col q-pr-md">
                سامانه Healthyline بزرگترین و معتبرترین سامانه‌ی ثبت و انجام
                معاینات بدو استخدام و دوره‌ای در حوزه طب کار است. به ما
                بپیوندید.
              </p>
              <q-btn class="col-auto">
                راهنما
                <q-icon name="text_snippet" class="q-ml-sm" />
              </q-btn>
            </div>
          </q-card-section>
        </q-card>

        <div class="column q-pt-md">
          <div
            class="row q-gutter-sm justify-center q-mb-sm"
            v-for="(step, i) in preSignup"
            :key="i"
          >
            <q-btn
              :to="step.to"
              :size="step.type === 'hl' ? 'md' : 'lg'"
              round
              :color="step.type === 'center' ? 'positive' : 'primary'"
              push
              :style="{ 'margin-right': step.offset + 'px' }"
            >
              <q-tooltip v-if="step.tooltip"> {{ step.tooltip }}</q-tooltip>
              <q-icon v-if="step.type !== 'hl'" :name="step.icon" />
              <span class="text-bold">
                {{ step.type === "hl" ? "HL" : "" }}
              </span>
            </q-btn>

            <q-chat-message
              v-if="step.type === 'center'"
              class="q-pl-md"
              text-color="white"
              :text="[`${step.label}`]"
            />
          </div>
        </div>
      </div>
      <div class="col-6"></div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { preSignup } from "src/stores/steps";

export default defineComponent({
  name: "IndexPage",
  setup() {
    return {
      preSignup,
    };
  },
});
</script>

<style scoped lang="sass">
.my-card
  background: $positive
</style>
