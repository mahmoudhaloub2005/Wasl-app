import defaultGeneratorImage from "../assets/customer/images/generator-nour.png";
import smartGeneratorImage from "../assets/customer/images/generator-smart.png";
import workersGeneratorImage from "../assets/customer/images/generator-workers.png";

const STORAGE_KEY = "wasl_generators";

export const designGenerators = [
  {
    id: "nour",
    image: defaultGeneratorImage,
    name: "مولد النور",
    status: "يعمل الآن",
    statusType: "working",
    location: "دير البلح",
    price: "25,000",
    priceValue: 25000,
    priceText: "د.ع 25,000",
    currency: "د.ع / شهر",
    capacity: "450A",
    rating: "5",
    shortDescription:
      "نظام تزويد طاقة ذكي يوفر خدمة مستقرة للمنازل والمتاجر في دير البلح.",
    serviceDescription:
      "تقدم مولدات النور خدمة كهرباء موثوقة مع متابعة فنية مستمرة وسرعة استجابة للأعطال، لتوفير طاقة مستقرة للمشتركين على مدار الشهر.",
    provider: {
      name: "شركة مولد النور",
      address: "دير البلح - شارع البحر",
      phone: "+970 59 123 4567",
    },
    terms: [
      "يتم دفع رسوم الاشتراك في أول 5 أيام من الشهر.",
      "يلتزم المشترك بالسعة المتفق عليها عند الاشتراك.",
      "تتم متابعة الأعطال الفنية من قبل فريق الصيانة.",
    ],
    review: {
      userName: "محمد جاسم",
      date: "منذ يومين",
      text: "خدمة ممتازة والكهرباء مستقرة جدا.",
    },
  },
  {
    id: "smart",
    image: smartGeneratorImage,
    name: "مولد الرشيد الذكي",
    status: "يعمل الآن",
    statusType: "working",
    location: "دير البلح",
    price: "18,500",
    priceValue: 18500,
    priceText: "د.ع 18,500",
    currency: "د.ع / شهر",
    capacity: "450A",
    rating: "3",
    shortDescription:
      "خدمة طاقة ذكية بإدارة رقمية ومتابعة استهلاك واضحة للمشتركين.",
    serviceDescription:
      "يوفر مولد الرشيد الذكي حلول طاقة عملية مع نظام متابعة حديث للفواتير والاستهلاك، وخطط اشتراك مرنة تناسب احتياجات المنازل.",
    provider: {
      name: "مولد الرشيد الذكي",
      address: "دير البلح - المنطقة الوسطى",
      phone: "+970 59 234 5678",
    },
    terms: [
      "تتم المحاسبة حسب السعة المختارة.",
      "يمكن تعديل الاشتراك حسب توفر القدرة.",
      "يجب الالتزام بمواعيد الدفع الشهرية.",
    ],
    review: {
      userName: "أحمد سالم",
      date: "منذ أسبوع",
      text: "النظام واضح والفواتير سهلة المتابعة.",
    },
  },
  {
    id: "wafideen",
    image: workersGeneratorImage,
    name: "مولد الوافدين",
    status: "تحت الصيانة",
    statusType: "maintenance",
    location: "دير البلح",
    price: "18,500",
    priceValue: 18500,
    priceText: "د.ع 18,500",
    currency: "د.ع / شهر",
    capacity: "450A",
    rating: "1",
    shortDescription:
      "مزود طاقة محلي يخدم مناطق سكنية متعددة مع تحديثات صيانة دورية.",
    serviceDescription:
      "يعمل مولد الوافدين على توفير خدمة كهرباء للمشتركين مع جدول صيانة معلن ومتابعة دورية لحالة التشغيل.",
    provider: {
      name: "مولد الوافدين",
      address: "دير البلح - قرب السوق",
      phone: "+970 59 345 6789",
    },
    terms: [
      "قد تتأثر الخدمة أثناء أعمال الصيانة.",
      "يتم إعلام المشتركين بأي توقف مجدول.",
      "الدفع شهري حسب السعة المتفق عليها.",
    ],
    review: {
      userName: "سعيد منصور",
      date: "منذ شهر",
      text: "الخدمة تحتاج متابعة أفضل أثناء الصيانة.",
    },
  },
];

export function getGenerators() {
  try {
    const savedGenerators = localStorage.getItem(STORAGE_KEY);

    if (!savedGenerators) {
      return designGenerators;
    }

    const parsedGenerators = JSON.parse(savedGenerators);

    if (!Array.isArray(parsedGenerators)) {
      return designGenerators;
    }

    const savedIds = new Set(
      parsedGenerators.map((generator) => String(generator.id))
    );

    const missingDesignGenerators = designGenerators.filter(
      (generator) => !savedIds.has(String(generator.id))
    );

    return [...missingDesignGenerators, ...parsedGenerators];
  } catch (error) {
    console.log("Error reading generators:", error);
    return designGenerators;
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
    statusType: generatorData.statusType || "working",
    location: generatorData.location || "غير محدد",
    price: generatorData.price || "0",
    priceValue: Number(generatorData.price) || 0,
    priceText: generatorData.priceText || `${generatorData.price || 0} د.ع`,
    currency: generatorData.currency || "د.ع",
    capacity: generatorData.capacity || "0A",
    image: generatorData.image || defaultGeneratorImage,
    shortDescription:
      generatorData.shortDescription ||
      "مزود طاقة محلي يقدم خدمة كهرباء للمشتركين.",
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
      "يتم دفع رسوم الاشتراك في بداية الشهر.",
      "يجب الالتزام بالسعة المتفق عليها.",
      "تتم متابعة الأعطال من قبل فريق الصيانة.",
    ],
    rating: generatorData.rating || "0",
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
