/**
 * Newsletter Seed Script — RTA AI Newsletter (Railway DB)
 *
 * Run: node seed-newsletters.mjs
 *
 * Inserts 15 bilingual (English + Arabic) newsletters:
 *   Edition 1 → 10 newsletters (sections 1–10)
 *   Edition 2 → 5 newsletters  (sections 1–5)
 *
 * Requires DATABASE_URL in .env pointing to Railway MySQL.
 */

import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set in .env');
  process.exit(1);
}

const newsletters = [
  // ─────────────────────────────────────────────
  //  EDITION 1  (editionNumber=1, sections 1–10)
  // ─────────────────────────────────────────────
  {
    editionNumber: 1,
    sectionNumber: 1,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'Global AI Landscape: Where the World Stands Today',
    titleAr: 'المشهد العالمي للذكاء الاصطناعي: أين يقف العالم اليوم',
    contentEn: `The global AI landscape is undergoing an unprecedented transformation. Nations, corporations, and institutions are racing to harness artificial intelligence as the defining technology of the 21st century. The United States, China, the European Union, and the Gulf states are each charting distinct paths, investing billions in research, talent, and infrastructure.

In 2024 alone, global AI investment surpassed $200 billion, with generative AI accounting for the largest share. Large language models (LLMs), multimodal systems, and autonomous agents have moved from research labs into production environments at extraordinary speed. Meanwhile, countries like the UAE have positioned AI as a national strategic priority — embedding it across government services, healthcare, transport, and education.

For the Roads and Transport Authority (RTA), understanding this global context is essential. The same technologies shaping autonomous vehicles in Silicon Valley, predictive logistics in Shanghai, and smart traffic in Singapore are being adapted and deployed right here in Dubai. This section sets the stage for the detailed explorations that follow — from governance to productivity, from aviation to urban safety.`,
    contentAr: `يشهد المشهد العالمي للذكاء الاصطناعي تحولاً غير مسبوق. تتسابق الدول والشركات والمؤسسات لتسخير الذكاء الاصطناعي باعتباره التقنية المحورية للقرن الحادي والعشرين. تسلك كلٌّ من الولايات المتحدة والصين والاتحاد الأوروبي ودول الخليج مسارات متميزة، وتستثمر مليارات الدولارات في البحث والمواهب والبنية التحتية.

في عام 2024 وحده، تجاوزت الاستثمارات العالمية في الذكاء الاصطناعي 200 مليار دولار، إذ استحوذ الذكاء الاصطناعي التوليدي على الحصة الأكبر منها. وقد انتقلت نماذج اللغة الكبيرة والأنظمة متعددة الوسائط والوكلاء المستقلون من المختبرات البحثية إلى بيئات الإنتاج بسرعة استثنائية. في الوقت ذاته، جعلت دولة الإمارات العربية المتحدة الذكاء الاصطناعي أولوية استراتيجية وطنية، إذ دمجته في الخدمات الحكومية والرعاية الصحية والنقل والتعليم.

بالنسبة لهيئة الطرق والمواصلات، يُعدّ فهم هذا السياق العالمي أمراً بالغ الأهمية. إن التقنيات ذاتها التي تُشكّل المركبات ذاتية القيادة في وادي السيليكون واللوجستيات التنبؤية في شنغهاي والمرور الذكي في سنغافورة، يجري تكييفها ونشرها هنا في دبي. يُمهّد هذا القسم الطريق للاستكشافات التفصيلية التي تلي — من الحوكمة إلى الإنتاجية، ومن الطيران إلى السلامة الحضرية.`,
  },
  {
    editionNumber: 1,
    sectionNumber: 2,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'AI Governance: Building Trust in Intelligent Systems',
    titleAr: 'حوكمة الذكاء الاصطناعي: بناء الثقة في الأنظمة الذكية',
    contentEn: `As AI systems grow more powerful and pervasive, governance has emerged as one of the most critical challenges of our time. Who is responsible when an AI makes a harmful decision? How do we ensure fairness, transparency, and accountability in automated systems that affect millions of people daily?

The UAE AI Ethics Principles and the EU AI Act represent contrasting yet complementary approaches. The UAE framework emphasizes innovation-friendly governance that enables rapid deployment while maintaining ethical guardrails. The EU AI Act introduces risk-based classification — high-risk AI systems in transport, healthcare, and law enforcement face strict requirements for transparency and human oversight.

For RTA, governance translates into practical frameworks: auditable algorithms for traffic signal control, explainable AI for predictive maintenance decisions, and clear accountability chains when autonomous vehicles encounter edge cases. Building public trust in AI-driven transport requires not just technical excellence, but robust governance structures that citizens can understand and rely upon.

Key governance pillars for transport AI include: algorithmic transparency, bias auditing, human-in-the-loop protocols for high-stakes decisions, incident reporting mechanisms, and continuous performance monitoring.`,
    contentAr: `مع تنامي قدرة أنظمة الذكاء الاصطناعي وانتشارها، برزت الحوكمة باعتبارها من أهم التحديات في عصرنا. مَن يتحمل المسؤولية حين يتخذ الذكاء الاصطناعي قراراً ضاراً؟ وكيف نضمن الإنصاف والشفافية والمساءلة في الأنظمة الآلية التي تؤثر يومياً في ملايين البشر؟

تمثّل مبادئ أخلاقيات الذكاء الاصطناعي في الإمارات وقانون الذكاء الاصطناعي الأوروبي نهجَين متباينَين ومتكاملَين في آنٍ واحد. يُركّز الإطار الإماراتي على حوكمة صديقة للابتكار تتيح النشر السريع مع الحفاظ على الضمانات الأخلاقية. في المقابل، يُقدّم قانون الذكاء الاصطناعي الأوروبي تصنيفاً قائماً على المخاطر، إذ تواجه أنظمة الذكاء الاصطناعي عالية الخطورة في قطاعات النقل والرعاية الصحية وإنفاذ القانون متطلبات صارمة تتعلق بالشفافية والرقابة البشرية.

بالنسبة لهيئة الطرق والمواصلات، تتجسد الحوكمة في أطر عملية: خوارزميات قابلة للتدقيق في التحكم بإشارات المرور، وذكاء اصطناعي قابل للتفسير في قرارات الصيانة التنبؤية، وسلاسل مساءلة واضحة حين تواجه المركبات ذاتية القيادة حالات حافة. يستلزم بناء الثقة العامة في نظام النقل المدفوع بالذكاء الاصطناعي ليس فقط التميز التقني، بل أطر حوكمة متينة يستطيع المواطنون فهمها والاطمئنان إليها.`,
  },
  {
    editionNumber: 1,
    sectionNumber: 3,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'AI and Productivity: Transforming the RTA Workforce',
    titleAr: 'الذكاء الاصطناعي والإنتاجية: تحويل القوى العاملة في هيئة الطرق والمواصلات',
    contentEn: `Productivity transformation through AI is one of the most tangible and immediate benefits organizations can realize. At RTA, AI-powered tools are already augmenting the capabilities of engineers, planners, customer service agents, and operational teams — enabling them to accomplish more with greater accuracy and speed.

Generative AI tools have transformed knowledge work: drafting reports, summarizing technical documents, translating content between Arabic and English, generating data visualizations, and even writing code. Studies show that employees using AI assistants complete tasks 37% faster on average, with significant improvements in output quality for complex analytical work.

For transport operations specifically, AI productivity gains are striking. Predictive maintenance AI reduces equipment downtime by 20-35%. AI-powered scheduling systems optimize bus routes in real-time, improving fleet utilization by 15-25%. Computer vision systems automated inspection of road infrastructure, reducing manual survey costs by 60%.

The key to realizing these gains is not replacement but augmentation — empowering RTA's talented workforce with AI tools that handle repetitive, data-intensive tasks while humans focus on creative problem-solving, stakeholder engagement, and strategic decision-making.`,
    contentAr: `يُعدّ تحول الإنتاجية عبر الذكاء الاصطناعي من أكثر الفوائد ملموسية وفورية التي يمكن للمؤسسات تحقيقها. في هيئة الطرق والمواصلات، تُعزّز أدوات الذكاء الاصطناعي بالفعل قدرات المهندسين والمخططين وموظفي خدمة العملاء وفرق التشغيل، مما يمكّنهم من إنجاز المزيد بدقة وسرعة أكبر.

حوّلت أدوات الذكاء الاصطناعي التوليدي العمل المعرفي: صياغة التقارير، وتلخيص الوثائق التقنية، وترجمة المحتوى بين العربية والإنجليزية، وإنشاء تصورات البيانات، وحتى كتابة الشفرات البرمجية. تُظهر الدراسات أن الموظفين الذين يستخدمون المساعدين الذكيين ينجزون المهام أسرع بنسبة 37% في المتوسط، مع تحسينات ملحوظة في جودة المخرجات للأعمال التحليلية المعقدة.

في عمليات النقل تحديداً، تبرز مكاسب الإنتاجية بوضوح. يُقلّل ذكاء الصيانة التنبؤية من وقت توقف المعدات بنسبة 20-35%. وتُحسّن أنظمة الجدولة بالذكاء الاصطناعي مسارات الحافلات في الوقت الفعلي، مما يرفع معدل استخدام الأسطول بنسبة 15-25%. فضلاً عن ذلك، تُؤتمت أنظمة الرؤية الحاسوبية عمليات فحص البنية التحتية للطرق، مما يُخفّض تكاليف المسح اليدوي بنسبة 60%.

يكمن مفتاح تحقيق هذه المكاسب في التعزيز لا في الإحلال — تمكين القوى العاملة الموهوبة في الهيئة بأدوات الذكاء الاصطناعي التي تتولى المهام المتكررة وكثيفة البيانات، بينما ينصبّ تركيز البشر على حل المشكلات الإبداعي وإشراك أصحاب المصلحة واتخاذ القرارات الاستراتيجية.`,
  },
  {
    editionNumber: 1,
    sectionNumber: 4,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'AI in Railways: Smart Metros and Predictive Operations',
    titleAr: 'الذكاء الاصطناعي في قطاع السكك الحديدية: المترو الذكي والعمليات التنبؤية',
    contentEn: `Dubai Metro stands as one of the world's most advanced urban rail systems — fully automated, driverless, and increasingly enhanced by artificial intelligence. But the integration of AI in railway operations goes far beyond automation; it represents a fundamental shift in how mass transit systems are managed, maintained, and experienced by passengers.

Predictive maintenance is the cornerstone of AI-driven railway operations. Vibration sensors embedded in train bogies, track circuits, and station escalators continuously feed data to machine learning models that detect anomalies weeks before they become failures. This approach has reduced unplanned downtime on Dubai Metro by an estimated 30%, translating directly to improved service reliability.

AI-powered passenger flow management analyzes real-time data from station cameras and fare gate systems to predict crowding 20-30 minutes ahead. Dynamic train spacing, platform screen door optimization, and proactive staff deployment all respond to these predictions — creating a smoother, safer passenger experience even during peak hours.

Energy optimization is another frontier. AI systems now dynamically adjust regenerative braking schedules, station climate control, and lighting systems based on real-time passenger load and weather conditions — reducing energy consumption by up to 18%.`,
    contentAr: `يُعدّ مترو دبي واحداً من أكثر أنظمة سكك حديد الحضر تطوراً في العالم — آلياً بالكامل، وبلا سائق، ومُعزَّزاً بشكل متزايد بالذكاء الاصطناعي. غير أن دمج الذكاء الاصطناعي في عمليات السكك الحديدية يتجاوز الأتمتة بكثير؛ إذ يمثّل تحولاً جذرياً في طريقة إدارة أنظمة النقل الجماعي وصيانتها وتجربة الركاب لها.

تُشكّل الصيانة التنبؤية ركيزة عمليات السكك الحديدية المدعومة بالذكاء الاصطناعي. تُغذّي أجهزة استشعار الاهتزاز المدمجة في عربات القطارات ودوائر السكة والسلالم الكهربائية بالمحطات نماذجَ التعلم الآلي باستمرار، للكشف عن الشذوذات قبل أسابيع من تحولها إلى أعطال. وقد أسهم هذا النهج في تقليل وقت التوقف غير المخطط له في مترو دبي بنسبة تُقدَّر بـ30%، مما ينعكس مباشرةً على تحسين موثوقية الخدمة.

تُحلّل إدارة تدفق الركاب بالذكاء الاصطناعي البيانات الفورية من كاميرات المحطات وأنظمة بوابات الأجرة، لتتنبأ بالازدحام قبل 20-30 دقيقة. وتستجيب المسافة الديناميكية بين القطارات، وتحسين أبواب رصيف المحطة، والنشر الاستباقي للموظفين لهذه التنبؤات — مما يخلق تجربة ركوب أكثر سلاسةً وأماناً حتى في ساعات الذروة.

يمثّل تحسين الطاقة حدوداً أخرى؛ إذ تُعدّل أنظمة الذكاء الاصطناعي الآن جداول الكبح التجديدي وتكييف الهواء في المحطات وأنظمة الإضاءة ديناميكياً بناءً على الحمل الفوري للركاب وظروف الطقس، مما يُقلّل استهلاك الطاقة بنسبة تصل إلى 18%.`,
  },
  {
    editionNumber: 1,
    sectionNumber: 5,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'AI in Traffic Management: From Signals to City-Wide Intelligence',
    titleAr: 'الذكاء الاصطناعي في إدارة المرور: من الإشارات إلى الذكاء على مستوى المدينة',
    contentEn: `Traffic congestion costs cities worldwide trillions of dollars annually in lost productivity, fuel waste, and environmental damage. Dubai has emerged as a global leader in deploying AI-driven traffic management to address this challenge — transforming what was once a reactive system of fixed-timing signals into a dynamic, learning network that adapts in real time.

RTA's Integrated Traffic Management Center (ITMC) represents the nerve center of Dubai's AI traffic ecosystem. Over 12,000 cameras, 3,500 induction loops, and hundreds of radar sensors feed continuous data streams into AI systems that optimize signal timing across the entire road network simultaneously. The result: a 23% reduction in average journey times on monitored corridors.

Adaptive traffic signal control uses reinforcement learning — the same technique that made AlphaGo a world champion at Go — to discover optimal signal timing patterns through millions of simulated scenarios. Unlike traditional fixed-phase signals, these systems respond to actual traffic conditions, pedestrian demand, and even emergency vehicle priority in milliseconds.

The next frontier is vehicle-to-infrastructure (V2I) communication: traffic signals that directly communicate with approaching vehicles, providing optimal speed advisories that allow cars to hit every green light — a concept called "green wave" driving. Early pilots in Dubai have shown fuel savings of up to 12% and a 34% reduction in stop-and-go driving on equipped corridors.`,
    contentAr: `تُكلّف ازدحامات المرور مدنَ العالم تريليونات الدولارات سنوياً في خسائر الإنتاجية وهدر الوقود والأضرار البيئية. ظهرت دبي بوصفها رائدة عالمية في نشر إدارة المرور المدعومة بالذكاء الاصطناعي لمواجهة هذا التحدي، محوّلةً ما كان نظاماً تفاعلياً من الإشارات ذات التوقيت الثابت إلى شبكة ديناميكية متعلّمة تتكيف في الوقت الفعلي.

يمثّل مركز إدارة المرور المتكامل لهيئة الطرق والمواصلات المركز العصبي لمنظومة مرور دبي الذكية. تُغذّي أكثر من 12,000 كاميرا و3,500 حلقة استحثاث ومئات من أجهزة استشعار الرادار تدفقات بيانات مستمرة لأنظمة الذكاء الاصطناعي التي تُحسّن توقيت الإشارات عبر شبكة الطرق بأكملها في آنٍ واحد. والنتيجة: انخفاض بنسبة 23% في متوسط أوقات الرحلة على الممرات المُراقَبة.

يستخدم التحكم التكيفي في إشارات المرور التعلم المعزز — الأسلوب ذاته الذي جعل AlphaGo بطلاً عالمياً في لعبة Go — لاكتشاف أنماط توقيت الإشارات المثلى من خلال ملايين السيناريوهات المُحاكاة. وخلافاً لإشارات المرحلة الثابتة التقليدية، تستجيب هذه الأنظمة لأوضاع المرور الفعلية وطلب المشاة وأولوية مركبات الطوارئ في غضون أجزاء من الثانية.

الحدود التالية هي الاتصال بين المركبة والبنية التحتية: إشارات مرور تتواصل مباشرةً مع المركبات المقتربة، مقدّمةً إرشادات السرعة المثلى التي تتيح للسيارات اجتياز كل إشارة خضراء — وهو مفهوم يُعرف بـ"قيادة الموجة الخضراء". أظهرت التجارب الأولية في دبي توفيراً في الوقود يبلغ 12% وانخفاضاً بنسبة 34% في قيادة التوقف والانطلاق على الممرات المُجهَّزة.`,
  },
  {
    editionNumber: 1,
    sectionNumber: 6,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'AI in Aviation: Transforming Airports and Air Traffic Control',
    titleAr: 'الذكاء الاصطناعي في الطيران: تحويل المطارات وإدارة حركة الجو',
    contentEn: `Aviation stands at the forefront of AI adoption, driven by the sector's uncompromising safety standards, massive data generation, and extraordinary operational complexity. Dubai International Airport — one of the world's busiest — has become a living laboratory for AI-driven aviation transformation.

Baggage handling, historically a major source of passenger dissatisfaction and operational cost, has been revolutionized by computer vision and robotics. AI-powered sorting systems at DXB process over 90,000 bags daily with an error rate below 0.1%. Computer vision cameras automatically read bag tags, classify items by size and weight, and route them to the correct aircraft — all without human intervention.

Passenger flow management uses AI to predict congestion at security checkpoints, immigration counters, and boarding gates up to 90 minutes in advance. This enables dynamic resource allocation: opening additional lanes, redeploying staff, and even adjusting flight boarding sequences to smooth passenger flow.

Air Traffic Management (ATM) represents perhaps the most consequential application of AI in aviation. Machine learning models now assist controllers in predicting optimal flight paths, detecting potential conflicts, and managing weather-related disruptions. The implementation of SWIM (System Wide Information Management) protocols enables real-time data sharing between airports, airlines, and ATC systems — creating the foundation for truly collaborative air traffic management.`,
    contentAr: `يقف قطاع الطيران في طليعة اعتماد الذكاء الاصطناعي، مدفوعاً بمعايير السلامة الصارمة في هذا القطاع وتوليده الهائل للبيانات وتعقيده التشغيلي الاستثنائي. وقد غدا مطار دبي الدولي — أحد أكثر المطارات ازدحاماً في العالم — مختبراً حياً لتحول الطيران المدفوع بالذكاء الاصطناعي.

ثورة الذكاء الاصطناعي في قطاع الطيران تجلّت في معالجة الأمتعة التي كانت تاريخياً مصدراً رئيسياً لعدم رضا المسافرين والتكاليف التشغيلية. تعالج أنظمة الفرز المدعومة بالذكاء الاصطناعي في مطار دبي الدولي أكثر من 90,000 حقيبة يومياً بمعدل خطأ أقل من 0.1%. تقرأ كاميرات الرؤية الحاسوبية ملصقات الحقائب تلقائياً، وتُصنّف العناصر حسب الحجم والوزن، وتوجّهها إلى الطائرة الصحيحة — كل ذلك دون تدخل بشري.

تستخدم إدارة تدفق المسافرين الذكاءَ الاصطناعي للتنبؤ بالازدحام عند نقاط التفتيش الأمني ومكاتب الهجرة وبوابات الصعود قبل 90 دقيقة. وهذا ما يُمكّن من التخصيص الديناميكي للموارد: فتح ممرات إضافية وإعادة نشر الموظفين وحتى تعديل تسلسل الصعود إلى الطائرات لتسهيل تدفق المسافرين.

تمثّل إدارة حركة الجو ربما أهم تطبيقات الذكاء الاصطناعي في الطيران. تُساعد نماذج التعلم الآلي الآن المراقبين في التنبؤ بمسارات الطيران المثلى وكشف النزاعات المحتملة وإدارة الاضطرابات المرتبطة بالطقس. وقد أرسى تطبيق بروتوكولات SWIM الأساسَ لإدارة حقيقية وتعاونية لحركة الجو.`,
  },
  {
    editionNumber: 1,
    sectionNumber: 7,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'AI in Logistics: Smart Supply Chains for a Connected City',
    titleAr: 'الذكاء الاصطناعي في اللوجستيات: سلاسل الإمداد الذكية لمدينة متصلة',
    contentEn: `The logistics industry is undergoing its most profound transformation in decades, driven by AI capabilities that are reshaping everything from demand forecasting and warehouse automation to last-mile delivery and customs clearance. For a global trade hub like Dubai, AI-powered logistics represents a strategic competitive advantage.

Dubai's Logistics Cluster, spanning Jebel Ali Free Zone, Dubai South, and the surrounding infrastructure, handles hundreds of billions of dollars in goods annually. AI is optimizing every node in this complex network. Demand forecasting models using deep learning analyze historical data, seasonal patterns, economic indicators, and even social media trends to predict inventory needs with 94% accuracy — dramatically reducing both stockouts and excess inventory costs.

Warehouse automation has leaped forward: autonomous mobile robots (AMRs) navigate warehouse floors alongside human workers, carrying goods and managing inventory. Computer vision systems perform quality control inspections at speeds no human could match. AI-powered conveyor routing systems sort packages by destination, size, and delivery priority in milliseconds.

Last-mile delivery — the most expensive and carbon-intensive leg of logistics — is being optimized through AI-driven route planning. Algorithms that consider real-time traffic, package weight, time windows, and delivery clustering reduce delivery costs by 20-30% while cutting emissions. Dubai is piloting autonomous delivery vehicles and drone delivery systems that could transform urban last-mile logistics within the decade.`,
    contentAr: `يمرّ قطاع اللوجستيات بتحوله الأعمق منذ عقود، مدفوعاً بقدرات الذكاء الاصطناعي التي تُعيد تشكيل كل شيء بدءاً من التنبؤ بالطلب وأتمتة المستودعات وصولاً إلى التوصيل في المرحلة الأخيرة وتخليص الجمارك. وبالنسبة لمركز تجاري عالمي كدبي، يمثّل اللوجستيات المدعوم بالذكاء الاصطناعي ميزةً تنافسية استراتيجية.

تتولى مجموعة اللوجستيات في دبي، التي تمتد عبر المنطقة الحرة لجبل علي ودبي الجنوب والبنية التحتية المحيطة بها، معالجةَ بضائع تُقدَّر بمئات المليارات من الدولارات سنوياً. يُحسّن الذكاء الاصطناعي كل عقدة في هذه الشبكة المعقدة. تُحلّل نماذج التنبؤ بالطلب باستخدام التعلم العميق البيانات التاريخية والأنماط الموسمية والمؤشرات الاقتصادية وحتى اتجاهات وسائل التواصل الاجتماعي، للتنبؤ باحتياجات المخزون بدقة تبلغ 94%.

قفزت أتمتة المستودعات إلى الأمام بخطى واسعة: تتنقل الروبوتات المتنقلة الذاتية في أرضية المستودعات إلى جانب العمال البشريين. وتُجري أنظمة الرؤية الحاسوبية عمليات التفتيش لمراقبة الجودة بسرعات لا يستطيع الإنسان مجاراتها. وتُفرز أنظمة توجيه ناقل الحركة الذكية الطرود حسب الوجهة والحجم وأولوية التسليم في أجزاء من الثانية.

تتمّ عملية التوصيل في المرحلة الأخيرة — أغلى مراحل اللوجستيات وأكثرها كثافةً في إنبعاثات الكربون — من خلال تخطيط مسار مدفوع بالذكاء الاصطناعي يُخفّض تكاليف التسليم بنسبة 20-30% مع تقليل الانبعاثات. وتختبر دبي مركبات التوصيل ذاتية القيادة وأنظمة التوصيل بالطائرات المسيّرة التي قد تُحوّل لوجستيات المرحلة الأخيرة في المدن خلال العقد الحالي.`,
  },
  {
    editionNumber: 1,
    sectionNumber: 8,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'Road Safety and AI: Zero Accidents as a Reachable Goal',
    titleAr: 'سلامة الطرق والذكاء الاصطناعي: أصفار الحوادث هدف قابل للتحقيق',
    contentEn: `Road traffic accidents remain one of humanity's most preventable tragedies, claiming 1.35 million lives annually worldwide. Dubai's Vision Zero initiative — aiming to eliminate road fatalities entirely — is harnessing artificial intelligence as its most powerful tool. The numbers are promising: AI-enhanced safety interventions have contributed to a 40% reduction in Dubai road fatalities over the past decade.

Computer vision camera networks deployed across Dubai's road network analyze driver behavior in real-time: detecting distracted driving, lane violations, tailgating, and speeding with unprecedented precision. Unlike traditional speed cameras, these AI systems can identify dangerous behaviors before they result in accidents — enabling proactive intervention rather than reactive punishment.

Predictive accident risk modeling represents a paradigm shift. Machine learning models analyze thousands of variables — road geometry, historical accident data, traffic volume, weather conditions, time of day, nearby events, and even social media sentiment — to generate real-time risk heat maps across the road network. High-risk zones receive immediate interventions: variable speed limits, enhanced warning systems, and targeted enforcement.

Driver behavior analytics extend into fleet management. Commercial vehicle operators can access AI dashboards that score driver behavior, identify coaching opportunities, and predict which drivers are most likely to be involved in incidents. Insurance companies are beginning to integrate these scores into premium calculations — creating powerful financial incentives for safer driving.`,
    contentAr: `لا تزال حوادث حركة المرور من أكثر مآسي البشرية قابليةً للوقاية، إذ تودي بحياة 1.35 مليون شخص سنوياً في جميع أنحاء العالم. تستعين مبادرة دبي لصفر حوادث — الرامية إلى القضاء على وفيات الطرق كلياً — بالذكاء الاصطناعي بوصفه أقوى أدواتها. والأرقام واعدة: أسهمت تدخلات السلامة المعززة بالذكاء الاصطناعي في خفض وفيات الطرق في دبي بنسبة 40% خلال العقد الماضي.

تُحلّل شبكات كاميرات الرؤية الحاسوبية المنتشرة عبر شبكة طرق دبي سلوك السائقين في الوقت الفعلي: الكشف عن التشتت أثناء القيادة ومخالفات المسار والمتابعة عن قرب والسرعة الزائدة بدقة غير مسبوقة. وخلافاً لكاميرات السرعة التقليدية، تستطيع هذه الأنظمة الذكية تحديد السلوكيات الخطرة قبل أن تُفضي إلى حوادث.

يمثّل نمذجة مخاطر الحوادث التنبؤية تحولاً نوعياً. تُحلّل نماذج التعلم الآلي آلاف المتغيرات — هندسة الطريق وبيانات الحوادث التاريخية وحجم المرور والظروف الجوية والوقت من اليوم والأحداث القريبة — لإنتاج خرائط حرارية للمخاطر في الوقت الفعلي عبر شبكة الطرق. وتتلقى المناطق عالية الخطورة تدخلات فورية: حدود سرعة متغيرة وأنظمة تحذير معززة وإنفاذ مستهدف.

يمتد تحليل سلوك السائق إلى إدارة الأساطيل. يمكن لمشغّلي المركبات التجارية الوصول إلى لوحات معلومات ذكية تُقيّم سلوك السائقين وتُحدد فرص التدريب وتتنبأ بأي السائقين الأكثر عرضة للتورط في حوادث. وبدأت شركات التأمين في دمج هذه الدرجات في حسابات الأقساط، مما يخلق حوافز مالية قوية للقيادة الآمنة.`,
  },
  {
    editionNumber: 1,
    sectionNumber: 9,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'AI in Academic Research: Advancing the Science of Transport',
    titleAr: 'الذكاء الاصطناعي في البحث الأكاديمي: تطوير علم النقل',
    contentEn: `The intersection of academic research and transport AI is producing breakthroughs that will define mobility for generations. Universities in Dubai, Abu Dhabi, and around the world are advancing the theoretical and applied foundations of intelligent transportation systems — creating the knowledge base that RTA's applied programs depend upon.

Khalifa University's Center for Autonomous Robotic Systems is developing next-generation control algorithms for autonomous vehicles that can handle Dubai's unique challenges: extreme heat affecting sensor performance, sandstorms reducing visibility, and mixed traffic environments with varying compliance to traffic rules.

New York University Abu Dhabi researchers are pioneering AI-powered urban mobility modeling that can simulate millions of trips simultaneously, evaluating the system-level impacts of policy changes, new infrastructure, or autonomous vehicle deployment before any real-world implementation. These digital twin environments reduce policy risk dramatically.

Deep learning approaches to traffic prediction have achieved remarkable accuracy: models trained on Dubai's sensor network can now forecast traffic conditions 4-6 hours ahead with 89% accuracy — enabling proactive rather than reactive network management. This research, developed in partnership between RTA and UAE universities, is being published in top international journals and adopted by transport agencies globally.`,
    contentAr: `يُنتج تقاطع البحث الأكاديمي وذكاء النقل اختراقات ستُحدد ملامح التنقل لأجيال قادمة. تُطوّر جامعات دبي وأبوظبي وما وراءهما الأسس النظرية والتطبيقية لأنظمة النقل الذكية، مما يُكوّن قاعدة المعرفة التي تعتمد عليها البرامج التطبيقية لهيئة الطرق والمواصلات.

يطوّر مركز جامعة خليفة للأنظمة الروبوتية الذاتية خوارزميات تحكم من الجيل التالي للمركبات ذاتية القيادة، قادرة على التعامل مع التحديات الفريدة لدبي: الحرارة الشديدة التي تؤثر في أداء أجهزة الاستشعار، وعواصف الرمال التي تُقلّص الرؤية، وبيئات الحركة المختلطة.

يرسم باحثو جامعة نيويورك أبوظبي آفاقاً جديدة في نمذجة التنقل الحضري بالذكاء الاصطناعي التي تُحاكي ملايين الرحلات في آنٍ واحد، مُقيّمةً التأثيرات على مستوى النظام لتغييرات السياسات أو البنية التحتية الجديدة أو نشر المركبات ذاتية القيادة قبل أي تطبيق فعلي.

حققت مناهج التعلم العميق في التنبؤ بالمرور دقةً ملحوظة: يمكن للنماذج المُدرَّبة على شبكة استشعار دبي الآن التنبؤ بأوضاع المرور قبل 4-6 ساعات بدقة 89% — مما يُمكّن من الإدارة الاستباقية للشبكة بدلاً من التفاعلية.`,
  },
  {
    editionNumber: 1,
    sectionNumber: 10,
    issueNumber: '1st Edition',
    publishDate: '2025-10-01',
    titleEn: 'AI Tools and Platforms: The Technology Stack Powering RTA Innovation',
    titleAr: 'أدوات ومنصات الذكاء الاصطناعي: المكدس التقني الذي يدعم ابتكار الهيئة',
    contentEn: `Behind every AI application at RTA lies a sophisticated stack of platforms, tools, and infrastructure that enables innovation at scale. Understanding this technology ecosystem is essential for leaders and practitioners who need to make informed decisions about AI adoption, vendor selection, and capability building.

Cloud platforms provide the foundational compute infrastructure. Microsoft Azure, AWS, and Google Cloud each offer specialized AI services: computer vision APIs, speech recognition, natural language processing, and managed machine learning services that dramatically reduce the time to deploy AI applications. RTA's hybrid cloud strategy maintains sensitive operational data on-premises while leveraging cloud AI services for analysis and inference.

Large Language Models (LLMs) have emerged as versatile productivity tools across RTA's operations. GPT-4, Claude, and Arabic-optimized models like Jais are being evaluated for document processing, customer service automation, technical report generation, and knowledge management. The ability to process Arabic text natively — without translation loss — is particularly valuable for an organization serving Dubai's multicultural population.

Edge AI is transforming field operations: compact AI processors deployed in traffic cameras, smart lampposts, and vehicle-mounted systems enable real-time inference without cloud connectivity. This is critical for safety-critical applications where milliseconds matter. NVIDIA Jetson and Intel Movidius platforms are enabling sophisticated computer vision applications at every intersection.

Open source frameworks — PyTorch, TensorFlow, and Hugging Face — combined with commercial MLOps platforms like MLflow and Weights & Biases, create the development infrastructure that RTA's data science teams use to build, train, evaluate, and deploy custom AI models at scale.`,
    contentAr: `خلف كل تطبيق للذكاء الاصطناعي في هيئة الطرق والمواصلات تكمن حزمة متطورة من المنصات والأدوات والبنية التحتية التي تُمكّن الابتكار على نطاق واسع. إن فهم هذا النظام البيئي التكنولوجي أمر جوهري للقادة والممارسين الذين يحتاجون إلى اتخاذ قرارات مدروسة بشأن اعتماد الذكاء الاصطناعي واختيار الموردين وبناء القدرات.

توفّر منصات الحوسبة السحابية البنية التحتية الأساسية للحوسبة. يُقدّم كلٌّ من Microsoft Azure وAWS وGoogle Cloud خدمات ذكاء اصطناعي متخصصة: واجهات برمجة الرؤية الحاسوبية والتعرف على الكلام ومعالجة اللغة الطبيعية وخدمات التعلم الآلي المُدارة التي تُقلّص وقت نشر تطبيقات الذكاء الاصطناعي بشكل كبير.

برزت نماذج اللغة الكبيرة بوصفها أدوات إنتاجية متعددة الاستخدامات عبر عمليات الهيئة. يجري تقييم GPT-4 وClaude والنماذج المُحسَّنة للعربية مثل جايس لمعالجة الوثائق وأتمتة خدمة العملاء وإنشاء التقارير التقنية وإدارة المعرفة. إن القدرة على معالجة النص العربي بشكل مباشر — دون فقدان الترجمة — ذات قيمة استثنائية لمؤسسة تخدم سكان دبي متعددي الثقافات.

يُحوّل الذكاء الاصطناعي الحافّي عمليات الميدان: معالجات الذكاء الاصطناعي المدمجة في كاميرات المرور والمصابيح الذكية والأنظمة المحمولة على المركبات تُمكّن من الاستنتاج الفوري دون الاتصال بالسحابة. وهذا أمر بالغ الأهمية للتطبيقات الحرجة للسلامة التي تستغرق فيها المللي ثانية أهمية قصوى.`,
  },

  // ─────────────────────────────────────────────
  //  EDITION 2  (editionNumber=2, sections 1–5)
  // ─────────────────────────────────────────────
  {
    editionNumber: 2,
    sectionNumber: 1,
    issueNumber: '2nd Edition',
    publishDate: '2025-12-01',
    titleEn: 'RTA AI Strategy 2030: Vision, Goals, and Roadmap',
    titleAr: 'استراتيجية الذكاء الاصطناعي لهيئة الطرق والمواصلات 2030: الرؤية والأهداف وخارطة الطريق',
    contentEn: `The Roads and Transport Authority's AI Strategy 2030 represents a comprehensive blueprint for embedding artificial intelligence into every dimension of Dubai's transport ecosystem. Aligned with the UAE National AI Strategy 2031 and Dubai's D33 Economic Agenda, this strategy charts a 10-year journey from AI experimentation to AI-native operations.

The strategy is built around five strategic pillars: Intelligent Infrastructure, Data-Driven Operations, AI-Enhanced Safety, Digital Customer Experience, and Sustainable Mobility. Each pillar has defined KPIs, budget allocations, and accountability frameworks that ensure systematic progress tracking.

Intelligent Infrastructure encompasses the deployment of 50,000 additional smart sensors across Dubai's road network, the establishment of an AI Operations Center with real-time monitoring of all transport systems, and the implementation of predictive maintenance across 100% of RTA's asset base by 2027.

The talent development component is particularly ambitious: a goal to train 3,000 RTA employees in AI literacy by 2026, establish dedicated AI squads in each operational division, and create a Center of AI Excellence that will serve as the hub for innovation, research partnerships, and knowledge sharing with global transport authorities.

International partnerships are central to the strategy's success. Collaborations with MIT, Stanford, and leading technology companies ensure RTA has access to cutting-edge research and proven methodologies, while knowledge transfer programs build internal capabilities that reduce long-term vendor dependency.`,
    contentAr: `تمثّل استراتيجية الذكاء الاصطناعي لهيئة الطرق والمواصلات لعام 2030 مخططاً شاملاً لدمج الذكاء الاصطناعي في كل بُعد من أبعاد منظومة النقل في دبي. ومتوافقةً مع استراتيجية الإمارات الوطنية للذكاء الاصطناعي 2031 وأجندة دبي الاقتصادية D33، ترسم هذه الاستراتيجية رحلة ممتدة عشر سنوات من تجريب الذكاء الاصطناعي إلى العمليات القائمة عليه بالكامل.

تقوم الاستراتيجية على خمس ركائز استراتيجية: البنية التحتية الذكية، والعمليات القائمة على البيانات، والسلامة المعززة بالذكاء الاصطناعي، وتجربة العملاء الرقمية، والتنقل المستدام. ولكل ركيزة مؤشرات أداء رئيسية محددة وتخصيصات للميزانية وأطر للمساءلة تضمن التتبع المنهجي للتقدم.

تشمل البنية التحتية الذكية نشر 50,000 جهاز استشعار ذكي إضافي عبر شبكة طرق دبي، وإنشاء مركز عمليات الذكاء الاصطناعي لمراقبة جميع أنظمة النقل في الوقت الفعلي، وتطبيق الصيانة التنبؤية على 100% من أصول الهيئة بحلول عام 2027.

يتسم مكوّن تنمية المواهب بالطموح الاستثنائي: هدف تدريب 3,000 موظف في الهيئة على محو الأمية الرقمية بحلول عام 2026، وتأسيس فِرَق ذكاء اصطناعي مخصصة في كل قسم تشغيلي، وإنشاء مركز التميز في الذكاء الاصطناعي الذي سيكون مركزاً للابتكار وشراكات البحث وتبادل المعرفة مع هيئات النقل العالمية.`,
  },
  {
    editionNumber: 2,
    sectionNumber: 2,
    issueNumber: '2nd Edition',
    publishDate: '2025-12-01',
    titleEn: 'Smart City Integration: How Transport AI Connects Dubai\'s Urban Fabric',
    titleAr: 'تكامل المدينة الذكية: كيف يربط ذكاء النقل نسيج دبي الحضري',
    contentEn: `Transport does not exist in isolation — it is the connective tissue that links every element of a city's economic and social life. As Dubai advances its Smart City vision, the integration of transport AI with adjacent urban systems is unlocking synergies that no single system could achieve alone.

The Dubai City Brain initiative represents the most ambitious attempt yet to integrate city-wide data streams into a unified intelligence layer. Transport sensors, utility networks, emergency services, commercial activity data, and citizen feedback systems all feed into this platform — enabling decision makers to see the city as a living, breathing organism and respond to emerging conditions before they become crises.

Real estate and transport AI are increasingly interlinked: machine learning models analyze transport accessibility scores, commute time projections, and planned infrastructure investments to generate urban growth predictions that inform both private investment and public planning decisions. Areas scoring highly on transport AI connectivity metrics are attracting premium development — creating virtuous cycles of investment and improvement.

Emergency response integration is particularly impactful: when a major incident occurs, the transport AI system automatically adjusts signal timing to clear priority corridors, reroutes public transit away from affected areas, alerts drivers via variable message signs and navigation apps, and coordinates with emergency services in real-time. Pilot implementations have reduced emergency response times by 23%.`,
    contentAr: `النقل لا يوجد في عزلة — إنه الرابط الذي يربط كل عنصر من عناصر الحياة الاقتصادية والاجتماعية في المدينة. مع تطور دبي نحو رؤية المدينة الذكية، يكشف دمج ذكاء النقل مع الأنظمة الحضرية المجاورة عن تآزرات لا يستطيع أي نظام منفرد تحقيقها.

تمثّل مبادرة دبي سيتي برين أطموح محاولة حتى الآن لدمج تدفقات البيانات على مستوى المدينة في طبقة ذكاء موحّدة. تُغذّي أجهزة استشعار النقل وشبكات المرافق وخدمات الطوارئ وبيانات النشاط التجاري وأنظمة التغذية الراجعة للمواطنين هذه المنصة جميعها، مما يُمكّن صانعي القرار من رؤية المدينة كائناً حياً والاستجابة للأوضاع الناشئة قبل أن تتحول إلى أزمات.

يزداد ترابط قطاعَي العقارات وذكاء النقل: تُحلّل نماذج التعلم الآلي درجات إمكانية الوصول إلى وسائل النقل وتوقعات وقت التنقل والاستثمارات في البنية التحتية المخطط لها، لتوليد تنبؤات بالنمو الحضري تُعلم قرارات الاستثمار الخاص والتخطيط العام معاً.

دمج الاستجابة للطوارئ ذو تأثير استثنائي: حين يقع حادث كبير، يُعدّل نظام ذكاء النقل تلقائياً توقيت الإشارات لتخليص ممرات الأولوية، ويُحوّل مسارات وسائل النقل العام بعيداً عن المناطق المتضررة، ويُنبّه السائقين عبر لافتات الرسائل المتغيرة وتطبيقات الملاحة، وينسّق مع خدمات الطوارئ في الوقت الفعلي. وأسفرت عمليات التطبيق التجريبية عن تقليص أوقات الاستجابة للطوارئ بنسبة 23%.`,
  },
  {
    editionNumber: 2,
    sectionNumber: 3,
    issueNumber: '2nd Edition',
    publishDate: '2025-12-01',
    titleEn: 'Autonomous Vehicles: The Road to Full Self-Driving in Dubai',
    titleAr: 'المركبات ذاتية القيادة: الطريق نحو القيادة الذاتية الكاملة في دبي',
    contentEn: `Dubai has set one of the world's most ambitious autonomous vehicle targets: 25% of all trips to be completed by autonomous means by 2030. This goal, enshrined in the Dubai Self-Driving Transport Strategy, is driving an extraordinary convergence of policy innovation, technology deployment, and infrastructure development.

The technology readiness landscape for autonomous vehicles has advanced dramatically. Tesla's Full Self-Driving system, Waymo's robotaxi network, and Zoox's purpose-built autonomous vehicles represent different approaches to the same challenge. In Dubai, Cruise and Uber ATG have conducted pilot programs, while local technology companies are developing AV solutions optimized for Gulf climate conditions.

The regulatory framework is equally critical. RTA has developed one of the world's most comprehensive AV regulatory frameworks — covering safety certification, insurance requirements, cybersecurity standards, data privacy protections, and incident reporting protocols. This framework provides the clarity that technology companies need to invest confidently in Dubai's AV market.

Infrastructure adaptation is ongoing: dedicated AV lanes on Sheikh Zayed Road, high-definition mapping of Dubai's entire road network to centimeter accuracy, V2X (vehicle-to-everything) communication infrastructure at 500 intersections, and an AI-powered AV monitoring center that tracks all autonomous vehicles in real-time.

The economic case is compelling: full autonomous mobility could reduce transport costs by 40%, eliminate 95% of road accidents caused by human error, and free up billions of hours of productive time currently lost to driving. For a city that spends billions on road infrastructure, the ROI of successful AV deployment is extraordinary.`,
    contentAr: `حددت دبي واحدة من أكثر أهداف المركبات ذاتية القيادة طموحاً في العالم: إتمام 25% من جميع الرحلات بوسائل ذاتية القيادة بحلول عام 2030. هذا الهدف، المُرسَّخ في استراتيجية دبي للنقل ذاتي القيادة، يدفع نحو تقاطع استثنائي من ابتكار السياسات ونشر التقنيات وتطوير البنية التحتية.

تطورت جاهزية التقنية للمركبات ذاتية القيادة بشكل ملحوظ. تمثّل أنظمة القيادة الذاتية الكاملة لتسلا وشبكة سيارات الأجرة الروبوتية لـ Waymo ومركبات Zoox ذاتية القيادة المصممة لهذا الغرض مناهج مختلفة للتحدي ذاته. وفي دبي، أجرت Cruise وUber ATG برامج تجريبية، فيما تطوّر شركات التكنولوجيا المحلية حلولاً للمركبات ذاتية القيادة مُحسَّنة لظروف مناخ الخليج.

الإطار التنظيمي بالغ الأهمية أيضاً. طوّرت الهيئة واحداً من أشمل الأطر التنظيمية للمركبات ذاتية القيادة في العالم، يُغطّي اعتماد السلامة ومتطلبات التأمين ومعايير الأمن السيبراني وحماية خصوصية البيانات وبروتوكولات الإبلاغ عن الحوادث.

تكييف البنية التحتية مستمر: مسارات مخصصة للمركبات ذاتية القيادة على شارع الشيخ زايد، ورسم خرائط عالية الدقة لشبكة طرق دبي بأكملها بدقة تصل إلى السنتيمتر، وبنية تحتية للاتصالات بين المركبة وكل شيء (V2X) في 500 تقاطع، ومركز مراقبة مدعوم بالذكاء الاصطناعي يتتبع جميع المركبات ذاتية القيادة في الوقت الفعلي.

الحجة الاقتصادية مقنعة: قد يُخفّض التنقل ذاتي القيادة الكامل تكاليف النقل بنسبة 40%، ويُلغي 95% من حوادث الطريق الناجمة عن خطأ بشري، ويُحرّر مليارات ساعات الإنتاجية المُهدَرة حالياً في القيادة.`,
  },
  {
    editionNumber: 2,
    sectionNumber: 4,
    issueNumber: '2nd Edition',
    publishDate: '2025-12-01',
    titleEn: 'AI Surveillance and Security: Balancing Safety with Privacy',
    titleAr: 'المراقبة الذكية والأمن: الموازنة بين السلامة والخصوصية',
    contentEn: `The deployment of AI-powered surveillance systems across Dubai's transport network has produced remarkable safety and security outcomes — but it also raises profound questions about privacy, civil liberties, and the appropriate boundaries of automated monitoring. Navigating this tension thoughtfully is essential for maintaining public trust in AI-enhanced transport systems.

Dubai's SafeCity program has deployed over 300,000 cameras across the emirate, with AI-powered analytics processing video feeds in real-time for: incident detection, crowd density monitoring, suspicious behavior identification, and emergency response coordination. The system has contributed to a 46% reduction in public safety incidents in monitored areas — a compelling argument for deployment.

Facial recognition technology remains the most contentious element. Used at border crossings and major transit hubs, it has dramatically reduced fraud and improved security processing times. However, civil liberties advocates raise legitimate concerns about accuracy (particularly for darker-skinned individuals), scope creep, and the chilling effect of persistent identification on public behavior.

Privacy-by-design principles are being incorporated into next-generation surveillance systems: federated learning allows AI models to be trained without centralizing sensitive data; on-device processing enables analytics without transmitting identifiable video; automatic data expiration ensures footage is not retained longer than necessary; and differential privacy techniques protect individual identities within aggregated analytics.

The governance framework for AI surveillance in transport must address: clear legal authorization, independent oversight, public transparency about capabilities and use, strong data security requirements, and meaningful redress mechanisms when systems make errors.`,
    contentAr: `أنتج نشر أنظمة المراقبة المدعومة بالذكاء الاصطناعي عبر شبكة النقل في دبي نتائج مبهرة في مجالَي السلامة والأمن — غير أنه يُثير أيضاً تساؤلات عميقة حول الخصوصية والحريات المدنية والحدود المناسبة للرقابة الآلية. إن التعامل مع هذا التوتر بتأنٍّ أمر ضروري للحفاظ على الثقة العامة في أنظمة النقل المعززة بالذكاء الاصطناعي.

نشر برنامج SafeCity في دبي أكثر من 300,000 كاميرا في أرجاء الإمارة، مع تحليل الذكاء الاصطناعي لتدفقات الفيديو في الوقت الفعلي لأغراض: اكتشاف الحوادث، ورصد كثافة الحشود، وتحديد السلوك المثير للريبة، وتنسيق الاستجابة للطوارئ. وقد أسهم النظام في تقليل الحوادث الأمنية العامة بنسبة 46% في المناطق المُراقَبة.

تقنية التعرف على الوجه تبقى العنصر الأكثر إثارةً للجدل. غير أن تصميم الخصوصية بوصفها مبدأً أصيلاً يُدمج في أنظمة المراقبة من الجيل التالي: يُتيح التعلم الموحّد تدريب نماذج الذكاء الاصطناعي دون مركزة البيانات الحساسة، والمعالجة على الجهاز تُمكّن التحليل دون نقل مقاطع فيديو يمكن التعرف عليها، فيما تضمن انتهاء صلاحية البيانات تلقائياً عدم الاحتفاظ باللقطات أطول مما هو ضروري.

يجب أن يُعالج الإطار الحوكمي لمراقبة الذكاء الاصطناعي في النقل: التفويض القانوني الصريح، والرقابة المستقلة، والشفافية العامة حول القدرات والاستخدام، ومتطلبات أمن البيانات القوية، وآليات انتصاف فعّالة حين تقع الأنظمة في أخطاء.`,
  },
  {
    editionNumber: 2,
    sectionNumber: 5,
    issueNumber: '2nd Edition',
    publishDate: '2025-12-01',
    titleEn: 'Urban Mobility of the Future: Hyperloop, Air Taxis, and Beyond',
    titleAr: 'تنقل المدينة في المستقبل: الهايبرلوب وسيارات الأجرة الجوية وما وراءها',
    contentEn: `The future of urban mobility is being written right now, and Dubai is determined to author some of the most ambitious chapters. Beyond the incremental improvements of smarter signals and better apps lies a fundamental reimagining of how people and goods move through cities — enabled by technologies that were science fiction just a decade ago.

The Dubai Hyperloop project, in partnership with Virgin Hyperloop (and successor companies), envisions connecting Dubai to Abu Dhabi in 12 minutes — a journey that currently takes 90-120 minutes by road. Beyond the engineering feat, the Hyperloop represents an AI challenge: autonomous pod routing, dynamic pressure management, real-time safety monitoring, and seamless integration with surface transport all require sophisticated AI coordination.

Urban Air Mobility (UAM) is transitioning from concept to commercial reality. Joby Aviation, Lilium, and Archer are developing electric vertical takeoff and landing (eVTOL) aircraft that could serve as aerial taxis in Dubai's skyline within the next five years. RTA is actively planning vertiport infrastructure and developing the regulatory frameworks that will govern UAM operations — including AI-powered urban air traffic management systems.

Personal Rapid Transit (PRT) — small automated pods traveling on dedicated guideway networks — represents an intermediate solution for last-mile connectivity that complements existing public transport. Systems operating in Masdar City provide proof of concept for Dubai's own planned deployments.

The common thread connecting all these future mobility systems is AI: autonomous control, real-time optimization, seamless multi-modal integration, and predictive safety monitoring. The future of Dubai's mobility is not just electric or autonomous — it is intelligent.`,
    contentAr: `مستقبل التنقل الحضري يُكتب الآن، ودبي عازمة على تأليف بعض فصوله الأكثر طموحاً. وراء التحسينات التدريجية للإشارات الأذكى والتطبيقات الأفضل تكمن إعادة تصوّر جذرية لكيفية تنقل الناس والبضائع عبر المدن، مُتاحة بتقنيات كانت خيالاً علمياً قبل عقد من الزمن.

يتصوّر مشروع الهايبرلوب في دبي ربطَها بأبوظبي في 12 دقيقة — رحلة تستغرق حالياً 90-120 دقيقة بالسيارة. يمثّل الهايبرلوب تحدياً مزدوجاً: مهندسياً وذكاءً اصطناعياً في آنٍ واحد، إذ يستلزم التوجيه الذاتي للكبسولات وإدارة الضغط الديناميكية والمراقبة الآنية للسلامة أنظمة تنسيق ذكي متطورة.

التنقل الجوي الحضري ينتقل من المفهوم إلى الواقع التجاري. تطوّر Joby Aviation وLilium وArcher طائرات بقدرة الإقلاع والهبوط العمودي الكهربائية (eVTOL) التي قد تعمل بوصفها سيارات أجرة جوية في سماء دبي خلال السنوات الخمس القادمة. وتخطط الهيئة بفاعلية للبنية التحتية لمرسى العمودي الجوي وتطوير الأطر التنظيمية التي ستحكم عمليات التنقل الجوي الحضري.

الخيط المشترك الذي يربط جميع أنظمة التنقل المستقبلية هو الذكاء الاصطناعي: التحكم الذاتي، والتحسين الآني، والتكامل السلس متعدد الوسائط، والمراقبة التنبؤية للسلامة. مستقبل تنقل دبي ليس كهربائياً أو ذاتياً فحسب — بل هو ذكي في جوهره.`,
  },
];

