import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Compass,
  MapPin,
  AlertTriangle,
  Send,
  Plus,
  ThumbsUp,
  MessageSquare,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Camera,
  Upload,
  Volume2,
  VolumeX,
  Share2,
  Calendar,
  X,
  ChevronRight,
  Info,
  Droplets,
  Layers,
  Sparkles,
  TreePine,
  Waves,
  Mountain,
  Radio,
  ExternalLink,
  ShieldCheck,
  Check,
  SlidersHorizontal
} from 'lucide-react';

// Generated authentic high-resolution nature photography
import heroForestImg from './assets/images/foggy_forest_hero_1793789376629.jpg';
import hutanImg from './assets/images/hutan_canopy_1793789378355.jpg';
import lautImg from './assets/images/laut_kepulauan_1793789378159.jpg';
import gunungImg from './assets/images/gunung_mist_1793789380646.jpg';

// Types
export interface Report {
  id: string;
  title: string;
  category: 'got_mampet' | 'sampah_saluran' | 'genangan_air' | 'tutup_rusak' | 'limbah_bau';
  categoryLabel: string;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  photoUrl: string;
  reporterName: string;
  rtRw: string;
  reporterPhone?: string;
  severity: 'ringan' | 'sedang' | 'kritis';
  status: 'pending' | 'in_progress' | 'resolved';
  upvotes: number;
  userUpvoted?: boolean;
  createdAt: string;
  actionPlan?: string;
}

export interface NatureArticle {
  id: string;
  type: 'hutan' | 'laut' | 'gunung' | 'sunter';
  typeLabel: string;
  title: string;
  deck: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  leadParagraph: string;
  paragraphs: string[];
  keyTakeaway: string;
  locationTag: string;
}

export interface CommunityServer {
  id: string;
  name: string;
  badge: string;
  description: string;
  scope: string; // e.g. "Sunter Agung & Tanjung Priok", "Nasional / Indonesia"
  membersCount: number;
  channels: string[];
  topic: string;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  serverId: string;
  channel: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  tag: 'Opini' | 'Solusi Konkret' | 'Kerja Bakti' | 'Pertanyaan';
  likes: number;
  liked?: boolean;
}

export interface CommunityAction {
  id: string;
  title: string;
  location: string;
  date: string;
  target: string;
  joinedCount: number;
  maxParticipants: number;
  organizer: string;
  isUserJoined?: boolean;
}

// Initial Reports for Sunter & Jakarta
const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-01',
    title: 'Got Mampet Total di Saluran Belakang Ruko Danau Sunter Utara',
    category: 'got_mampet',
    categoryLabel: 'Got Mampet',
    description: 'Saluran air tertutup endapan lumpur hitam pekat dan sampah styrofoam sepanjang 15 meter. Saat hujan lebat 30 menit, air meluap setinggi mata kaki ke trotoar dan depan pertokoan.',
    locationName: 'Jl. Danau Sunter Utara Blok F No. 12-18, Sunter Agung',
    lat: -6.1368,
    lng: 106.8655,
    photoUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Bambang Sudibyo',
    rtRw: 'RT 008 / RW 014',
    reporterPhone: '0812-9844-XXXX',
    severity: 'kritis',
    status: 'pending',
    upvotes: 42,
    createdAt: 'Hari ini, 07:45 WIB',
    actionPlan: 'Menunggu jadwal armada truk sedot lumpur Suku Dinas SDA Jakarta Utara.'
  },
  {
    id: 'rep-02',
    title: 'Tumpukan Sampah Batang Pohon & Plastik di Bawah Jembatan Kali Sunter',
    category: 'sampah_saluran',
    categoryLabel: 'Sampah Menumpuk',
    description: 'Dahan kayu rapuh dan kantong sampah menyumbat pintu saringan air mikro menuju danau penampung. Dikhawatirkan menghambat aliran pompa air.',
    locationName: 'Dekat Pintu Air Danau Sunter Barat, Sunter Jaya',
    lat: -6.1422,
    lng: 106.8612,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Kartika Sari',
    rtRw: 'RW 002 Sunter Jaya',
    severity: 'sedang',
    status: 'in_progress',
    upvotes: 29,
    createdAt: 'Kemarin, 16:20 WIB',
    actionPlan: 'Sudah dikoordinasikan dengan petugas PPSU Kelurahan Sunter Jaya; proses evakuasi sampah berjalan.'
  },
  {
    id: 'rep-03',
    title: 'Tutup Saluran Drainase Amblas & Air Menggenang di Depan Sekolah',
    category: 'tutup_rusak',
    categoryLabel: 'Penutup Rusak & Rawan',
    description: 'Plat beton penutup got pecah terlindas kendaraan pengangkut barang, membahayakan anak sekolah dan pengendara motor saat malam hari.',
    locationName: 'Jl. Sunter Permai Raya, Tanjung Priok',
    lat: -6.1315,
    lng: 106.8698,
    photoUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Hendra Wijaya (Komite Sekolah)',
    rtRw: 'RT 004 / RW 006',
    severity: 'kritis',
    status: 'pending',
    upvotes: 56,
    createdAt: '2 November 2026',
    actionPlan: 'Perlu pengadaan plat beton precast baru dari Sudin Bina Marga.'
  },
  {
    id: 'rep-04',
    title: 'Normalisasi Got & Pengangkatan 3 Ton Sedimen di Jl. Danau Indah',
    category: 'got_mampet',
    categoryLabel: 'Pembersihan Tuntas',
    description: 'Gotong royong warga bersama 12 petugas oranye berhasil menguras sedimen lumpur sedalam 60cm. Aliran air kembali lancar menyambut musim hujan.',
    locationName: 'Jl. Danau Indah Barat IV, Sunter Jaya',
    lat: -6.1485,
    lng: 106.8682,
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Ibu Ratna Susanti',
    rtRw: 'RT 011 / RW 012',
    severity: 'sedang',
    status: 'resolved',
    upvotes: 84,
    createdAt: '28 Oktober 2026',
    actionPlan: 'Selesai diverifikasi oleh pengurus RW setempat. Aliran air 100% lancar.'
  },
  {
    id: 'rep-05',
    title: 'Genangan Air Setinggi 25 cm Akibat Penyumbatan Sambungan Gorong-gorong',
    category: 'genangan_air',
    categoryLabel: 'Genangan Air Hujan',
    description: 'Setiap hujan lebih dari 20 menit, air tertahan karena sambungan pipa got ke saluran utama mengecil akibat endapan semen bekas proyek renovasi.',
    locationName: 'Kompleks Sunter Hijau, Jl. Sunter Hijau Raya',
    lat: -6.1395,
    lng: 106.8741,
    photoUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Ferry Pratama',
    rtRw: 'RT 003 / RW 009',
    severity: 'sedang',
    status: 'in_progress',
    upvotes: 38,
    createdAt: '31 Oktober 2026',
    actionPlan: 'Penjadwalan pembongkaran sumbatan semen akhir pekan ini.'
  }
];

// Articles Data
const NATURE_ARTICLES: NatureArticle[] = [
  {
    id: 'art-01',
    type: 'hutan',
    typeLabel: 'Hutan Hujan Tropis',
    title: 'Nafas Rimba yang Menyejukkan Tanah Rendah Kita',
    deck: 'Menelusuri bagaimana tegakan pohon lebat di jantung Kalimantan dan hutan lindung Jawa menjadi benteng siklus hidrologi kepulauan.',
    author: 'Redaksi Rimba Lestari',
    date: 'Edisi November 2026',
    readTime: '6 menit baca',
    image: hutanImg,
    locationTag: 'Taman Nasional Gede Pangrango & Hutan Tropis',
    leadParagraph: 'Di bawah kanopi yang rapat, tetes embun pertama tidak langsung menghantam tanah berpasir. Mereka diserap perlahan oleh lumut purba, humus, dan jalinan akar raksasa yang bekerja laksana spons tanpa batas.',
    paragraphs: [
      'Ketika kita di kawasan perkotaan seperti Jakarta bergulat dengan saluran air yang meluap, kita sering lupa bahwa kemampuan tanah menyerap air bermula dari etika kita memperlakukan pohon dan vegetasi perakaran.',
      'Satu pohon trembesi dewasa mampu menahan ribuan liter air hujan di pori-pori tanah di sekitarnya. Saat kota mengganti ruang tanah dengan aspal dan semen tanpa celah resapan, beban itu sepenuhnya terlempar ke selokan sempit di depan rumah kita.',
      'Kembali mendengarkan hutan bukan berarti kita semua harus mengungsi ke pedalaman, melainkan membawa kembali kecerdasan vegetatif hutan ke halaman rumah kita: biopori, rumpun tanaman penyerap, dan saluran terbuka yang bernapas.'
    ],
    keyTakeaway: 'Hutan mengajarkan bahwa air tidak boleh diperlakukan sebagai musuh yang harus dibuang tergesa-gesa, melainkan tamu yang dialirkan dan diserap dengan lapang.'
  },
  {
    id: 'art-02',
    type: 'laut',
    typeLabel: 'Laut & Muara Pesisir',
    title: 'Muara Terakhir: Cerita Got Kota yang Menuju Teluk Jakarta',
    deck: 'Mengapa selembar plastik kresek yang tersangkut di parit Sunter berakhir menjadi ancaman bagi terumbu karang Kepulauan Seribu.',
    author: 'Pusat Dokumentasi Bahari',
    date: 'Edisi Oktober 2026',
    readTime: '5 menit baca',
    image: lautImg,
    locationTag: 'Kepulauan Seribu & Pesisir Utara Jakarta',
    leadParagraph: 'Air laut memiliki ingatan yang jernih. Semua partikel yang hanyut melalui saluran pembuangan permukiman Jakarta Utara pada akhirnya bermuara ke bibir ombak pesisir.',
    paragraphs: [
      'Kepulauan Seribu hanya berjarak beberapa mil laut dari daratan Sunter dan Tanjung Priok. Saat musim angin barat tiba, sisa-sisa buangan limbah rumah tangga dan mikroplastik yang gagal tertahan di got terbawa arus pasang ke gugusan pulau karang.',
      'Nelayan di Pulau Pari dan Pulau Harapan sering kali menemukan sampah kemasan bertanggal kadaluwarsa dari minimarket daratan di dalam jaring tangkap mereka. Pembersihan got di tingkat RT bukan semata-mata soal mencegah banjir di depan pagar, tapi wujud tanggung jawab hulu ke hilir.',
      'Pelaporan got mampet dan inisiatif jaring penyaring sampah di mulut got mikro adalah langkah pertahanan pertama agar laut Indonesia tetap bernapas jernih.'
    ],
    keyTakeaway: 'Laut adalah muara akhir dari cermin kesadaran kita di daratan. Menjaga parit di depan rumah adalah bentuk cinta laut yang paling nyata.'
  },
  {
    id: 'art-03',
    type: 'gunung',
    typeLabel: 'Gunung & Daerah Tangkapan',
    title: 'Hening di Atas Awan, Tanggung Jawab di Kaki Lembah',
    deck: 'Refleksi dari puncak-puncak vulkanik Nusantara tentang perjalanan air menuju pemukiman dan pentingnya merawat saluran air warga.',
    author: 'Catatan Jelajah Sunter',
    date: 'Edisi Oktober 2026',
    readTime: '7 menit baca',
    image: gunungImg,
    locationTag: 'Hulu Sungai Ciliwung & Gunung Salak',
    leadParagraph: 'Saat berdiri di bibir kawah berkabut di kala subuh, sunyi begitu mutlak. Gemercik mata air yang merembes di sela batuan andesit dingin adalah asal mula sungai yang menghidupi jutaan warga di hilir.',
    paragraphs: [
      'Aliran air dari lereng pegunungan menempuh perjalanan puluhan kilometer, melintasi persawahan, bendungan, hingga memasuki labirin kanal dan selokan beton di Sunter Agung dan Tanjung Priok.',
      'Betapa ironisnya saat air pegunungan yang jernih dan sarat kehidupan tersebut tercekik begitu menyentuh drainase lingkungan yang mampet oleh endapan sisa makanan, oli bengkel, dan botol plastik yang tak terurus.',
      'Melalui pemetaan bersama dan kesadaran lingkungan, kita mengembalikan kehormatan siklus air alami dari puncak gunung tertinggi hingga ke muara laut nusantara.'
    ],
    keyTakeaway: 'Rasa hormat pada gunung terwujud dalam cara kita merawat aliran air ketika ia tiba di depan rumah kita.'
  },
  {
    id: 'art-04',
    type: 'sunter',
    typeLabel: 'Ekologi Lokal Sunter',
    title: 'Menyelamatkan Danau Sunter & Drainase Penghubung',
    deck: 'Panduan teknis dan ekologis bagi warga RT/RW di Sunter untuk mengatasi sedimen got serta menjaga kualitas air danau kota.',
    author: 'Forum Warga Sunter Lestari',
    date: 'Edisi November 2026',
    readTime: '4 menit baca',
    image: heroForestImg,
    locationTag: 'Kawasan Danau Sunter Barat & Timur',
    leadParagraph: 'Danau Sunter bukan sekadar kolam retensi pengendali banjir bagi Jakarta Utara, tetapi ruang terbuka biru yang menyangga kehidupan burung bangau putih dan kesejukan iklim mikro.',
    paragraphs: [
      'Sistem drainase di Sunter dirancang secara grid, menyalurkan limpasan hujan ke saluran kolektor sebelum dipompa atau dialirkan ke Danau Sunter. Apabila got lingkungan mampet, kapasitas tampung danau menjadi sia-sia karena air terjebak di jalanan permukiman.',
      'Warga dapat melakukan tiga aksi utama: pertama, membuat lubang kontrol pada penutup saluran semen; kedua, memasang saringan kawat di pipa pembuangan rumah; ketiga, melaporkan secara aktif setiap endapan sebelum musim hujan memuncak.',
      'Aplikasi ini dibuat sebagai ruang temu warga untuk memotret fakta di lapangan, berdiskusi mencari jalan keluar, dan bergerak bersama dinas terkait.'
    ],
    keyTakeaway: 'Kolaborasi warga adalah kunci utama ketahanan lingkungan perkotaan yang berkelanjutan.'
  }
];

