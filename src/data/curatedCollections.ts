export type CuratedCollectionRegionBucket = 'nyc' | 'milan' | 'rome' | 'switzerland' | 'unknown';

export const curatedRegionMeta = {
  nyc: {
    label: 'NYC',
    city: 'New York City',
    edition: 'NYC food map',
    focus: 'Downtown dinners, Korean comfort, omakase, and West Village stops.',
    hook: 'Use this when you want a dense downtown food crawl without starting from generic best-of lists.',
    annotation: 'Dense restaurant crawl',
    guide: 'Urban',
    cover: {
      src: '/images/curated/city-nyc-restaurant-row.jpg',
      alt: 'Restaurant Row street scene in New York City',
    },
  },
  milan: {
    label: 'Milan',
    city: 'Milan',
    edition: 'Milan short list',
    focus: 'A compact set of restaurants for a northern Italy stop.',
    hook: 'A small Milan set for choosing one or two meals near the core route.',
    annotation: 'Few pins, high intent',
    guide: 'Urban',
    cover: {
      src: '/images/curated/city-milan-brera.jpg',
      alt: 'Bar Brera street scene in Milan',
    },
  },
  rome: {
    label: 'Rome',
    city: 'Rome',
    edition: 'Rome short list',
    focus: 'Saved meals to compare before building a walking route.',
    hook: 'A dinner-first Rome set for pairing food stops with a historic walk.',
    annotation: 'Starter dinner map',
    guide: 'Historic',
    cover: {
      src: '/images/curated/city-rome-trastevere.jpg',
      alt: 'Restaurant exterior in Trastevere, Rome',
    },
  },
  switzerland: {
    label: 'Switzerland',
    city: 'Switzerland',
    edition: 'Swiss stops',
    focus: 'Small cross-city restaurant notes for a wider route.',
    hook: 'Useful when the trip is spread across scenic stops and you need food pins between moves.',
    annotation: 'Route-side saves',
    guide: 'Scenic',
    cover: {
      src: '/images/curated/city-switzerland-muerren.jpg',
      alt: 'Murren mountain village in the Bernese Oberland, Switzerland',
    },
  },
  unknown: {
    label: 'Other',
    city: 'Other',
    edition: 'Other saves',
    focus: 'Places that need a cleaner city label before remixing.',
    hook: 'Review these pins before turning them into a travel-ready set.',
    annotation: 'Needs review',
    guide: 'Mixed',
    cover: {
      src: '/images/curated/home-local-treasures.jpg',
      alt: 'Scenic travel cover for uncategorized saved places',
    },
  },
} satisfies Record<
  CuratedCollectionRegionBucket,
  {
    label: string;
    city: string;
    edition: string;
    focus: string;
    hook: string;
    annotation: string;
    guide: string;
    cover: {
      src: string;
      alt: string;
    };
  }
>;

export interface CuratedCollectionOwner {
  name: string;
  slug: string;
  avatarUrl: string;
  id: string;
}

export interface CuratedCollectionPlace {
  id: string;
  name: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  note: string;
  sourceProvider: string;
  regionBucket: CuratedCollectionRegionBucket;
}

export interface CuratedCollection {
  slug: string;
  provider: string;
  sourceUrl: string;
  canonicalUrl: string;
  listId: string;
  title: string;
  description: string;
  emoji: string;
  owner: CuratedCollectionOwner;
  placeCount: number;
  importedAt: string;
  regionBuckets: Partial<Record<CuratedCollectionRegionBucket, number>>;
  places: CuratedCollectionPlace[];
}

