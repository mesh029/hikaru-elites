export type GalleryCategory = "all" | "kids" | "schools" | "coaching" | "events";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: Exclude<GalleryCategory, "all">;
  pin: "short" | "medium" | "tall";
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  image: string;
  body: string[];
};

/** Sirv CDN — Hikaru field photos */
export const sirv = {
  host: "https://meshackariri.sirv.com",
  folder: "/chess101/chess",
} as const;

function sirvUrl(file: string, query = "w=1600&q=80") {
  return `${sirv.host}${sirv.folder}/${file}?${query}`;
}

/** Full-resolution Sirv URL for print / download */
function sirvPrintUrl(file: string) {
  return sirvUrl(file, "w=2400&q=90");
}

function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/**
 * Every src below is unique site-wide.
 * Hero keeps the classic board. Sections use Hikaru Sirv shots +
 * free African / kids chess atmosphere photos (not Chess Masala hotlinks).
 */
export const photos = {
  heroBoard: {
    src: unsplash("photo-1529699211952-734e80c4d42b", 2400),
    alt: "Chess board mid-game",
  },
  kidsSession: {
    src: sirvUrl("IMG-20250727-WA0078.jpg"),
    alt: "Children gathered around a chess game",
  },
  teachingBoard: {
    src: sirvUrl("IMG-20250722-WA0166.jpg"),
    alt: "Coach presenting a roll-up teaching chess board",
  },
  focusedPlay: {
    src: sirvUrl("IMG-20250727-WA0088.jpg"),
    alt: "Chess player focused at an outdoor board",
  },
  demoBoard: {
    src: sirvUrl("IMG-20250722-WA0164.jpg"),
    alt: "Hikaru coach holding a demonstration chess board outdoors",
  },
  lakesideCoach: {
    src: sirvUrl("IMG-20250722-WA0177.jpg"),
    alt: "Coach with chess set by the water",
  },
  boardCape: {
    src: sirvUrl("IMG-20250722-WA0224.jpg"),
    alt: "Coach with roll-up chess board by the water",
  },
  outdoorSession: {
    src: sirvUrl("IMG-20250727-WA0042.jpg"),
    alt: "Outdoor chess session in Kenya",
  },
  groupPlay: {
    src: sirvUrl("IMG-20250727-WA0048.jpg"),
    alt: "Players gathered for an outdoor chess match",
  },
  boardCircle: {
    src: sirvUrl("IMG-20250727-WA0069.jpg"),
    alt: "Chess circle during a community session",
  },
  sideTable: {
    src: sirvUrl("IMG-20250727-WA0084.jpg"),
    alt: "Focused play at a side table",
  },
} as const;

