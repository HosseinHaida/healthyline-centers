<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar class="justify-between">
        <div class="row">
          <q-btn
            v-if="user.phone"
            flat
            @click="isDrawerOpen = !isDrawerOpen"
            round
            dense
            icon="menu"
          />

          <div>
            <q-menu>
              <div class="row no-wrap bg-primary">
                <div v-if="user && user.phone" class="column">
                  <q-chip
                    color="light"
                    class="q-ma-none text-primary shadow-3 g-rounded-6"
                    square
                    style="min-width: 200px"
                  >
                    <div
                      class="row full-width text-center font-medium items-center justify-between"
                    >
                      {{ user.username ? user.username : user.phone }}
                      <q-icon name="person" />
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
              v-if="user?.phone"
              :label="user.phone"
              class="text-lowercase"
              icon-right="expand_more"
              flat
            />
            <q-btn
              v-else
              to="/login"
              icon="login"
              label=" ورود به سامانه"
              flat
            />
          </div>
        </div>

        <q-btn icon="route" to="/" flat size="lg" rounded dense />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="user.phone"
      v-model="isDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="400"
      class="bg-grey-2"
      bordered
    >
      <div class="absolute-top" style="height: 150px">
        <div class="absolute-bottom bg-transparent q-px-md">
          <q-avatar size="56px" class="q-mb-sm">
            <q-icon :name="metas[userType].icon" size="xl" />
          </q-avatar>
          <div class="text-weight-bold text-h7">
            {{ metas[userType].label }}
          </div>
          <div>{{ user.phone }}</div>
        </div>
      </div>
      <q-scroll-area
        style="
          height: calc(100% - 160px);
          margin-top: 160px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item
            clickable
            v-ripple
            v-for="(link, i) in links[userType]"
            :key="i"
            :to="link.to"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>

            <q-item-section> {{ link.label }} </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container style="margin-bottom: 8rem">
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
import links from "src/stores/nav-links";

const metas = {
  admin: { icon: "admin_panel_settings", label: "ادمین" },
  center: { icon: "domain", label: "مرکز تخصصی طب کار" },
  org: { icon: "appartment", label: "سازمان" },
};

export default defineComponent({
  name: "MainLayout",

  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const isDrawerOpen = ref(true);

    const user = computed(() => userStore.data);
    const signinPending = computed(() => userStore.signinPending);
    const userType = computed(() =>
      user.value.is_admin
        ? "admin"
        : user.value.is_center_auth
        ? "center"
        : user.value.is_org_auth
        ? "org"
        : null
    );

    const onLogout = () => {
      userStore.logout();
      notifPrimary(messages.loggedOut, "logout");
      router.push({ name: "login" });
    };

    const checkLoginAndRedirect = () => {
      if (!user.value.phone) router.push({ name: "login" });
      else return true;
    };
    return {
      links,
      metas,

      isDrawerOpen,

      user,
      signinPending,
      userType,

      onLogout,
      checkLoginAndRedirect,
    };
  },
});
</script>
