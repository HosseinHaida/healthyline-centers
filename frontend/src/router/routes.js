const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "index",
        component: () => import("pages/IndexPage.vue"),
      },
      // admin
      {
        path: "/manage/centers",
        name: "manageCenters",
        component: () => import("pages/manage/centers/IndexPage.vue"),
      },
      {
        path: "/manage/organizations",
        name: "manageOrganizations",
        component: () => import("pages/manage/orgs/IndexPage.vue"),
      },
      // centers
      {
        path: "/center/organizations",
        name: "centerOrgsIndex",
        component: () => import("pages/centers/orgs/IndexPage.vue"),
      },
      {
        path: "/center/setup",
        name: "centerSetupIndex",
        component: () =>
          import("pages/centers/setup/centerForms/IndexPage.vue"),
      },
      {
        path: "/center/setup/new",
        name: "centerNew",
        component: () =>
          import("pages/centers/setup/centerForms/InitialsForm.vue"),
      },
      {
        path: "/center/setup/legals",
        name: "centerLegalsList",
        component: () => import("pages/centers/setup/lists/LegalsList.vue"),
      },
      {
        path: "/center/setup/legals/:id",
        name: "centerLegalsShow",
        component: () =>
          import("pages/centers/setup/centerForms/LegalsForm.vue"),
      },
      {
        path: "/center/setup/legals/new",
        name: "centerLegalsNew",
        component: () =>
          import("pages/centers/setup/centerForms/LegalsForm.vue"),
      },
      {
        path: "/center/setup/certs/new",
        name: "centerCertsNew",
        component: () =>
          import("pages/centers/setup/centerForms/CertsForm.vue"),
      },
      {
        path: "/center/setup/specialists/new",
        name: "centerSpecialistsNew",
        component: () =>
          import("pages/centers/setup/centerForms/SpecialistsForm.vue"),
      },
      {
        path: "/center/setup/equipments/new",
        name: "centerEquipmentsNew",
        component: () =>
          import("pages/centers/setup/centerForms/EquipmentsForm.vue"),
      },
      {
        path: "/login",
        name: "login",
        component: () => import("pages/LoginPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
