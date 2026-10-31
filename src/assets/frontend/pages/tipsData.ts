export type TipSection = {
  heading: string;
  body: string;
};

export type Tip = {
  id: string;
  category: string;
  title: string;
  description: string; // short teaser used on the cards
  sections: TipSection[]; // expanded content used on the detail page
  actionSteps: string[];  // practical "try this" bullets
};

const tipsData: Tip[] = [
  {
    id: 'pay-fixed-costs-first',
    category: 'SAVING',
    title: 'Pay your fixed costs first',
    description:
      'Rent, transport and data come off the top the day your allowance lands. What is left is what you can actually spend.',
    sections: [
      {
        heading: 'Why this works',
        body:
          'Fixed costs are non-negotiable — missing them causes far bigger problems (eviction, no data for online lectures, no way to campus) than simply running low on discretionary money. By moving them out of your "available" balance the moment money arrives, you remove the temptation to spend freely before covering necessities.',
      },
      {
        heading: 'The student reality in South Africa',
        body:
          'NSFAS disbursements, parental allowances and part-time pay often land on irregular dates. That unpredictability makes it easy to celebrate payday with a spend-up before the bills are settled. Treating fixed costs as an automatic "debit order" — even if you transfer them manually — protects you from that pattern.',
      },
      {
        heading: 'Setting up your own "pay-yourself-first" system',
        body:
          'On the day money arrives, open StudentSpend and log your rent, transport budget and data purchase as committed expenses. What the app shows as "remaining budget" after those entries is your real discretionary money. Anything you spend before that moment is borrowed from a necessity.',
      },
    ],
    actionSteps: [
      'List every fixed cost and its amount in the StudentSpend Budget Planner before the month starts.',
      'On payday, log rent, transport and data as expenses within the first hour.',
      'Only open the food and entertainment budget after those three are recorded.',
      'Set a phone reminder for the day your allowance normally lands.',
    ],
  },
  {
    id: 'cook-in-batches',
    category: 'FOOD',
    title: 'Cook in batches on Sunday',
    description:
      'Four portions of samp and beans costs less than two takeaway meals and saves you the weekday decision.',
    sections: [
      {
        heading: 'The economics of batch cooking',
        body:
          'A 1 kg pack of samp costs roughly R18–R22 at major South African retailers. Add a 500 g tin of mixed beans (R16), onions, salt and a cube of stock and you have four generous portions for around R12 each. A single Chicken Licken or Steers combo frequently costs R80–R120. The maths is stark.',
      },
      {
        heading: 'Decision fatigue and the lunchtime trap',
        body:
          'After back-to-back lectures, the path of least resistance is the campus cafeteria queue. Batch cooking removes that decision entirely — you have food, it is already made, and hunger does not get to overrule your budget. Studies on decision fatigue consistently show that people make worse financial choices when tired or hungry.',
      },
      {
        heading: 'What works well for batch cooking',
        body:
          'South African staples that batch-cook brilliantly: samp and beans, lentil soup, chakalaka, pap with tomato relish, red kidney bean stew, and rice with a hearty vegetable curry. All reheat well in a microwave or on a single-burner hot plate. Most also improve in flavour after a day or two.',
      },
    ],
    actionSteps: [
      'Pick one protein source per week from the reduced-to-clear section at your nearest Shoprite or Pick n Pay.',
      'Cook a pot of at least four portions every Sunday afternoon.',
      'Buy five small reusable containers (often under R60 for a set) to portion and label meals.',
      'Log the total grocery cost in StudentSpend under Groceries — then note the saving versus equivalent takeaways.',
    ],
  },
  {
    id: 'weekly-taxi-budget',
    category: 'TRANSPORT',
    title: 'Buy a weekly taxi total, not daily',
    description:
      'Work out the full week of fares in advance so a busy Friday does not eat into food money.',
    sections: [
      {
        heading: 'Why daily thinking is expensive',
        body:
          'When you think about taxi money "for today", you underestimate the week. A R15 trip becomes R30 round-trip, R150 for five days, and R600 for the month — before any detours, late lectures or weekend trips. Starting with the monthly number and working backwards gives you a fixed weekly envelope that you can plan around.',
      },
      {
        heading: 'Minibus taxi vs other options',
        body:
          'Minibus taxis remain the most affordable point-to-point option in most South African cities. Monthly MyCiTi or Rea Vaya Myconnect cards (Cape Town and Johannesburg) offer discounted rates for frequent users and help you cap transport spend at a predictable amount. Walking for trips under 2 km adds up to meaningful savings over a semester.',
      },
      {
        heading: 'The Friday problem',
        body:
          'Friday afternoons often mean extra trips — visiting friends, a social event, an off-campus errand. If you have already mentally "spent" your transport budget by Wednesday, Friday becomes a crisis. Buffer R20–R30 per week specifically for unplanned Friday or weekend trips so these do not raid your food allocation.',
      },
    ],
    actionSteps: [
      'Time your most common route once and calculate the exact weekly fare.',
      'Add a R20 buffer on top and set that as your weekly Transport allocation in StudentSpend.',
      'If a trip is spontaneous and unplanned, log it the same day before you forget.',
      'If you exceed transport budget in a week, note why — pattern recognition helps you adjust next month.',
    ],
  },
  {
    id: 'campus-wifi-downloads',
    category: 'DATA',
    title: 'Use campus wifi for big downloads',
    description:
      'Lecture recordings and readings are the biggest drain. Queue them on campus, not on your bundle.',
    sections: [
      {
        heading: 'What actually drains your data',
        body:
          'A one-hour 720p lecture recording can be 500 MB–1 GB. A full textbook PDF is typically 5–50 MB. A two-hour study session streaming YouTube explanations can consume 1–2 GB. At R149 for a 3 GB bundle (a typical prepaid rate), streaming three lectures off-campus costs you your entire bundle. Downloading once on wifi and watching offline costs nothing.',
      },
      {
        heading: 'Building the campus-download habit',
        body:
          'Most South African universities — UCT, Wits, UJ, UP, SU, CPUT and others — offer free or subsidised wifi for registered students. The habit to build is simple: before you leave campus each day, check what you need for the next 48 hours and download it. LMS platforms like Moodle, Sakai and Blackboard all have offline-capable apps or downloadable content.',
      },
      {
        heading: 'Apps and tools that help',
        body:
          'YouTube Premium allows offline downloads (use your student email — some universities have Google Workspace partnerships). VLC and most podcast apps support background downloading. WhatsApp\'s media auto-download should be set to "wifi only" in settings. The biggest single setting change you can make is switching off video auto-play on all social media apps.',
      },
    ],
    actionSteps: [
      'Download all lecture recordings and readings before leaving campus each day.',
      'Set WhatsApp, Instagram and TikTok to "wifi only" for media downloads right now.',
      'Buy data in larger bundles (1 GB bundles are almost always cheaper per MB than 100 MB bundles).',
      'Log your monthly data spend in StudentSpend to see exactly what it costs you per semester.',
    ],
  },
  {
    id: 'r300-buffer',
    category: 'SAVING',
    title: 'Keep a R300 buffer',
    description:
      'A small untouched amount covers a printing deadline or a broken charger without breaking the budget.',
    sections: [
      {
        heading: 'What a buffer actually does',
        body:
          'A buffer is not an emergency fund (that is a larger concept) — it is a small, always-present cushion that absorbs the ordinary unpredictable expenses of student life: a last-minute printing job, a phone charger that stops working the night before a submission, bus fare when your usual taxi is not running, or a forgotten textbook fee. Without it, every small shock becomes a crisis.',
      },
      {
        heading: 'Why R300 specifically',
        body:
          'R300 is enough to cover most common student micro-crises without being so large that it feels impossible to save. It covers roughly: 20 A4 pages of colour printing, a basic replacement charger cable, five days of taxi fares, or a week of lunches. It is not meant to cover a broken laptop or medical emergency — those require a separate strategy.',
      },
      {
        heading: 'How to actually protect it',
        body:
          'The buffer only works if you treat it as truly off-limits. Practical tricks: keep it in a separate account or at the back of a wallet in cash; do not link it to your main card; give it a mental "cost" — tell yourself accessing it means going through a 24-hour waiting period. These friction layers prevent impulse dipping.',
      },
    ],
    actionSteps: [
      'Set aside R300 from your next allowance before budgeting anything else.',
      'Keep it in a separate account or envelope — physically separate from spending money.',
      'When you use it, top it back up within the next two weeks as the highest budget priority.',
      'Log it as a "Saving" entry in StudentSpend so it shows in your category allocation.',
    ],
  },
  {
    id: 'prescribed-books',
    category: 'BOOKS',
    title: 'Ask before you buy prescribed books',
    description:
      'Second hand copies and short loan collections cover most modules for a fraction of the price.',
    sections: [
      {
        heading: 'The prescribed book myth',
        body:
          'Lecturers prescribe books because publishers require it for desk copies, or because they wrote the book themselves. In practice, many modules use only two or three chapters from a R600+ textbook — chapters that are often available as photocopies, PDFs, or short-loan library copies. Before you spend any money, go to the first lecture and ask exactly which chapters will be covered.',
      },
      {
        heading: 'Where to find cheaper copies in South Africa',
        body:
          'Short loan desks at university libraries hold two-hour and overnight copies of most prescribed texts. WhatsApp student groups and Facebook groups named after your institution (e.g. "UCT Textbook Exchange") have active second-hand markets with copies at 30–50% of retail price. Bid or Buy and Gumtree also list academic books. In many cases, a previous year\'s edition (one edition back) covers the same content.',
      },
      {
        heading: 'Legal digital alternatives',
        body:
          'South African academic libraries subscribe to platforms like EBSCOhost, ProQuest and JSTOR that include full e-book access to many prescribed titles — free with your student login. Google Scholar and OpenDOAR index openly available versions. For textbooks specifically, OpenStax offers free, peer-reviewed alternatives for common first and second-year subjects.',
      },
    ],
    actionSteps: [
      'Attend the first lecture before buying anything — ask which specific chapters are required.',
      'Check the library\'s short loan desk and your institution\'s e-book subscriptions first.',
      'Post in your faculty\'s WhatsApp or Facebook group asking for a second-hand copy.',
      'If you must buy new, split the cost with a classmate and share access for the semester.',
    ],
  },
];

export default tipsData;

