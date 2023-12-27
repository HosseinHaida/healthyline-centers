<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar class="justify-between">
        <div>
          <q-menu>
            <div class="row no-wrap bg-primary">
              <div v-if="user && user.email" class="column">
                <q-chip
                  color="light"
                  class="q-ma-none text-primary shadow-3 g-rounded-6"
                  square
                  style="min-width: 200px"
                >
                  <div class="full-width text-center font-medium">
                    {{ "(:" }} {{ user.username ? user.username : user.email }}
                    {{ "@" }}
                  </div>
                </q-chip>

                <q-list dense padding class="rounded-borders text-light">
                  <q-item
                    active-class="text-light"
                    to="/panel"
                    clickable
                    v-ripple
                  >
                    <q-item-section>
                      <div class="row items-center font-regular text-white">
                        <q-icon
                          size="xs"
                          class="q-mr-sm"
                          name="person_outline"
                        />
                        پنل کاربری
                      </div>
                    </q-item-section>
                  </q-item>

                  <q-item
                    @click="onLogout"
                    active-class="text-light"
                    clickable
                    v-ripple
                  >
                    <q-item-section>
                      <div class="row items-center font-regular text-white">
                        <q-icon size="xs" class="q-mr-sm" name="logout" />
                        خروج
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-menu>

          <q-btn
            v-if="user?.email"
            :label="user.email"
            class="text-lowercase"
            icon="expand_more"
            flat
          />
          <q-btn v-else to="/login" icon="login" label=" ورود به سامانه" flat />
        </div>

        <q-btn icon="route" to="/" flat size="lg" rounded dense />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useUserStore } from "src/stores/users-store";
import { messages } from "src/stores/messages";
import { ref, computed } from "vue";
import { defineComponent } from "vue";
import { notifPrimary } from "src/util/notify";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const user = computed(() => userStore.data);
    const signinPending = computed(() => userStore.signinPending);

    const onLogout = () => {
      userStore.logout();
      notifPrimary(messages.loggedOut, "logout");
      router.push({ name: "login" });
    };

    const checkLoginAndRedirect = () => {
      if (!user.value.email) router.push({ name: "login" });
      else return true;
    };
    return {
      user,
      signinPending,
      onLogout,
      checkLoginAndRedirect,
    };
  },
});
</script>
