export const questionAlternates = [
  { hreflang: 'en', href: '/answers/' },
  { hreflang: 'ko', href: '/ko/answers/' },
  { hreflang: 'ja', href: '/ja/answers/' },
  { hreflang: 'x-default', href: '/answers/' },
];

export const questionLocales = {
  en: {
    lang: 'en',
    path: '/answers/',
    label: 'English',
    title: 'Traveler answers matched to China guides',
    description:
      'Common China travel answers in a retrieval-friendly QA format, matched to crowd-vetted guides on visas, payments, eSIMs, hotels, food, trains, language, and itineraries.',
    eyebrow: 'Traveler answers',
    heading: 'China travel answers',
    intro:
      'Answer pages should match how travelers actually search: short concerns, direct answers, and a guide when they need more detail.',
    readAnswer: 'Read answer',
    submitTitle: 'What should we answer next?',
    submitCopy: 'Send a real planning question. The best questions become new guides or updates to existing ones.',
    submitButton: 'Submit answer request',
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
            answer: 'A provider-verified international roaming plan is usually safer than relying on hotel Wi-Fi or an unverified VPN alone.',
            href: '/guides/internet-esim-vpn-blocked-apps/',
            guide: 'Internet and eSIM guide',
          },
          {
            q: 'Can I get around if I do not speak Chinese?',
            answer: 'Offline camera and screenshot translation plus reviewed Chinese address and needs cards cover routine tasks; high-stakes details need human confirmation.',
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
          {
            q: 'Can I eat safely in China with a severe food allergy or celiac disease?',
            answer: 'Do not rely on menu translation alone. Prepare a reviewed Chinese chef card and medical plan, verify kitchen cross-contact, keep prescribed medication accessible, and leave when staff cannot confirm the requirement.',
            href: '/guides/food-ordering-dietary/',
            guide: 'Food and dietary guide',
            related: [
              { label: 'Offline translation', href: '/guides/translation-language-survival/' },
              { label: 'Payment fallback', href: '/guides/alipay-wechat-pay-foreign-cards/' },
            ],
          },
          {
            q: 'How do I visit a Chinese teahouse without getting trapped by hidden charges?',
            answer: 'Choose the venue yourself, resolve its official Chinese identity, and confirm the tea, weight, seat or room fee, service charge, refills, minimum purchase, and total before brewing. Do not follow a stranger who approached you to a venue they selected.',
            href: '/guides/tea-houses-and-rituals/',
            guide: 'Teahouse and tea-buying guide',
            related: [
              { label: 'Payment fallback', href: '/guides/alipay-wechat-pay-foreign-cards/' },
              { label: 'Offline translation', href: '/guides/translation-language-survival/' },
            ],
          },
          {
            q: 'Can I enter hutong courtyards or residential longtang lanes shown in travel videos?',
            answer: 'Only enter when the space is clearly a public museum, business, booked stay, or an occupant explicitly invites you. Build the walk from named public streets, parks, and transit exits; an open gate or creator entering is not proof of public access.',
            href: '/guides/neighborhoods-beyond-landmarks/',
            guide: 'Neighborhood walk guide',
            related: [
              { label: 'Map and pickup workflow', href: '/guides/didi-metro-getting-around/' },
              { label: 'Offline place cards', href: '/guides/translation-language-survival/' },
            ],
          },
          {
            q: 'A Reel shows a Chinese lantern festival. How do I find the right zone, ticket, and closing time?',
            answer: 'Find the current-year operator notice first. Keep the permanent venue separate from the temporary event, then verify the Gregorian date, exact zone, free or paid access, entrance, last admission, closure notice, final transport, and weather or crowd fallback.',
            href: '/guides/festivals-and-local-experiences/',
            guide: 'Festival and nightlife execution guide',
            related: [
              { label: 'Timed attraction tickets', href: '/guides/china-attraction-tickets-reservations/' },
              { label: 'Map and pickup workflow', href: '/guides/didi-metro-getting-around/' },
            ],
          },
        ],
      },
    ],
  },
  ko: {
    lang: 'ko',
    path: '/ko/answers/',
    label: '한국어',
    title: '중국 여행 질문과 답변',
    description:
      '비자, 결제, eSIM, 호텔, 음식, 기차, 언어, 일정, 지도 저장에 대한 중국 여행 질문을 한국어 QA 형식으로 정리하고 관련 가이드로 연결합니다.',
    eyebrow: '여행자 질문',
    heading: '중국 여행 전에 가장 많이 묻는 질문.',
    intro:
      '한국어 검색 사용자는 짧고 구체적인 질문으로 정보를 찾는 경우가 많습니다. 그래서 답변은 먼저 결론을 말하고, 필요한 경우 자세한 가이드로 연결합니다.',
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
            answer: '중국 본토와 필요한 앱 접속을 명시한 국제 로밍 요금제를 확인하고, 호텔 와이파이나 검증되지 않은 VPN 하나에만 의존하지 않는 편이 안전합니다.',
            href: '/guides/internet-esim-vpn-blocked-apps/',
            guide: '인터넷과 eSIM 가이드',
          },
          {
            q: '중국어를 못해도 여행할 수 있나요?',
            answer: '오프라인 카메라·스크린샷 번역과 검토된 중국어 주소·요청 카드는 일상적인 상황에 유용하지만, 알레르기·의료·티켓 정보는 사람의 확인이 필요합니다.',
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
          {
            q: '심한 음식 알레르기나 셀리악병이 있어도 중국에서 안전하게 먹을 수 있나요?',
            answer: '메뉴 번역만 믿지 마세요. 검토된 중국어 셰프 카드와 의료 계획을 준비하고, 주방의 교차 접촉 가능성을 확인하며, 처방받은 응급약을 항상 휴대해야 합니다. 확인할 수 없다는 답을 들으면 주문하지 않는 것이 안전합니다.',
            href: '/guides/food-ordering-dietary/',
            guide: '음식·식이 제한 가이드',
          },
          {
            q: '중국 찻집에서 숨은 요금이나 사기를 피하려면 어떻게 해야 하나요?',
            answer: '직접 고른 장소의 공식 중국어 상호와 주소를 확인하고, 차 종류와 중량, 좌석·룸·서비스 요금, 리필, 최소 구매액, 총액을 차를 우리기 전에 서면으로 확인하세요. 길에서 접근한 사람이 고른 장소로 따라가지 마세요.',
            href: '/guides/tea-houses-and-rituals/',
            guide: '찻집·차 구매 가이드',
          },
          {
            q: '여행 영상에 나온 후퉁 안뜰이나 주거용 룽탕 골목에 들어가도 되나요?',
            answer: '공공 박물관, 영업 중인 가게, 예약한 숙소이거나 거주자가 명확히 초대한 경우에만 들어가세요. 열린 문이나 영상 속 크리에이터의 출입만으로 공공 접근이 허용된다고 판단하면 안 됩니다. 공개 도로, 공원, 교통 출구로 짧은 경로를 만드세요.',
            href: '/guides/neighborhoods-beyond-landmarks/',
            guide: '동네 산책 가이드',
          },
          {
            q: '릴스에 나온 중국 등불 축제의 정확한 구역과 티켓, 종료 시간은 어떻게 확인하나요?',
            answer: '먼저 해당 연도의 공식 주최측 공지를 찾으세요. 상설 장소와 기간 한정 행사를 분리하고, 양력 날짜, 정확한 구역, 무료·유료 여부, 입구, 마지막 입장, 휴장 공지, 마지막 교통편, 날씨·혼잡 대안을 확인하세요.',
            href: '/guides/festivals-and-local-experiences/',
            guide: '축제·야간 활동 실행 가이드',
          },
        ],
      },
    ],
  },
  ja: {
    lang: 'ja',
    path: '/ja/answers/',
    label: '日本語',
    title: '中国旅行の質問と回答',
    description:
      'ビザ、決済、eSIM、ホテル、食事、鉄道、言語、旅程、地図保存に関する中国旅行の疑問を日本語のQA形式で整理し、関連ガイドと実用的な準備手順へつなげます。',
    eyebrow: '旅行者の質問',
    heading: '中国旅行の前に知りたいこと。',
    intro:
      '日本語の旅行検索では、具体的な不安をそのまま質問することが多いです。短い答えを先に出し、必要な人だけ詳しいガイドへ進める構成にします。',
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
            answer: '中国本土と必要なアプリへの接続を明記した国際ローミングプランを確認し、ホテルWi-Fiや未検証のVPNだけに頼らない方が安全です。',
            href: '/guides/internet-esim-vpn-blocked-apps/',
            guide: 'ネットとeSIMガイド',
          },
          {
            q: '中国語が話せなくても旅行できますか？',
            answer: 'オフラインのカメラ・スクリーンショット翻訳と確認済みの中国語住所・要望カードは日常場面に有効ですが、アレルギー・医療・チケット情報は人による確認が必要です。',
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
          {
            q: '重い食物アレルギーやセリアック病があっても中国で安全に食事できますか？',
            answer: 'メニュー翻訳だけに頼らず、確認済みの中国語シェフカードと医療計画を用意し、厨房での交差接触を確認して、処方された緊急薬を常に携帯してください。対応を保証できない店では注文しない判断が必要です。',
            href: '/guides/food-ordering-dietary/',
            guide: '食事・食事制限ガイド',
          },
          {
            q: '中国の茶館で隠れた料金や勧誘トラブルを避けるには？',
            answer: '自分で選んだ店の正式な中国語名と住所を確認し、茶の種類・重量、席料・個室料・サービス料、湯の追加、最低購入額、合計を淹れる前に書面で確認してください。路上で声をかけてきた人が選んだ店にはついて行かないでください。',
            href: '/guides/tea-houses-and-rituals/',
            guide: '茶館・茶葉購入ガイド',
          },
          {
            q: '旅行動画に出てくる胡同の中庭や住宅の弄堂に入ってもよいですか？',
            answer: '公共の博物館、営業中の店舗、予約済みの宿泊先、または居住者から明確に招かれた場合だけ入ってください。開いた門や投稿者が入った映像だけでは一般公開の証拠になりません。公道、公園、交通機関の出口を使って短いルートを組みます。',
            href: '/guides/neighborhoods-beyond-landmarks/',
            guide: '街歩きガイド',
          },
          {
            q: 'リールに出てきた中国のランタン祭りで、正しい会場エリア、チケット、終了時間をどう確認しますか？',
            answer: 'まず訪問年の主催者公式告知を確認します。常設施設と期間限定イベントを分け、西暦の開催日、正確なゾーン、無料・有料の別、入口、最終入場、休止告知、帰りの最終交通、天候・混雑時の代替案を記録します。',
            href: '/guides/festivals-and-local-experiences/',
            guide: '祭り・ナイトライフ実行ガイド',
          },
        ],
      },
    ],
  },
} as const;

export type QuestionLocaleKey = keyof typeof questionLocales;
