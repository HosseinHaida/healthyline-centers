<template>
  <div class="w-full">
    <section
      class="bg-river-start h-screen w-full bg-contain bg-no-repeat pt-[5%]"
    >
      <div class="flex h-16 w-full items-center justify-center bg-orange-500">
        <SearchBar />
      </div>

      <div class="mt-[25%] flex w-full justify-end pl-2 lg:mt-[15%] lg:pl-36">
        <LandingArticle
          :label="articles[0].label"
          :title="articles[0].title"
          :list="articles[0].list"
        />
      </div>
    </section>

    <section
      class="bg-river-follow-1 mt-[-25%] h-screen w-full overflow-auto bg-contain bg-right bg-no-repeat"
    >
      <div class="mt-[25%] flex w-full pr-2 lg:mt-[15%] lg:pr-36">
        <LandingArticle
          :label="articles[1].label"
          :title="articles[1].title"
          :list="articles[1].list"
          :rtl="true"
        />
      </div>
    </section>

    <section
      class="bg-river-follow-2 mt-[-15%] min-h-screen w-full overflow-auto bg-contain bg-no-repeat py-36"
    >
      <div class="flex w-full justify-end pl-2 lg:pl-36">
        <LandingArticle
          :label="articles[2].label"
          :title="articles[2].title"
          :list="articles[2].list"
        />
      </div>
      <div class="mt-52 flex w-full justify-end pl-6 lg:pl-28">
        <LandingArticle
          :label="articles[3].label"
          :title="articles[3].title"
          :list="articles[3].list"
        />
      </div>
    </section>

    <section
      class="bg-river-end bg-top-right relative mt-[-5%] min-h-screen w-full overflow-visible bg-cover bg-no-repeat"
    >
      <div class="flex w-full pr-2 lg:pr-36">
        <LandingArticle
          :label="articles[4].label"
          :title="articles[4].title"
          :list="articles[4].list"
          :rtl="true"
        />
      </div>

      <div
        class="lg:text-md absolute bottom-4 right-4 max-w-md text-sm text-slate-50 lg:bottom-16 lg:right-16"
      >
        <p>
          طبقه آدرس: اصفهان، میدان جمهوری،
          <br />
          ساختمان جمهوری، طبقه سوم، واحد ۲۴.
        </p>
        <p>تلفن: ۰۳۱ ۳۳۳ ۵۹ ۰۰۴</p>
        <a href="malto:info@healthyline.ir">info@healthyline.ir</a>
      </div>
    </section>
  </div>
</template>

<script>
const articles = [
  {
    label: "هزینه در ازای ثبت پرونده",
    title: "مراکز تخصصی طب کار",
    list: [
      "افزایش سرعت ثبت و تأیید پرونده‌ها",
      "جلوگیری صد در صدی از تقلبات مراجعین",
      "مشاهده سوابق و کنترل اتوماتیک صحت اطلاعان",
    ],
  },
  {
    label: "از ۴۰ تا ۱۰۰۰ میلیون ریال",
    title: "سازمانها",
    list: [
      "آمار تحلیلی از وضعیت سلامتی در سازمان",
      "موفقیت صد در صدی در پرونده‌های حقوقی مبتنی بر بیماری‌های شغلی",
      "صرفه‌جویی در زمان و هزینه‌های سلامت شغلی پرسنل",
    ],
  },
  {
    label: "از ۵۰۰ تا ۴۵۰۰ هزار ریال",
    title: "افراد شاغل و بازنشسته",
    list: [
      "اطلاع از وضعیت سلامت شغلی",
      "برنامه‌ریزی برای حفظ و بهبود سلامت فردی",
      "ارائه مشاوره‌های ایمنی حین کار",
    ],
  },
  {
    label: "به ازای میزان ترافیک داده",
    title: "راهکار‌های ERP",
    list: [
      "آمار تحلیلی از وضعیت سلامتی در سازمان",
      "موفقیت صد در صدی در پرونده‌های حقوقی مبتنی بر بیماری‌های شغلی",
      "صرفه‌جویی در زمان و هزینه‌های سلامت شغلی پرسنل",
    ],
  },
  {
    label: "از ۵۰۰ تا ۴۵۰۰ هزار ریال",
    title: "راهکار‌های ERP",
    list: [
      "دسترسی کامل و هوشمند به آیین نامه‌ها و دستورالعمل‌ها",
      "آرشیو مقالات و ویدئو‌های تخصصی جهان",
      "موردکاوی پرونده‌های حقوقی و قضائی",
    ],
  },
];

// import { reactive, toRefs } from 'vue'
export default {
  setup() {
    //     const state = reactive({
    //         count: 0,
    //     })
    return {
      // ...toRefs(state),
      articles,
    };
  },
};
</script>

<style scoped></style>
