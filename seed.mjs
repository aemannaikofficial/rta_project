/**
 * Database Seed Script — Self-hosted RTA AI Newsletter
 * 
 * Run: node seed.mjs
 * 
 * This script populates the database with initial content:
 * - Admin user
 * - 4 Posters (EN + AR images)
 * - 2 Articles
 * - 2 Videos
 * 
 * All asset URLs point to local /assets/images/ and /assets/videos/ paths.
 * 
 * Prerequisites:
 * - DATABASE_URL must be set in .env
 * - Database tables must exist (run: pnpm db:push)
 */

import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set in .env');
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);
  console.log('✓ Connected to database');

  // ─── Admin User ───
  const adminOpenId = process.env.OWNER_OPEN_ID || 'local-admin-001';
  const adminName = process.env.OWNER_NAME || 'Admin';
  await connection.execute(`
    INSERT INTO users (openId, name, email, loginMethod, role, lastSignedIn)
    VALUES (?, ?, 'admin@rta.ae', 'local', 'admin', NOW())
    ON DUPLICATE KEY UPDATE name = VALUES(name), role = 'admin', lastSignedIn = NOW()
  `, [adminOpenId, adminName]);
  console.log('✓ Admin user created/updated');

  // ─── Posters ───
  const posters = [
    {
      titleEn: 'AI Can Decide... But Can It Be Accountable?',
      titleAr: 'الذكاء الاصطناعي يقرر... لكن هل يتحمل المسؤولية؟',
      descriptionEn: 'Exploring the critical intersection of AI decision-making and accountability in governance. This poster examines how organizations can implement AI governance frameworks that ensure transparency, fairness, and human oversight in automated decision systems.',
      descriptionAr: 'استكشاف التقاطع الحرج بين صنع القرار بالذكاء الاصطناعي والمساءلة في الحوكمة. يبحث هذا الملصق في كيفية تنفيذ المؤسسات لأطر حوكمة الذكاء الاصطناعي التي تضمن الشفافية والعدالة والرقابة البشرية في أنظمة القرار الآلي.',
      imageUrl: '/assets/images/AIDecidePoster_369a8d2c.png',
      thumbnailUrl: '/assets/images/AIDecidePoster_369a8d2c.png',
      imageUrlAr: '/assets/images/AIdecidePosterArabic_e0ea4ede.png',
      thumbnailUrlAr: '/assets/images/AIdecidePosterArabic_e0ea4ede.png',
    },
    {
      titleEn: 'Agentic AI: The Next Frontier',
      titleAr: 'الذكاء الاصطناعي الوكيل: الحدود القادمة',
      descriptionEn: 'Agentic AI represents a paradigm shift where AI systems can autonomously plan, reason, and execute complex tasks. This poster explores how agentic AI will transform transportation, urban planning, and public services in smart cities.',
      descriptionAr: 'يمثل الذكاء الاصطناعي الوكيل نقلة نوعية حيث يمكن لأنظمة الذكاء الاصطناعي التخطيط والتفكير وتنفيذ المهام المعقدة بشكل مستقل. يستكشف هذا الملصق كيف سيحول الذكاء الاصطناعي الوكيل النقل والتخطيط الحضري والخدمات العامة في المدن الذكية.',
      imageUrl: '/assets/images/poster-agentic-ai-en_bf3a1d7a.png',
      thumbnailUrl: '/assets/images/poster-agentic-ai-en-thumb_00fd50b5.webp',
      imageUrlAr: '/assets/images/poster-agentic-ai-ar_cfdd3830.png',
      thumbnailUrlAr: '/assets/images/poster-agentic-ai-ar-thumb_3cd6ac14.webp',
    },
    {
      titleEn: 'When the City Starts Thinking',
      titleAr: 'عندما تبدأ المدن بالتفكير',
      descriptionEn: 'Imagine a city that doesn\'t just move — it thinks. AI-driven transportation is evolving beyond automation into a cognitive mobility ecosystem. From predictive traffic management to autonomous transit networks, this poster explores how artificial intelligence is transforming urban mobility into an intelligent, adaptive system that learns, anticipates, and responds in real time.',
      descriptionAr: 'تخيّل مدينة لا تتحرك فحسب — بل تفكّر. يتطور النقل المدعوم بالذكاء الاصطناعي إلى ما هو أبعد من الأتمتة ليصبح منظومة تنقل إدراكية. من إدارة حركة المرور التنبؤية إلى شبكات النقل ذاتية القيادة، يستكشف هذا الملصق كيف يحوّل الذكاء الاصطناعي التنقل الحضري إلى نظام ذكي متكيّف يتعلم ويتوقع ويستجيب في الوقت الفعلي.',
      imageUrl: '/assets/images/engposter3_8e508e2a.png',
      thumbnailUrl: '/assets/images/engposter3_8e508e2a.png',
      imageUrlAr: '/assets/images/arabicposter3_c062bf17.png',
      thumbnailUrlAr: '/assets/images/arabicposter3_c062bf17.png',
    },
    {
      titleEn: 'AI Driver. Focused on You.',
      titleAr: 'السائق الذكي — راحتك تهمّنا',
      descriptionEn: 'The future of driving is here — and it\'s watching the road so you don\'t have to. AI-powered autonomous driving systems combine computer vision, sensor fusion, and deep learning to create a safer, more comfortable driving experience. This poster showcases how AI drivers perceive their environment, make split-second decisions, and prioritize passenger safety above all.',
      descriptionAr: 'مستقبل القيادة هنا — وهو يراقب الطريق حتى لا تضطر أنت لذلك. تجمع أنظمة القيادة الذاتية المدعومة بالذكاء الاصطناعي بين الرؤية الحاسوبية ودمج المستشعرات والتعلم العميق لخلق تجربة قيادة أكثر أمانًا وراحة. يعرض هذا الملصق كيف يدرك السائقون الأذكياء بيئتهم ويتخذون قرارات في أجزاء من الثانية ويضعون سلامة الركاب فوق كل اعتبار.',
      imageUrl: '/assets/images/Engposter4_da8f127b.png',
      thumbnailUrl: '/assets/images/Engposter4_da8f127b.png',
      imageUrlAr: '/assets/images/ArabicPoster4_6cbfc9f8.png',
      thumbnailUrlAr: '/assets/images/ArabicPoster4_6cbfc9f8.png',
    },
  ];

  for (const p of posters) {
    await connection.execute(`
      INSERT INTO posters (titleEn, titleAr, descriptionEn, descriptionAr, imageUrl, thumbnailUrl, imageUrlAr, thumbnailUrlAr, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, true)
    `, [p.titleEn, p.titleAr, p.descriptionEn, p.descriptionAr, p.imageUrl, p.thumbnailUrl, p.imageUrlAr, p.thumbnailUrlAr]);
  }
  console.log(`✓ ${posters.length} posters inserted`);

  // ─── Articles ───
  const articles = [
    {
      titleEn: 'AI in Urban Mobility: Transforming How Cities Move',
      titleAr: 'الذكاء الاصطناعي في التنقل الحضري: تحويل كيفية تحرك المدن',
      summaryEn: 'An in-depth look at how artificial intelligence is revolutionizing urban transportation systems, from smart traffic management to predictive maintenance of infrastructure.',
      summaryAr: 'نظرة معمقة على كيفية ثورة الذكاء الاصطناعي في أنظمة النقل الحضري، من إدارة حركة المرور الذكية إلى الصيانة التنبؤية للبنية التحتية.',
      contentEn: `# AI in Urban Mobility: Transforming How Cities Move

## Introduction

Artificial Intelligence is rapidly transforming urban mobility, creating smarter, more efficient, and more sustainable transportation systems. From Dubai's autonomous metro to AI-optimized traffic signals, cities worldwide are leveraging machine learning and data analytics to solve their most pressing transportation challenges.

## Smart Traffic Management

AI-powered traffic management systems analyze real-time data from thousands of sensors, cameras, and connected vehicles to optimize signal timing, reduce congestion, and improve safety. These systems can predict traffic patterns hours in advance, enabling proactive rather than reactive management.

### Key Technologies
- **Computer Vision**: Cameras with AI can count vehicles, detect incidents, and classify traffic in real-time
- **Reinforcement Learning**: Traffic signals learn optimal timing patterns through trial and error
- **Digital Twins**: Virtual replicas of road networks allow testing of scenarios before implementation

## Predictive Maintenance

AI algorithms analyze sensor data from bridges, roads, and transit vehicles to predict when maintenance will be needed before failures occur. This approach reduces costs by 25-30% compared to scheduled maintenance while improving safety.

## Autonomous Transit

Self-driving buses and metro systems are becoming reality in cities like Dubai, Singapore, and Helsinki. These systems use a combination of LiDAR, radar, cameras, and AI to navigate complex urban environments safely.

## The Road Ahead

The future of urban mobility lies in the integration of these AI systems into a cohesive, city-wide intelligence layer that coordinates all modes of transportation in real-time, creating a seamless experience for residents and visitors alike.`,
      contentAr: `# الذكاء الاصطناعي في التنقل الحضري: تحويل كيفية تحرك المدن

## المقدمة

يعمل الذكاء الاصطناعي على تحويل التنقل الحضري بسرعة، مما يخلق أنظمة نقل أكثر ذكاءً وكفاءة واستدامة. من مترو دبي ذاتي القيادة إلى إشارات المرور المحسّنة بالذكاء الاصطناعي، تستفيد المدن في جميع أنحاء العالم من التعلم الآلي وتحليلات البيانات لحل تحديات النقل الأكثر إلحاحًا.

## إدارة حركة المرور الذكية

تحلل أنظمة إدارة حركة المرور المدعومة بالذكاء الاصطناعي البيانات في الوقت الفعلي من آلاف أجهزة الاستشعار والكاميرات والمركبات المتصلة لتحسين توقيت الإشارات وتقليل الازدحام وتحسين السلامة.

### التقنيات الرئيسية
- **الرؤية الحاسوبية**: يمكن للكاميرات المزودة بالذكاء الاصطناعي عد المركبات واكتشاف الحوادث وتصنيف حركة المرور في الوقت الفعلي
- **التعلم المعزز**: تتعلم إشارات المرور أنماط التوقيت المثلى من خلال التجربة والخطأ
- **التوائم الرقمية**: تسمح النسخ الافتراضية لشبكات الطرق باختبار السيناريوهات قبل التنفيذ

## الصيانة التنبؤية

تحلل خوارزميات الذكاء الاصطناعي بيانات أجهزة الاستشعار من الجسور والطرق ومركبات النقل للتنبؤ بموعد الحاجة إلى الصيانة قبل حدوث الأعطال.

## النقل الذاتي

أصبحت الحافلات وأنظمة المترو ذاتية القيادة حقيقة واقعة في مدن مثل دبي وسنغافورة وهلسنكي.

## الطريق إلى الأمام

يكمن مستقبل التنقل الحضري في دمج أنظمة الذكاء الاصطناعي هذه في طبقة ذكاء متماسكة على مستوى المدينة تنسق جميع وسائل النقل في الوقت الفعلي.`,
      coverImageUrl: '/assets/images/article-ai-urban-mobility-cover-wide-FnBoPCPDxDUQLJSEm5KQTY.webp',
    },
    {
      titleEn: 'Smart City Indicators: Measuring Urban Intelligence',
      titleAr: 'مؤشرات المدينة الذكية: قياس الذكاء الحضري',
      summaryEn: 'How cities measure and benchmark their smart city initiatives using AI-powered analytics and key performance indicators.',
      summaryAr: 'كيف تقيس المدن وتقيّم مبادرات المدن الذكية باستخدام التحليلات المدعومة بالذكاء الاصطناعي ومؤشرات الأداء الرئيسية.',
      contentEn: `# Smart City Indicators: Measuring Urban Intelligence

## Introduction

As cities invest billions in smart infrastructure, the need for robust measurement frameworks becomes critical. How do we know if a smart city initiative is actually making life better for residents? This article explores the key indicators and AI-powered analytics that help cities benchmark their progress.

## Key Performance Indicators

### Mobility Efficiency
- Average commute time reduction
- Public transit reliability scores
- Multi-modal integration index
- Last-mile connectivity rating

### Environmental Impact
- Carbon emissions per capita from transport
- Air quality improvement metrics
- Energy efficiency of transit systems
- Green corridor coverage

### Citizen Satisfaction
- Real-time service feedback scores
- Digital service adoption rates
- Accessibility compliance metrics
- Safety perception indices

## AI-Powered Analytics

Modern smart cities use AI to process vast amounts of data from IoT sensors, mobile devices, and public feedback systems. Machine learning models identify patterns and correlations that human analysts might miss, enabling data-driven policy decisions.

## Dubai's Approach

Dubai has pioneered a comprehensive smart city measurement framework that combines traditional KPIs with AI-generated insights. The city's Digital Twin platform provides real-time visualization of all urban systems, enabling rapid response to emerging challenges.

## Conclusion

Effective measurement is the foundation of successful smart city transformation. By combining traditional metrics with AI-powered analytics, cities can ensure their investments deliver real improvements in quality of life.`,
      contentAr: `# مؤشرات المدينة الذكية: قياس الذكاء الحضري

## المقدمة

مع استثمار المدن مليارات في البنية التحتية الذكية، تصبح الحاجة إلى أطر قياس قوية أمرًا بالغ الأهمية. كيف نعرف ما إذا كانت مبادرة المدينة الذكية تجعل الحياة أفضل فعلاً للسكان؟

## مؤشرات الأداء الرئيسية

### كفاءة التنقل
- تقليل متوسط وقت التنقل
- درجات موثوقية النقل العام
- مؤشر التكامل متعدد الوسائط
- تصنيف الاتصال في الميل الأخير

### الأثر البيئي
- انبعاثات الكربون للفرد من النقل
- مقاييس تحسين جودة الهواء
- كفاءة الطاقة لأنظمة النقل

### رضا المواطنين
- درجات التغذية الراجعة في الوقت الفعلي
- معدلات اعتماد الخدمات الرقمية
- مقاييس الامتثال لإمكانية الوصول

## التحليلات المدعومة بالذكاء الاصطناعي

تستخدم المدن الذكية الحديثة الذكاء الاصطناعي لمعالجة كميات هائلة من البيانات من أجهزة استشعار إنترنت الأشياء والأجهزة المحمولة وأنظمة التغذية الراجعة العامة.

## نهج دبي

ريادة دبي في إطار قياس شامل للمدن الذكية يجمع بين مؤشرات الأداء الرئيسية التقليدية والرؤى المولدة بالذكاء الاصطناعي.

## الخلاصة

القياس الفعال هو أساس التحول الناجح للمدن الذكية.`,
      coverImageUrl: '/assets/images/article-ai-urban-mobility-2-cover-CPAQbm8wFdgTnJ7j3L94kT.webp',
    },
  ];

  for (const a of articles) {
    await connection.execute(`
      INSERT INTO articles (titleEn, titleAr, summaryEn, summaryAr, contentEn, contentAr, coverImageUrl, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, true)
    `, [a.titleEn, a.titleAr, a.summaryEn, a.summaryAr, a.contentEn, a.contentAr, a.coverImageUrl]);
  }
  console.log(`✓ ${articles.length} articles inserted`);

  // ─── Videos ───
  const videosData = [
    {
      titleEn: 'Quantum City: The Future of AI-Powered Urban Transport',
      titleAr: 'المدينة الكمية: مستقبل النقل الحضري المدعوم بالذكاء الاصطناعي',
      descriptionEn: 'Explore how quantum computing and AI are converging to create next-generation urban transportation systems that can process millions of variables in real-time.',
      descriptionAr: 'اكتشف كيف يتقارب الحوسبة الكمية والذكاء الاصطناعي لإنشاء أنظمة نقل حضري من الجيل التالي يمكنها معالجة ملايين المتغيرات في الوقت الفعلي.',
      videoUrl: '/assets/videos/quantum-city-v2_ffc07ff5.mp4',
      thumbnailUrl: '/assets/images/quantum-city-thumb-v2_08bed01e.jpg',
      duration: '3:45',
    },
    {
      titleEn: 'Smart City Indicators: Measuring What Matters',
      titleAr: 'مؤشرات المدينة الذكية: قياس ما يهم',
      descriptionEn: 'A comprehensive overview of how Dubai measures smart city performance using AI-driven analytics, IoT sensors, and citizen feedback systems.',
      descriptionAr: 'نظرة شاملة على كيفية قياس دبي لأداء المدينة الذكية باستخدام التحليلات المدعومة بالذكاء الاصطناعي وأجهزة استشعار إنترنت الأشياء وأنظمة تغذية راجعة المواطنين.',
      videoUrl: '/assets/videos/rta-video-2-smart-city-indicators_d6200346.mp4',
      thumbnailUrl: '/assets/images/rta-video-2-thumb_4861fa58.jpg',
      duration: '4:12',
    },
  ];

  for (const v of videosData) {
    await connection.execute(`
      INSERT INTO videos (titleEn, titleAr, descriptionEn, descriptionAr, videoUrl, thumbnailUrl, duration, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, true)
    `, [v.titleEn, v.titleAr, v.descriptionEn, v.descriptionAr, v.videoUrl, v.thumbnailUrl, v.duration]);
  }
  console.log(`✓ ${videosData.length} videos inserted`);

  await connection.end();
  console.log('\n✅ Database seeded successfully!');
  console.log('   You can now start the app with: pnpm dev');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
