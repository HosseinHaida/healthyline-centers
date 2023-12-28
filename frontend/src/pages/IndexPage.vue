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
            v-for="(step, i) in progress"
            :key="i"
          >
            <div
              class="flex items-center"
              :style="{ 'margin-right': step.offset + 'px' }"
            >
              <q-icon
                v-if="step.isNext"
                size="md"
                color="primary"
                name="chevron_left"
              />
              <q-icon
                v-if="step.type === 'hl'"
                :name="complete ? 'done_all' : 'more_horiz'"
                size="sm"
                color="primary"
                class="q-mr-sm"
              />
              <q-btn
                :to="step.to"
                :size="step.type === 'hl' ? 'md' : 'lg'"
                round
                :disable="!step.complete && !step.isNext"
                :color="
                  !step.complete && !step.isNext && step.type !== 'hl'
                    ? 'grey'
                    : step.type === 'center'
                    ? 'positive'
                    : 'primary'
                "
                push
              >
                <q-tooltip v-if="step.tooltip"> {{ step.tooltip }}</q-tooltip>
                <q-icon v-if="step.type !== 'hl'" :name="step.icon" />
                <span class="text-bold">
                  {{ step.type === "hl" ? "HL" : "" }}
                </span>
              </q-btn>
            </div>

            <q-chat-message
              v-if="step.type === 'center'"
              class="q-pl-sm"
              text-color="initial"
              bg-color="green-1"
            >
              <div>
                <div>
                  {{ step.label }}
                </div>
                <div>
                  <q-icon
                    name="done"
                    size="xs"
                    class="q-mt-xs"
                    color="positive"
                    v-if="step.complete"
                  />
                </div>
              </div>
            </q-chat-message>
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

export default defineComponent({
  name: "IndexPage",
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
