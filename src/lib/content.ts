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
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

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
