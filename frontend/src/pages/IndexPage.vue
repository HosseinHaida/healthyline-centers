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
          <div class="q-mb-sm" v-for="(step, i) in progress" :key="i">
            <ProgressStep :step="step" />
          </div>
        </div>
      </div>
      <div class="col-6"></div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { progressRaw } from "src/stores/steps";
import axios from "axios";
import { apiUrl } from "src/stores/variables";
import { useUserStore } from "src/stores/users-store";
import { catchError } from "src/stores/action-helpers";
import ProgressStep from "src/components/ProgressStep.vue";

export default defineComponent({
  name: "IndexPage",
  components: { ProgressStep },
  setup() {
    const usersStore = useUserStore();

    const progress = ref(progressRaw);
    const pending = ref(false);

    onMounted(() => {
      pending.value = true;
      axios
        .get(apiUrl + "/main/progress", {
          headers: { token: usersStore.t },
        })
        .then(
          (res) => {
            // integrate real user progress with the progressRaw
            if (res.data?.progress) {
              Object.entries(res.data?.progress).forEach(([k, v]) => {
                progress.value[k] = { ...progress.value[k], ...v };
              });
            }
            pending.value = false;
          },
          (error) => catchError(error)
        );
    });
    return {
      progress,
    };
  },
});
</script>

<style scoped lang="sass">
.my-card
  background: $positive
</style>
