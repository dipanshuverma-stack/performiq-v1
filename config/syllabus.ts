import { Subject, SectionType, ExamType } from "@prisma/client";

export interface SyllabusTopic {
  id: string;
  slug: string;
  name: string;
  displayOrder: number;
  section: SectionType;
  examTypes: ExamType[];
  tags: string[];
  weightage: "HIGH" | "MEDIUM" | "LOW";
  estimatedMinutes: number;
}

// All major banking exams targeting the same structural core definitions
const ALL_EXAMS: ExamType[] = [
  "IBPS_PO",
  "IBPS_CLERK",
  "SBI_PO",
  "SBI_CLERK",
  "RRB_PO",
  "RRB_CLERK",
  "RBI_ASSISTANT",
  "RBI_GRADE_B",
  "NABARD",
  "LIC_AAO"
];

export const BANKING_SYLLABUS: Record<Subject, SyllabusTopic[]> = {
  QUANTITATIVE_APTITUDE: [
    {
      id: "quant_simplification",
      slug: "simplification",
      name: "Simplification & Approximation",
      displayOrder: 1,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Calculation", "Speed Math", "Vedic Math"],
      weightage: "HIGH",
      estimatedMinutes: 240
    },
    {
      id: "quant_number_series",
      slug: "number-series",
      name: "Number Series (Missing & Wrong)",
      displayOrder: 2,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Patterns", "Logic", "Speed Math"],
      weightage: "HIGH",
      estimatedMinutes: 180
    },
    {
      id: "quant_quadratic",
      slug: "quadratic-equations",
      name: "Quadratic Equations",
      displayOrder: 3,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Algebra", "Inequalities", "Speed Math"],
      weightage: "HIGH",
      estimatedMinutes: 120
    },
    {
      id: "quant_percentage",
      slug: "percentage",
      name: "Percentage",
      displayOrder: 4,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Base Concepts", "Core Math"],
      weightage: "HIGH",
      estimatedMinutes: 180
    },
    {
      id: "quant_profit_loss",
      slug: "profit-loss",
      name: "Profit & Loss",
      displayOrder: 5,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Discount", "Marked Price"],
      weightage: "HIGH",
      estimatedMinutes: 240
    },
    {
      id: "quant_si_ci",
      slug: "simple-compound-interest",
      name: "Simple & Compound Interest",
      displayOrder: 6,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Interest Fractions", "Effective Rate"],
      weightage: "HIGH",
      estimatedMinutes: 240
    },
    {
      id: "quant_ratio",
      slug: "ratio-proportion",
      name: "Ratio & Proportion",
      displayOrder: 7,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Proportions", "Ages"],
      weightage: "MEDIUM",
      estimatedMinutes: 150
    },
    {
      id: "quant_average",
      slug: "average",
      name: "Average",
      displayOrder: 8,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Weighted Average", "Replacements"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    },
    {
      id: "quant_partnership",
      slug: "partnership",
      name: "Partnership",
      displayOrder: 9,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Profit Sharing", "Investments"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    },
    {
      id: "quant_mixture",
      slug: "mixture-alligation",
      name: "Mixture & Alligation",
      displayOrder: 10,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Replacements", "Weighted Average"],
      weightage: "MEDIUM",
      estimatedMinutes: 180
    },
    {
      id: "quant_time_work",
      slug: "time-work",
      name: "Time & Work",
      displayOrder: 11,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Efficiency", "Wages"],
      weightage: "HIGH",
      estimatedMinutes: 240
    },
    {
      id: "quant_pipes",
      slug: "pipes-cisterns",
      name: "Pipes & Cisterns",
      displayOrder: 12,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Efficiency", "Inlet-Outlet"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    },
    {
      id: "quant_tsd",
      slug: "time-speed-distance",
      name: "Time Speed Distance",
      displayOrder: 13,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Relative Speed", "Average Speed"],
      weightage: "HIGH",
      estimatedMinutes: 240
    },
    {
      id: "quant_boats",
      slug: "boats-streams",
      name: "Boats & Streams",
      displayOrder: 14,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arithmetic", "Upstream", "Downstream"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    },
    {
      id: "quant_di_pre",
      slug: "data-interpretation-pre",
      name: "Data Interpretation (Prelims)",
      displayOrder: 15,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Charts", "Table DI", "Bar Chart", "Line Graph", "Pie Chart"],
      weightage: "HIGH",
      estimatedMinutes: 480
    },
    {
      id: "quant_probability",
      slug: "probability",
      name: "Permutation, Combination & Probability",
      displayOrder: 16,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Modern Math", "Counting", "Arrangements"],
      weightage: "MEDIUM",
      estimatedMinutes: 200
    },
    {
      id: "quant_data_sufficiency",
      slug: "data-sufficiency",
      name: "Data Sufficiency",
      displayOrder: 17,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Logical Quant", "Statement Evaluation"],
      weightage: "HIGH",
      estimatedMinutes: 180
    },
    {
      id: "quant_di_mains",
      slug: "data-interpretation-mains",
      name: "Advanced & Caselet DI (Mains)",
      displayOrder: 18,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Caselets", "Missing DI", "Arithmetic DI", "Radar Chart"],
      weightage: "HIGH",
      estimatedMinutes: 600
    }
  ],

  REASONING_ABILITY: [
    {
      id: "reasoning_alphanumeric",
      slug: "alphanumeric-series",
      name: "Alpha-Numeric-Symbol Series",
      displayOrder: 1,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Logic", "Series", "Speed Reasoning"],
      weightage: "HIGH",
      estimatedMinutes: 120
    },
    {
      id: "reasoning_direction",
      slug: "direction-sense",
      name: "Direction Sense Test",
      displayOrder: 2,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Distance", "Coordinates", "Shadows"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    },
    {
      id: "reasoning_blood_relation",
      slug: "blood-relation",
      name: "Blood Relations",
      displayOrder: 3,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Family Tree", "Coded Blood Relation"],
      weightage: "HIGH",
      estimatedMinutes: 150
    },
    {
      id: "reasoning_syllogism",
      slug: "syllogism",
      name: "Syllogism (Only / Only a Few)",
      displayOrder: 4,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Venn Diagrams", "Deductions", "Logic"],
      weightage: "HIGH",
      estimatedMinutes: 180
    },
    {
      id: "reasoning_coding_decoding",
      slug: "coding-decoding",
      name: "Coding Decoding (Chinese & New Pattern)",
      displayOrder: 5,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Substitution", "Logic Matrices", "Patterns"],
      weightage: "HIGH",
      estimatedMinutes: 180
    },
    {
      id: "reasoning_inequality",
      slug: "inequality",
      name: "Inequalities (Direct & Coded)",
      displayOrder: 6,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Mathematical Logic", "Coded Expressions"],
      weightage: "HIGH",
      estimatedMinutes: 120
    },
    {
      id: "reasoning_order_ranking",
      slug: "order-ranking",
      name: "Order & Ranking",
      displayOrder: 7,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Comparisons", "Positions", "Linear Rank"],
      weightage: "LOW",
      estimatedMinutes: 90
    },
    {
      id: "reasoning_seating_circular",
      slug: "circular-seating",
      name: "Circular Seating Arrangement",
      displayOrder: 8,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arrangements", "Inward-Outward", "Variable Puzzles"],
      weightage: "HIGH",
      estimatedMinutes: 300
    },
    {
      id: "reasoning_seating_linear",
      slug: "linear-seating",
      name: "Linear Seating Arrangement",
      displayOrder: 9,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Arrangements", "North-South", "Uncertain Number", "Parallel Rows"],
      weightage: "HIGH",
      estimatedMinutes: 300
    },
    {
      id: "reasoning_puzzle_floor",
      slug: "floor-flat-puzzles",
      name: "Floor & Flat Puzzles",
      displayOrder: 10,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Puzzles", "Matrix Constraints", "Structural Logic"],
      weightage: "HIGH",
      estimatedMinutes: 360
    },
    {
      id: "reasoning_puzzle_box",
      slug: "box-puzzles",
      name: "Box & Stack Puzzles",
      displayOrder: 11,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Puzzles", "Stacking Logic", "Variables"],
      weightage: "HIGH",
      estimatedMinutes: 300
    },
    {
      id: "reasoning_puzzle_schedule",
      slug: "scheduling-puzzles",
      name: "Scheduling Puzzles (Days/Months/Years)",
      displayOrder: 12,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Puzzles", "Calendar Constraints", "Age Calculations"],
      weightage: "HIGH",
      estimatedMinutes: 300
    },
    {
      id: "reasoning_input_output",
      slug: "machine-input-output",
      name: "Machine Input Output",
      displayOrder: 13,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Shifting Pattern", "Mathematical Operations", "Advanced Analytics"],
      weightage: "HIGH",
      estimatedMinutes: 240
    },
    {
      id: "reasoning_critical",
      slug: "critical-reasoning",
      name: "Critical Reasoning",
      displayOrder: 14,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Statement-Assumption", "Course of Action", "Cause & Effect", "Inferences"],
      weightage: "HIGH",
      estimatedMinutes: 360
    },
    {
      id: "reasoning_data_sufficiency",
      slug: "logical-data-sufficiency",
      name: "Data Sufficiency (Reasoning)",
      displayOrder: 15,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Statement Integration", "Logical Completeness"],
      weightage: "HIGH",
      estimatedMinutes: 180
    }
  ],

  ENGLISH_LANGUAGE: [
    {
      id: "english_rc",
      slug: "reading-comprehension",
      name: "Reading Comprehension",
      displayOrder: 1,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Reading", "Inference", "Vocabulary", "Theme Detection"],
      weightage: "HIGH",
      estimatedMinutes: 480
    },
    {
      id: "english_cloze_test",
      slug: "cloze-test",
      name: "Cloze Test",
      displayOrder: 2,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Vocabulary", "Grammar", "Contextual Fit"],
      weightage: "HIGH",
      estimatedMinutes: 180
    },
    {
      id: "english_error_spotting",
      slug: "error-spotting",
      name: "Error Spotting",
      displayOrder: 3,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Grammar", "Syntax", "Tenses", "Subject-Verb Agreement"],
      weightage: "HIGH",
      estimatedMinutes: 300
    },
    {
      id: "english_sentence_improvement",
      slug: "sentence-improvement",
      name: "Sentence Improvement & Correction",
      displayOrder: 4,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Grammar", "Phrasal Verbs", "Modifiers"],
      weightage: "MEDIUM",
      estimatedMinutes: 180
    },
    {
      id: "english_para_jumbles",
      slug: "para-jumbles",
      name: "Para Jumbles (Traditional & Fixed)",
      displayOrder: 5,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Coherence", "Paragraph Reordering", "Connectors"],
      weightage: "HIGH",
      estimatedMinutes: 240
    },
    {
      id: "english_fillers",
      slug: "fillers",
      name: "Fillers (Single, Double & Multiple)",
      displayOrder: 6,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Vocabulary", "Grammar Matching"],
      weightage: "MEDIUM",
      estimatedMinutes: 150
    },
    {
      id: "english_word_swap",
      slug: "word-swap",
      name: "Word Swap & Usage",
      displayOrder: 7,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Contextual Meanings", "Vocabulary Integration"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    },
    {
      id: "english_vocabulary",
      slug: "vocabulary-synonyms-antonyms",
      name: "Synonyms, Antonyms & Homonyms",
      displayOrder: 8,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Lexicon", "Word Power"],
      weightage: "MEDIUM",
      estimatedMinutes: 360
    },
    {
      id: "english_idioms_phrases",
      slug: "idioms-phrases",
      name: "Idioms, Phrases & Word Roots",
      displayOrder: 9,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Expressions", "Phrasal Idioms"],
      weightage: "LOW",
      estimatedMinutes: 180
    },
    {
      id: "english_sentence_rearrangement",
      slug: "sentence-rearrangement",
      name: "Sentence Rearrangement",
      displayOrder: 10,
      section: "PRELIMS",
      examTypes: ALL_EXAMS,
      tags: ["Syntax", "Structural Alignment"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    }
  ],

  GENERAL_AWARENESS: [
    {
      id: "ga_banking_awareness",
      slug: "banking-financial-awareness",
      name: "Banking & Financial Awareness",
      displayOrder: 1,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Banking History", "Instruments", "Monetary Policy", "Inflation"],
      weightage: "HIGH",
      estimatedMinutes: 400
    },
    {
      id: "ga_rbi_functions",
      slug: "rbi-notifications-circulars",
      name: "RBI Notifications, Circulars & Regulations",
      displayOrder: 2,
      section: "MAINS",
      examTypes: ["RBI_GRADE_B", "RBI_ASSISTANT", "SBI_PO", "IBPS_PO"],
      tags: ["RBI Policy", "Compliance", "Banking Standards"],
      weightage: "HIGH",
      estimatedMinutes: 300
    },
    {
      id: "ga_current_affairs",
      slug: "national-international-current-affairs",
      name: "Current Affairs (Last 6 Months)",
      displayOrder: 3,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["News", "Summits", "MoUs", "National Indices"],
      weightage: "HIGH",
      estimatedMinutes: 900
    },
    {
      id: "ga_gov_schemes",
      slug: "government-schemes-initiatives",
      name: "Government Schemes & Social Programs",
      displayOrder: 4,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Central Schemes", "Welfare Programs", "Financial Inclusion"],
      weightage: "HIGH",
      estimatedMinutes: 480
    },
    {
      id: "ga_budget_economic_survey",
      slug: "union-budget-economic-survey",
      name: "Union Budget & Economic Survey",
      displayOrder: 5,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Fiscal Deficit", "Allocations", "Tax Slabs", "GDP Forecasts"],
      weightage: "HIGH",
      estimatedMinutes: 240
    },
    {
      id: "ga_economy",
      slug: "indian-global-economy",
      name: "Indian & Global Economy Indicators",
      displayOrder: 6,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["GDP", "FDI", "Capital Markets", "Exim Policy"],
      weightage: "MEDIUM",
      estimatedMinutes: 240
    },
    {
      id: "ga_static_gk",
      slug: "static-general-knowledge",
      name: "Static GK (Dams, National Parks, Thermal Hubs)",
      displayOrder: 7,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Geography", "Locations", "Static Data"],
      weightage: "MEDIUM",
      estimatedMinutes: 300
    },
    {
      id: "ga_awards_honors",
      slug: "awards-honors",
      name: "Awards, Honors & Summits",
      displayOrder: 8,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Achievements", "Global Trophies", "Summits"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    },
    {
      id: "ga_sports",
      slug: "sports-news-tournaments",
      name: "Sports News & Tournaments",
      displayOrder: 9,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Cricket", "Olympics", "Grand Prix", "Medals"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    },
    {
      id: "ga_books_authors",
      slug: "books-authors-appointments",
      name: "Books, Authors & Regulatory Appointments",
      displayOrder: 10,
      section: "MAINS",
      examTypes: ALL_EXAMS,
      tags: ["Literature", "Resignations", "CMD Appointments"],
      weightage: "LOW",
      estimatedMinutes: 120
    }
  ],

  COMPUTER_AWARENESS: [
    {
      id: "comp_fundamentals",
      slug: "computer-fundamentals-history",
      name: "Computer Fundamentals & Architecture Generations",
      displayOrder: 1,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["Basics", "CPU Structure", "History"],
      weightage: "HIGH",
      estimatedMinutes: 150
    },
    {
      id: "comp_hardware",
      slug: "hardware-input-output-devices",
      name: "Hardware, Input/Output Devices & Peripherals",
      displayOrder: 2,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["Peripherals", "Memory Chips", "RAM-ROM"],
      weightage: "HIGH",
      estimatedMinutes: 120
    },
    {
      id: "comp_software",
      slug: "software-languages",
      name: "Software Classifications, Compilers & Languages",
      displayOrder: 3,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["System Software", "Application Software", "Assemblers"],
      weightage: "MEDIUM",
      estimatedMinutes: 150
    },
    {
      id: "comp_os",
      slug: "operating-systems",
      name: "Operating Systems (Windows, Linux, Mobile OS)",
      displayOrder: 4,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["Kernel", "Processes", "Memory Allocation"],
      weightage: "HIGH",
      estimatedMinutes: 120
    },
    {
      id: "comp_ms_office",
      slug: "ms-word-powerpoint",
      name: "MS Office Automation Suite (Word & PowerPoint)",
      displayOrder: 5,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["Shortcuts", "Ribbon Properties", "Macros"],
      weightage: "MEDIUM",
      estimatedMinutes: 120
    },
    {
      id: "comp_excel",
      slug: "ms-excel-formulas",
      name: "MS Excel Spreadsheet Functions & Formulas",
      displayOrder: 6,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["Formulas", "Charts", "Cells Formatting"],
      weightage: "HIGH",
      estimatedMinutes: 180
    },
    {
      id: "comp_internet",
      slug: "internet-web-technologies",
      name: "Internet Protocols, Web Browsers & E-mail Matrix",
      displayOrder: 7,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["HTTP", "SMTP", "DNS", "Browsing Engine"],
      weightage: "HIGH",
      estimatedMinutes: 120
    },
    {
      id: "comp_networking",
      slug: "computer-networking-topologies",
      name: "Computer Networking & Topologies (LAN, WAN, OSI)",
      displayOrder: 8,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["OSI Model", "Star Topology", "Routers", "Hubs"],
      weightage: "HIGH",
      estimatedMinutes: 240
    },
    {
      id: "comp_cyber_security",
      slug: "cyber-security-malware",
      name: "Cyber Security, Threat Intelligence & Malware Types",
      displayOrder: 9,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["Trojans", "Phishing", "Firewalls", "Encryption"],
      weightage: "HIGH",
      estimatedMinutes: 180
    },
    {
      id: "comp_dbms",
      slug: "dbms-concepts-sql",
      name: "Database Management Systems & Core SQL Concepts",
      displayOrder: 10,
      section: "MAINS",
      examTypes: ["RRB_PO", "RRB_CLERK", "RBI_ASSISTANT"],
      tags: ["Keys", "Entities", "Normalization", "Queries"],
      weightage: "MEDIUM",
      estimatedMinutes: 150
    }
  ]
};

// ==========================================
// CENTRAL AGGREGATIONS & TYPED LOGIC MAPS
// ==========================================

/**
 * ✅ 100% Type-Safe Aggregation Map
 * Iterates directly over native Prisma enums to avoid implicit key stringification.
 * Eradicates the requirement for any temporary 'as Subject' type assertions.
 */
export const ALL_SYLLABUS_TOPICS = Object.values(Subject).flatMap((subject) =>
  BANKING_SYLLABUS[subject].map((topic) => ({
    ...topic,
    subject,
  }))
);

export const TOTAL_TOPIC_COUNT = ALL_SYLLABUS_TOPICS.length;

export const getTopicsBySubject = (subject: Subject): SyllabusTopic[] => BANKING_SYLLABUS[subject];

/**
 * ✅ Central UI Presentation Labels Dictionary
 * Maps strict backend Prisma keys smoothly to clean client display labels.
 * Always utilize this map inside .tsx files to safely display headers.
 */
export const SUBJECT_LABELS: Record<Subject, string> = {
  [Subject.QUANTITATIVE_APTITUDE]: "Quantitative Aptitude",
  [Subject.REASONING_ABILITY]: "Reasoning Ability",
  [Subject.ENGLISH_LANGUAGE]: "English Language",
  [Subject.GENERAL_AWARENESS]: "General Awareness",
  [Subject.COMPUTER_AWARENESS]: "Computer Awareness",
};

/**
 * ✅ Strict Syllabus Index Config Map
 * Maps direct core Subject enums directly to arrays of strings, enabling
 * lookups like syllabus[Subject.QUANTITATIVE_APTITUDE][0] safely across layouts.
 */
export const syllabus: Record<Subject, string[]> = {
  [Subject.QUANTITATIVE_APTITUDE]: BANKING_SYLLABUS.QUANTITATIVE_APTITUDE.map((t) => t.name),
  [Subject.REASONING_ABILITY]: BANKING_SYLLABUS.REASONING_ABILITY.map((t) => t.name),
  [Subject.ENGLISH_LANGUAGE]: BANKING_SYLLABUS.ENGLISH_LANGUAGE.map((t) => t.name),
  [Subject.GENERAL_AWARENESS]: BANKING_SYLLABUS.GENERAL_AWARENESS.map((t) => t.name),
  [Subject.COMPUTER_AWARENESS]: BANKING_SYLLABUS.COMPUTER_AWARENESS.map((t) => t.name),
};

export const SUBJECT_LIST: Subject[] = Object.values(Subject);