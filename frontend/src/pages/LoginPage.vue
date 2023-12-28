<template>
  <q-page class="row items-center q-mx-lg">
    <q-form class="col-12">
      <!-- <q-card-section class="row justify-center">
        <q-icon color="primary" name="person_outline" size="80px" />
      </q-card-section> -->

      <q-card-section class="q-pa-sm q-gutter-sm">
        <div class="row justify-center q-mb-lg">
          <div class="col-xs-12 col-sm-5">
            <div class="row justify-start q-gutter-sm">
              <q-btn
                :outline="which === 'signup'"
                color="primary"
                class="q-px-md q-py-none"
                label="ورود"
                @click="which = 'login'"
              />
              <q-btn
                :outline="which === 'login'"
                color="primary"
                class="q-px-md q-py-none"
                label="ثبت نام"
                @click="which = 'signup'"
              />
            </div>
          </div>
        </div>

        <div class="row justify-center">
          <div class="col-xs-12 col-sm-5">
            <q-input
              dense
              outlined
              input-class="text-center"
              class=""
              color="primary"
              v-model="username"
              :placeholder="
                which === 'login' ? 'شماره موبایل / نام کاربری' : 'شماره موبایل'
              "
            />
          </div>
        </div>

        <div class="row justify-center">
          <div class="col-xs-12 col-sm-5">
            <q-input
              dense
              outlined
              input-class="text-center"
              class=""
              color="primary"
              v-model="pass"
              type="password"
              placeholder="کلمه عبور"
            />
          </div>
        </div>

        <div v-if="which === 'signup'" class="row justify-center">
          <div class="col-xs-12 col-sm-5">
            <q-input
              dense
              outlined
              input-class="text-center"
              class=""
              color="primary"
              v-model="passConfirm"
              type="password"
              placeholder="تکرار کلمه عبور"
            />
          </div>
        </div>

        <div class="row justify-center">
          <div class="col-xs-12 col-sm-5">
            <q-btn
              v-if="which === 'login'"
              :loading="signinPending"
              color="primary"
              type="submit"
              @click.prevent="onSignin"
              class="full-width"
              label="ورود"
            />

            <q-btn
              v-if="which === 'signup'"
              :loading="signupPending"
              color="primary"
              type="submit"
              @click.prevent="onSignup"
              class="full-width"
              label="ثبت نام"
            />
          </div>
        </div>

        <div class="row justify-center q-mt-md">
          <div class="col-xs-12 col-sm-5 q-pr-none q-pl-xs">
            <div class="row">
              <div class="col-6">
                <div v-if="errMessage" class="text-caption text-light">
                  * {{ errMessage }}
                </div>
              </div>
              <div class="col-12">
                <div
                  v-if="which === 'login'"
                  class="row justify-end text-accent cursor-pointer"
                >
                  کلمه عبور را فراموش کردی؟
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-form>
  </q-page>
</template>

<script>
import { messages } from "src/stores/messages";
import { notifPrimary } from "src/util/notify";
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../stores/users-store";

export default {
  setup() {
    const userStore = useUserStore();

    const signinPending = computed(() => userStore.signinPending);
    const signupPending = computed(() => userStore.signupPending);

    const router = useRouter();
    const route = useRoute();

    const which = ref("signup");
    const username = ref("");
    const pass = ref("");
    const passConfirm = ref("");
    const errMessage = ref("");

    const isThereEmptyFields = () => {
      if (!username.value) errMessage.value = messages.pleaseEnterPhone;
      else if (!pass.value) errMessage.value = messages.pleaseEnterPassword;
      else if (which.value === "signup" && !passConfirm.value)
        errMessage.value = messages.pleaseEnterPasswordConfirm;

      if (
        !username.value ||
        !pass.value ||
        (which.value === "signup" && !passConfirm.value)
      ) {
        return true;
      }
    };

    const onSignin = async () => {
      if (isThereEmptyFields()) return;

      errMessage.value = null;

      await userStore
        .signin({
          username: username.value,
          password: pass.value,
        })
        .then(async ({ status, message }) => {
          if (status === "error") {
            errMessage.value = message;
          } else if (status === "success") {
            notifPrimary(message, "login");
            router.push({ name: "index" });
          }
        });
    };

    const onSignup = async () => {
      if (isThereEmptyFields()) return;

      errMessage.value = null;

      await userStore
        .signup({
          phone: username.value,
          password: pass.value,
          password_confirm: passConfirm.value,
        })
        .then(async ({ status, message }) => {
          if (status === "error") {
            errMessage.value = message;
          } else if (status === "success") {
            notifPrimary(message, "login");
            router.push({ name: "index" });
          }
        });
    };

    watch(
      route,
      () => {
        which.value =
          route.fullPath === "/login"
            ? "login"
            : route.fullPath === "/signup"
            ? "signup"
            : null;
      },
      { immediate: true }
    );

    return {
      which,
      username,
      pass,
      passConfirm,
      errMessage,
      isThereEmptyFields,
      signinPending,
      signupPending,
      onSignup,
      onSignin,
    };
  },
};
</script>

<style lang="sass" scoped>
.login-card
  height: 77vh
  max-width: 60dvw
  width: 85dvw
  min-height: 40vh
@media only screen and (max-width: 600px)
  .login-card
    max-width: 100dvw
</style>
