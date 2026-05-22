import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Insert poster - columns: titleEn, titleAr, descriptionEn, descriptionAr, imageUrl (EN), thumbnailUrl (EN), imageUrlAr, thumbnailUrlAr
await db.execute(sql`
  INSERT INTO posters (id, titleEn, titleAr, descriptionEn, descriptionAr, imageUrl, thumbnailUrl, imageUrlAr, thumbnailUrlAr, published, createdAt)
  VALUES (
    2,
    'Agentic AI: When Machines Act, Not Just Respond',
    'عندما لا تكتفي الآلة بالاستجابة وتبدأ باتخاذ القرار',
    'Agentic AI systems go beyond responses. They understand, decide, and act to deliver real outcomes. Autonomous. Intelligent. Impactful.',
    'أنظمة الذكاء الاصطناعي الوكيل تتجاوز مجرد الاستجابة. فهي تفهم، وتقرر، وتتصرف لتحقيق نتائج حقيقية. مستقل. ذكي. مؤثر.',
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663030440268/hWqPJQZpV4iDcAitzw8Ymn/poster-agentic-ai-en_bf3a1d7a.png',
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663030440268/hWqPJQZpV4iDcAitzw8Ymn/poster-agentic-ai-en-thumb_00fd50b5.webp',
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663030440268/hWqPJQZpV4iDcAitzw8Ymn/poster-agentic-ai-ar_cfdd3830.png',
    'https://d2xsxph8kpxj0f.cloudfront.net/310419663030440268/hWqPJQZpV4iDcAitzw8Ymn/poster-agentic-ai-ar-thumb_3cd6ac14.webp',
    1,
    NOW()
  )
`);
console.log('Poster inserted successfully');

// Insert article - columns: titleEn, titleAr, summaryEn, summaryAr, contentEn, contentAr
const summaryEn = "RTA's AI Strategy 2030 is transforming urban mobility from infrastructure-led models to intelligence-led operations, where data is continuously translated into real-time decisions and measurable impact.";
const summaryAr = 'تعمل استراتيجية الذكاء الاصطناعي 2030 لهيئة الطرق والمواصلات على تحويل التنقل الحضري من نماذج قائمة على البنية التحتية إلى عمليات قائمة على الذكاء، حيث تُترجم البيانات باستمرار إلى قرارات آنية وأثر قابل للقياس.';

const contentEn = `The Roads and Transport Authority (RTA) has established a strong foundation in AI-enabled mobility through its Artificial Intelligence Strategy 2030, advanced data platform, and expanding portfolio of operational use cases. Artificial Intelligence is no longer a supporting technology—it is becoming the operational layer of modern transportation, transforming data into real-time decisions, improving efficiency, and enhancing customer experience.

The next phase is not about introducing AI, but about scaling its impact, integrating it across operations, and reinforcing RTA's position as a global reference model in intelligent mobility.

Modern transport systems require continuous awareness, rapid analysis, and immediate response. AI enables this shift by transforming large volumes of data into actionable insights across traffic management, predictive maintenance, demand forecasting, and customer experience.

Recent advancements in AI-driven mobility initiatives demonstrate a clear transition: transportation systems are evolving from infrastructure-led models toward intelligence-led operations, where data is continuously analysed and translated into real-time actions. This marks a shift from reactive transport management to predictive and adaptive mobility ecosystems, where decisions are faster, more accurate, and increasingly automated.

RTA's Artificial Intelligence Strategy 2030 reflects a structured and measurable approach to embedding AI across mobility operations, customer services, and organizational performance. The focus on measurable outcomes—such as improved travel time, increased productivity, optimized costs, and enhanced customer experience—signals that AI is being treated as a core operational capability rather than a standalone initiative.

This progression highlights a key principle: value is not created by data alone, but by the ability to convert data into decisions and operational improvements.

RTA's data platform enables integration across systems, real-time analytics, and scalable AI deployment across multiple domains. This allows AI to move beyond isolated applications into enterprise-wide operational intelligence, supporting both internal decision-making and external service delivery.

Current developments in AI-enabled transport systems confirm a critical transition: mobility is moving toward integrated ecosystems where data, infrastructure, and decision-making are continuously connected.

Globally, leading mobility systems are advancing toward real-time decision platforms, predictive traffic management, and integrated governance models. RTA is well-positioned to build on its current strengths and further reinforce its global standing by accelerating the transition from AI-enabled systems to AI-driven operations.

As part of the natural progression of a mature AI program, three priority directions can further enhance impact:

• From Use Cases to Full Operational Integration: Expanding AI into fully connected, system-wide decision environments.
• From Data Visibility to Real-Time Decision Intelligence: Moving toward systems that recommend and trigger actions in real time.
• From Technology Deployment to Institutional AI Governance: Strengthening governance, cybersecurity, and cross-functional alignment.

To maintain long-term value and consistency: ensure integration and alignment across departments, maintain high standards of data security and operational trust, and scale successful AI initiatives across the organization.

Beyond current AI applications, the next phase of intelligent mobility is being shaped by the convergence of advanced technologies such as digital twins, satellite intelligence, robotics, and edge-enabled sensing. Digital twins enable real-time simulation of transport networks, allowing authorities to anticipate congestion, test scenarios, and optimize infrastructure performance before issues occur.

At the computational level, accelerated AI platforms developed by companies such as NVIDIA enable the processing of massive volumes of real-time data from cameras, sensors, and connected infrastructure. These systems support advanced computer vision, autonomous inspection, and robotics-based monitoring of critical assets. In parallel, emerging developments in quantum computing are expected to unlock new capabilities in solving complex optimization challenges such as traffic flow and network-wide mobility management at unprecedented scale.

RTA is not only implementing Artificial Intelligence in transportation—it is shaping what an intelligent mobility authority looks like. The next phase offers an opportunity to move from intelligent systems to decision-driven ecosystems, where data is continuously transformed into actions and operations become faster, smarter, and more resilient. The future of mobility will be defined not only by technology, but by the ability to translate intelligence into real-time decisions and measurable impact. In this respect, RTA is well-positioned to lead.`;