// Initial Community Servers
const INITIAL_SERVERS: CommunityServer[] = [
  {
    id: 'srv-sunter',
    name: 'Warga Sunter Bersatu',
    badge: 'Sunter & Tanjung Priok',
    description: 'Ruang koordinasi warga Sunter Agung, Sunter Jaya, dan sekitarnya untuk pelaporan got mampet, agenda kerja bakti, dan pemantauan pompa air.',
    scope: 'Kecamatan Tanjung Priok, Jakarta Utara',
    membersCount: 418,
    channels: ['umum-sunter', 'gotong-royong-saluran', 'pantauan-pompa-danau', 'solusi-biopori'],
    topic: 'Fokus pembersihan gorong-gorong dan pemantauan debit air Danau Sunter jelang puncak musim penghujan.'
  },
  {
    id: 'srv-jakarta',
    name: 'Jakarta Bebas Genangan',
    badge: 'DKI Jakarta',
    description: 'Forum diskusi antarkelurahan se-Jakarta mengenai normalisasi saluran air mikro, kolaborasi bersama PPSU, dan kebijakan tata kota berwawasan lingkungan.',
    scope: 'Seluruh Wilayah DKI Jakarta',
    membersCount: 1250,
    channels: ['diskusi-kebijakan', 'lapor-saluran-lintas-wilayah', 'edukasi-sampah-rt', 'kolaborasi-dinas-sda'],
    topic: 'Mendorong transparansi pemeliharaan saluran got tertutup di area ruko dan pemukiman padat.'
  },
  {
    id: 'srv-nusantara',
    name: 'Bumi Nusantara: Aksi Nyata',
    badge: 'Nasional / Seluruh Indonesia',
    description: 'Komunitas peduli ekologi Indonesia: pertukaran ide penanganan sampah hulu ke hilir, pelestarian hutan hujan, dan suara warga dari berbagai pulau.',
    scope: 'Lintas Provinsi Indonesia',
    membersCount: 3420,
    channels: ['opini-lingkungan', 'solusi-inovasi-warga', 'kabar-hutan-dan-laut', 'gerakan-pilah-sampah'],
    topic: 'Bagaimana warga lokal dapat mandiri mengelola sampah organik rumah tangga dan menghentikan kiriman sampah ke sungai.'
  }
];

// Initial Chat Messages
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    serverId: 'srv-sunter',
    channel: 'umum-sunter',
    senderName: 'Pak Dedi Sulaiman',
    senderRole: 'Ketua RW 08 Sunter Agung',
    content: 'Selamat pagi warga Sunter. Dari pantauan kami di jalan Danau Sunter Utara, ada 3 titik got mampet parah yang sudah dilaporkan di web ini. Hari Sabtu pagi kita rencanakan kerja bakti gabungan bersama PPSU.',
    timestamp: '08:15 WIB',
    tag: 'Kerja Bakti',
    likes: 18
  },
  {
    id: 'msg-02',
    serverId: 'srv-sunter',
    channel: 'umum-sunter',
    senderName: 'dr. Farah Anindita',
    senderRole: 'Warga Sunter Hijau',
    content: 'Sangat setuju Pak RW. Air got yang tergenang hitam ini sudah mulai memicu jentik nyamuk demam berdarah. Kalau bisa kita sediakan juga bubuk abate atau jaring kawat pencegah nyamuk saat got selesai dikeruk.',
    timestamp: '08:32 WIB',
    tag: 'Solusi Konkret',
    likes: 14
  },
  {
    id: 'msg-03',
    serverId: 'srv-sunter',
    channel: 'gotong-royong-saluran',
    senderName: 'Bima Wisesa',
    senderRole: 'Relawan Lingkungan Muda',
    content: 'Masalah utama di ruko-ruko itu pemilik toko menutup trotoar dengan cor semen utuh tanpa lubang kontrol pembersihan. Seharusnya ada regulasi tegas agar ada bak kontrol setiap 5 meter untuk memudahkan pembersihan sedimen.',
    timestamp: '09:05 WIB',
    tag: 'Opini',
    likes: 27
  },
  {
    id: 'msg-04',
    serverId: 'srv-sunter',
    channel: 'pantauan-pompa-danau',
    senderName: 'Kurniawan Pratama',
    senderRole: 'Warga Sunter Podomoro',
    content: 'Pagi ini debit Danau Sunter Barat masih di batas aman (-1.2 meter). Pompa station bekerja normal. Yang perlu diwaspadai hanya aliran air dari saluran perumahan yang tertahan sampah plastik.',
    timestamp: '09:40 WIB',
    tag: 'Solusi Konkret',
    likes: 9
  },
  {
    id: 'msg-05',
    serverId: 'srv-jakarta',
    channel: 'diskusi-kebijakan',
    senderName: 'Laksmi Nurhaliza',
    senderRole: 'Peneliti Ekologi Perkotaan',
    content: 'Pemerintah daerah perlu memperbanyak insentif bagi lingkungan RT yang sukses mengurangi volume sampah got lewat komposting dan lubang biopori. Pendekatan gotong royong warga berbasis peta seperti ini sangat efektif!',
    timestamp: '10:12 WIB',
    tag: 'Opini',
    likes: 31
  }
];

// Initial Community Actions
const INITIAL_ACTIONS: CommunityAction[] = [
  {
    id: 'act-01',
    title: 'Aksi Bersih Gotong Royong Saluran Utama Sunter Agung',
    location: 'Titik Kumpul: Depan Kantor Kelurahan Sunter Agung',
    date: 'Sabtu, 7 November 2026 • 06.30 WIB',
    target: 'Menguras sedimen got sepanjang 400m dan membersihkan 5 bak kontrol utama.',
    joinedCount: 38,
    maxParticipants: 50,
    organizer: 'Paguyuban Warga RW 08 & Relawan Hijau'
  },
  {
    id: 'act-02',
    title: 'Pembuatan 100 Lubang Resapan Biopori di Pemukiman Padat',
    location: 'Area Fasum RW 02 Sunter Jaya',
    date: 'Minggu, 8 November 2026 • 08.00 WIB',
    target: 'Mengurangi genangan air halaman dan mengolah sampah daun menjadi kompos.',
    joinedCount: 24,
    maxParticipants: 35,
    organizer: 'Gerakan Sunter Lestari Mandiri'
  }
];

