const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "index",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "login",
        name: "login",
        component: () => import("pages/LoginPage.vue"),
      },
      {
        path: "center/new",
        name: "initialsNew",
        component: () => import("pages/forms/InitialsForm.vue"),
      },
      {
        path: "legals/new",
        name: "legalsNew",
        component: () => import("pages/forms/LegalsForm.vue"),
      },
      {
        path: "certs/new",
        name: "certsNew",
        component: () => import("pages/forms/CertsForm.vue"),
      },
      {
        path: "specialists/new",
        name: "specialistsNew",
        component: () => import("pages/forms/SpecialistsForm.vue"),
      },
      {
        path: "equipments/new",
        name: "equipmentsNew",
        component: () => import("pages/forms/EquipmentsForm.vue"),
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