export const bennyChanGoodRestaurants = {
  "slug": "benny-chan-good-restaurants",
  "provider": "Google Maps",
  "sourceUrl": "https://maps.app.goo.gl/6rcQCys342xzSeRx9?g_st=i",
  "canonicalUrl": "https://www.google.com/maps/placelists/list/2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw",
  "listId": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw",
  "title": "good restaurants",
  "description": "",
  "emoji": "🤤",
  "owner": {
    "name": "Benny Chan",
    "slug": "benny-chan",
    "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKrVTIxfXkyGy4TGDhp-xRt-laRu1Qx2DOow-ukEdEv3aCS=mo",
    "id": "118160816319953085723"
  },
  "placeCount": 75,
  "importedAt": "2026-07-05T22:54:11.070Z",
  "regionBuckets": {
    "nyc": 65,
    "milan": 4,
    "switzerland": 3,
    "rome": 3
  },
  "places": [
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:1",
      "name": "Hungry Llama",
      "slug": "hungry-llama",
      "address": "679 Washington St, New York, NY 10014",
      "latitude": 40.733942299999995,
      "longitude": -74.00824399999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:2",
      "name": "Tarallucci e Vino Union Square",
      "slug": "tarallucci-e-vino-union-square",
      "address": "15 E 18th St, New York, NY 10003",
      "latitude": 40.738201,
      "longitude": -73.990605,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:3",
      "name": "Shinzo Omakase",
      "slug": "shinzo-omakase",
      "address": "Please be On Time, BYOB (No Corkage Fee), 60 Min Session, 89 E 2nd St, New York, NY 10009",
      "latitude": 40.7237006,
      "longitude": -73.98769639999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:4",
      "name": "Zero Otto Nove Manhattan",
      "slug": "zero-otto-nove-manhattan",
      "address": "15 W 21st St, New York, NY 10010",
      "latitude": 40.7408377,
      "longitude": -73.99156839999999,
      "note": "tinfoil pasta",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:5",
      "name": "Norma",
      "slug": "norma",
      "address": "438 3rd Ave, New York, NY 10016",
      "latitude": 40.743522999999996,
      "longitude": -73.9799614,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:6",
      "name": "OKDONGSIK New York",
      "slug": "okdongsik-new-york",
      "address": "13 E 30th St 1st floor, New York, NY 10016",
      "latitude": 40.7456944,
      "longitude": -73.9853743,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:7",
      "name": "BCD Tofu House",
      "slug": "bcd-tofu-house",
      "address": "5 W 32nd St, New York, NY 10001",
      "latitude": 40.7475555,
      "longitude": -73.98604449999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:8",
      "name": "Au Cheval",
      "slug": "au-cheval",
      "address": "33 Cortlandt Alley, New York, NY 10013",
      "latitude": 40.7181205,
      "longitude": -74.00179419999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:9",
      "name": "Thai Villa",
      "slug": "thai-villa",
      "address": "5 E 19th St, New York, NY 10003",
      "latitude": 40.7390045,
      "longitude": -73.9906704,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:10",
      "name": "Boucherie Union Square",
      "slug": "boucherie-union-square",
      "address": "225 Park Ave S, New York, NY 10003",
      "latitude": 40.7372552,
      "longitude": -73.9882246,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:11",
      "name": "Mission Ceviche Union Square",
      "slug": "mission-ceviche-union-square",
      "address": "7 E 17th St, New York, NY 10003",
      "latitude": 40.7377086,
      "longitude": -73.9914811,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:12",
      "name": "Eight Jane",
      "slug": "eight-jane",
      "address": "37-12 Main St, Flushing, NY 11354",
      "latitude": 40.7611043,
      "longitude": -73.831073,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:13",
      "name": "Mama Mezze",
      "slug": "mama-mezze",
      "address": "1123 Broadway, New York, NY 10010",
      "latitude": 40.7432459,
      "longitude": -73.9892711,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:14",
      "name": "Sabai Thai",
      "slug": "sabai-thai",
      "address": "432 Park Ave S, New York, NY 10016",
      "latitude": 40.744299,
      "longitude": -73.98366399999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:15",
      "name": "La Pecora Bianca NoMad",
      "slug": "la-pecora-bianca-nomad",
      "address": "1133 Broadway, New York, NY 10010",
      "latitude": 40.7436754,
      "longitude": -73.9891719,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:16",
      "name": "L’Adresse NoMad",
      "slug": "l-adresse-nomad",
      "address": "1184 Broadway, New York, NY 10001",
      "latitude": 40.745508699999995,
      "longitude": -73.9884895,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:17",
      "name": "Zaytinya",
      "slug": "zaytinya",
      "address": "1185 Broadway Ground Floor, New York, NY 10001",
      "latitude": 40.745546,
      "longitude": -73.9889515,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:18",
      "name": "Nami Nori West Village",
      "slug": "nami-nori-west-village",
      "address": "33 Carmine St, New York, NY 10014",
      "latitude": 40.7302179,
      "longitude": -74.003219,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:19",
      "name": "Jiang's Kitchen 疆湖 - Halal Chinese Food",
      "slug": "jiang-s-kitchen-halal-chinese-food",
      "address": "65 St Marks Pl, New York, NY 10003",
      "latitude": 40.7281888,
      "longitude": -73.9860631,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:20",
      "name": "Via Quadronno",
      "slug": "via-quadronno",
      "address": "25 E 73rd St, New York, NY 10021",
      "latitude": 40.7727207,
      "longitude": -73.9651722,
      "note": "amazing sandwiches",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:21",
      "name": "COQODAQ",
      "slug": "coqodaq",
      "address": "12 E 22nd St, New York, NY 10010",
      "latitude": 40.7400559,
      "longitude": -73.9887467,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:22",
      "name": "Little Prince",
      "slug": "little-prince",
      "address": "199 Prince St, New York, NY 10012",
      "latitude": 40.726876499999996,
      "longitude": -74.0027216,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:23",
      "name": "Ci Siamo",
      "slug": "ci-siamo",
      "address": "440 W 33rd St Suite #100, New York, NY 10001",
      "latitude": 40.7526152,
      "longitude": -73.9989141,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:24",
      "name": "Oscar Wilde",
      "slug": "oscar-wilde",
      "address": "45 W 27th St, New York, NY 10001",
      "latitude": 40.7451638,
      "longitude": -73.99007209999999,
      "note": "truffle gnocchi ",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:25",
      "name": "Paros Tribeca",
      "slug": "paros-tribeca",
      "address": "211 W Broadway, New York, NY 10013",
      "latitude": 40.718913799999996,
      "longitude": -74.0062106,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:26",
      "name": "Au Za'atar - East Village",
      "slug": "au-za-atar-east-village",
      "address": "188 Avenue A, New York, NY 10009",
      "latitude": 40.7289046,
      "longitude": -73.98117239999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:27",
      "name": "Osteria Delbianco Bryant Park",
      "slug": "osteria-delbianco-bryant-park",
      "address": "18 E 41st St, New York, NY 10017",
      "latitude": 40.752207899999995,
      "longitude": -73.9804547,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:28",
      "name": "noa, a café",
      "slug": "noa-a-cafe",
      "address": "34 E 32nd St, New York, NY 10016",
      "latitude": 40.746014599999995,
      "longitude": -73.9833113,
      "note": "breakfast burrito",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:29",
      "name": "La Dong",
      "slug": "la-dong",
      "address": "11 E 17th St, New York, NY 10003",
      "latitude": 40.7377201,
      "longitude": -73.9912047,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:30",
      "name": "Pastis",
      "slug": "pastis",
      "address": "52 Gansevoort St, New York, NY 10014",
      "latitude": 40.739289199999995,
      "longitude": -74.0069717,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:31",
      "name": "OLIO E PIÙ",
      "slug": "olio-e-piu",
      "address": "3 Greenwich Ave, New York, NY 10014",
      "latitude": 40.733820699999995,
      "longitude": -73.9997865,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:32",
      "name": "Dagon",
      "slug": "dagon",
      "address": "2454 Broadway, New York, NY 10024",
      "latitude": 40.791271099999996,
      "longitude": -73.9738886,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:33",
      "name": "Dave's Hot Chicken",
      "slug": "dave-s-hot-chicken",
      "address": "944 8th Ave, New York, NY 10019",
      "latitude": 40.7657431,
      "longitude": -73.9831813,
      "note": "really spicy chicken sandwich",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:34",
      "name": "Soothr",
      "slug": "soothr",
      "address": "204 E 13th St, New York, NY 10003",
      "latitude": 40.7323017,
      "longitude": -73.9873417,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:35",
      "name": "Santa Fe BK",
      "slug": "santa-fe-bk",
      "address": "178 N 8th St, Brooklyn, NY 11211",
      "latitude": 40.7179797,
      "longitude": -73.9566863,
      "note": "breakfast burrito",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:36",
      "name": "Pring",
      "slug": "pring",
      "address": "401 W 24th St, New York, NY 10011",
      "latitude": 40.7473508,
      "longitude": -74.0011933,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:37",
      "name": "Shukette",
      "slug": "shukette",
      "address": "230 9th Ave, New York, NY 10001",
      "latitude": 40.747154599999995,
      "longitude": -74.0005218,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:38",
      "name": "HaSalon",
      "slug": "hasalon",
      "address": "735 10th Ave, New York, NY 10019",
      "latitude": 40.764472399999995,
      "longitude": -73.99221039999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:39",
      "name": "I Sodi",
      "slug": "i-sodi",
      "address": "314 Bleecker St, New York, NY 10014",
      "latitude": 40.7327965,
      "longitude": -74.004058,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:40",
      "name": "Ceremonia Bakeshop",
      "slug": "ceremonia-bakeshop",
      "address": "743 Driggs Ave, Brooklyn, NY 11211",
      "latitude": 40.7124964,
      "longitude": -73.9605857,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:41",
      "name": "Court Street Grocers",
      "slug": "court-street-grocers",
      "address": "540 LaGuardia Pl, New York, NY 10012",
      "latitude": 40.7288316,
      "longitude": -73.99849999999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:42",
      "name": "Society Cafe",
      "slug": "society-cafe",
      "address": "52 W 13th St, New York, NY 10011",
      "latitude": 40.73618,
      "longitude": -73.9966,
      "note": "very pretty place and good brunch",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:43",
      "name": "Sala Thai",
      "slug": "sala-thai",
      "address": "307 Amsterdam Ave, New York, NY 10023",
      "latitude": 40.7801149,
      "longitude": -73.9803307,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:44",
      "name": "Counter & Bodega",
      "slug": "counter-and-bodega",
      "address": "216 7th Ave, New York, NY 10011",
      "latitude": 40.7438248,
      "longitude": -73.9962761,
      "note": "really tasty latin food",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:45",
      "name": "Ayat",
      "slug": "ayat",
      "address": "107 Loisaida Ave, New York, NY 10009",
      "latitude": 40.724249799999996,
      "longitude": -73.9789883,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:46",
      "name": "Chama Mama Chelsea",
      "slug": "chama-mama-chelsea",
      "address": "149 W 14th St, New York, NY 10011",
      "latitude": 40.7384413,
      "longitude": -73.9988997,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:47",
      "name": "The Osprey",
      "slug": "the-osprey",
      "address": "60 Furman St, Brooklyn, NY 11201",
      "latitude": 40.7023371,
      "longitude": -73.99551559999999,
      "note": "amazing brunch",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:48",
      "name": "Osteria 57",
      "slug": "osteria-57",
      "address": "57 W 10th St, New York, NY 10011",
      "latitude": 40.735161999999995,
      "longitude": -73.9987529,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:49",
      "name": "Buttermilk Bakeshop",
      "slug": "buttermilk-bakeshop",
      "address": "264 5th Ave, Brooklyn, NY 11215",
      "latitude": 40.6748593,
      "longitude": -73.9818781,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:50",
      "name": "Kame",
      "slug": "kame",
      "address": "330 8th Ave, New York, NY 10001",
      "latitude": 40.747487799999995,
      "longitude": -73.99664899999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:51",
      "name": "Ichiran",
      "slug": "ichiran",
      "address": "132 W 31st St, New York, NY 10001",
      "latitude": 40.748267,
      "longitude": -73.990714,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:52",
      "name": "Amali NYC",
      "slug": "amali-nyc",
      "address": "115 E 60th St, New York, NY 10022",
      "latitude": 40.763369399999995,
      "longitude": -73.96856269999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:53",
      "name": "Lava Shawarma NYC",
      "slug": "lava-shawarma-nyc",
      "address": "226 Thompson St, New York, NY 10012",
      "latitude": 40.7291753,
      "longitude": -73.9987336,
      "note": "really good food, just a bit slow",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:54",
      "name": "Lao Ma Spicy",
      "slug": "lao-ma-spicy",
      "address": "58 E 8th St, New York, NY 10003",
      "latitude": 40.7309048,
      "longitude": -73.9934337,
      "note": "dry pot is very good",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:55",
      "name": "七里香 ristorante di SICHUAN",
      "slug": "ristorante-di-sichuan",
      "address": "Via Carlo Farini, 6, 20154 Milano MI, Italy",
      "latitude": 45.4832694,
      "longitude": 9.1817583,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "milan"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:56",
      "name": "Bryn Williams at The Cambrian",
      "slug": "bryn-williams-at-the-cambrian",
      "address": "Dorfstrasse 7, 3715 Adelboden, Switzerland",
      "latitude": 46.4936419,
      "longitude": 7.5612144,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "switzerland"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:57",
      "name": "Restaurant Alpenblick",
      "slug": "restaurant-alpenblick",
      "address": "Dorfstrasse 9, 3715 Adelboden, Switzerland",
      "latitude": 46.493530299999996,
      "longitude": 7.5606399,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "switzerland"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:58",
      "name": "Asllanis Corner",
      "slug": "asllanis-corner",
      "address": "Höheweg 94, 3800 Interlaken, Switzerland",
      "latitude": 46.6896512,
      "longitude": 7.866117,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "switzerland"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:59",
      "name": "Al Cantinone",
      "slug": "al-cantinone",
      "address": "Via Agnello, 19, 20121 Milano MI, Italy",
      "latitude": 45.466031799999996,
      "longitude": 9.1917146,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "milan"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:60",
      "name": "DeRos Restaurant",
      "slug": "deros-restaurant",
      "address": "Via Romagnosi, 4, 20121 Milano MI, Italy",
      "latitude": 45.468609,
      "longitude": 9.190534,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "milan"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:61",
      "name": "Salsamenteria di Parma",
      "slug": "salsamenteria-di-parma",
      "address": "Via Ponte Vetero, 11, 20121 Milano MI, Italy",
      "latitude": 45.4696722,
      "longitude": 9.1849917,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "milan"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:62",
      "name": "Gran Caffè Rione VIII",
      "slug": "gran-caffe-rione-viii",
      "address": "Via di S. Maria del Pianto, 59, 00186 Roma RM, Italy",
      "latitude": 41.893526099999995,
      "longitude": 12.476161699999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "rome"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:63",
      "name": "Trattoria Lilli",
      "slug": "trattoria-lilli",
      "address": "Via di Tor di Nona, 23, 00186 Roma RM, Italy",
      "latitude": 41.901536899999996,
      "longitude": 12.4706306,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "rome"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:64",
      "name": "Cuoco & Camicia",
      "slug": "cuoco-and-camicia",
      "address": "Via di Monte Polacco, 2/4, 00184 Roma RM, Italy",
      "latitude": 41.8944407,
      "longitude": 12.4937826,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "rome"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:65",
      "name": "L'Antagoniste",
      "slug": "l-antagoniste",
      "address": "238 Malcolm X Blvd, Brooklyn, NY 11233",
      "latitude": 40.6850192,
      "longitude": -73.9296181,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:66",
      "name": "Prédio Friends",
      "slug": "predio-friends",
      "address": "90 Bedford St, New York, NY 10014",
      "latitude": 40.7323891,
      "longitude": -74.0053427,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:67",
      "name": "Cookshop",
      "slug": "cookshop",
      "address": "156 10th Ave, New York, NY 10011",
      "latitude": 40.7456552,
      "longitude": -74.005422,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:68",
      "name": "Laut",
      "slug": "laut",
      "address": "15 E 17th St, New York, NY 10003",
      "latitude": 40.737558199999995,
      "longitude": -73.99112029999999,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:69",
      "name": "Friend Of A Farmer",
      "slug": "friend-of-a-farmer",
      "address": "77 Irving Pl, New York, NY 10003",
      "latitude": 40.7368776,
      "longitude": -73.9868623,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:70",
      "name": "The Grey Dog",
      "slug": "the-grey-dog",
      "address": "49 Carmine St, New York, NY 10014",
      "latitude": 40.7300117,
      "longitude": -74.0038879,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:71",
      "name": "Rana Fifteen",
      "slug": "rana-fifteen",
      "address": "209 4th Ave, Brooklyn, NY 11217",
      "latitude": 40.6774895,
      "longitude": -73.9826649,
      "note": "turkish breakfast",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:72",
      "name": "Cafe Luna",
      "slug": "cafe-luna",
      "address": "628 Hudson St, New York, NY 10014",
      "latitude": 40.7383306,
      "longitude": -74.0053786,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:73",
      "name": "Nabila's",
      "slug": "nabila-s",
      "address": "248 Court St, Brooklyn, NY 11201",
      "latitude": 40.6856127,
      "longitude": -73.9945068,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:74",
      "name": "Trattoria Trecolori",
      "slug": "trattoria-trecolori",
      "address": "254 W 47th St, New York, NY 10036",
      "latitude": 40.7599972,
      "longitude": -73.9867421,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    },
    {
      "id": "2VFPO_U1kVNK6Spj2p1_Mk3dsswhkw:75",
      "name": "The Garret",
      "slug": "the-garret",
      "address": "296 Bleecker St, New York, NY 10014",
      "latitude": 40.7323715,
      "longitude": -74.003783,
      "note": "",
      "sourceProvider": "Google Maps",
      "regionBucket": "nyc"
    }
  ]
} satisfies CuratedCollection;

export const curatedCollections = [bennyChanGoodRestaurants] as const;
