export const questionAlternates = [
  { hreflang: 'en', href: '/questions/' },
  { hreflang: 'ko', href: '/ko/questions/' },
  { hreflang: 'ja', href: '/ja/questions/' },
  { hreflang: 'x-default', href: '/questions/' },
];

export const questionLocales = {
  en: {
    lang: 'en',
    path: '/questions/',
    label: 'English',
    title: 'Traveler questions matched to China guides',
    description:
      'Common China travel questions in a retrieval-friendly QA format, matched to crowd-vetted guides on visas, payments, eSIMs, hotels, food, trains, language, and itineraries.',
    eyebrow: 'Traveler questions',
    heading: 'Common China questions, matched to the right guide.',
    intro:
      'Question pages should match how travelers actually search: short concerns, direct answers, and a guide when they need more detail.',
    whyTitle: 'Why QA works for travel planning',
    whyCopy:
      'Visitors rarely start with a table of contents. They ask whether Alipay works, where to stay, how trains work, or what to set up before flying. Keeping pages in question-and-answer form makes the content easier to scan, translate, index, and retrieve.',
    steps: [
      ['Listen', 'Collect review language, forum questions, social posts, and trip reports.'],
      ['Localize', 'Rewrite the same intent in the way English, Korean, and Japanese travelers ask it.'],
      ['Answer', 'Give a short answer first, then point to the full guide or map-saving tool.'],
    ],
    readAnswer: 'Read answer',
    submitTitle: 'What should we answer next?',
    submitCopy: 'Send a real planning question. The best questions become new guides or updates to existing ones.',
    submitButton: 'Submit question',
    questionPlaceholder: 'Example: Can I use a US iPhone eSIM and still receive bank verification texts?',
    emailLabel: 'Email optional',
    groups: [
      {
        title: 'Before booking',
        questions: [
          {
            q: 'Do I need a visa for China, or can I use the 240-hour transit policy?',
            answer: 'Start here before buying flights. The answer changes by passport, route, and trip length.',
            href: '/guides/china-visa-free-2026/',
            guide: 'Visa-free entry guide',
          },
          {
            q: 'What should I set up two weeks before flying?',
            answer: 'Payments, eSIM, train reminders, passport copies, hotel addresses, and booking windows.',
            href: '/guides/china-pre-departure-checklist/',
            guide: 'Pre-departure checklist',
            related: [
              { label: 'Payments', href: '/guides/alipay-wechat-pay-foreign-cards/' },
              { label: 'eSIM and internet', href: '/guides/internet-esim-vpn-blocked-apps/' },
              { label: 'Hotels', href: '/guides/hotels-foreigners-china/' },
            ],
          },
          {
            q: 'What is a realistic first-time China route?',
            answer: 'Beijing, Xi’an, and Shanghai by high-speed rail is the simplest one-week route.',
            href: '/guides/7-day-china-itinerary/',
            guide: '7-day itinerary',
            related: [
              { label: 'High-speed rail', href: '/guides/china-high-speed-trains/' },
              { label: 'Where to stay', href: '/guides/hotels-foreigners-china/' },
              { label: 'Neighborhoods', href: '/guides/neighborhoods-beyond-landmarks/' },
            ],
          },
        ],
      },
      {
        title: 'Phone, money, and apps',
        questions: [
          {
            q: 'Can I use Alipay or WeChat Pay with a foreign card?',
            answer: 'Yes, but set it up before arrival and understand where foreign cards still fail.',
            href: '/guides/alipay-wechat-pay-foreign-cards/',
            guide: 'Payment setup guide',
            related: [
              { label: 'Metro QR codes', href: '/guides/didi-metro-getting-around/' },
              { label: 'Street food payment', href: '/guides/street-food-night-markets/' },
              { label: 'QR menus', href: '/guides/food-ordering-dietary/' },
            ],
          },
          {
            q: 'Will Google, WhatsApp, Instagram, and Gmail work in China?',
            answer: 'A roaming eSIM is usually easier than relying on hotel Wi-Fi or a VPN alone.',
            href: '/guides/internet-esim-vpn-blocked-apps/',
            guide: 'Internet and eSIM guide',
          },
          {
            q: 'Can I get around if I do not speak Chinese?',
            answer: 'Camera translation, screenshots, WeChat translate, and a few phrases cover most situations.',
            href: '/guides/translation-language-survival/',
            guide: 'Language survival guide',
            related: [
              { label: 'Didi and metro', href: '/guides/didi-metro-getting-around/' },
              { label: 'Ordering food', href: '/guides/food-ordering-dietary/' },
              { label: 'Hotel check-in', href: '/guides/hotels-foreigners-china/' },
            ],
          },
        ],
      },
      {
        title: 'On the ground',
        questions: [
          {
            q: 'Should I take trains or domestic flights between Chinese cities?',
            answer: 'For Beijing, Xi’an, Shanghai, Hangzhou, and similar routes, high-speed rail is usually easier.',
            href: '/guides/china-high-speed-trains/',
            guide: 'High-speed train guide',
            related: [
              { label: 'First route', href: '/guides/7-day-china-itinerary/' },
              { label: 'Didi and metro', href: '/guides/didi-metro-getting-around/' },
            ],
          },
          {
            q: 'How do I use Didi, taxis, and metro QR codes?',
            answer: 'Use Alipay for metro codes and Didi for typed destinations when taxi language is hard.',
            href: '/guides/didi-metro-getting-around/',
            guide: 'City transport guide',
          },
          {
            q: 'Will hotels accept foreign passports?',
            answer: 'Most mainstream city hotels do, but budget stays, homestays, and small towns still need care.',
            href: '/guides/hotels-foreigners-china/',
            guide: 'Hotel guide',
          },
        ],
      },
    ],
  },
  ko: {
    lang: 'ko',
    path: '/ko/questions/',
    label: '한국어',
    title: '중국 여행 질문과 답변',
    description:
      '비자, 결제, eSIM, 호텔, 음식, 기차, 언어, 일정에 대한 중국 여행 질문을 한국어 QA 형식으로 정리했습니다.',
    eyebrow: '여행자 질문',
    heading: '중국 여행 전에 가장 많이 묻는 질문.',
    intro:
      '한국어 검색 사용자는 짧고 구체적인 질문으로 정보를 찾는 경우가 많습니다. 그래서 답변은 먼저 결론을 말하고, 필요한 경우 자세한 가이드로 연결합니다.',
    whyTitle: '왜 QA 형식인가',
    whyCopy:
      '중국 여행 정보는 앱, 결제, 호텔, 교통처럼 불안한 지점이 뚜렷합니다. 질문 단위로 정리하면 검색에도 잘 잡히고, 여행자가 필요한 답만 빠르게 찾을 수 있습니다.',
    steps: [
      ['수집', '후기, 커뮤니티 질문, 현지 SNS, 여행 기록에서 실제 표현을 모읍니다.'],
      ['현지화', '영어 문장을 그대로 번역하지 않고 한국어 여행자가 묻는 방식으로 다시 씁니다.'],
      ['답변', '짧은 결론을 먼저 보여주고, 더 자세한 가이드로 연결합니다.'],
    ],
    readAnswer: '답변 보기',
    submitTitle: '다음에 어떤 질문을 답하면 좋을까요?',
    submitCopy: '실제 여행 준비 중 생긴 질문을 보내 주세요. 좋은 질문은 새 가이드나 기존 가이드 업데이트로 반영합니다.',
    submitButton: '질문 보내기',
    questionPlaceholder: '예: 한국 카드로 알리페이나 위챗페이를 사용할 수 있나요?',
    emailLabel: '이메일 선택',
    groups: [
      {
        title: '예약 전',
        questions: [
          {
            q: '중국 여행에 비자가 필요한가요, 아니면 240시간 무비자 환승을 쓸 수 있나요?',
            answer: '항공권을 사기 전에 확인해야 합니다. 여권, 입국 경로, 체류 기간에 따라 답이 달라집니다.',
            href: '/guides/china-visa-free-2026/',
            guide: '무비자 입국 가이드',
          },
          {
            q: '출국 2주 전에는 무엇을 준비해야 하나요?',
            answer: '결제 앱, eSIM, 기차 예매, 여권 사본, 호텔 주소, 예약 가능 시점을 먼저 정리하는 것이 좋습니다.',
            href: '/guides/china-pre-departure-checklist/',
            guide: '출국 전 체크리스트',
          },
          {
            q: '중국이 처음이라면 어떤 일정이 가장 현실적인가요?',
            answer: '베이징, 시안, 상하이를 고속철로 연결하는 1주 일정이 가장 단순합니다.',
            href: '/guides/7-day-china-itinerary/',
            guide: '7일 일정 가이드',
          },
        ],
      },
      {
        title: '휴대폰, 결제, 앱',
        questions: [
          {
            q: '해외 카드로 알리페이나 위챗페이를 사용할 수 있나요?',
            answer: '가능하지만 출국 전에 설정하고, 해외 카드가 실패할 수 있는 장소를 알아두는 것이 좋습니다.',
            href: '/guides/alipay-wechat-pay-foreign-cards/',
            guide: '결제 설정 가이드',
          },
          {
            q: '중국에서 구글, 카카오톡, 인스타그램, 지메일이 되나요?',
            answer: '호텔 와이파이나 VPN만 믿기보다 로밍 eSIM을 준비하는 편이 보통 더 쉽습니다.',
            href: '/guides/internet-esim-vpn-blocked-apps/',
            guide: '인터넷과 eSIM 가이드',
          },
          {
            q: '중국어를 못해도 여행할 수 있나요?',
            answer: '카메라 번역, 스크린샷, 위챗 번역, 몇 가지 기본 표현이면 대부분의 상황은 해결됩니다.',
            href: '/guides/translation-language-survival/',
            guide: '언어 생존 가이드',
          },
        ],
      },
      {
        title: '현지 이동',
        questions: [
          {
            q: '중국 도시 간 이동은 기차가 좋나요, 국내선이 좋나요?',
            answer: '베이징, 시안, 상하이, 항저우 같은 노선은 고속철이 더 편한 경우가 많습니다.',
            href: '/guides/china-high-speed-trains/',
            guide: '고속철 가이드',
          },
          {
            q: '디디, 택시, 지하철 QR 코드는 어떻게 쓰나요?',
            answer: '지하철은 알리페이 교통 QR, 택시는 목적지를 입력할 수 있는 디디가 유용합니다.',
            href: '/guides/didi-metro-getting-around/',
            guide: '도시 교통 가이드',
          },
          {
            q: '외국 여권으로 중국 호텔 체크인이 되나요?',
            answer: '대부분의 도심 호텔은 가능하지만, 저가 숙소나 민박, 작은 도시는 미리 확인하는 것이 안전합니다.',
            href: '/guides/hotels-foreigners-china/',
            guide: '호텔 가이드',
          },
        ],
      },
    ],
  },
  ja: {
    lang: 'ja',
    path: '/ja/questions/',
    label: '日本語',
    title: '中国旅行の質問と回答',
    description:
      'ビザ、決済、eSIM、ホテル、食事、鉄道、言語、旅程に関する中国旅行の疑問を日本語のQA形式で整理しています。',
    eyebrow: '旅行者の質問',
    heading: '中国旅行の前に知りたいこと。',
    intro:
      '日本語の旅行検索では、具体的な不安をそのまま質問することが多いです。短い答えを先に出し、必要な人だけ詳しいガイドへ進める構成にします。',
    whyTitle: 'なぜQA形式なのか',
    whyCopy:
      '中国旅行では、決済、通信、ホテル、移動など「事前に失敗したくない」疑問が多くあります。質問単位で整理すると、検索にも引っかかりやすく、旅行者も必要な答えをすぐ見つけられます。',
    steps: [
      ['収集', 'レビュー、掲示板、SNS、旅行記から実際の不安や表現を集めます。'],
      ['ローカライズ', '英語を直訳せず、日本語の旅行者が検索しそうな聞き方に直します。'],
      ['回答', 'まず結論を出し、必要に応じて詳しいガイドへつなげます。'],
    ],
    readAnswer: '答えを見る',
    submitTitle: '次に答えてほしい質問は？',
    submitCopy: '旅行準備中に出てきた疑問を送ってください。よい質問は新しいガイドや既存ガイドの更新に使います。',
    submitButton: '質問を送る',
    questionPlaceholder: '例：日本のクレジットカードでAlipayやWeChat Payは使えますか？',
    emailLabel: 'メール任意',
    groups: [
      {
        title: '予約前',
        questions: [
          {
            q: '中国旅行にビザは必要ですか、それとも240時間トランジット免除を使えますか？',
            answer: '航空券を買う前に確認してください。パスポート、入国ルート、滞在日数で答えが変わります。',
            href: '/guides/china-visa-free-2026/',
            guide: 'ビザ免除ガイド',
          },
          {
            q: '出発2週間前に何を準備すればいいですか？',
            answer: '決済アプリ、eSIM、鉄道予約、パスポートコピー、ホテル住所、予約開始日を先に整えます。',
            href: '/guides/china-pre-departure-checklist/',
            guide: '出発前チェックリスト',
          },
          {
            q: '初めての中国旅行なら、どのルートが現実的ですか？',
            answer: '北京、西安、上海を高速鉄道でつなぐ1週間ルートが最も組みやすいです。',
            href: '/guides/7-day-china-itinerary/',
            guide: '7日間モデルコース',
          },
        ],
      },
      {
        title: 'スマホ、決済、アプリ',
        questions: [
          {
            q: '海外カードでAlipayやWeChat Payは使えますか？',
            answer: '使える場面は増えていますが、出発前の設定と、失敗しやすい場所の把握が必要です。',
            href: '/guides/alipay-wechat-pay-foreign-cards/',
            guide: '決済設定ガイド',
          },
          {
            q: '中国でGoogle、LINE、Instagram、Gmailは使えますか？',
            answer: 'ホテルWi-FiやVPNだけに頼るより、ローミングeSIMを準備する方が簡単な場合が多いです。',
            href: '/guides/internet-esim-vpn-blocked-apps/',
            guide: 'ネットとeSIMガイド',
          },
          {
            q: '中国語が話せなくても旅行できますか？',
            answer: 'カメラ翻訳、スクリーンショット、WeChat翻訳、最低限のフレーズで多くの場面は乗り切れます。',
            href: '/guides/translation-language-survival/',
            guide: '言語サバイバルガイド',
          },
        ],
      },
      {
        title: '現地での移動',
        questions: [
          {
            q: '中国国内の移動は鉄道と飛行機のどちらがよいですか？',
            answer: '北京、西安、上海、杭州のようなルートでは、高速鉄道の方が楽なことが多いです。',
            href: '/guides/china-high-speed-trains/',
            guide: '高速鉄道ガイド',
          },
          {
            q: 'DiDi、タクシー、地下鉄QRコードはどう使いますか？',
            answer: '地下鉄はAlipayの交通QR、タクシーは目的地を入力できるDiDiが便利です。',
            href: '/guides/didi-metro-getting-around/',
            guide: '市内交通ガイド',
          },
          {
            q: '外国人パスポートでホテルに泊まれますか？',
            answer: '都市部の一般的なホテルは多くの場合対応していますが、格安宿や民泊、小都市では事前確認が必要です。',
            href: '/guides/hotels-foreigners-china/',
            guide: 'ホテルガイド',
          },
        ],
      },
    ],
  },
} as const;

export type QuestionLocaleKey = keyof typeof questionLocales;