const contentAr = `أرست هيئة الطرق والمواصلات أساساً متيناً في مجال التنقل المدعوم بالذكاء الاصطناعي من خلال استراتيجية الذكاء الاصطناعي 2030، ومنصة البيانات المتقدمة، ومحفظة متنامية من حالات الاستخدام التشغيلية. لم يعد الذكاء الاصطناعي تقنية مساندة فحسب، بل أصبح الطبقة التشغيلية للنقل الحديث، إذ يحوّل البيانات إلى قرارات آنية، ويحسّن الكفاءة، ويعزز تجربة المتعاملين.

المرحلة المقبلة لا تتعلق بإدخال الذكاء الاصطناعي، بل بتوسيع أثره، ودمجه عبر العمليات، وتعزيز مكانة الهيئة كنموذج مرجعي عالمي في التنقل الذكي.

تتطلب أنظمة النقل الحديثة وعياً مستمراً، وتحليلاً سريعاً، واستجابة فورية. يُمكّن الذكاء الاصطناعي من هذا التحول عبر تحويل أحجام كبيرة من البيانات إلى رؤى قابلة للتنفيذ في مجالات إدارة حركة المرور، والصيانة التنبؤية، والتنبؤ بالطلب، وتجربة المتعاملين.

تُظهر التطورات الأخيرة في مبادرات التنقل المدعومة بالذكاء الاصطناعي تحولاً واضحاً: أنظمة النقل تتطور من نماذج قائمة على البنية التحتية نحو عمليات قائمة على الذكاء، حيث تُحلَّل البيانات باستمرار وتُترجم إلى إجراءات آنية. يمثل هذا انتقالاً من إدارة النقل التفاعلية إلى منظومات تنقل تنبؤية وتكيفية، حيث تكون القرارات أسرع وأدق وأكثر أتمتة.

تعكس استراتيجية الذكاء الاصطناعي 2030 لهيئة الطرق والمواصلات نهجاً منظماً وقابلاً للقياس لدمج الذكاء الاصطناعي عبر عمليات التنقل وخدمات المتعاملين والأداء المؤسسي. يشير التركيز على النتائج القابلة للقياس — مثل تحسين زمن الرحلة، وزيادة الإنتاجية، وتحسين التكاليف، وتعزيز تجربة المتعاملين — إلى أن الذكاء الاصطناعي يُعامل كقدرة تشغيلية جوهرية وليس كمبادرة منفصلة.

يبرز هذا التقدم مبدأً أساسياً: القيمة لا تُصنع من البيانات وحدها، بل من القدرة على تحويل البيانات إلى قرارات وتحسينات تشغيلية.

تُتيح منصة بيانات الهيئة التكامل عبر الأنظمة، والتحليلات الآنية، ونشر الذكاء الاصطناعي على نطاق واسع عبر مجالات متعددة. يسمح هذا للذكاء الاصطناعي بالانتقال من التطبيقات المعزولة إلى ذكاء تشغيلي مؤسسي شامل، يدعم صنع القرار الداخلي وتقديم الخدمات الخارجية.

تؤكد التطورات الحالية في أنظمة النقل المدعومة بالذكاء الاصطناعي تحولاً جوهرياً: التنقل يتجه نحو منظومات متكاملة تترابط فيها البيانات والبنية التحتية وصنع القرار بشكل مستمر.

على المستوى العالمي، تتقدم أنظمة التنقل الرائدة نحو منصات قرار آنية، وإدارة مرور تنبؤية، ونماذج حوكمة متكاملة. تتمتع الهيئة بموقع مثالي للبناء على نقاط قوتها الحالية وتعزيز مكانتها العالمية من خلال تسريع الانتقال من أنظمة مدعومة بالذكاء الاصطناعي إلى عمليات مدفوعة بالذكاء الاصطناعي.

كجزء من التقدم الطبيعي لبرنامج ذكاء اصطناعي ناضج، يمكن لثلاثة اتجاهات ذات أولوية تعزيز الأثر بشكل أكبر:

• من حالات الاستخدام إلى التكامل التشغيلي الكامل: توسيع الذكاء الاصطناعي ليشمل بيئات قرار متصلة على مستوى المنظومة بأكملها.
• من رؤية البيانات إلى ذكاء القرار الآني: التحول نحو أنظمة توصي وتُطلق إجراءات في الوقت الفعلي.
• من نشر التقنية إلى حوكمة الذكاء الاصطناعي المؤسسية: تعزيز الحوكمة والأمن السيبراني والمواءمة بين الوظائف.

للحفاظ على القيمة والاتساق على المدى الطويل: ضمان التكامل والمواءمة عبر الإدارات، والحفاظ على معايير عالية لأمن البيانات والثقة التشغيلية، وتوسيع نطاق مبادرات الذكاء الاصطناعي الناجحة عبر المؤسسة.

إلى جانب تطبيقات الذكاء الاصطناعي الحالية، تتشكل المرحلة التالية من التنقل الذكي من خلال تقارب تقنيات متقدمة مثل التوائم الرقمية، والذكاء الفضائي، والروبوتات، والاستشعار المدعوم بالحوسبة الطرفية. تُمكّن التوائم الرقمية من المحاكاة الآنية لشبكات النقل، مما يسمح للجهات المعنية بتوقع الازدحام واختبار السيناريوهات وتحسين أداء البنية التحتية قبل حدوث المشكلات.

على مستوى الحوسبة، تُمكّن منصات الذكاء الاصطناعي المتسارعة التي طورتها شركات مثل NVIDIA من معالجة أحجام هائلة من البيانات الآنية من الكاميرات والمستشعرات والبنية التحتية المتصلة. تدعم هذه الأنظمة الرؤية الحاسوبية المتقدمة والفحص المستقل والمراقبة الروبوتية للأصول الحيوية. وبالتوازي، من المتوقع أن تفتح التطورات الناشئة في الحوسبة الكمية قدرات جديدة في حل تحديات التحسين المعقدة مثل تدفق حركة المرور وإدارة التنقل على مستوى الشبكة بأكملها بنطاق غير مسبوق.

لا تكتفي هيئة الطرق والمواصلات بتطبيق الذكاء الاصطناعي في النقل، بل ترسم ملامح ما تبدو عليه هيئة تنقل ذكية. تُتيح المرحلة المقبلة فرصة للانتقال من الأنظمة الذكية إلى منظومات قائمة على اتخاذ القرار، حيث تُحوَّل البيانات باستمرار إلى إجراءات وتصبح العمليات أسرع وأذكى وأكثر مرونة. مستقبل التنقل لن يُحدده التقنية وحدها، بل القدرة على ترجمة الذكاء إلى قرارات آنية وأثر قابل للقياس. وفي هذا الصدد، تتمتع هيئة الطرق والمواصلات بموقع ريادي.`;

await db.execute(sql.raw(`
  INSERT INTO articles (id, titleEn, titleAr, summaryEn, summaryAr, contentEn, contentAr, published, createdAt)
  VALUES (
    20001,
    'Artificial Intelligence in Urban Mobility: From Intelligent Systems to Decision-Driven Ecosystems',
    'الذكاء الاصطناعي في التنقل الحضري: من الأنظمة الذكية إلى منظومات التنقل القائمة على اتخاذ القرار',
    '${summaryEn.replace(/'/g, "\\'")}',
    '${summaryAr.replace(/'/g, "\\'")}',
    '${contentEn.replace(/'/g, "\\'")}',
    '${contentAr.replace(/'/g, "\\'")}',
    1,
    NOW()
  )
`));
console.log('Article inserted successfully');

await connection.end();
process.exit(0);
