export default {
  admin: [
    { label: "دورنمای همکاری", to: "/overview", icon: "speed" },
    {
      label: "مدیریت سازمانها",
      to: "/manage/organizations",
      icon: "apartment",
    },
    { label: "مدیریت مراکز", to: "/manage/centers", icon: "handshake" },
    { label: "مدیریت امتیازات", to: "/manage/points", icon: "hotel_class" },
  ],
  center: [
    { label: "دورنمای همکاری", to: "/overview/center", icon: "speed" },
    {
      label: "ارائه پنل سازمانی",
      to: "/center/organizations",
      icon: "apartment",
    },
    { label: "ارتقاء گرید مرکز", to: "/_", icon: "grade" },
    { label: "معرفی کاربران", to: "/_", icon: "groups" },
    { label: "توافق‌نامه‌ها", to: "/_", icon: "handshake" },
    { label: "تراکنش مالی", to: "/_", icon: "receipt_long" },
    { label: "توسعه دانش", to: "/_", icon: "expand" },
  ],
};