async function seedNewsletters() {
  const connection = await mysql.createConnection(DATABASE_URL + '?charset=utf8mb4');
  console.log('✓ Connected to Railway database');

  // Ensure utf8mb4 charset for proper Arabic support
  await connection.execute("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
  await connection.execute("SET CHARACTER SET utf8mb4");
  console.log('✓ Character set configured for Arabic (utf8mb4)');

  let inserted = 0;
  let skipped = 0;

  for (const n of newsletters) {
    try {
      const [result] = await connection.execute(
        `INSERT INTO newsletters 
          (titleEn, titleAr, contentEn, contentAr, issueNumber, publishDate, editionNumber, sectionNumber, published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, true)`,
        [
          n.titleEn,
          n.titleAr,
          n.contentEn,
          n.contentAr,
          n.issueNumber,
          n.publishDate,
          n.editionNumber,
          n.sectionNumber,
        ]
      );
      inserted++;
      console.log(`  ✓ Edition ${n.editionNumber} / Section ${n.sectionNumber}: ${n.titleEn}`);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        skipped++;
        console.log(`  ⚠ Skipped (duplicate): Edition ${n.editionNumber} / Section ${n.sectionNumber}`);
      } else {
        throw err;
      }
    }
  }

  console.log(`\n✅ Done! Inserted: ${inserted}, Skipped: ${skipped}`);

  // Verify Arabic text
  console.log('\n── Verification: titleEn + titleAr ─────────────────────────────');
  const [rows] = await connection.execute(
    `SELECT editionNumber, sectionNumber, titleEn, titleAr FROM newsletters ORDER BY editionNumber, sectionNumber`
  );
  for (const row of rows) {
    console.log(`  [Ed${row.editionNumber}/Sec${row.sectionNumber}] EN: ${row.titleEn.substring(0, 50)}`);
    console.log(`                          AR: ${row.titleAr}`);
  }

  await connection.end();
}

seedNewsletters().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
