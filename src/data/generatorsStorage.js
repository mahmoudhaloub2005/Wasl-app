import defaultGeneratorImage from "../assets/customer/images/generator-nour.png";

const STORAGE_KEY = "wasl_generators";

const defaultGenerator = {
  id: "nour",
  name: "مولد النور",
  status: "يعمل الآن",
  location: "دير البلح",
  price: "25,000",
  currency: "د.ع / شهر",
  capacity: "120/500 أمبير",
  image: defaultGeneratorImage,

  shortDescription:
    "نظام تزويد طاقة ذكي مع استجابة فورية للأعطال ودعم فني على مدار الساعة لضمان راحة المشتركين.",

  serviceDescription:
    "تقدم مولدة النور الكهربائي حلول طاقة مضمونة للمناطق السكنية والتجارية، تستخدم أحدث مولدات كاتربيلر الصناعية لضمان أداء موثوق وخدمة مستمرة.",

  provider: {
    name: "يوسف حسن العزاوي",
    address: "دير البلح شارع البحر",
    phone: "+970 59 123 4567",
  },

  terms: [
    "يتم دفع مبلغ الاشتراك في أول 5 أيام من الشهر كحد أقصى.",
    "يمنع استخدام الأجهزة ذات الأحمال العالية أو التبريد المركزي دون تنسيق مسبق.",
    "يتحمل إدارة المولدة مسؤولية العطل من لوحة التوزيع الرئيسية إلى مدخل المنزل.",
  ],

  rating: "4.8",

  review: {
    userName: "محمد جاسم",
    date: "منذ يومين",
    text: "خدمة ممتازة والكهرباء مستقرة جداً.",
  },
};

export function getGenerators() {
  try {
    const savedGenerators = localStorage.getItem(STORAGE_KEY);

    if (!savedGenerators) {
      return [defaultGenerator];
    }

    const parsedGenerators = JSON.parse(savedGenerators);

    if (!Array.isArray(parsedGenerators)) {
      return [defaultGenerator];
    }

    const hasDefaultGenerator = parsedGenerators.some(
      (generator) => String(generator.id) === String(defaultGenerator.id)
    );

    if (hasDefaultGenerator) {
      return parsedGenerators;
    }

    return [defaultGenerator, ...parsedGenerators];
  } catch (error) {
    console.log("Error reading generators:", error);
    return [defaultGenerator];
  }
}

export function getGeneratorById(id) {
  const generators = getGenerators();

  return generators.find((generator) => String(generator.id) === String(id));
}

export function addGenerator(generatorData) {
  const generators = getGenerators();

  const newGenerator = {
    id: Date.now(),

    name: generatorData.name || "مولد جديد",
    status: generatorData.status || "يعمل الآن",
    location: generatorData.location || "غير محدد",
    price: generatorData.price || "0",
    currency: generatorData.currency || "د.ع",
    capacity: generatorData.capacity || "0A",
    image: generatorData.image || defaultGeneratorImage,

    shortDescription:
      generatorData.shortDescription ||
      "نظام تزويد طاقة ذكي مع استجابة فورية للأعطال ودعم فني على مدار الساعة لضمان راحة المشتركين.",

    serviceDescription:
      generatorData.serviceDescription ||
      "تقدم هذه المولدة حلول طاقة للمناطق السكنية والتجارية مع متابعة فنية وخدمة مستقرة للمشتركين.",

    provider: {
      name: generatorData.providerName || "مزود الخدمة",
      address:
        generatorData.providerAddress || generatorData.location || "غير محدد",
      phone: generatorData.providerPhone || "",
    },

    terms: [
      "يتم دفع مبلغ الاشتراك في أول 5 أيام من الشهر كحد أقصى.",
      "يمنع استخدام الأجهزة ذات الأحمال العالية دون تنسيق مسبق.",
      "يجب الالتزام بالقدرة المتفق عليها عند الاشتراك.",
    ],

    rating: generatorData.rating || "0.0",

    review: {
      userName: "لا توجد مراجعات بعد",
      date: "",
      text: "لم يقم أي مشترك بإضافة رأي حتى الآن.",
    },
  };

  const updatedGenerators = [...generators, newGenerator];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGenerators));

  return newGenerator;
}