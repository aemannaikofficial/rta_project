/*
 * RTA AI Newsletter — Bilingual EN/AR — Monthly Series
 * Editorial Broadsheet Design — Content Data
 */

export const LOGO_URL = "/assets/images/rta_logo_transparent_b5d67b4d.png";

export interface BiText {
  en: string;
  ar: string;
}

export interface Section {
  num: number;
  title: BiText;
  shortTitle: BiText;
  body: BiText[];
  bullets?: { label: BiText; text: BiText }[];
  callout?: { type: "insight" | "result" | "conclusion"; text: BiText };
  table?: { headers: BiText[]; rows: BiText[][] };
  image: string;
}

export interface Edition {
  id: string;
  number: number;
  month: BiText;
  year: number;
  title: BiText;
  subtitle: BiText;
  foreword: BiText;
  finalNote: BiText;
  sections: Section[];
  references: { id: number; text: string; url: string }[];
}

/* ─── UI Labels ─── */
export const UI = {
  foreword: { en: "Foreword", ar: "تمهيد" },
  finalNote: { en: "Final Note", ar: "ملاحظة ختامية" },
  contents: { en: "Contents", ar: "المحتويات" },
  readNow: { en: "Read Now", ar: "اقرأ الآن" },
  scrollToRead: { en: "Scroll to read", ar: "مرر للقراءة" },
  more: { en: "More...", ar: "المزيد..." },
  insight: { en: "Insight", ar: "رؤية" },
  result: { en: "Result", ar: "نتيجة" },
  conclusion: { en: "Conclusion", ar: "خلاصة" },
  references: { en: "References", ar: "المراجع" },
  thankYou: { en: "Thank You for Reading", ar: "شكراً لقراءتكم" },
  tagline: { en: "Together, we are shaping the future of mobility.", ar: "معاً نرسم مستقبل التنقل." },
  copyright: { en: "Roads and Transport Authority, Dubai. All rights reserved.", ar: "هيئة الطرق والمواصلات، دبي. جميع الحقوق محفوظة." },
  editions: { en: "Editions", ar: "الإصدارات" },
  edition: { en: "Edition", ar: "الإصدار" },
  backToEditions: { en: "All Editions", ar: "جميع الإصدارات" },
  section: { en: "Section", ar: "القسم" },
  aiNewsletter: { en: "AI Newsletter", ar: "نشرة الذكاء الاصطناعي" },
  monthlyBlog: { en: "AI Insights for Transport Innovation", ar: "رؤى في الذكاء الاصطناعي لابتكار النقل" },
};

