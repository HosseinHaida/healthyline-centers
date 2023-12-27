<template>
  <router-view />
</template>

<script>
import { defineComponent, onBeforeMount } from "vue";
import { notifError } from "./util/notify";
import { useUserStore } from "./stores/users-store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "App",
  setup() {
    const router = useRouter();
    const usersStore = useUserStore();

    onBeforeMount(async () => {
      await usersStore.fetchUserData().then(({ status, message }) => {
        if (status === "error") {
          notifError(message, "warning");
          usersStore.logout();
          router.push({ name: "login" });
        }
      });
    });
  },
});
</script>