export const navLinks = [
  { href: "/programs", label: "Programs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/articles", label: "Articles" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export type PrintPhotoId = keyof typeof photos | (string & {});

/** Photos available for A3 print cards (Sirv CDN). */
export const printPhotos = [
  {
    id: "boardCape",
    file: "IMG-20250722-WA0224.jpg",
    label: "Board cape · lakeside",
    alt: photos.boardCape.alt,
    src: sirvPrintUrl("IMG-20250722-WA0224.jpg"),
    thumb: sirvUrl("IMG-20250722-WA0224.jpg", "w=600&q=75"),
    objectPosition: "52% 28%",
  },
  {
    id: "kidsSession",
    file: "IMG-20250727-WA0078.jpg",
    label: "Kids session",
    alt: photos.kidsSession.alt,
    src: sirvPrintUrl("IMG-20250727-WA0078.jpg"),
    thumb: sirvUrl("IMG-20250727-WA0078.jpg", "w=600&q=75"),
    objectPosition: "45% 20%",
  },
  {
    id: "teachingBoard",
    file: "IMG-20250722-WA0166.jpg",
    label: "Teaching board",
    alt: photos.teachingBoard.alt,
    src: sirvPrintUrl("IMG-20250722-WA0166.jpg"),
    thumb: sirvUrl("IMG-20250722-WA0166.jpg", "w=600&q=75"),
    objectPosition: "50% 30%",
  },
  {
    id: "demoBoard",
    file: "IMG-20250722-WA0164.jpg",
    label: "Demo board",
    alt: photos.demoBoard.alt,
    src: sirvPrintUrl("IMG-20250722-WA0164.jpg"),
    thumb: sirvUrl("IMG-20250722-WA0164.jpg", "w=600&q=75"),
    objectPosition: "50% 25%",
  },
  {
    id: "lakesideCoach",
    file: "IMG-20250722-WA0177.jpg",
    label: "Lakeside coach",
    alt: photos.lakesideCoach.alt,
    src: sirvPrintUrl("IMG-20250722-WA0177.jpg"),
    thumb: sirvUrl("IMG-20250722-WA0177.jpg", "w=600&q=75"),
    objectPosition: "50% 30%",
  },
  {
    id: "focusedPlay",
    file: "IMG-20250727-WA0088.jpg",
    label: "Focused play",
    alt: photos.focusedPlay.alt,
    src: sirvPrintUrl("IMG-20250727-WA0088.jpg"),
    thumb: sirvUrl("IMG-20250727-WA0088.jpg", "w=600&q=75"),
    objectPosition: "50% 25%",
  },
  {
    id: "outdoorSession",
    file: "IMG-20250727-WA0042.jpg",
    label: "Outdoor session",
    alt: photos.outdoorSession.alt,
    src: sirvPrintUrl("IMG-20250727-WA0042.jpg"),
    thumb: sirvUrl("IMG-20250727-WA0042.jpg", "w=600&q=75"),
    objectPosition: "50% 30%",
  },
  {
    id: "groupPlay",
    file: "IMG-20250727-WA0048.jpg",
    label: "Group play",
    alt: photos.groupPlay.alt,
    src: sirvPrintUrl("IMG-20250727-WA0048.jpg"),
    thumb: sirvUrl("IMG-20250727-WA0048.jpg", "w=600&q=75"),
    objectPosition: "50% 35%",
  },
  {
    id: "boardCircle",
    file: "IMG-20250727-WA0069.jpg",
    label: "Board circle",
    alt: photos.boardCircle.alt,
    src: sirvPrintUrl("IMG-20250727-WA0069.jpg"),
    thumb: sirvUrl("IMG-20250727-WA0069.jpg", "w=600&q=75"),
    objectPosition: "50% 30%",
  },
  {
    id: "sideTable",
    file: "IMG-20250727-WA0084.jpg",
    label: "Side table",
    alt: photos.sideTable.alt,
    src: sirvPrintUrl("IMG-20250727-WA0084.jpg"),
    thumb: sirvUrl("IMG-20250727-WA0084.jpg", "w=600&q=75"),
    objectPosition: "50% 30%",
  },
] as const;

export type PrintPhoto = {
  id: string;
  file: string;
  label: string;
  alt: string;
  src: string;
  thumb: string;
  objectPosition: string;
};

export const DEFAULT_PRINT_PHOTO_ID = "boardCape" as const;

export function getPrintPhoto(id?: string | null): PrintPhoto {
  const match = printPhotos.find((photo) => photo.id === id);
  if (match) return match;
  return (
    printPhotos.find((photo) => photo.id === DEFAULT_PRINT_PHOTO_ID) ??
    printPhotos[0]
  );
}

/** Accept only http(s) image URLs for custom card generation. */
export function sanitizeImageUrl(raw?: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function customPrintPhoto(imageUrl: string): PrintPhoto {
  return {
    id: "custom",
    file: "custom.jpg",
    label: "Custom image URL",
    alt: "Custom card image",
    src: imageUrl,
    thumb: imageUrl,
    objectPosition: "50% 30%",
  };
}

export function resolvePrintPhoto(options: {
  photo?: string | null;
  img?: string | null;
}): PrintPhoto {
  const custom = sanitizeImageUrl(options.img);
  if (custom) return customPrintPhoto(custom);
  return getPrintPhoto(options.photo);
}

export type PrintCardPillar = {
  label: string;
  title: string;
  line: string;
  body: string;
  focus?: boolean;
};

export const printCards = [
  {
    id: "parents" as const,
    title: "Parents",
    line: "Kids training that builds focus and confidence.",
    body: "A3 card for families — what your child learns, how sessions run, and how you stay in the loop.",
    eyebrow: "Kids · Focus · Confidence",
    tagline:
      "Chess that builds patience, focus, and competitive calm — without killing the fun.",
    frontMeta: "For parents",
    backEyebrow: "For parents & guardians",
    backTitle: "What your child actually gets",
    backLede:
      "Hikaru kids training is age-ready and structured. We start where your child is — curiosity first, openings later — so focus and confidence grow without burning out the joy of the game.",
    pillars: [
      {
        label: "At the board",
        title: "Skills that stick",
        line: "Focus, patience, sportsmanship.",
        body: "Children learn piece stories, fair play, and how to think ahead — habits that show up in homework and everyday decisions.",
        focus: true,
      },
      {
        label: "For you",
        title: "Clear progress",
        line: "You can see what improved.",
        body: "Sessions follow a plan. We share what was practiced and what comes next, so you are not guessing at home.",
      },
      {
        label: "Practical",
        title: "Real schedules",
        line: "Fits family life.",
        body: "Group kids sessions and optional private top-ups when your child is ready for sharper work — without weekend-only chaos.",
      },
    ] satisfies PrintCardPillar[],
    benefits: [
      "Age-ready entry — not a wall of openings on day one",
      "Focus and calm under pressure, practiced every session",
      "Sportsmanship and respectful competition",
      "Progress notes parents can talk about at home",
      "Path into school clubs or private coaching when ready",
    ],
    ctaTitle: "Inquire for kids training",
  },
  {
    id: "kids" as const,
    title: "Kids",
    line: "First moves that stick for life.",
    body: "A3 card for young players — fun missions, real games, and skills that grow with them.",
    eyebrow: "Play · Learn · Grow",
    tagline:
      "Learn the board like a game worth mastering — names, missions, and real matches.",
    frontMeta: "Kids training",
    backEyebrow: "For young players",
    backTitle: "Chess that still feels like play",
    backLede:
      "Knights hop. Rooks run straight. Kings stay brave but careful. Hikaru kids training turns rules into stories and practice into missions — then you play for real.",
    pillars: [
      {
        label: "01",
        title: "Learn",
        line: "Pieces with purpose.",
        body: "You meet each piece through stories and small missions before diving into heavy theory.",
        focus: true,
      },
      {
        label: "02",
        title: "Play",
        line: "Real games, every week.",
        body: "Practice seats, mini-matches, and fair play — so you get better by actually sitting at the board.",
      },
      {
        label: "03",
        title: "Level up",
        line: "Ready for more?",
        body: "When you want sharper calculation, we open school clubs and private coaching paths.",
      },
    ] satisfies PrintCardPillar[],
    benefits: [
      "Fun first — discipline without killing curiosity",
      "Clear goals each session so you know what you are working on",
      "Friends at the board and respectful competition",
      "Coaches who explain, not just lecture",
      "A path from first moves to serious improvement",
    ],
    ctaTitle: "Join a kids session",
  },
  {
    id: "schools" as const,
    title: "Schools",
    line: "Campus programs that fit real timetables.",
    body: "A3 card for heads, teachers, and clubs — structure, outcomes, and flexible delivery.",
    eyebrow: "Campus · Clubs · Terms",
    tagline:
      "We bring the board to your campus — structured programs that fit real timetables and real classrooms.",
    frontMeta: "School partnerships",
    backEyebrow: "For schools & administrators",
    backTitle: "A program staff can stand behind",
    backLede:
      "Hikaru partners with schools for clubs, term blocks, and demo days. You get session design that fits the bell schedule, and outcomes you can report to parents and leadership.",
    pillars: [
      {
        label: "Delivery",
        title: "On your campus",
        line: "We come to you.",
        body: "Clubs, after-school blocks, or term programs — set up around your calendar, rooms, and class sizes.",
        focus: true,
      },
      {
        label: "Quality",
        title: "Visible structure",
        line: "Teachers can observe.",
        body: "Clear session plans, warm-ups, guided play, and wrap-ups — not unstructured free play with a board in the corner.",
      },
      {
        label: "Outcomes",
        title: "Reportable progress",
        line: "Parents ask. You can answer.",
        body: "Focus, problem-solving, and sportsmanship markers schools can share with confidence.",
      },
    ] satisfies PrintCardPillar[],
    benefits: [
      "Fits school days — not weekend-only hobby logistics",
      "Flexible formats: clubs, term blocks, assemblies, demo days",
      "Session structure heads and teachers can review",
      "Pathway from classroom curiosity to competitive hopefuls",
      "One partner for kids training, clubs, and follow-on coaching",
    ],
    ctaTitle: "Partner with Hikaru",
  },
  {
    id: "coaching" as const,
    title: "Coaching",
    line: "Private pressure. Personal progress.",
    body: "A3 card for serious improvers — one-to-one and small-group coaching with a clear plan.",
    eyebrow: "1:1 · Small group · Progress",
    tagline:
      "Sharper calculation, honest feedback, and a plan built around your games.",
    frontMeta: "Private coaching",
    backEyebrow: "For players who want more",
    backTitle: "Training with intention",
    backLede:
      "Whether you are climbing from beginner basics or preparing for tougher opponents, Hikaru coaching is personal: your positions, your habits, your next rating leap.",
    pillars: [
      {
        label: "Format",
        title: "1:1 or small group",
        line: "Pressure that fits you.",
        body: "Private lessons for deep work, or tight groups when peer competition sharpens the session.",
        focus: true,
      },
      {
        label: "Method",
        title: "Your games first",
        line: "No generic syllabus dump.",
        body: "We review your recent play, patch recurring mistakes, and drill the skills that actually show up in your matches.",
      },
      {
        label: "Pace",
        title: "Real schedules",
        line: "Progress without burnout.",
        body: "Session frequency that respects school, work, and life — with homework that is short and purposeful.",
      },
    ] satisfies PrintCardPillar[],
    benefits: [
      "Personalized plans from your own games",
      "Tactics, endgames, and opening ideas that match your level",
      "Honest feedback with clear next steps",
      "Beginner-friendly through tournament hopeful",
      "Optional bridge from kids/school programs into private work",
    ],
    ctaTitle: "Book a coaching consult",
  },
  {
    id: "events" as const,
    title: "Events",
    line: "Full showcase for booths, fairs, and open days.",
    body: "A3 card for community events — everything Hikaru offers in one clear piece.",
    eyebrow: "Academy · Schools · Coaching",
    tagline: "We train minds. In schools. At the board.",
    frontMeta: "Meet us here",
    backEyebrow: "What we do",
    backTitle: "Three paths. One standard.",
    backLede:
      "At this event you can ask about kids training, school partnerships, or private coaching. Same Hikaru discipline — pick the door that fits you.",
    pillars: [
      {
        label: "01",
        title: "Kids",
        line: "First moves that stick.",
        body: "Age-ready sessions that build focus and confidence while keeping the game fun for young players.",
        focus: true,
      },
      {
        label: "02",
        title: "Schools",
        line: "Board on campus.",
        body: "Clubs, term programs, and demos structured for real timetables and classrooms.",
      },
      {
        label: "03",
        title: "Coaching",
        line: "Personal progress.",
        body: "One-to-one or small-group training for anyone hungry to improve — beginners to tournament hopefuls.",
      },
    ] satisfies PrintCardPillar[],
    benefits: [
      "Talk to a coach in person at this event",
      "Clear next steps for parents, schools, or players",
      "Community sessions, demos, and match-day energy",
      "Same quality whether you join a club or go private",
      "Scan the QR or leave your details — we follow up",
    ],
    ctaTitle: "Talk to us at this event",
  },
] as const;

export type PrintCardAudience = (typeof printCards)[number]["id"];

export function getPrintCard(audience: string) {
  return printCards.find((card) => card.id === audience) ?? printCards[0];
}

export const programs = [
  {
    id: "kids",
    title: "Kids",
    line: "First moves that stick for life.",
    body: "Age-ready chess training that builds focus, patience, and competitive confidence, without killing the fun.",
    image: photos.kidsSession.src,
    imageAlt: photos.kidsSession.alt,
  },
  {
    id: "schools",
    title: "Schools",
    line: "We bring the board to your campus.",
    body: "Structured school programs, club setups, and term-long training that fit real timetables and real classrooms.",
    image: photos.teachingBoard.src,
    imageAlt: photos.teachingBoard.alt,
  },
  {
    id: "coaching",
    title: "Coaching",
    line: "Private pressure. Personal progress.",
    body: "One-to-one or small-group coaching for anyone hungry to improve, from beginners to tournament hopefuls.",
    image: photos.focusedPlay.src,
    imageAlt: photos.focusedPlay.alt,
  },
] as const;

export const momentImage = photos.demoBoard;
export const aboutImage = photos.lakesideCoach;
export const heroImage = photos.heroBoard;

/** Gallery: remaining Hikaru Sirv shot + African / kids chess atmosphere */
export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    src: photos.outdoorSession.src,
    alt: photos.outdoorSession.alt,
    caption: "Session under open sky",
    category: "events",
    pin: "tall",
  },
  {
    id: "g2",
    src: photos.groupPlay.src,
    alt: photos.groupPlay.alt,
    caption: "Match day crowd",
    category: "events",
    pin: "medium",
  },
  {
    id: "g3",
    src: photos.boardCircle.src,
    alt: photos.boardCircle.alt,
    caption: "Community board circle",
    category: "kids",
    pin: "short",
  },
  {
    id: "g4",
    src: photos.sideTable.src,
    alt: photos.sideTable.alt,
    caption: "Quiet table, loud minds",
    category: "coaching",
    pin: "tall",
  },
  {
    id: "g5",
    src: unsplash("photo-1577896851231-70ef18881754"),
    alt: "Youth training session",
    caption: "Club night focus",
    category: "coaching",
    pin: "medium",
  },
  {
    id: "g6",
    src: unsplash("photo-1503676260728-1c00da094a0b"),
    alt: "Students learning together",
    caption: "School energy",
    category: "schools",
    pin: "short",
  },
  {
    id: "g7",
    src: unsplash("photo-1606092195730-5d7b9af1efc5"),
    alt: "Kids collaborating",
    caption: "Team puzzle battle",
    category: "kids",
    pin: "medium",
  },
  {
    id: "g8",
    src: unsplash("photo-1509062522246-3755977927d7"),
    alt: "School campus activity",
    caption: "Campus club day",
    category: "schools",
    pin: "tall",
  },
  {
    id: "g9",
    src: unsplash("photo-1586165368502-1bad197a6461"),
    alt: "Chess pieces on a board",
    caption: "Endgame precision",
    category: "events",
    pin: "short",
  },
  {
    id: "g10",
    src: unsplash("photo-1544716278-ca5e3f4abd8c"),
    alt: "Open book beside focused study",
    caption: "Study before the round",
    category: "schools",
    pin: "medium",
  },
];

export const articles: Article[] = [
  {
    slug: "tiny-hands-big-ideas",
    title: "Tiny hands, big ideas",
    excerpt:
      "What kids training looks like when the board becomes a playground and a classroom at the same time.",
    category: "Kids",
    date: "2026-03-12",
    readMinutes: 4,
    image: unsplash("photo-1427504494785-3a9ca7044f45"),
    body: [
      "The first time a child sits across a chessboard, something soft and serious happens at once. Their eyes light up at the pieces. Then they ask the best question in the world: “Can I move this one?”",
      "At Hikaru Chess Elites, kids training is built around that curiosity. We do not drop a child into a wall of openings on day one. We start with names, stories, and little missions. The knight hops. The rook runs straight. The king is brave but careful. Suddenly the rules feel like a game again.",
      "Sessions stay short enough to keep energy high, and clear enough that parents can see progress. One week a child learns to protect their queen. The next week they notice a fork before we even say the word. Those tiny wins matter. They build patience. They build pride.",
      "We mix puzzles, mini matches, and group laughs. Somebody will always celebrate a capture a little too loudly. Somebody else will quietly find a mate in one and grin like they invented fire. That mix is the point. Chess should feel warm in young hands.",
      "If your child is curious, restless, competitive, or simply loves games with rules, bring them over. We will meet them where they are, and grow with them one move at a time.",
    ],
  },
  {
    slug: "how-we-train-at-hikaru",
    title: "How we train at Hikaru",
    excerpt:
      "A simple look at our session rhythm, from warm-up puzzles to cool-headed practice games.",
    category: "Training",
    date: "2026-04-02",
    readMinutes: 5,
    image: unsplash("photo-1516321318423-f06f85e504b3"),
    body: [
      "People often ask what a Hikaru session actually feels like. Here is the honest answer: structured, friendly, and a little competitive in the best way.",
      "We open with a warm-up. That might be a quick tactic, a “find the best move” board, or a short review of last week’s sticky moment. It wakes the brain without pressure.",
      "Then we teach one clear idea. Not five. One. Maybe it is castling safely. Maybe it is looking at checks, captures, and threats before you move. We explain it, show it, and let students try it on their own boards.",
      "Practice comes next. Kids and learners play short games, solve puzzles in pairs, or walk through a position together. Coaches circulate, ask questions, and celebrate good thinking even when the move is not perfect.",
      "We close with reflection. What did you learn? What will you try next time? That habit turns a fun afternoon into lasting growth.",
      "For schools, we adapt the same rhythm to class size and timetable. For private coaching, we go deeper and personal. Same heart. Different pace. Always practical.",
    ],
  },
  {
    slug: "why-we-care-about-chess-in-kenya",
    title: "Why we care about chess in Kenya",
    excerpt:
      "Our motivation is simple. We love the game, and we want more Kenyan boards lit up with young minds.",
    category: "Motivation",
    date: "2026-05-18",
    readMinutes: 4,
    image: unsplash("photo-1434030216411-0b793f4b4173"),
    body: [
      "Hikaru Chess Elites started from a feeling many players know well. Chess grabs you. It teaches you to pause, plan, and try again after a loss. Once that fire is in you, you want to pass it on.",
      "Our passion is the game itself. The quiet tension before a move. The joy of a clean combination. The humility of blundering and coming back the next day sharper.",
      "But passion alone is not enough. We want chess to grow in Kenya in real places: classrooms, after-school clubs, living rooms, and weekend gatherings. More boards. More coaches. More kids who feel clever because they calculated something beautiful.",
      "Growing chess here means making it reachable. That is why we go into schools. That is why we train kids with patience. That is why we coach beginners with the same respect we give tournament players.",
      "Kenya has talent, energy, and communities ready for smart sports. Chess fits perfectly. It costs little to start, travels well, and builds minds that show up stronger in school and in life.",
      "So yes, we love chess. And yes, we are building Hikaru so that love has room to spread.",
    ],
  },
  {
    slug: "meet-hikaru-chess-elites",
    title: "Meet Hikaru Chess Elites",
    excerpt:
      "A friendly intro to who we are: trainers for kids, partners for schools, and coaches for anyone ready to improve.",
    category: "About Hikaru",
    date: "2026-02-20",
    readMinutes: 3,
    image: unsplash("photo-1518133910546-b6c2fb7d79e3"),
    body: [
      "Hikaru Chess Elites is a chess training family with a clear job. We help people learn the game properly, enjoy it deeply, and keep improving.",
      "We work with kids who are meeting the pieces for the first time. We partner with schools that want a club with structure, not chaos. We coach anyone who is interested, whether that means after-work lessons or weekend sharpening.",
      "What makes us “elites” is not attitude. It is standard. Clean teaching. Real practice. Honest feedback. A session should leave you clearer than you arrived.",
      "You will find us serious about progress and soft enough to keep the joy. Chess is a battle of ideas, not a place to scare beginners away.",
      "If that sounds like your kind of board, come train with us. We would love to meet you over the pieces.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string | null;
  pendingLabel?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "nkanda",
    name: "Nkanda Mwega",
    role: "Professional chess trainer · Nairobi",
    quote:
      "Hikaru Chess Elites trains kids the way the game deserves to be taught. Clear lessons, real practice, and coaches who actually stay with a child until the idea clicks. Nairobi needs more of this energy.",
  },
  {
    id: "zadock",
    name: "Zadock Nyakundi",
    role: "Professional chess player · Trainer",
    quote:
      "I have seen a lot of clubs start loud and fade fast. Hikaru is different. The sessions are structured, the kids stay hungry, and the standard keeps rising. That is how you grow strong players.",
  },
  {
    id: "owili",
    name: "Owili",
    role: "President · Chess Kenya",
    quote: null,
    pendingLabel: "Testimonial coming soon",
  },
];

export const presenceLines = [
  "Training this term in partner schools",
  "Open for new coaching slots",
  "Building junior clubs that last",
];