export default function App() {
  // Navigation state
  // Categories: 'magazine' (informasi & esai alam), 'reports' (laporan got & peta), 'community' (server warga & forum)
  const [activeTab, setActiveTab] = useState<'magazine' | 'reports' | 'community'>('magazine');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Reports state (persisted in localStorage)
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem('bumi_bernapas_reports_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REPORTS;
  });

  // Filter & Search states for reports
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchLocation, setSearchLocation] = useState<string>('');

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<Report | null>(null);
  const [selectedArticleDetail, setSelectedArticleDetail] = useState<NatureArticle | null>(null);
  const [isCreateServerModalOpen, setIsCreateServerModalOpen] = useState(false);
  const [isCreateActionModalOpen, setIsCreateActionModalOpen] = useState(false);

  // Report Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Report['category']>('got_mampet');
  const [formDescription, setFormDescription] = useState('');
  const [formLocationName, setFormLocationName] = useState('Jl. Danau Sunter Utara, Sunter Agung, Jakarta Utara');
  const [formLat, setFormLat] = useState(-6.1384);
  const [formLng, setFormLng] = useState(106.8640);
  const [formReporterName, setFormReporterName] = useState('');
  const [formRtRw, setFormRtRw] = useState('');
  const [formReporterPhone, setFormReporterPhone] = useState('');
  const [formSeverity, setFormSeverity] = useState<Report['severity']>('kritis');
  const [formPhotoPreview, setFormPhotoPreview] = useState<string>('https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80');

  // Community state
  const [servers, setServers] = useState<CommunityServer[]>(() => {
    try {
      const saved = localStorage.getItem('bumi_bernapas_servers_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_SERVERS;
  });
  const [activeServerId, setActiveServerId] = useState<string>('srv-sunter');
  const [activeChannel, setActiveChannel] = useState<string>('umum-sunter');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bumi_bernapas_chats_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MESSAGES;
  });

  const [newMessageText, setNewMessageText] = useState('');
  const [newMessageTag, setNewMessageTag] = useState<ChatMessage['tag']>('Opini');
  const [newSenderName, setNewSenderName] = useState('Warga Peduli Sunter');

  // Create Server Form
  const [newServerName, setNewServerName] = useState('');
  const [newServerScope, setNewServerScope] = useState('Kecamatan Tanjung Priok / Sunter');
  const [newServerTopic, setNewServerTopic] = useState('');
  const [newServerDescription, setNewServerDescription] = useState('');

  // Community Actions state
  const [actions, setActions] = useState<CommunityAction[]>(() => {
    try {
      const saved = localStorage.getItem('bumi_bernapas_actions_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ACTIONS;
  });

  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionLocation, setNewActionLocation] = useState('');
  const [newActionDate, setNewActionDate] = useState('');
  const [newActionTarget, setNewActionTarget] = useState('');

  // Audio Ambient Generator (Synthesizer for calming forest rain & gentle breeze)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);

  // Map references
  const mainMapContainerRef = useRef<HTMLDivElement | null>(null);
  const mainMapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const modalMapContainerRef = useRef<HTMLDivElement | null>(null);
  const modalMapInstanceRef = useRef<L.Map | null>(null);
  const modalMarkerRef = useRef<L.Marker | null>(null);

  // Save to localStorage when reports change
  useEffect(() => {
    try {
      localStorage.setItem('bumi_bernapas_reports_v2', JSON.stringify(reports));
    } catch {
      // ignore
    }
  }, [reports]);

  // Save to localStorage when servers change
  useEffect(() => {
    try {
      localStorage.setItem('bumi_bernapas_servers_v2', JSON.stringify(servers));
    } catch {
      // ignore
    }
  }, [servers]);

  // Save to localStorage when messages change
  useEffect(() => {
    try {
      localStorage.setItem('bumi_bernapas_chats_v2', JSON.stringify(chatMessages));
    } catch {
      // ignore
    }
  }, [chatMessages]);

  // Save to localStorage when actions change
  useEffect(() => {
    try {
      localStorage.setItem('bumi_bernapas_actions_v2', JSON.stringify(actions));
    } catch {
      // ignore
    }
  }, [actions]);

  // Sound generator toggle
  const toggleNatureAudio = () => {
    if (isAudioPlaying) {
      if (audioGainRef.current && audioContextRef.current) {
        audioGainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.8);
        setTimeout(() => {
          audioContextRef.current?.suspend();
        }, 900);
      }
      setIsAudioPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Generate gentle soothing pink noise / soft forest rain
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 1.2);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start(0);
        audioGainRef.current = gainNode;
        setIsAudioPlaying(true);
      } catch (e) {
        console.warn('Audio context init note:', e);
        setIsAudioPlaying(false);
      }
    }
  };

  // Create Custom Leaflet SVG Pins
  const createMarkerIcon = (status: Report['status'], isSelected = false) => {
    let bgColor = '#1E382B'; // forest green
    let pulseRing = '';

    if (status === 'pending') {
      bgColor = '#C2410C'; // terra orange/amber for pending got mampet
      pulseRing = '<div style="position:absolute; inset:-4px; border-radius:50%; border:2px solid rgba(194, 65, 12, 0.5); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>';
    } else if (status === 'in_progress') {
      bgColor = '#2563EB'; // blue
    } else {
      bgColor = '#166534'; // rich emerald for resolved
    }

    const size = isSelected ? 34 : 28;

    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position:relative; width:${size}px; height:${size}px;">
          ${status === 'pending' ? pulseRing : ''}
          <div style="
            width:${size}px;
            height:${size}px;
            background-color: ${bgColor};
            border: 2.5px solid #FAF8F5;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 12px rgba(22, 48, 34, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: #FAF8F5;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size - 4]
    });
  };

  // Initialize and Update Main Leaflet Map
  useEffect(() => {
    // Only init if reports section is rendered and container is available
    if (!mainMapContainerRef.current) return;

    if (!mainMapInstanceRef.current) {
      // Center coordinates on Sunter, Jakarta Utara: [-6.1384, 106.8640]
      const map = L.map(mainMapContainerRef.current, {
        center: [-6.1384, 106.8640],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // CartoDB Voyager or OpenStreetMap clean tiles matching beige/forest green aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mainMapInstanceRef.current = map;
    }

    // Refresh markers on reports or filter changes
    if (markersLayerRef.current && mainMapInstanceRef.current) {
      markersLayerRef.current.clearLayers();

      const filtered = reports.filter((rep) => {
        const matchesStatus = filterStatus === 'all' || rep.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || rep.category === filterCategory;
        const matchesSearch =
          !searchLocation ||
          rep.title.toLowerCase().includes(searchLocation.toLowerCase()) ||
          rep.locationName.toLowerCase().includes(searchLocation.toLowerCase());
        return matchesStatus && matchesCategory && matchesSearch;
      });

      filtered.forEach((report) => {
        const marker = L.marker([report.lat, report.lng], {
          icon: createMarkerIcon(report.status)
        });

        const statusText =
          report.status === 'pending'
            ? 'Menunggu Tindakan'
            : report.status === 'in_progress'
            ? 'Sedang Ditangani PPSU'
            : 'Tuntas / Aliran Lancar';

        const statusColor =
          report.status === 'pending'
            ? '#C2410C'
            : report.status === 'in_progress'
            ? '#2563EB'
            : '#166534';

        const popupContent = document.createElement('div');
        popupContent.className = 'text-stone-800 text-xs';
        popupContent.innerHTML = `
          <div style="font-family:'Plus Jakarta Sans', sans-serif; width: 220px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
              <span style="font-weight:700; color:${statusColor}; text-transform:uppercase; font-size:10px; letter-spacing:0.05em;">
                ${statusText}
              </span>
              <span style="color:#78716C; font-size:10px;">${report.rtRw}</span>
            </div>
            <h4 style="font-weight:700; font-size:13px; line-height:1.3; margin:0 0 6px 0; color:#1C2920;">
              ${report.title}
            </h4>
            <p style="color:#57534E; font-size:11px; margin:0 0 8px 0; line-height:1.4;">
              ${report.locationName}
            </p>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #E7DFC9; padding-top:6px;">
              <span style="color:#1F432F; font-weight:600;">${report.upvotes} Dukungan Warga</span>
              <button id="view-report-${report.id}" style="
                background-color:#1E382B;
                color:#FAF8F5;
                border:none;
                padding:4px 8px;
                border-radius:4px;
                font-size:10px;
                font-weight:600;
                cursor:pointer;
              ">Lihat Detail</button>
            </div>
          </div>
        `;

        // Wire popup click event
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-report-${report.id}`);
          if (btn) {
            btn.onclick = () => {
              setSelectedReportDetail(report);
            };
          }
        });

        marker.addTo(markersLayerRef.current!);
      });
    }
  }, [reports, filterStatus, filterCategory, searchLocation, activeTab]);

  // Invalidate map size whenever user switches to the reports tab
  useEffect(() => {
    if (activeTab === 'reports' && mainMapInstanceRef.current) {
      setTimeout(() => {
        mainMapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [activeTab]);

  // Modal map for picking location
  useEffect(() => {
    if (!isReportModalOpen) {
      if (modalMapInstanceRef.current) {
        modalMapInstanceRef.current.remove();
        modalMapInstanceRef.current = null;
        modalMarkerRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!modalMapContainerRef.current) return;
      if (!modalMapInstanceRef.current) {
        const pickerMap = L.map(modalMapContainerRef.current, {
          center: [formLat, formLng],
          zoom: 15,
          zoomControl: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap'
        }).addTo(pickerMap);

        const pin = L.marker([formLat, formLng], {
          draggable: true,
          icon: createMarkerIcon('pending', true)
        }).addTo(pickerMap);

        pin.on('dragend', () => {
          const pos = pin.getLatLng();
          setFormLat(pos.lat);
          setFormLng(pos.lng);
        });

        pickerMap.on('click', (e: L.LeafletMouseEvent) => {
          pin.setLatLng(e.latlng);
          setFormLat(e.latlng.lat);
          setFormLng(e.latlng.lng);
        });

        modalMarkerRef.current = pin;
        modalMapInstanceRef.current = pickerMap;
      } else {
        modalMapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isReportModalOpen, formLat, formLng]);

  // Center main map to a specific report
  const handleFocusReportOnMap = (rep: Report) => {
    setActiveTab('reports');
    setTimeout(() => {
      if (mainMapInstanceRef.current) {
        mainMapInstanceRef.current.flyTo([rep.lat, rep.lng], 16, { duration: 1.2 });
        // find marker and open popup
        markersLayerRef.current?.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            const pos = layer.getLatLng();
            if (Math.abs(pos.lat - rep.lat) < 0.0001 && Math.abs(pos.lng - rep.lng) < 0.0001) {
              layer.openPopup();
            }
          }
        });
      }
      // Scroll smoothly to map section
      const mapElem = document.getElementById('map-section-anchor');
      if (mapElem) {
        mapElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 250);
  };

  // Upvote report handler
  const handleUpvote = (reportId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          const isUpvoted = !!rep.userUpvoted;
          return {
            ...rep,
            upvotes: isUpvoted ? rep.upvotes - 1 : rep.upvotes + 1,
            userUpvoted: !isUpvoted
          };
        }
        return rep;
      })
    );
  };

  // Mark report resolved or in-progress
  const handleToggleReportStatus = (reportId: string, nextStatus: Report['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: nextStatus } : r))
    );
    if (selectedReportDetail && selectedReportDetail.id === reportId) {
      setSelectedReportDetail((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  // Submit new report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      categoryLabel:
        formCategory === 'got_mampet'
          ? 'Got Mampet Total'
          : formCategory === 'sampah_saluran'
          ? 'Sampah Menumpuk di Saluran'
          : formCategory === 'genangan_air'
          ? 'Genangan Air Hujan'
          : formCategory === 'tutup_rusak'
          ? 'Penutup Saluran Rusak'
          : 'Limbah Bau & Berbahaya',
      description: formDescription.trim() || 'Laporan kondisi got tersumbat warga sekitar Sunter.',
      locationName: formLocationName.trim() || 'Sunter, Jakarta Utara',
      lat: formLat,
      lng: formLng,
      photoUrl: formPhotoPreview || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
      reporterName: formReporterName.trim() || 'Warga Anonim',
      rtRw: formRtRw.trim() || 'Sunter Jakarta',
      reporterPhone: formReporterPhone.trim() || undefined,
      severity: formSeverity,
      status: 'pending',
      upvotes: 1,
      userUpvoted: true,
      createdAt: 'Baru saja dilaporkan',
      actionPlan: 'Menunggu peninjauan petugas lingkungan kelurahan & pengurus RT/RW.'
    };

    setReports([newReport, ...reports]);
    setIsReportModalOpen(false);

    // Reset fields
    setFormTitle('');
    setFormDescription('');
    setFormReporterName('');
    setFormRtRw('');
    setFormReporterPhone('');

    // Switch to reports tab and focus
    setActiveTab('reports');
    setTimeout(() => {
      handleFocusReportOnMap(newReport);
    }, 400);
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Sunter locations for map picker
  const setQuickLocation = (name: string, lat: number, lng: number) => {
    setFormLocationName(name);
    setFormLat(lat);
    setFormLng(lng);
    if (modalMarkerRef.current && modalMapInstanceRef.current) {
      modalMarkerRef.current.setLatLng([lat, lng]);
      modalMapInstanceRef.current.flyTo([lat, lng], 16);
    }
  };

  // Community Chat Handlers
  const currentServer = servers.find((s) => s.id === activeServerId) || servers[0];
  const filteredMessages = chatMessages.filter(
    (msg) => msg.serverId === activeServerId && msg.channel === activeChannel
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      serverId: activeServerId,
      channel: activeChannel,
      senderName: newSenderName.trim() || 'Warga Sunter',
      senderRole: 'Warga Peduli Lingkungan',
      content: newMessageText.trim(),
      timestamp: 'Baru saja',
      tag: newMessageTag,
      likes: 1,
      liked: true
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMessageText('');
  };

  const handleLikeMessage = (msgId: string) => {
    setChatMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          const isLiked = !!m.liked;
          return {
            ...m,
            likes: isLiked ? m.likes - 1 : m.likes + 1,
            liked: !isLiked
          };
        }
        return m;
      })
    );
  };

  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim()) return;

    const newServer: CommunityServer = {
      id: `srv-${Date.now()}`,
      name: newServerName.trim(),
      badge: newServerScope.trim() || 'Komunitas Lokal',
      description: newServerDescription.trim() || 'Server diskusi warga peduli pemecahan masalah lingkungan.',
      scope: newServerScope.trim() || 'Indonesia',
      membersCount: 1,
      channels: ['diskusi-umum', 'solusi-warga', 'rencana-aksi'],
      topic: newServerTopic.trim() || 'Rembuk warga untuk lingkungan bersih dan asri.',
      isCustom: true
    };

    setServers([...servers, newServer]);
    setActiveServerId(newServer.id);
    setActiveChannel('diskusi-umum');
    setIsCreateServerModalOpen(false);
    setNewServerName('');
    setNewServerTopic('');
    setNewServerDescription('');
  };

  const handleJoinAction = (actionId: string) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === actionId) {
          const isJoined = !!act.isUserJoined;
          return {
            ...act,
            joinedCount: isJoined ? act.joinedCount - 1 : act.joinedCount + 1,
            isUserJoined: !isJoined
          };
        }
        return act;
      })
    );
  };

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;

    const act: CommunityAction = {
      id: `act-${Date.now()}`,
      title: newActionTitle.trim(),
      location: newActionLocation.trim() || 'Sunter, Jakarta Utara',
      date: newActionDate.trim() || 'Minggu depan • 07.00 WIB',
      target: newActionTarget.trim() || 'Aksi gotong royong warga mengatasi got mampet dan penanaman biopori.',
      joinedCount: 1,
      maxParticipants: 40,
      organizer: 'Warga Inisiator Sunter',
      isUserJoined: true
    };

    setActions([act, ...actions]);
    setIsCreateActionModalOpen(false);
    setNewActionTitle('');
    setNewActionLocation('');
    setNewActionDate('');
    setNewActionTarget('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#203126] flex flex-col md:flex-row antialiased">
      {/* ─────────────────────────────────────────────────────────────
          VERY LEFT SIDE: CATEGORY BUTTONS & SITE NAVIGATION
          Fixed on desktop, sleek drawer on mobile
      ───────────────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#1B3527] text-[#FAF8F5] md:min-h-screen flex-shrink-0 flex flex-col justify-between border-r border-[#2C4D3A] z-40">
        {/* Brand & Editorial Wordmark */}
        <div>
          <div className="p-6 border-b border-[#2C4D3A]/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8EBA9D] inline-block" />
                <span className="text-[11px] uppercase tracking-widest text-[#9DB8A7] font-medium">
                  Majalah & Aksi Warga
                </span>
              </div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-[#FAF8F5] mt-1">
                Bumi Bernapas
              </h1>
              <p className="text-xs text-[#9DB8A7] mt-0.5">
                Sunter, Jakarta & Nusantara
              </p>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#FAF8F5] hover:bg-[#264A36] rounded"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
            </button>
          </div>

          {/* Category Navigation Buttons */}
          <nav
            className={`${
              mobileMenuOpen ? 'block' : 'hidden'
            } md:block p-4 space-y-2`}
          >
            <div className="text-[10px] uppercase tracking-widest text-[#86A691] font-semibold px-3 py-1">
              Kategori Navigasi Utama
            </div>

            {/* Category 1: Informasi & Artikel Alam */}
            <button
              onClick={() => {
                setActiveTab('magazine');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full text-left px-3.5 py-3 rounded-lg text-sm transition-all flex items-start gap-3 ${
                activeTab === 'magazine'
                  ? 'bg-[#2E553F] text-[#FAF8F5] font-medium shadow-sm border-l-2 border-[#A3D2B3]'
                  : 'text-[#D0E0D6] hover:bg-[#244532] hover:text-[#FAF8F5]'
              }`}
            >
              <TreePine className="w-5 h-5 mt-0.5 text-[#97C5A8] flex-shrink-0" />
              <div>
                <div className="font-medium leading-tight">1. Informasi & Esai Alam</div>
                <div className="text-xs text-[#9BB9A5] mt-0.5">
                  Majalah alam, foto hutan, laut & gunung
                </div>
              </div>
            </button>

            {/* Category 2: Laporan Got Mampet Sunter & Jakarta */}
            <button
              onClick={() => {
                setActiveTab('reports');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-lg text-sm transition-all flex items-start gap-3 ${
                activeTab === 'reports'
                  ? 'bg-[#2E553F] text-[#FAF8F5] font-medium shadow-sm border-l-2 border-[#F97316]'
                  : 'text-[#D0E0D6] hover:bg-[#244532] hover:text-[#FAF8F5]'
              }`}
            >
              <MapPin className="w-5 h-5 mt-0.5 text-[#F97316] flex-shrink-0" />
              <div>
                <div className="font-medium leading-tight flex items-center justify-between">
                  <span>2. Laporan Got & Peta</span>
                  <span className="text-[10px] bg-[#C2410C] text-white px-1.5 py-0.2 rounded font-mono font-semibold">
                    {reports.length}
                  </span>
                </div>
                <div className="text-xs text-[#9BB9A5] mt-0.5">
                  Peta interaktif Sunter & lapor got mampet
                </div>
              </div>
            </button>

            {/* Category 3: Komunitas & Server Warga */}
            <button
              onClick={() => {
                setActiveTab('community');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-lg text-sm transition-all flex items-start gap-3 ${
                activeTab === 'community'
                  ? 'bg-[#2E553F] text-[#FAF8F5] font-medium shadow-sm border-l-2 border-[#60A5FA]'
                  : 'text-[#D0E0D6] hover:bg-[#244532] hover:text-[#FAF8F5]'
              }`}
            >
              <Users className="w-5 h-5 mt-0.5 text-[#93C5FD] flex-shrink-0" />
              <div>
                <div className="font-medium leading-tight flex items-center justify-between">
                  <span>3. Komunitas & Server Warga</span>
                  <span className="text-[10px] bg-[#1E40AF] text-[#DBEAFE] px-1.5 py-0.2 rounded font-mono font-medium">
                    {servers.length}
                  </span>
                </div>
                <div className="text-xs text-[#9BB9A5] mt-0.5">
                  Buat server chitchat & aksi gotong royong
                </div>
              </div>
            </button>

            {/* Quick Action Button in Sidebar */}
            <div className="pt-4 mt-4 border-t border-[#2C4D3A]/60">
              <button
                onClick={() => {
                  setIsReportModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#E57A36] hover:bg-[#D46B29] text-[#FAF8F5] text-xs font-semibold py-2.5 px-3 rounded-md flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Plus size={16} />
                <span>Lapor Got Mampet</span>
              </button>
            </div>

            {/* Curated Channels shortcut if on Community */}
            {activeTab === 'community' && (
              <div className="pt-3">
                <div className="text-[10px] uppercase tracking-wider text-[#7EA089] px-2 mb-1.5 font-medium">
                  Saluran Aktif ({currentServer.name})
                </div>
                <div className="space-y-1">
                  {currentServer.channels.map((chan) => (
                    <button
                      key={chan}
                      onClick={() => setActiveChannel(chan)}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                        activeChannel === chan
                          ? 'bg-[#234633] text-white font-medium'
                          : 'text-[#ABC3B3] hover:text-white'
                      }`}
                    >
                      <span className="text-[#84A992]">#</span>
                      <span className="truncate">{chan}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer with Ambient Audio & Civic Contact */}
        <div className="p-4 border-t border-[#2C4D3A]/60 space-y-3">
          {/* Nature Sound Generator */}
          <button
            onClick={toggleNatureAudio}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-all ${
              isAudioPlaying
                ? 'bg-[#264D36] text-[#A5E2B9]'
                : 'bg-[#152B20] text-[#93B19E] hover:text-[#FAF8F5]'
            }`}
            title="Dengarkan gemerisik hujan dan desau angin alam"
          >
            <div className="flex items-center gap-2">
              {isAudioPlaying ? (
                <Volume2 size={15} className="animate-pulse text-[#8CE3A6]" />
              ) : (
                <VolumeX size={15} />
              )}
              <span>{isAudioPlaying ? 'Suara Hutan Aktif' : 'Dengar Suara Hutan'}</span>
            </div>
            <span className="text-[10px] opacity-75 font-mono">
              {isAudioPlaying ? 'ON' : 'OFF'}
            </span>
          </button>

          <div className="text-[11px] text-[#8BA997] leading-relaxed">
            <span className="font-medium text-[#CFE2D6] block mb-0.5">
              Posko Lingkungan Sunter:
            </span>
            Kecamatan Tanjung Priok · Posko SDA Sunter Barat 24 Jam
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF8F5] overflow-y-auto">
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-[#E8E2D5] bg-[#FAF8F5]/90 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-4 text-xs text-[#5D7063]">
            <span>DKI Jakarta</span>
            <span aria-hidden="true">·</span>
            <span>Wilayah Sunter Agung & Sunter Jaya</span>
            <span aria-hidden="true">·</span>
            <span>Danau Sunter Barat & Timur</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1B3527] hover:bg-[#274E39] rounded-md transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={14} />
              <span>Lapor Got Mampet Sunter</span>
            </button>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────
            TAB 1: MAGAZINE & INFORMASI ALAM
        ───────────────────────────────────────────────────────── */}
        {activeTab === 'magazine' && (
          <div className="space-y-16 pb-20">
            {/* HERO SECTION: Foggy Forest Hero "Bumi Bernapas. Dengarkan." */}
            <section className="relative min-h-[520px] lg:min-h-[580px] flex items-end justify-start overflow-hidden bg-[#14261C]">
              {/* Foggy Forest Background Photo */}
              <img
                src={heroForestImg}
                alt="Hutan Tropis Berkabut Indonesia"
                className="absolute inset-0 w-full h-full object-cover opacity-85 object-center"
              />

              {/* Fog & Ambient Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#112419] via-[#112419]/60 to-[#112419]/20" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_40%,_rgba(17,36,25,0.7)_100%)]" />

              {/* Hero Content */}
              <div className="relative z-10 max-w-4xl px-6 lg:px-12 py-12 md:py-16 text-[#FAF8F5]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#8EBA9D]" />
                  <span className="text-xs uppercase tracking-widest text-[#B2D6C0] font-mono">
                    Majalah Ekologi & Keheningan Nusantara
                  </span>
                </div>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-[#FAF8F5] tracking-tight leading-[1.08] mb-4 text-balance">
                  Bumi Bernapas. <br />
                  <span className="italic font-normal text-[#D5EADF]">Dengarkan.</span>
                </h2>

                <p className="text-base md:text-lg text-[#DFECE4] font-light max-w-2xl leading-relaxed mb-8">
                  Jeda sejenak dari deru kendaraan dan beton ibu kota. Resapi kesejukan
                  lumut hutan hujan, debur tenang ombak muara, dan heningnya lereng gunung.
                  Dari keheningan alam ini, bangkitkan kepedulian menjaga aliran got dan
                  lingkungan tempat tinggal kita.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      const gallery = document.getElementById('nature-gallery');
                      gallery?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-[#FAF8F5] text-[#1B3527] hover:bg-[#EDE7DA] font-semibold text-xs tracking-wider uppercase rounded transition-all"
                  >
                    Jelajahi Foto Hutan, Laut & Gunung
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('reports');
                      setTimeout(() => {
                        const repSection = document.getElementById('laporan-warga-section');
                        repSection?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="px-5 py-2.5 bg-[#E57A36] hover:bg-[#D46B29] text-[#FAF8F5] font-semibold text-xs tracking-wider uppercase rounded transition-all flex items-center gap-2"
                  >
                    <span>Laporan Warga Sunter</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* SCROLLABLE NATURE PHOTOS SECTION: Hutan, Laut, Gunung */}
            <section id="nature-gallery" className="px-6 lg:px-12 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E5DFD3] pb-4 gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#698271] font-mono">
                    Trilogi Lanskap Nusantara
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1B3527] mt-1">
                    Hutan, Laut, dan Gunung
                  </h3>
                </div>
                <p className="text-xs text-[#63796A] max-w-md">
                  Geser kartu foto untuk merasakan karakter tiap elemen bentang alam Indonesia
                  dan hubungannya dengan ekosistem pemukiman kita.
                </p>
              </div>

              {/* Horizontal Scrollable Gallery Container */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. HUTAN */}
                <article
                  onClick={() => setSelectedArticleDetail(NATURE_ARTICLES[0])}
                  className="group bg-[#F4EFE6] rounded-xl overflow-hidden border border-[#E8E2D5] hover:border-[#1B3527]/30 transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#162C1E]">
                    <img
                      src={hutanImg}
                      alt="Hutan Hujan Indonesia"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#162E20]/80 backdrop-blur-sm text-[#E2F0E7] text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                      Rimba & Pakis
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-[#678070] uppercase tracking-wider mb-1">
                        01. Hutan Hujan Tropis
                      </div>
                      <h4 className="font-serif text-xl font-bold text-[#1B3527] group-hover:text-[#2D5A3F] transition-colors leading-snug">
                        Kanopi Lebat & Serapan Air Alami
                      </h4>
                      <p className="text-xs text-[#526457] mt-2 line-clamp-3 leading-relaxed">
                        Di balik kabut pagi Gunung Gede dan Kalimantan, perakaran pohon purba
                        menjadi spons raksasa yang menyerap ratusan ton air sebelum sampai ke kota.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E5DFD3] flex items-center justify-between text-xs text-[#1B3527] font-semibold">
                      <span>Baca Esai Hutan</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>

                {/* 2. LAUT */}
                <article
                  onClick={() => setSelectedArticleDetail(NATURE_ARTICLES[1])}
                  className="group bg-[#F4EFE6] rounded-xl overflow-hidden border border-[#E8E2D5] hover:border-[#1B3527]/30 transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#112429]">
                    <img
                      src={lautImg}
                      alt="Laut Kepulauan Indonesia"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#0E2830]/80 backdrop-blur-sm text-[#DEF2F7] text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                      Pesisir & Teluk
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-[#678070] uppercase tracking-wider mb-1">
                        02. Laut & Pesisir Utara
                      </div>
                      <h4 className="font-serif text-xl font-bold text-[#1B3527] group-hover:text-[#2D5A3F] transition-colors leading-snug">
                        Ombak Sunyi Teluk Jakarta
                      </h4>
                      <p className="text-xs text-[#526457] mt-2 line-clamp-3 leading-relaxed">
                        Ke mana perginya air dari got Sunter? Menelusuri jalur kanal yang bermuara
                        pada perairan Kepulauan Seribu dan pentingnya menyaring sampah di hulu parit.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E5DFD3] flex items-center justify-between text-xs text-[#1B3527] font-semibold">
                      <span>Baca Esai Laut</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>

                {/* 3. GUNUNG */}
                <article
                  onClick={() => setSelectedArticleDetail(NATURE_ARTICLES[2])}
                  className="group bg-[#F4EFE6] rounded-xl overflow-hidden border border-[#E8E2D5] hover:border-[#1B3527]/30 transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#241F1A]">
                    <img
                      src={gunungImg}
                      alt="Gunung dan Lautan Kabut"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#241C16]/80 backdrop-blur-sm text-[#F7EFE9] text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded">
                      Vulkanik & Awan
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-[#678070] uppercase tracking-wider mb-1">
                        03. Gunung & Daerah Tangkapan
                      </div>
                      <h4 className="font-serif text-xl font-bold text-[#1B3527] group-hover:text-[#2D5A3F] transition-colors leading-snug">
                        Puncak Kabut Mata Air Kehidupan
                      </h4>
                      <p className="text-xs text-[#526457] mt-2 line-clamp-3 leading-relaxed">
                        Dari kesunyian kawah Bromo dan Gede, air pegunungan menempuh ratusan kilometer.
                        Sebuah pengingat sakral untuk menghargai setiap tetes yang sampai ke selokan kita.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E5DFD3] flex items-center justify-between text-xs text-[#1B3527] font-semibold">
                      <span>Baca Esai Gunung</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </div>
            </section>

            {/* EDITORIAL ARTICLES & LOCAL NATURE ISSUES */}
            <section className="px-6 lg:px-12">
              <div className="bg-[#F2ECE0] rounded-2xl p-6 lg:p-10 border border-[#E3DBCB]">
                <div className="max-w-2xl mb-8">
                  <span className="text-xs uppercase tracking-widest text-[#698271] font-mono">
                    Jurnalisme Warga & Konservasi
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1B3527] mt-1">
                    Informasi & Artikel Masalah Alam Lokal Sunter & Jakarta
                  </h3>
                  <p className="text-xs text-[#55695C] mt-2 leading-relaxed">
                    Kumpulan telaah mendalam tentang ekologi urban, normalisasi got, dan peran
                    danau retensi dalam menyelamatkan hunian warga dari banjir genangan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {NATURE_ARTICLES.map((article, idx) => (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticleDetail(article)}
                      className="bg-[#FAF8F5] p-6 rounded-xl border border-[#E5DFD3] hover:border-[#1B3527]/30 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#718476] mb-2 font-mono">
                          <span className="uppercase">{article.typeLabel}</span>
                          <span>{article.readTime}</span>
                        </div>
                        <h4 className="font-serif text-xl font-bold text-[#1B3527] hover:text-[#2D5A3F] leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-xs text-[#4F6154] mt-2 leading-relaxed">
                          {article.deck}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-[#E8E2D5] flex items-center justify-between text-xs text-[#708476]">
                        <span>Oleh {article.author}</span>
                        <span className="font-semibold text-[#1B3527] flex items-center gap-1">
                          Baca Selengkapnya <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CALL TO ACTION BANNER LEADING TO USEFUL FEATURE */}
            <section className="px-6 lg:px-12">
              <div className="bg-[#1B3527] text-[#FAF8F5] rounded-2xl p-8 lg:p-12 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl relative z-10">
                  <div className="text-xs uppercase font-mono tracking-widest text-[#9CBDA7] mb-2">
                    Aksi Nyata Warga Sunter
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#FAF8F5] leading-tight mb-3">
                    Saat Got Mampet, Alam di Sekitar Kita Menderita.
                  </h3>
                  <p className="text-sm text-[#D1E2D7] font-light leading-relaxed">
                    Jangan biarkan air hitam tergenang di depan tempat tinggal Anda. Potret,
                    tentukan koordinat lokasi di Sunter, dan laporkan agar segera ditangani bersama
                    pengurus lingkungan dan petugas PPSU.
                  </p>
                </div>

                <div className="relative z-10 flex-shrink-0 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('reports');
                      setTimeout(() => {
                        const anchor = document.getElementById('laporan-warga-section');
                        anchor?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-[#E8E2D5] text-[#1B3527] text-xs uppercase font-bold tracking-wider rounded transition-all shadow-sm"
                  >
                    Buka Peta Laporan Warga
                  </button>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-6 py-3.5 bg-[#E57A36] hover:bg-[#D46B29] text-[#FAF8F5] text-xs uppercase font-bold tracking-wider rounded transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Lapor Got Mampet Sekarang</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────
            TAB 2: LAPORAN WARGA SUNTER & JAKARTA (USEFUL FEATURE)
        ───────────────────────────────────────────────────────── */}
        {activeTab === 'reports' && (
          <div id="laporan-warga-section" className="space-y-8 p-6 lg:p-10 pb-20">
            {/* Section Header with Big Action Button */}
            <div className="bg-[#F4EFE6] rounded-2xl p-6 lg:p-8 border border-[#E5DFD3] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E57A36]" />
                  <span className="text-xs uppercase tracking-widest text-[#856041] font-mono font-semibold">
                    Portal Interaktif Warga
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#1B3527] leading-tight">
                  LAPORAN WARGA SUNTER & JAKARTA
                </h2>
                <p className="text-xs md:text-sm text-[#54685A] mt-2 leading-relaxed">
                  Pusat pemantauan got tersumbat, saluran drainase dangkal, dan sampah mikro.
                  Setiap laporan tersimpan di penyimpanan lokal, tersemat di peta interaktif
                  Sunter, dan siap ditindaklanjuti secara gotong royong.
                </p>
              </div>

              {/* THE BIG BUTTON AS REQUESTED BY USER */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-4 bg-[#1B3527] hover:bg-[#284E39] text-[#FAF8F5] rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 border border-[#3A634C]"
                >
                  <AlertTriangle className="text-[#FBBF24]" size={20} />
                  <span>LAPOR GOT MAMPET DI SUNTER & JAKARTA</span>
                </button>
              </div>
            </div>

            {/* Filter and Stats Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D5]">
              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[#6F8274] font-medium mr-2">Status:</span>
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-[#1B3527] text-white shadow-sm'
                      : 'bg-[#EDE7DA] text-[#4F6153] hover:text-[#1B3527]'
                  }`}
                >
                  Semua ({reports.length})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filterStatus === 'pending'
                      ? 'bg-[#C2410C] text-white shadow-sm'
                      : 'bg-[#EDE7DA] text-[#4F6153] hover:text-[#1B3527]'
                  }`}
                >
                  Menunggu ({reports.filter((r) => r.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilterStatus('in_progress')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filterStatus === 'in_progress'
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'bg-[#EDE7DA] text-[#4F6153] hover:text-[#1B3527]'
                  }`}
                >
                  Dalam Penanganan ({reports.filter((r) => r.status === 'in_progress').length})
                </button>
                <button
                  onClick={() => setFilterStatus('resolved')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filterStatus === 'resolved'
                      ? 'bg-[#166534] text-white shadow-sm'
                      : 'bg-[#EDE7DA] text-[#4F6153] hover:text-[#1B3527]'
                  }`}
                >
                  Selesai ({reports.filter((r) => r.status === 'resolved').length})
                </button>
              </div>

              {/* Search by location */}
              <div className="relative min-w-[240px]">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A8E80]"
                />
                <input
                  type="text"
                  placeholder="Cari jalan / RW di Sunter..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#F4EFE6] border border-[#E0D7C6] rounded-md text-xs text-[#203126] focus:outline-none focus:border-[#1B3527]"
                />
              </div>
            </div>

            {/* LEAFLET MAP SECTION: Centered on Sunter, Jakarta */}
            <div id="map-section-anchor" className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#5C7062]">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#1B3527]" />
                  <span className="font-semibold text-[#1B3527]">
                    Peta Interaktif Saluran Got Sunter & Jakarta Utara
                  </span>
                  <span>(Klik pin untuk melihat rincian laporan)</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]" /> Menunggu
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Sedang Ditangani
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#166534]" /> Selesai / Lancar
                  </span>
                </div>
              </div>

              {/* Map DOM Container */}
              <div className="w-full h-[400px] lg:h-[480px] rounded-2xl overflow-hidden border border-[#E0D7C6] shadow-inner relative z-10">
                <div ref={mainMapContainerRef} className="w-full h-full" />
              </div>
            </div>

            {/* REPORT CARDS SECTION */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1B3527]">
                    Daftar Aduan Warga Terkini
                  </h3>
                  <p className="text-xs text-[#617466]">
                    Diurutkan berdasarkan laporan terbaru dan dukungan partisipasi warga sekitar.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#617466]">
                  {reports.length} Laporan Terdaftar
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports
                  .filter((rep) => {
                    const matchesStatus = filterStatus === 'all' || rep.status === filterStatus;
                    const matchesCategory = filterCategory === 'all' || rep.category === filterCategory;
                    const matchesSearch =
                      !searchLocation ||
                      rep.title.toLowerCase().includes(searchLocation.toLowerCase()) ||
                      rep.locationName.toLowerCase().includes(searchLocation.toLowerCase());
                    return matchesStatus && matchesCategory && matchesSearch;
                  })
                  .map((rep) => {
                    const isPending = rep.status === 'pending';
                    const isInProgress = rep.status === 'in_progress';
                    const isResolved = rep.status === 'resolved';

                    return (
                      <div
                        key={rep.id}
                        className="bg-[#F8F5EF] rounded-xl border border-[#E5DFD3] hover:border-[#1B3527]/40 transition-all shadow-sm flex flex-col justify-between overflow-hidden"
                      >
                        {/* Report Photo preview */}
                        <div className="relative aspect-video w-full bg-[#1C2920] overflow-hidden">
                          <img
                            src={rep.photoUrl}
                            alt={rep.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Status Badge */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase ${
                                isPending
                                  ? 'bg-[#C2410C] text-white'
                                  : isInProgress
                                  ? 'bg-[#2563EB] text-white'
                                  : 'bg-[#166534] text-white'
                              }`}
                            >
                              {isPending
                                ? 'Menunggu'
                                : isInProgress
                                ? 'Ditangani PPSU'
                                : 'Tuntas'}
                            </span>
                          </div>

                          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-[#FAF8F5] text-[10px] px-2 py-0.5 rounded font-mono">
                            {rep.createdAt}
                          </div>
                        </div>

                        {/* Report Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-[11px] text-[#697E70] mb-1 font-mono">
                              <span>{rep.categoryLabel}</span>
                              <span aria-hidden="true">·</span>
                              <span>{rep.rtRw}</span>
                            </div>

                            <h4 className="font-serif text-lg font-bold text-[#1B3527] leading-snug">
                              {rep.title}
                            </h4>

                            <p className="text-xs text-[#526457] mt-2 line-clamp-3 leading-relaxed">
                              {rep.description}
                            </p>

                            <div className="mt-3 flex items-start gap-1.5 text-xs text-[#6A7E71]">
                              <MapPin size={13} className="text-[#1B3527] mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{rep.locationName}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-5 pt-3 border-t border-[#E5DFD3] flex items-center justify-between gap-2">
                            {/* Upvote button */}
                            <button
                              onClick={(e) => handleUpvote(rep.id, e)}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                                rep.userUpvoted
                                  ? 'bg-[#1B3527] text-white'
                                  : 'bg-[#EDE7DA] text-[#334638] hover:bg-[#E2D9C8]'
                              }`}
                              title="Dukung agar segera diprioritaskan pihak kelurahan"
                            >
                              <ThumbsUp size={13} />
                              <span>{rep.upvotes}</span>
                            </button>

                            <div className="flex items-center gap-2">
                              {/* Focus on map */}
                              <button
                                onClick={() => handleFocusReportOnMap(rep)}
                                className="px-2.5 py-1.5 text-xs text-[#1B3527] hover:bg-[#E8E2D5] rounded font-medium transition-colors"
                              >
                                Peta
                              </button>

                              {/* Detail Modal */}
                              <button
                                onClick={() => setSelectedReportDetail(rep)}
                                className="px-3 py-1.5 bg-[#1B3527] text-white hover:bg-[#2A503A] text-xs font-semibold rounded transition-colors"
                              >
                                Rincian
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────
            TAB 3: KOMUNITAS & SERVER WARGA (FORUM & CHITCHAT)
        ───────────────────────────────────────────────────────── */}
        {activeTab === 'community' && (
          <div className="p-6 lg:p-10 space-y-8 pb-20">
            {/* Community Header */}
            <div className="bg-[#F4EFE6] rounded-2xl p-6 lg:p-8 border border-[#E5DFD3] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-xs uppercase tracking-widest text-[#2563EB] font-mono font-semibold">
                    Ruang Kolaborasi Warga
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#1B3527] leading-tight">
                  Komunitas Solusi & Server Diskusi Warga
                </h2>
                <p className="text-xs md:text-sm text-[#54685A] mt-2 leading-relaxed">
                  Got mampet dan persoalan alam lokal tidak bisa diselesaikan sendirian.
                  Bergabunglah dengan server warga atau buat server baru untuk bertukar opini,
                  menyusun kerja bakti akhir pekan, dan merumuskan solusi nyata untuk Sunter dan Indonesia.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsCreateServerModalOpen(true)}
                  className="px-5 py-3 bg-[#1B3527] hover:bg-[#274F39] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>Buat Server / Ruang Diskusi Baru</span>
                </button>
                <button
                  onClick={() => setIsCreateActionModalOpen(true)}
                  className="px-5 py-3 bg-[#E57A36] hover:bg-[#D46B29] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Calendar size={16} />
                  <span>Inisiasi Kerja Bakti</span>
                </button>
              </div>
            </div>

            {/* UPCOMING COMMUNITY ACTIONS (GOTONG ROYONG) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-bold text-[#1B3527]">
                  Agenda Kerja Bakti & Pemulihan Got Terdekat
                </h3>
                <span className="text-xs text-[#6A7E71] font-mono">
                  {actions.length} Aksi Terbuka
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map((act) => (
                  <div
                    key={act.id}
                    className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E5DFD3] hover:border-[#1B3527]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#708477] mb-1.5 font-mono">
                        <span className="text-[#C2410C] font-semibold flex items-center gap-1">
                          <Calendar size={13} /> {act.date}
                        </span>
                        <span>{act.organizer}</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#1B3527]">
                        {act.title}
                      </h4>
                      <p className="text-xs text-[#526457] mt-1.5 leading-relaxed">
                        {act.target}
                      </p>
                      <div className="mt-2 text-xs text-[#738579] flex items-center gap-1">
                        <MapPin size={13} className="text-[#1B3527]" />
                        <span>{act.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE3D5] flex items-center justify-between">
                      <div className="text-xs text-[#576B5E]">
                        <span className="font-bold text-[#1B3527]">{act.joinedCount}</span>{' '}
                        warga telah bergabung
                      </div>
                      <button
                        onClick={() => handleJoinAction(act.id)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors ${
                          act.isUserJoined
                            ? 'bg-[#166534] text-white'
                            : 'bg-[#1B3527] text-white hover:bg-[#284E39]'
                        }`}
                      >
                        {act.isUserJoined ? 'Sudah Terdaftar ✓' : 'Gabung Aksi'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SERVER & CHAT CHITCHAT INTERFACE */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DFD3] overflow-hidden flex flex-col lg:flex-row min-h-[580px] shadow-sm">
              {/* Server List (Left column of community hub) */}
              <div className="w-full lg:w-72 bg-[#F5EFE4] border-r border-[#E5DFD3] p-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[11px] uppercase font-mono tracking-wider text-[#697E70] font-semibold">
                      Daftar Server Diskusi
                    </span>
                    <button
                      onClick={() => setIsCreateServerModalOpen(true)}
                      className="text-xs text-[#1B3527] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Plus size={13} /> Baru
                    </button>
                  </div>

                  <div className="space-y-2">
                    {servers.map((srv) => (
                      <button
                        key={srv.id}
                        onClick={() => {
                          setActiveServerId(srv.id);
                          setActiveChannel(srv.channels[0] || 'umum');
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          activeServerId === srv.id
                            ? 'bg-[#FAF8F5] shadow-sm border border-[#E0D7C6]'
                            : 'hover:bg-[#EAE2D3] text-[#4F6355]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#1B3527] truncate">
                            {srv.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#7B8E80]">
                            {srv.membersCount} Warga
                          </span>
                        </div>
                        <p className="text-[11px] text-[#637769] line-clamp-2 leading-relaxed">
                          {srv.description}
                        </p>
                        <div className="mt-2 text-[10px] text-[#2563EB] font-mono font-medium">
                          {srv.scope}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5DFD3] text-[11px] text-[#718577] px-2">
                  Topik Aktif: <br />
                  <span className="text-[#1B3527] font-medium">{currentServer.topic}</span>
                </div>
              </div>

              {/* Chat Messages Panel */}
              <div className="flex-1 flex flex-col justify-between bg-[#FAF8F5]">
                {/* Channel Header Bar */}
                <div className="px-6 py-4 border-b border-[#E8E2D5] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-bold text-[#1B3527]">
                        {currentServer.name}
                      </span>
                      <span className="text-xs text-[#809486]">·</span>
                      <span className="text-xs font-mono text-[#2563EB]">
                        #{activeChannel}
                      </span>
                    </div>
                    <div className="text-xs text-[#637769] mt-0.5">
                      Ruang chitchat opini warga tentang masalah alam dan pemecahan saluran air.
                    </div>
                  </div>

                  {/* Channel Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                    {currentServer.channels.map((ch) => (
                      <button
                        key={ch}
                        onClick={() => setActiveChannel(ch)}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                          activeChannel === ch
                            ? 'bg-[#1B3527] text-white'
                            : 'bg-[#EDE7DA] text-[#55695B] hover:text-[#1B3527]'
                        }`}
                      >
                        #{ch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="p-6 space-y-4 overflow-y-auto max-h-[460px] flex-1">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-12 text-xs text-[#7B8E80]">
                      Belum ada obrolan di saluran #{activeChannel}. <br />
                      Mulai dengan membagikan opini atau usulan solusi Anda di bawah!
                    </div>
                  ) : (
                    filteredMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-[#F8F5EF] p-4 rounded-xl border border-[#EAE3D5] space-y-2 hover:border-[#1B3527]/20 transition-all"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#1B3527] text-white flex items-center justify-center font-bold text-[10px]">
                              {msg.senderName.charAt(0)}
                            </span>
                            <div>
                              <span className="font-bold text-[#1B3527]">
                                {msg.senderName}
                              </span>
                              <span className="text-[10px] text-[#718577] ml-2">
                                ({msg.senderRole})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                                msg.tag === 'Solusi Konkret'
                                  ? 'bg-[#DCFCE7] text-[#166534]'
                                  : msg.tag === 'Kerja Bakti'
                                  ? 'bg-[#FEF3C7] text-[#92400E]'
                                  : msg.tag === 'Opini'
                                  ? 'bg-[#DBEAFE] text-[#1E40AF]'
                                  : 'bg-[#F3E8FF] text-[#6B21A8]'
                              }`}
                            >
                              {msg.tag}
                            </span>
                            <span className="text-[10px] text-[#8C9E91] font-mono">
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[#3C4E42] leading-relaxed pl-8">
                          {msg.content}
                        </p>

                        <div className="pl-8 pt-1 flex items-center justify-between">
                          <button
                            onClick={() => handleLikeMessage(msg.id)}
                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                              msg.liked
                                ? 'text-[#166534] font-bold'
                                : 'text-[#6F8274] hover:text-[#1B3527]'
                            }`}
                          >
                            <ThumbsUp size={13} />
                            <span>{msg.likes} Dukungan</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-[#E8E2D5] bg-[#F7F3EB] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#647769]">Nama Pengirim:</span>
                      <input
                        type="text"
                        value={newSenderName}
                        onChange={(e) => setNewSenderName(e.target.value)}
                        placeholder="Nama Anda / Inisial..."
                        className="px-2 py-1 bg-white border border-[#DDD5C5] rounded text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[#647769]">Kategori Opini:</span>
                      {(['Opini', 'Solusi Konkret', 'Kerja Bakti', 'Pertanyaan'] as const).map(
                        (tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setNewMessageTag(tag)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                              newMessageTag === tag
                                ? 'bg-[#1B3527] text-white'
                                : 'bg-[#E5DFD3] text-[#526557] hover:bg-[#DDD5C5]'
                            }`}
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder={`Tulis opini Anda untuk #${activeChannel}...`}
                      className="flex-1 px-4 py-2.5 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                    />
                    <button
                      type="submit"
                      disabled={!newMessageText.trim()}
                      className="px-4 py-2.5 bg-[#1B3527] hover:bg-[#284E39] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Send size={14} />
                      <span>Kirim</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            MODAL 1: FORM LAPOR GOT MAMPET (WITH MAP PICKER & PHOTO UPLOAD)
        ───────────────────────────────────────────────────────────── */}
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl border border-[#E5DFD3] shadow-2xl overflow-hidden my-6">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-[#1B3527] text-[#FAF8F5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#9CBDA7]">
                    Layanan Aspirasi & Aduan Warga
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#FAF8F5]">
                    Lapor Got Mampet di Sunter & Jakarta
                  </h3>
                </div>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-1.5 text-[#9CBDA7] hover:text-white rounded"
                  aria-label="Tutup Modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form Content */}
              <form onSubmit={handleSubmitReport} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* 1. Title & Category */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                      Judul Laporan Singkat <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Got Mampet Total Depan Ruko Blok G Sunter Agung"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                        Jenis Masalah Saluran
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as Report['category'])}
                        className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                      >
                        <option value="got_mampet">Got Mampet / Dangkal Total</option>
                        <option value="sampah_saluran">Sampah Plastik & Kayu Menumpuk</option>
                        <option value="genangan_air">Genangan Air Hujan / Meluap</option>
                        <option value="tutup_rusak">Penutup Saluran Rusak / Amblas</option>
                        <option value="limbah_bau">Bau Menyengat / Limbah Berbahaya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                        Tingkat Kedesakan
                      </label>
                      <select
                        value={formSeverity}
                        onChange={(e) => setFormSeverity(e.target.value as Report['severity'])}
                        className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                      >
                        <option value="kritis">Kritis (Air meluap masuk rumah / jalan raya)</option>
                        <option value="sedang">Sedang (Aliran terhenti, lumpur pekat)</option>
                        <option value="ringan">Ringan (Perlu normalisasi preventif)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Photo Upload / Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider">
                    Foto Bukti Lapangan
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-[#1C2920] border border-[#DDD5C5]">
                      <img
                        src={formPhotoPreview}
                        alt="Preview Foto Bukti"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#EAE3D5] text-[#1B3527] border border-[#DDD5C5] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors">
                          <Upload size={14} />
                          <span>Pilih Foto dari HP/Kamera</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-[11px] text-[#697E70]">
                        Bisa juga menggunakan foto sampel:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setFormPhotoPreview(
                              'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80'
                            )
                          }
                          className="text-[10px] bg-[#EAE2D3] hover:bg-[#DFD5C4] px-2 py-0.5 rounded text-[#374B3D]"
                        >
                          Got Hitam Danau Sunter
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormPhotoPreview(
                              'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
                            )
                          }
                          className="text-[10px] bg-[#EAE2D3] hover:bg-[#DFD5C4] px-2 py-0.5 rounded text-[#374B3D]"
                        >
                          Tumpukan Sampah Saluran
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormPhotoPreview(
                              'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
                            )
                          }
                          className="text-[10px] bg-[#EAE2D3] hover:bg-[#DFD5C4] px-2 py-0.5 rounded text-[#374B3D]"
                        >
                          Penutup Got Pecah
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Location Picker on Map centered on Sunter Jakarta */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider">
                      Pilih Titik Lokasi di Peta Sunter (Klik / Geser Pin)
                    </label>
                    <span className="text-[11px] font-mono text-[#6A7E71]">
                      Lat: {formLat.toFixed(4)}, Lng: {formLng.toFixed(4)}
                    </span>
                  </div>

                  {/* Preset Buttons for Sunter */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-1">
                    <span className="text-[11px] text-[#697E70]">Titik Cepat:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickLocation(
                          'Jl. Danau Sunter Utara Blok F, Sunter Agung',
                          -6.1368,
                          106.8655
                        )
                      }
                      className="text-[10px] bg-[#EAE2D3] hover:bg-[#DFD5C4] px-2 py-0.5 rounded text-[#374B3D]"
                    >
                      Sunter Utara
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickLocation(
                          'Danau Sunter Barat & Pintu Air Mikro',
                          -6.1422,
                          106.8612
                        )
                      }
                      className="text-[10px] bg-[#EAE2D3] hover:bg-[#DFD5C4] px-2 py-0.5 rounded text-[#374B3D]"
                    >
                      Danau Sunter Barat
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickLocation(
                          'Kompleks Sunter Indah & Sunter Jaya',
                          -6.1485,
                          106.8682
                        )
                      }
                      className="text-[10px] bg-[#EAE2D3] hover:bg-[#DFD5C4] px-2 py-0.5 rounded text-[#374B3D]"
                    >
                      Sunter Jaya RW 02
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickLocation(
                          'Sunter Permai Raya, Tanjung Priok',
                          -6.1315,
                          106.8698
                        )
                      }
                      className="text-[10px] bg-[#EAE2D3] hover:bg-[#DFD5C4] px-2 py-0.5 rounded text-[#374B3D]"
                    >
                      Sunter Permai
                    </button>
                  </div>

                  {/* Picker Map Container */}
                  <div className="w-full h-56 rounded-lg overflow-hidden border border-[#DDD5C5] relative">
                    <div ref={modalMapContainerRef} className="w-full h-full" />
                  </div>

                  {/* Street address input */}
                  <div>
                    <label className="block text-[11px] text-[#697E70] mb-1">
                      Nama Jalan / Patokan Lokasi:
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocationName}
                      onChange={(e) => setFormLocationName(e.target.value)}
                      placeholder="Contoh: Jl. Danau Sunter Utara No. 45, depan Apotek"
                      className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                    />
                  </div>
                </div>

                {/* 4. Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                    Keterangan Kondisi & Dampak
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan kondisi sumbatan: tinggi genangan saat hujan, warna air, bau, atau ada kabel/cor semen yang menghambat..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                  />
                </div>

                {/* 5. Reporter Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                      Nama Pelapor
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={formReporterName}
                      onChange={(e) => setFormReporterName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                      RT / RW
                    </label>
                    <input
                      type="text"
                      placeholder="RT 005 / RW 014"
                      value={formRtRw}
                      onChange={(e) => setFormRtRw(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                      Nomor HP/WA (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="0812-XXXX-XXXX"
                      value={formReporterPhone}
                      onChange={(e) => setFormReporterPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                    />
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-[#E5DFD3] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2.5 text-xs text-[#526457] hover:text-[#1B3527] font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1B3527] hover:bg-[#284E39] text-[#FAF8F5] text-xs uppercase font-bold tracking-wider rounded-lg shadow-sm transition-all"
                  >
                    Kirim & Simpan Laporan Warga
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            MODAL 2: DETAIL LAPORAN WARGA
        ───────────────────────────────────────────────────────────── */}
        {selectedReportDetail && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-2xl border border-[#E5DFD3] shadow-2xl overflow-hidden my-6">
              <div className="relative aspect-video w-full bg-[#1C2920]">
                <img
                  src={selectedReportDetail.photoUrl}
                  alt={selectedReportDetail.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedReportDetail(null)}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 text-white hover:bg-black rounded-full"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-3 left-3 bg-[#1B3527]/80 backdrop-blur-sm text-[#FAF8F5] text-xs px-2.5 py-1 rounded">
                  {selectedReportDetail.categoryLabel}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#6A7E71]">
                  <span>Dilaporkan oleh {selectedReportDetail.reporterName} ({selectedReportDetail.rtRw})</span>
                  <span>{selectedReportDetail.createdAt}</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#1B3527] leading-snug">
                  {selectedReportDetail.title}
                </h3>

                <p className="text-xs text-[#485B4E] leading-relaxed">
                  {selectedReportDetail.description}
                </p>

                <div className="bg-[#F3ECE0] p-3.5 rounded-lg border border-[#E2D8C5] text-xs space-y-1">
                  <div className="font-semibold text-[#1B3527] flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#1B3527]" />
                    <span>Titik Lokasi:</span>
                  </div>
                  <div className="text-[#516457] pl-5">
                    {selectedReportDetail.locationName}
                  </div>
                  <div className="text-[11px] font-mono text-[#75887B] pl-5">
                    Koordinat: {selectedReportDetail.lat.toFixed(5)}, {selectedReportDetail.lng.toFixed(5)}
                  </div>
                </div>

                {selectedReportDetail.actionPlan && (
                  <div className="bg-[#EBF3EE] p-3.5 rounded-lg border border-[#CFDFD4] text-xs text-[#20402C]">
                    <span className="font-bold block mb-0.5">Status Penanganan:</span>
                    {selectedReportDetail.actionPlan}
                  </div>
                )}

                {/* Status Toggle & Upvote Controls */}
                <div className="pt-4 border-t border-[#E5DFD3] flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => handleUpvote(selectedReportDetail.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold ${
                      selectedReportDetail.userUpvoted
                        ? 'bg-[#1B3527] text-white'
                        : 'bg-[#EDE7DA] text-[#1B3527]'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    <span>{selectedReportDetail.upvotes} Dukungan Warga</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleReportStatus(selectedReportDetail.id, 'in_progress')}
                      className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded"
                    >
                      Tandai Proses PPSU
                    </button>
                    <button
                      onClick={() => handleToggleReportStatus(selectedReportDetail.id, 'resolved')}
                      className="px-3 py-1.5 bg-[#166534] hover:bg-[#14532D] text-white text-xs font-medium rounded"
                    >
                      Tandai Selesai / Lancar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            MODAL 3: BACA ARTIKEL LENGKAP MAJALAH
        ───────────────────────────────────────────────────────────── */}
        {selectedArticleDetail && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-2xl border border-[#E5DFD3] shadow-2xl overflow-hidden my-6">
              <div className="relative aspect-[16/9] w-full bg-[#182B1F]">
                <img
                  src={selectedArticleDetail.image}
                  alt={selectedArticleDetail.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedArticleDetail(null)}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 text-white hover:bg-black rounded-full"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-sm text-[#FAF8F5] text-[11px] px-2.5 py-1 rounded font-mono">
                  {selectedArticleDetail.locationTag}
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="text-xs text-[#708376] font-mono flex items-center gap-2">
                  <span>{selectedArticleDetail.typeLabel}</span>
                  <span>·</span>
                  <span>{selectedArticleDetail.readTime}</span>
                  <span>·</span>
                  <span>{selectedArticleDetail.date}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1B3527] leading-tight">
                  {selectedArticleDetail.title}
                </h3>

                <p className="text-sm italic text-[#55695C] border-b border-[#E5DFD3] pb-3">
                  {selectedArticleDetail.deck}
                </p>

                <p className="text-xs md:text-sm text-[#384A3E] leading-relaxed font-medium">
                  {selectedArticleDetail.leadParagraph}
                </p>

                {selectedArticleDetail.paragraphs.map((par, i) => (
                  <p key={i} className="text-xs md:text-sm text-[#4A5D50] leading-relaxed">
                    {par}
                  </p>
                ))}

                <div className="bg-[#F1E9DB] p-4 rounded-xl border border-[#DFD3BE] text-xs text-[#2F4435]">
                  <span className="font-bold block mb-1 font-serif text-sm">
                    Pesan Konservasi:
                  </span>
                  {selectedArticleDetail.keyTakeaway}
                </div>

                <div className="pt-4 border-t border-[#E5DFD3] flex items-center justify-between text-xs text-[#708477]">
                  <span>Ditulis oleh: {selectedArticleDetail.author}</span>
                  <button
                    onClick={() => setSelectedArticleDetail(null)}
                    className="px-4 py-2 bg-[#1B3527] text-white rounded text-xs font-semibold"
                  >
                    Tutup Bacaan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            MODAL 4: BUAT SERVER / RUANG DISKUSI BARU
        ───────────────────────────────────────────────────────────── */}
        {isCreateServerModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl border border-[#E5DFD3] shadow-2xl overflow-hidden">
              <div className="px-6 py-4 bg-[#1B3527] text-white flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">
                  Buat Server Komunitas Warga Baru
                </h3>
                <button
                  onClick={() => setIsCreateServerModalOpen(false)}
                  className="text-[#9DB8A7] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateServer} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                    Nama Server / Komunitas <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Forum Peduli Got Sunter Hijau RW 09"
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                    Cakupan Wilayah
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sunter Jaya, Jakarta Utara, atau Indonesia"
                    value={newServerScope}
                    onChange={(e) => setNewServerScope(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                    Topik Fokus Masalah
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pengawasan pengerukan lumpur dan biopori halaman"
                    value={newServerTopic}
                    onChange={(e) => setNewServerTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ruang diskusi terbuka untuk warga dan RT..."
                    value={newServerDescription}
                    onChange={(e) => setNewServerDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                  />
                </div>

                <div className="pt-4 border-t border-[#E5DFD3] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateServerModalOpen(false)}
                    className="px-4 py-2 text-xs text-[#526457]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1B3527] text-white hover:bg-[#284E39] text-xs font-bold rounded-lg uppercase tracking-wider"
                  >
                    Buat & Masuk Server
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            MODAL 5: INISIASI KERJA BAKTI BARU
        ───────────────────────────────────────────────────────────── */}
        {isCreateActionModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl border border-[#E5DFD3] shadow-2xl overflow-hidden">
              <div className="px-6 py-4 bg-[#1B3527] text-white flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">
                  Inisiasi Agenda Kerja Bakti Warga
                </h3>
                <button
                  onClick={() => setIsCreateActionModalOpen(false)}
                  className="text-[#9DB8A7] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAction} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                    Nama Kegiatan <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kerja Bakti Pengurasan Got RW 04 Sunter Agung"
                    value={newActionTitle}
                    onChange={(e) => setNewActionTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                    Lokasi Kumpul
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pos RT 08 Jl. Danau Indah"
                    value={newActionLocation}
                    onChange={(e) => setNewActionLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                    Waktu & Tanggal
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Minggu, 15 November 2026 • 07.00 WIB"
                    value={newActionDate}
                    onChange={(e) => setNewActionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3527] uppercase tracking-wider mb-1">
                    Target Pembersihan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Pembersihan sampah plastik penutup got dan pengerukan sedimen..."
                    value={newActionTarget}
                    onChange={(e) => setNewActionTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C5] rounded-lg text-xs text-[#1B3527] focus:outline-none focus:border-[#1B3527]"
                  />
                </div>

                <div className="pt-4 border-t border-[#E5DFD3] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateActionModalOpen(false)}
                    className="px-4 py-2 text-xs text-[#526457]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#E57A36] text-white hover:bg-[#D46B29] text-xs font-bold rounded-lg uppercase tracking-wider"
                  >
                    Publikasikan Aksi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