/* ─── Edition 1: April 2026 ─── */
const edition1: Edition = {
  id: "apr-2026",
  number: 1,
  month: { en: "April", ar: "أبريل" },
  year: 2026,
  title: { en: "AI Newsletter", ar: "نشرة الذكاء الاصطناعي" },
  subtitle: { en: "1st Edition", ar: "الإصدار الأول" },
  foreword: {
    en: "Artificial Intelligence is no longer merely an experimental technology; it has rapidly evolved into a foundational pillar of enterprise transformation and operational excellence. For the Roads and Transport Authority (RTA), embracing AI is not just about adopting new tools — it is about redefining the core infrastructure of modern mobility. As we navigate this transition, this edition of our newsletter explores the global landscape of AI, its profound impact on business productivity, the critical importance of robust governance, and real-world applications across various transport sectors.",
    ar: "لم يعد الذكاء الاصطناعي مجرد تقنية تجريبية؛ بل تطور بسرعة ليصبح ركيزة أساسية للتحول المؤسسي والتميز التشغيلي. بالنسبة لهيئة الطرق والمواصلات، فإن تبني الذكاء الاصطناعي لا يتعلق فقط بتبني أدوات جديدة — بل يتعلق بإعادة تعريف البنية التحتية الأساسية للتنقل الحديث. ونحن نتنقل في هذا التحول، يستكشف هذا الإصدار من نشرتنا المشهد العالمي للذكاء الاصطناعي، وتأثيره العميق على إنتاجية الأعمال، والأهمية البالغة للحوكمة الرشيدة، والتطبيقات الواقعية عبر مختلف قطاعات النقل."
  },
  finalNote: {
    en: "As demonstrated across these various sectors, Artificial Intelligence is no longer an experimental concept on the horizon. It is a fully operational, highly measurable, and deeply strategic asset. For the RTA, continuing to integrate and scale these technologies will be vital in shaping the future of mobility and maintaining our position as a global leader in transport innovation.",
    ar: "كما تبين عبر هذه القطاعات المتنوعة، لم يعد الذكاء الاصطناعي مفهوماً تجريبياً في الأفق. إنه أصل تشغيلي بالكامل، وقابل للقياس بدرجة عالية، واستراتيجي بعمق. بالنسبة لهيئة الطرق والمواصلات، سيكون الاستمرار في دمج هذه التقنيات وتوسيع نطاقها أمراً حيوياً في تشكيل مستقبل التنقل والحفاظ على مكانتنا كرائد عالمي في ابتكار النقل."
  },
  sections: [
    {
      num: 1,
      title: { en: "The Global AI Radar: From Experimentation to Core Infrastructure", ar: "رادار الذكاء الاصطناعي العالمي: من التجريب إلى البنية التحتية الأساسية" },
      shortTitle: { en: "Global AI Radar", ar: "الرادار العالمي" },
      body: [
        { en: "The global adoption of Artificial Intelligence is accelerating at an unprecedented pace. Organizations worldwide are moving beyond pilot projects to integrate AI deeply into their strategic operations. Currently, an impressive 88% of organizations utilize AI in at least one business function. However, the true competitive advantage lies in scaling these capabilities; presently, only 30% to 35% of enterprises have successfully implemented AI on an enterprise-wide scale.", ar: "يتسارع تبني الذكاء الاصطناعي عالمياً بوتيرة غير مسبوقة. تتجاوز المؤسسات في جميع أنحاء العالم المشاريع التجريبية لدمج الذكاء الاصطناعي بعمق في عملياتها الاستراتيجية. حالياً، تستخدم 88% من المؤسسات الذكاء الاصطناعي في وظيفة عمل واحدة على الأقل. ومع ذلك، تكمن الميزة التنافسية الحقيقية في توسيع نطاق هذه القدرات؛ حيث نجحت فقط 30% إلى 35% من المؤسسات في تطبيق الذكاء الاصطناعي على مستوى المؤسسة بأكملها." },
        { en: "The financial trajectory of AI underscores its monumental impact. The global AI market, which exceeded $390 billion in 2025, is projected to experience explosive growth, reaching an estimated $3.4 trillion by 2033. This growth is fueled by massive investments, with nearly 50% of global startup funding now directed toward AI-driven ventures.", ar: "يؤكد المسار المالي للذكاء الاصطناعي تأثيره الهائل. سوق الذكاء الاصطناعي العالمي، الذي تجاوز 390 مليار دولار في عام 2025، من المتوقع أن يشهد نمواً هائلاً ليصل إلى 3.4 تريليون دولار بحلول عام 2033. يغذي هذا النمو استثمارات ضخمة، حيث يتم توجيه ما يقرب من 50% من تمويل الشركات الناشئة العالمية نحو المشاريع المدعومة بالذكاء الاصطناعي." }
      ],
      callout: { type: "insight", text: { en: "The takeaway is clear — AI is no longer just a supplementary tool. It is rapidly becoming the core infrastructure upon which future business operations, including advanced transport networks, will be built.", ar: "الخلاصة واضحة — لم يعد الذكاء الاصطناعي مجرد أداة تكميلية. إنه يتحول بسرعة إلى البنية التحتية الأساسية التي ستُبنى عليها العمليات التجارية المستقبلية، بما في ذلك شبكات النقل المتقدمة." } },
      image: "/assets/images/sec01_global_ai_f5e47092.png"
    },
    {
      num: 2,
      title: { en: "AI Risks & Governance: Navigating the New Reality", ar: "مخاطر الذكاء الاصطناعي والحوكمة: التنقل في الواقع الجديد" },
      shortTitle: { en: "AI Governance", ar: "الحوكمة" },
      body: [
        { en: "While the potential of AI is vast, it introduces new strategic risks that organizations must proactively manage. The rapid deployment of AI technologies has brought several critical challenges to the forefront:", ar: "على الرغم من الإمكانات الهائلة للذكاء الاصطناعي، إلا أنه يُدخل مخاطر استراتيجية جديدة يجب على المؤسسات إدارتها بشكل استباقي. أدى النشر السريع لتقنيات الذكاء الاصطناعي إلى ظهور عدة تحديات حرجة:" },
        { en: "To mitigate these risks, a robust governance framework is essential. Key concerns that must be addressed include algorithmic bias, ethical considerations, operational transparency, and comprehensive data governance.", ar: "للتخفيف من هذه المخاطر، يُعد إطار حوكمة قوي أمراً ضرورياً. تشمل المخاوف الرئيسية التي يجب معالجتها التحيز الخوارزمي، والاعتبارات الأخلاقية، والشفافية التشغيلية، وحوكمة البيانات الشاملة." }
      ],
      bullets: [
        { label: { en: "Inaccuracies and Hallucinations", ar: "عدم الدقة والهلوسة" }, text: { en: "A significant 74% of organizations cite AI inaccuracies as a primary concern, highlighting the need for rigorous model validation.", ar: "تشير 74% من المؤسسات إلى عدم دقة الذكاء الاصطناعي كمصدر قلق رئيسي، مما يبرز الحاجة إلى التحقق الدقيق من النماذج." } },
        { label: { en: "Cybersecurity Threats", ar: "تهديدات الأمن السيبراني" }, text: { en: "With increased digital integration, 72% of enterprises view AI-related cybersecurity vulnerabilities as a major risk.", ar: "مع زيادة التكامل الرقمي، تعتبر 72% من المؤسسات ثغرات الأمن السيبراني المرتبطة بالذكاء الاصطناعي خطراً كبيراً." } },
        { label: { en: "Data Quality Issues", ar: "مشاكل جودة البيانات" }, text: { en: "More than 50% of organizations fail to extract meaningful value from their AI investments due to poor underlying data quality.", ar: "تفشل أكثر من 50% من المؤسسات في استخراج قيمة ذات معنى من استثماراتها في الذكاء الاصطناعي بسبب ضعف جودة البيانات الأساسية." } }
      ],
      callout: { type: "conclusion", text: { en: "Long-term success in AI depends heavily on establishing trust, maintaining control, and enforcing strict governance protocols — mere adoption is not enough to guarantee positive outcomes.", ar: "يعتمد النجاح طويل المدى في الذكاء الاصطناعي بشكل كبير على بناء الثقة، والحفاظ على السيطرة، وتطبيق بروتوكولات حوكمة صارمة — مجرد التبني لا يكفي لضمان نتائج إيجابية." } },
      image: "/assets/images/sec02_governance_7d51a626.png"
    },
    {
      num: 3,
      title: { en: "AI Productivity & Business Impact: Empowering the Workforce", ar: "إنتاجية الذكاء الاصطناعي وأثره على الأعمال: تمكين القوى العاملة" },
      shortTitle: { en: "AI Productivity", ar: "الإنتاجية" },
      body: [
        { en: "AI is fundamentally transforming workplace productivity and redefining how businesses operate. By automating routine and repetitive tasks, AI enables a significant shift in workforce dynamics.", ar: "يُحدث الذكاء الاصطناعي تحولاً جذرياً في إنتاجية مكان العمل ويعيد تعريف كيفية عمل الشركات. من خلال أتمتة المهام الروتينية والمتكررة، يُمكّن الذكاء الاصطناعي من تحول كبير في ديناميكيات القوى العاملة." },
        { en: "The integration of AI tools can lead to up to a 40% increase in overall operational efficiency. Furthermore, it is estimated that 60% to 70% of current tasks can be automated or significantly augmented by AI technologies. This automation allows employees to pivot away from manual data processing and focus on higher-value, strategic thinking.", ar: "يمكن أن يؤدي دمج أدوات الذكاء الاصطناعي إلى زيادة تصل إلى 40% في الكفاءة التشغيلية الإجمالية. علاوة على ذلك، يُقدر أن 60% إلى 70% من المهام الحالية يمكن أتمتتها أو تعزيزها بشكل كبير بواسطة تقنيات الذكاء الاصطناعي. تتيح هذه الأتمتة للموظفين التحول من معالجة البيانات اليدوية والتركيز على التفكير الاستراتيجي ذي القيمة العالية." }
      ],
      table: {
        headers: [{ en: "Productivity Metric", ar: "مقياس الإنتاجية" }, { en: "Estimated Impact", ar: "الأثر المتوقع" }],
        rows: [
          [{ en: "Operational Efficiency", ar: "الكفاءة التشغيلية" }, { en: "Up to 40% Increase", ar: "زيادة تصل إلى 40%" }],
          [{ en: "Task Automation Potential", ar: "إمكانية أتمتة المهام" }, { en: "60% - 70% of Routine Tasks", ar: "60% - 70% من المهام الروتينية" }],
          [{ en: "Decision Making", ar: "اتخاذ القرارات" }, { en: "Faster, Data-Driven Insights", ar: "رؤى أسرع مبنية على البيانات" }]
        ]
      },
      callout: { type: "result", text: { en: "The ultimate outcome is the creation of smarter operations and an AI-augmented workforce that is more agile, innovative, and focused on strategic objectives.", ar: "النتيجة النهائية هي خلق عمليات أذكى وقوى عاملة معززة بالذكاء الاصطناعي أكثر مرونة وابتكاراً وتركيزاً على الأهداف الاستراتيجية." } },
      image: "/assets/images/sec03_productivity_88dbf013.png"
    },
    {
      num: 4,
      title: { en: "AI in Action: Transforming the Railways", ar: "الذكاء الاصطناعي في العمل: تحويل السكك الحديدية" },
      shortTitle: { en: "Railways", ar: "السكك الحديدية" },
      body: [
        { en: "In the railway sector, AI is revolutionizing maintenance and operational efficiency. Traditional reactive maintenance is being replaced by proactive strategies powered by machine learning.", ar: "في قطاع السكك الحديدية، يُحدث الذكاء الاصطناعي ثورة في الصيانة والكفاءة التشغيلية. يتم استبدال الصيانة التفاعلية التقليدية باستراتيجيات استباقية مدعومة بالتعلم الآلي." }
      ],
      bullets: [
        { label: { en: "Predictive Maintenance", ar: "الصيانة التنبؤية" }, text: { en: "By analyzing data from sensors embedded in trains and tracks, AI can predict equipment failures before they occur. This proactive approach has been shown to reduce unexpected breakdowns by up to 50%.", ar: "من خلال تحليل البيانات من أجهزة الاستشعار المدمجة في القطارات والمسارات، يمكن للذكاء الاصطناعي التنبؤ بأعطال المعدات قبل حدوثها. وقد ثبت أن هذا النهج الاستباقي يقلل الأعطال غير المتوقعة بنسبة تصل إلى 50%." } },
        { label: { en: "Real-Time Monitoring", ar: "المراقبة الفورية" }, text: { en: "Continuous monitoring of the railway network allows for dynamic adjustments to schedules and routing, significantly improving overall punctuality.", ar: "تتيح المراقبة المستمرة لشبكة السكك الحديدية إجراء تعديلات ديناميكية على الجداول والمسارات، مما يحسن بشكل كبير الالتزام بالمواعيد." } },
        { label: { en: "Digital Twins", ar: "التوائم الرقمية" }, text: { en: "The creation of digital twins — virtual replicas of the entire physical network — enables operators to simulate various scenarios, optimize performance, and plan infrastructure upgrades with unprecedented accuracy.", ar: "يتيح إنشاء التوائم الرقمية — نسخ افتراضية من الشبكة المادية بأكملها — للمشغلين محاكاة سيناريوهات مختلفة، وتحسين الأداء، والتخطيط لترقيات البنية التحتية بدقة غير مسبوقة." } }
      ],
      callout: { type: "result", text: { en: "These advancements lead to a safer, more efficient, and highly cost-effective transport ecosystem.", ar: "تؤدي هذه التطورات إلى منظومة نقل أكثر أماناً وكفاءة وفعالية من حيث التكلفة." } },
      image: "/assets/images/sec04_railways_e7cebd90.png"
    },
    {
      num: 5,
      title: { en: "AI in Action: Smart Traffic Systems", ar: "الذكاء الاصطناعي في العمل: أنظمة المرور الذكية" },
      shortTitle: { en: "Smart Traffic", ar: "المرور الذكي" },
      body: [
        { en: "Urban mobility is being redefined by AI-driven smart traffic management systems. As cities grow, managing congestion and ensuring smooth traffic flow becomes increasingly complex.", ar: "يُعاد تعريف التنقل الحضري من خلال أنظمة إدارة المرور الذكية المدعومة بالذكاء الاصطناعي. مع نمو المدن، تصبح إدارة الازدحام وضمان انسيابية حركة المرور أكثر تعقيداً." },
        { en: "AI optimizes city traffic by analyzing real-time data from cameras, sensors, and GPS devices. This intelligent analysis can reduce traffic congestion by up to 30%. Furthermore, AI systems can dynamically adjust traffic signals based on current flow conditions, rather than relying on fixed timers. In the event of an incident, AI can detect accidents instantly, alerting emergency services and rerouting traffic to minimize delays.", ar: "يُحسّن الذكاء الاصطناعي حركة المرور في المدن من خلال تحليل البيانات الفورية من الكاميرات وأجهزة الاستشعار وأجهزة تحديد المواقع. يمكن لهذا التحليل الذكي تقليل الازدحام المروري بنسبة تصل إلى 30%. كما يمكن لأنظمة الذكاء الاصطناعي ضبط إشارات المرور ديناميكياً بناءً على ظروف التدفق الحالية. وفي حالة وقوع حادث، يمكن للذكاء الاصطناعي اكتشاف الحوادث فوراً وتنبيه خدمات الطوارئ وإعادة توجيه حركة المرور لتقليل التأخير." }
      ],
      callout: { type: "result", text: { en: "The implementation of smart traffic systems results in lower carbon emissions, faster mobility for citizens, and a significant improvement in the quality of urban life.", ar: "يؤدي تطبيق أنظمة المرور الذكية إلى خفض انبعاثات الكربون، وتنقل أسرع للمواطنين، وتحسين كبير في جودة الحياة الحضرية." } },
      image: "/assets/images/sec05_traffic_23223587.png"
    },
    {
      num: 6,
      title: { en: "AI in Action: Airports & Aviation", ar: "الذكاء الاصطناعي في العمل: المطارات والطيران" },
      shortTitle: { en: "Aviation", ar: "الطيران" },
      body: [
        { en: "The aviation industry is leveraging AI to create seamless and secure travel experiences for passengers while optimizing complex ground operations.", ar: "يستفيد قطاع الطيران من الذكاء الاصطناعي لخلق تجارب سفر سلسة وآمنة للمسافرين مع تحسين العمليات الأرضية المعقدة." }
      ],
      bullets: [
        { label: { en: "Biometric Passenger Processing", ar: "معالجة المسافرين بالقياسات الحيوية" }, text: { en: "Modern airports are increasingly relying on facial recognition and other AI technologies to expedite security checks and boarding procedures.", ar: "تعتمد المطارات الحديثة بشكل متزايد على تقنية التعرف على الوجه وتقنيات الذكاء الاصطناعي الأخرى لتسريع عمليات التفتيش الأمني وإجراءات الصعود." } },
        { label: { en: "Smart Baggage Handling", ar: "إدارة الأمتعة الذكية" }, text: { en: "AI systems track luggage in real-time, reducing the incidence of lost or delayed bags.", ar: "تتبع أنظمة الذكاء الاصطناعي الأمتعة في الوقت الفعلي، مما يقلل من حالات فقدان أو تأخير الحقائب." } },
        { label: { en: "Predictive Delay Management", ar: "إدارة التأخير التنبؤية" }, text: { en: "AI algorithms analyze weather patterns, air traffic, and maintenance schedules to proactively address potential disruptions.", ar: "تحلل خوارزميات الذكاء الاصطناعي أنماط الطقس وحركة الملاحة الجوية وجداول الصيانة لمعالجة الاضطرابات المحتملة بشكل استباقي." } }
      ],
      callout: { type: "result", text: { en: "These innovations ensure a seamless travel experience for passengers while significantly enhancing operational safety and efficiency.", ar: "تضمن هذه الابتكارات تجربة سفر سلسة للمسافرين مع تعزيز كبير للسلامة والكفاءة التشغيلية." } },
      image: "/assets/images/sec06_aviation_45e938f3.png"
    },
    {
      num: 7,
      title: { en: "AI in Action: Logistics & Supply Chain", ar: "الذكاء الاصطناعي في العمل: اللوجستيات وسلسلة التوريد" },
      shortTitle: { en: "Logistics", ar: "اللوجستيات" },
      body: [
        { en: "Global supply chains are notoriously complex, but AI is providing the tools necessary to build resilience and drive efficiency.", ar: "تتميز سلاسل التوريد العالمية بتعقيدها الشديد، لكن الذكاء الاصطناعي يوفر الأدوات اللازمة لبناء المرونة وتعزيز الكفاءة." },
        { en: "The integration of AI in logistics operations can lead to a remarkable 20% to 40% reduction in costs. This is achieved through advanced demand forecasting, which uses historical data and market trends to predict future inventory needs with high accuracy. Furthermore, AI excels at route optimization, calculating the most efficient delivery paths in real-time by considering variables such as traffic, weather, and fuel consumption.", ar: "يمكن أن يؤدي دمج الذكاء الاصطناعي في العمليات اللوجستية إلى خفض ملحوظ في التكاليف يتراوح بين 20% و40%. يتحقق ذلك من خلال التنبؤ المتقدم بالطلب، الذي يستخدم البيانات التاريخية واتجاهات السوق للتنبؤ باحتياجات المخزون المستقبلية بدقة عالية. كما يتفوق الذكاء الاصطناعي في تحسين المسارات، حيث يحسب أكثر مسارات التسليم كفاءة في الوقت الفعلي مع مراعاة متغيرات مثل حركة المرور والطقس واستهلاك الوقود." }
      ],
      callout: { type: "result", text: { en: "The application of AI creates faster, smarter, and more resilient supply chains capable of adapting to global disruptions.", ar: "يُنشئ تطبيق الذكاء الاصطناعي سلاسل توريد أسرع وأذكى وأكثر مرونة وقادرة على التكيف مع الاضطرابات العالمية." } },
      image: "/assets/images/sec07_logistics_eca39524.png"
    },
    {
      num: 8,
      title: { en: "AI in Action: Public Safety & Surveillance", ar: "الذكاء الاصطناعي في العمل: السلامة العامة والمراقبة" },
      shortTitle: { en: "Public Safety", ar: "السلامة العامة" },
      body: [
        { en: "Ensuring public safety is a paramount concern for transport authorities, and AI is playing a crucial role in strengthening security measures across transit networks.", ar: "يُعد ضمان السلامة العامة مصدر قلق بالغ لسلطات النقل، ويلعب الذكاء الاصطناعي دوراً حاسماً في تعزيز التدابير الأمنية عبر شبكات النقل." }
      ],
      bullets: [
        { label: { en: "Real-Time Threat Detection", ar: "كشف التهديدات الفوري" }, text: { en: "Advanced surveillance systems powered by AI are capable of automatically identifying suspicious objects or unauthorized access.", ar: "أنظمة المراقبة المتقدمة المدعومة بالذكاء الاصطناعي قادرة على التعرف تلقائياً على الأجسام المشبوهة أو الوصول غير المصرح به." } },
        { label: { en: "Behavior Analysis", ar: "تحليل السلوك" }, text: { en: "These systems can detect unusual patterns that may indicate a security risk or an impending emergency.", ar: "يمكن لهذه الأنظمة اكتشاف الأنماط غير العادية التي قد تشير إلى خطر أمني أو حالة طوارئ وشيكة." } },
        { label: { en: "Predictive Risk Identification", ar: "تحديد المخاطر التنبؤي" }, text: { en: "By combining these capabilities, authorities can intervene before an incident escalates.", ar: "من خلال الجمع بين هذه القدرات، يمكن للسلطات التدخل قبل تصاعد أي حادث." } }
      ],
      callout: { type: "result", text: { en: "The deployment of AI in surveillance fosters proactive security measures, ultimately leading to safer transit environments and more secure cities.", ar: "يعزز نشر الذكاء الاصطناعي في المراقبة التدابير الأمنية الاستباقية، مما يؤدي في النهاية إلى بيئات نقل أكثر أماناً ومدن أكثر حماية." } },
      image: "/assets/images/sec08_safety_f368e545.png"
    },
    {
      num: 9,
      title: { en: "Academic Spotlight: AI and Smart Transport Research in Dubai", ar: "تسليط الضوء الأكاديمي: أبحاث الذكاء الاصطناعي والنقل الذكي في دبي" },
      shortTitle: { en: "Academic Spotlight", ar: "الأبحاث الأكاديمية" },
      body: [
        { en: "The RTA's commitment to innovation is mirrored by active academic research focusing on Dubai's transport ecosystem. Recent studies highlight the transformative potential of AI in our specific context:", ar: "ينعكس التزام هيئة الطرق والمواصلات بالابتكار في الأبحاث الأكاديمية النشطة التي تركز على منظومة النقل في دبي. تسلط الدراسات الحديثة الضوء على الإمكانات التحويلية للذكاء الاصطناعي في سياقنا المحدد:" },
        { en: "1. Leveraging AI and IoT for Smart Transportation in the UAE — This 2025 study explores the integration of AI and IoT across Dubai's transport networks. It highlights the RTA's ambitious plans to deploy 4,000 autonomous vehicles, aiming for 25% of all trips to be autonomous. The research specifically emphasizes the role of AI in Autonomous Emergency Braking (AEB) systems and proposes stronger government-academic partnerships.", ar: "1. الاستفادة من الذكاء الاصطناعي وإنترنت الأشياء للنقل الذكي في الإمارات — تستكشف هذه الدراسة لعام 2025 دمج الذكاء الاصطناعي وإنترنت الأشياء عبر شبكات النقل في دبي. وتسلط الضوء على خطط الهيئة الطموحة لنشر 4,000 مركبة ذاتية القيادة، بهدف أن تكون 25% من جميع الرحلات ذاتية القيادة." },
        { en: "2. AI-Driven Energy Optimization in Urban Logistics — A recent study in the journal Sustainability examined how AI optimizes energy consumption in Dubai's urban logistics. The researchers found that AI solutions led to a 13.9% decrease in fuel consumption and a 17.3% decrease in energy use.", ar: "2. تحسين الطاقة المدعوم بالذكاء الاصطناعي في اللوجستيات الحضرية — فحصت دراسة حديثة في مجلة Sustainability كيف يُحسّن الذكاء الاصطناعي استهلاك الطاقة في اللوجستيات الحضرية في دبي. وجد الباحثون أن حلول الذكاء الاصطناعي أدت إلى انخفاض بنسبة 13.9% في استهلاك الوقود و17.3% في استخدام الطاقة." },
        { en: "3. Innovative Pavement Management System for Sustainable Roads — Research published in 2025 demonstrates how AI and big data are revolutionizing road maintenance in Dubai. By combining smartphone-based roughness detection with advanced laser scanning, this hybrid system allows for economical, real-time monitoring of road conditions.", ar: "3. نظام إدارة الرصف المبتكر للطرق المستدامة — يوضح بحث نُشر في 2025 كيف يُحدث الذكاء الاصطناعي والبيانات الضخمة ثورة في صيانة الطرق في دبي. من خلال الجمع بين كشف خشونة الطرق عبر الهواتف الذكية والمسح الليزري المتقدم، يتيح هذا النظام الهجين مراقبة اقتصادية وفورية لحالة الطرق." }
      ],
      image: "/assets/images/sec09_academic_22788f4f.png"
    },
    {
      num: 10,
      title: { en: "AI at Work: Enhancing Staff Efficiency", ar: "الذكاء الاصطناعي في العمل: تعزيز كفاءة الموظفين" },
      shortTitle: { en: "AI at Work", ar: "أدوات العمل" },
      body: [
        { en: "As AI transforms our external operations, it is equally vital for enhancing our internal productivity. Equipping our staff with the right AI tools can significantly reduce administrative burdens and accelerate high-value work.", ar: "بينما يُحوّل الذكاء الاصطناعي عملياتنا الخارجية، فإنه بنفس القدر من الأهمية لتعزيز إنتاجيتنا الداخلية. تزويد موظفينا بأدوات الذكاء الاصطناعي المناسبة يمكن أن يقلل بشكل كبير من الأعباء الإدارية ويسرّع العمل ذي القيمة العالية." }
      ],
      bullets: [
        { label: { en: "Microsoft 365 Copilot", ar: "مايكروسوفت 365 كوبايلوت" }, text: { en: "Seamlessly integrated into Word, Excel, PowerPoint, and Teams, Copilot acts as a daily digital assistant. It can instantly draft reports, summarize lengthy email threads, analyze complex data sets, and generate presentations.", ar: "مدمج بسلاسة في Word وExcel وPowerPoint وTeams، يعمل كوبايلوت كمساعد رقمي يومي. يمكنه صياغة التقارير فوراً، وتلخيص سلاسل البريد الإلكتروني الطويلة، وتحليل مجموعات البيانات المعقدة، وإنشاء العروض التقديمية." } },
        { label: { en: "Perplexity AI", ar: "بيربلكستي AI" }, text: { en: "An AI-powered answer engine that provides real-time, cited sources from the web. Ideal for fact-checking, gathering industry trends, and compiling policy research.", ar: "محرك إجابات مدعوم بالذكاء الاصطناعي يوفر مصادر موثقة في الوقت الفعلي من الإنترنت. مثالي للتحقق من الحقائق، وجمع اتجاهات الصناعة، وتجميع أبحاث السياسات." } },
        { label: { en: "AI Meeting Assistants", ar: "مساعدو الاجتماعات الذكية" }, text: { en: "Tools like Fireflies.ai and Granola automatically transcribe meetings, generate concise summaries, and extract key action items — letting staff focus on the discussion rather than note-taking.", ar: "أدوات مثل Fireflies.ai وGranola تنسخ الاجتماعات تلقائياً، وتولد ملخصات موجزة، وتستخرج بنود العمل الرئيسية — مما يتيح للموظفين التركيز على النقاش بدلاً من تدوين الملاحظات." } }
      ],
      callout: { type: "result", text: { en: "Embracing these tools will empower RTA employees to work smarter, fostering a culture of continuous innovation from the inside out.", ar: "سيُمكّن تبني هذه الأدوات موظفي الهيئة من العمل بذكاء أكبر، مما يعزز ثقافة الابتكار المستمر من الداخل إلى الخارج." } },
      image: "/assets/images/sec10_tools_e5332c95.png"
    }
  ],
  references: [
    { id: 1, text: 'Badhan, A., Kaur, P., Kumar, A., & Mishra, V. P. (2025). "Leveraging AI and IoT for Smart Transportation in the UAE." 8th ICOEI.', url: "https://ieeexplore.ieee.org/abstract/document/11013108/" },
    { id: 2, text: 'Mohsen, B. M., & Mohsen, M. (2025). "AI-Driven Energy Optimization in Urban Logistics." Sustainability, 17(18).', url: "https://www.mdpi.com/2071-1050/17/18/8301" },
    { id: 3, text: 'Saeed, M. (2025). "Innovative Pavement Management System & Sustainable Roads in Dubai." Lex Localis.', url: "https://www.researchgate.net/publication/394995432" },
    { id: 4, text: 'Microsoft. (2026). "AI in Government: Benefits and Use Cases | Microsoft Copilot."', url: "https://www.microsoft.com/en-us/microsoft-copilot/copilot-101/ai-for-government" },
    { id: 5, text: 'Zapier. (2025). "The best AI productivity tools in 2026."', url: "https://zapier.com/blog/best-ai-productivity-tools/" }
  ]
};

export const editions: Edition[] = [edition1];

export function getEdition(id: string): Edition | undefined {
  return editions.find((e) => e.id === id);
}
