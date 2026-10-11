import crypto from "crypto";
import { SoalPg, SoalEssay, QuizGenerateResponse } from "@/types";
import { GenerateQuizInput } from "@/lib/quiz/schema";
import { shuffleQuestionOptions } from "./shuffle";

interface ItemBankPg {
  materiSlug: string;
  kartuRujukan: string;
  kesulitan: "mudah" | "sedang" | "sulit";
  pertanyaan: string;
  opsi: string[];
  indeksBenar: number;
  pembahasan: string;
}

interface ItemBankEssay {
  materiSlug: string;
  kartuRujukan: string;
  kesulitan: "mudah" | "sedang" | "sulit";
  pertanyaan: string;
  kunciJawaban: string;
  rubrik: string[];
}

export const BANK_SOAL_PG: ItemBankPg[] = [
  // === MODUL 1: PSIKOLOGI DAN PERKEMBANGAN ANAK ===
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "Teori Kognitif (Jean Piaget)",
    kesulitan: "mudah",
    pertanyaan: "Ketika seorang anak melihat seekor kucing untuk pertama kali dan menyebutnya 'kucing', lalu melihat anjing kecil dan ikut menyebutnya 'kucing', proses kognitif apakah yang sedang terjadi menurut Jean Piaget?",
    opsi: [
      "Asimilasi, karena anak memasukkan pengalaman baru ke dalam skema lama yang sudah ia miliki",
      "Akomodasi, karena anak mengubah skema berpikirnya secara mendalam",
      "Ekuilibrasi, karena anak telah mencapai keseimbangan konsep baru",
      "Sensorimotor, karena anak hanya mengandalkan refleks motorik fisik semata",
    ],
    indeksBenar: 0,
    pembahasan: "Asimilasi adalah proses memasukkan informasi atau pengalaman baru ke dalam skema/folder berpikir yang sudah ada tanpa mengubah skema tersebut.",
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "4 Tahap Perkembangan Kognitif (Jean Piaget)",
    kesulitan: "sedang",
    pertanyaan: "Anak usia 4 tahun di kelas PAUD sering berbicara sendiri saat bermain balok dan sulit melihat sudut pandang temannya. Berdasarkan teori Piaget, anak berada pada tahap:",
    opsi: [
      "Pra-operasional (2-7 tahun), di mana anak mulai menggunakan simbol namun masih memiliki sifat egosentris",
      "Sensorimotor (0-2 tahun), karena belum dapat menggunakan bahasa secara fungsional",
      "Operasional konkret (7-11 tahun), karena sudah mampu mengklasifikasikan benda nyata",
      "Operasional formal (11+ tahun), karena telah mampu melakukan penalaran hipotesis",
    ],
    indeksBenar: 0,
    pembahasan: "Anak usia PAUD berada pada tahap pra-operasional (2-7 tahun), ditandai oleh kemampuan berpikir simbolik dan bermain peran, namun masih memiliki cara pandang egosentris.",
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "Classical Conditioning (Ivan Pavlov)",
    kesulitan: "mudah",
    pertanyaan: "Dalam eksperimen Classical Conditioning Ivan Pavlov, bunyi lonceng yang pada awalnya netral kemudian memicu keluarnya air liur anjing disebut sebagai:",
    opsi: [
      "Conditioned Stimulus (CS / Rangsangan Terkondisi)",
      "Unconditioned Stimulus (US / Rangsangan Alami)",
      "Unconditioned Response (UR / Reaksi Alami)",
      "Operant Reinforcer (Penguat Operan)",
    ],
    indeksBenar: 0,
    pembahasan: "Bunyi lonceng yang telah diasosiasikan berulang kali dengan makanan menjadi stimulus terkondisi (Conditioned Stimulus) yang menghasilkan respon bersyarat.",
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "Operant Conditioning (B.F. Skinner)",
    kesulitan: "sedang",
    pertanyaan: "Guru PAUD memberikan stiker bintang dan pujian hangat kepada anak yang berhasil merapikan mainannya sendiri agar perilaku tersebut diulangi. Tindakan guru ini merupakan contoh dari:",
    opsi: [
      "Penguatan positif (Positive Reinforcement)",
      "Penguatan negatif (Negative Reinforcement)",
      "Hukuman langsung (Positive Punishment)",
      "Pengondisian klasik pasif (Classical Conditioning)",
    ],
    indeksBenar: 0,
    pembahasan: "Penguatan positif memberikan konsekuensi yang menyenangkan (pujian/stiker) segera setelah perilaku baik muncul untuk memperkuat peluang perilaku tersebut diulangi.",
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "3 Hukum Belajar (Edward Thorndike)",
    kesulitan: "sulit",
    pertanyaan: "Anak yang merasa lapar dan lelah dipaksa oleh guru untuk menulis angka di lembar kerja sehingga anak menangis dan menolak belajar. Fenomena ini paling tepat dijelaskan oleh hukum Thorndike yaitu:",
    opsi: [
      "Law of Readiness (Hukum Kesiapan), di mana pemaksaan saat individu belum siap akan menghasilkan rasa tidak puas dan penolakan",
      "Law of Exercise (Hukum Latihan), karena kurangnya pengulangan drill motorik",
      "Law of Effect (Hukum Akibat), karena anak tidak menyukai bentuk huruf",
      "Law of Contiguity (Hukum Kedekatan Waktu), karena jeda waktu yang terlalu singkat",
    ],
    indeksBenar: 0,
    pembahasan: "Law of Readiness menyatakan bahwa jika seorang anak belum memiliki kesiapan fisik dan mental untuk bertindak namun dipaksakan, maka aktivitas belajar akan menimbulkan kejengkelan dan frustrasi.",
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "Teori Sosiokultural (Lev Vygotsky)",
    kesulitan: "sedang",
    pertanyaan: "Bantuan terarah yang diberikan guru PAUD saat anak kesulitan menyusun puzzle rumit, lalu perlahan dikurangi seiring anak semakin terampil, dikenal dengan istilah:",
    opsi: [
      "Scaffolding (Dukungan berjenjang)",
      "Ekuilibrasi mandiri",
      "Kondisioning operan",
      "Asimilasi kognitif",
    ],
    indeksBenar: 0,
    pembahasan: "Scaffolding adalah teknik pemberian dukungan bertahap oleh guru atau teman sebaya yang lebih mampu di dalam Zone of Proximal Development (ZPD) anak hingga anak mandiri.",
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "8 Tahap Perkembangan Psikososial (Erik Erikson)",
    kesulitan: "mudah",
    pertanyaan: "Menurut Erik Erikson, krisis psikososial yang menjadi fokus utama perkembangan anak usia 3 sampai 6 tahun (usia prasekolah/TK) adalah:",
    opsi: [
      "Inisiatif vs Rasa bersalah (Initiative vs Guilt)",
      "Percaya vs Tidak percaya (Trust vs Mistrust)",
      "Mandiri vs Malu dan ragu (Autonomy vs Shame)",
      "Tekun vs Rendah diri (Industry vs Inferiority)",
    ],
    indeksBenar: 0,
    pembahasan: "Tahap 3 Erikson (usia 3-6 tahun) adalah Inisiatif vs Rasa Bersalah, di mana anak berani memulai ide dan bereksplorasi; dukungan positif guru akan menumbuhkan inisiatif yang sehat.",
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "Metode Montessori (Maria Montessori)",
    kesulitan: "sedang",
    pertanyaan: "Prinsip utama Maria Montessori yang menekankan penataan kelas dengan rak rendah yang mudah dijangkau anak secara mandiri disebut:",
    opsi: [
      "Prepared Environment (Lingkungan yang dipersiapkan)",
      "Banking Concept of Education",
      "Teacher-directed Instruction",
      "Unconditioned Learning Setup",
    ],
    indeksBenar: 0,
    pembahasan: "Prepared Environment adalah lingkungan belajar yang dirancang khusus sesuai ukuran fisik dan kebutuhan anak agar anak bebas memilih aktivitas dan mandiri.",
  },

  // === MODUL 2: LEARNING ENVIRONMENT ===
  {
    materiSlug: "02-learning-environment",
    kartuRujukan: "Tujuan dan Fungsi Learning Environment",
    kesulitan: "mudah",
    pertanyaan: "Lingkungan belajar PAUD tidak hanya mencakup ruangan fisik, melainkan juga harus menjalankan fungsi mengembangkan kemampuan sehari-hari, seperti:",
    opsi: [
      "Melatih anak makan sendiri, memakai sepatu, dan merapikan mainan setelah selesai bermain",
      "Menghafal rumus matematika dasar sejak usia 3 tahun",
      "Duduk tenang mendengarkan ceramah guru selama dua jam penuh",
      "Menyelesaikan tes tertulis lembar kerja secara ketat dan hening",
    ],
    indeksBenar: 0,
    pembahasan: "Fungsi pengembangan kemampuan sehari-hari pada lingkungan PAUD berfokus pada kemandirian dasar hidup (life skills) seperti makan mandiri dan merapikan alat main.",
  },
  {
    materiSlug: "02-learning-environment",
    kartuRujukan: "Lingkungan Fisik",
    kesulitan: "sedang",
    pertanyaan: "Dalam merancang lingkungan fisik kelas PAUD, aspek keamanan dan ergonomi ditunjukkan melalui penerapan:",
    opsi: [
      "Meja kursi berukuran sesuai tinggi tubuh anak dengan sudut yang tumpul dan rak mainan rendah yang stabil",
      "Lantai licin mengkilap dengan perabotan tinggi agar anak tidak sembarangan menyentuh barang",
      "Pintu kelas yang terkunci rapat dari luar selama jam belajar berlangsung",
      "Penggunaan hiasan gantung dari kaca yang berkilauan di atas area bermain",
    ],
    indeksBenar: 0,
    pembahasan: "Lingkungan fisik PAUD wajib mengedepankan keamanan (bebas sudut tajam) dan ergonomis (furnitur proporsional dengan fisik anak usia dini).",
  },
  {
    materiSlug: "02-learning-environment",
    kartuRujukan: "Lingkungan Psikologis",
    kesulitan: "sedang",
    pertanyaan: "Mengapa pemenuhan rasa aman secara psikologis sangat krusial bagi anak PAUD sebelum mereka mulai belajar menurut hierarki kebutuhan Maslow?",
    opsi: [
      "Karena kebutuhan rasa aman berada di tingkat dasar; anak yang merasa cemas atau terancam tidak akan mampu mengeksplorasi hal baru secara optimal",
      "Karena rasa aman hanya diperlukan untuk anak balita di bawah usia 2 tahun",
      "Karena suasana tegang justru akan memicu adrenalin anak untuk belajar lebih cepat",
      "Karena rasa aman tidak ada hubungannya dengan fungsi kognitif anak usia dini",
    ],
    indeksBenar: 0,
    pembahasan: "Menurut Maslow, kebutuhan rasa aman harus terpenuhi terlebih dahulu sebelum individu siap untuk bertumbuh dan belajar. Anak yang merasa aman akan berani bereksplorasi.",
  },
  {
    materiSlug: "02-learning-environment",
    kartuRujukan: "Lingkungan Sosial",
    kesulitan: "sulit",
    pertanyaan: "Di kelas PAUD terdapat anak berkebutuhan khusus (inklusif). Cara guru membangun lingkungan sosial yang sehat dan inklusif adalah dengan:",
    opsi: [
      "Memfasilitasi kegiatan bermain bersama yang saling menghargai perbedaan dan mengajarkan empati tanpa memisahkan anak tersebut",
      "Memisahkan meja bermain anak tersebut di sudut belakang agar tidak mengganggu teman-temannya",
      "Meminta anak lain untuk tidak mengajak bicara agar anak tersebut tenang",
      "Fokus pada prestasi akademik anak-anak reguler saja",
    ],
    indeksBenar: 0,
    pembahasan: "Lingkungan sosial inklusif di PAUD dibangun dengan membaurkan seluruh anak, memfasilitasi kerja sama timbal balik, dan menanamkan nilai empati serta penerimaan.",
  },

  // === MODUL 3: PEDAGOGIK ===
  {
    materiSlug: "03-pedagogik",
    kartuRujukan: "Pedagogik Tradisional",
    kesulitan: "mudah",
    pertanyaan: "Istilah 'Banking Concept of Education' yang dikemukakan oleh Paulo Freire untuk mengkritik pedagogik tradisional menggambarkan proses belajar seperti:",
    opsi: [
      "Guru menyetor informasi ke kepala anak yang dianggap seperti celengan pasif penampung ilmu",
      "Anak aktif menabung uang saku di bank sekolah setiap pagi",
      "Siswa dan guru berdiskusi setara dalam memecahkan masalah lingkungan",
      "Anak melakukan riset mandiri lewat bermain di alam terbuka",
    ],
    indeksBenar: 0,
    pembahasan: "Banking concept mengibaratkan murid sebagai bejana/celengan kosong tempat guru menyetorkan ilmu satu arah, yang membatasi daya kritis anak.",
  },
  {
    materiSlug: "03-pedagogik",
    kartuRujukan: "Kelebihan dan Kekurangan Tradisional",
    kesulitan: "sedang",
    pertanyaan: "Meskipun pedagogik tradisional sering dikritik karena membatasi kreativitas, pendekatan ini tetap memiliki kelebihan yang bermanfaat bagi PAUD, yaitu:",
    opsi: [
      "Membantu membentuk rutinitas, ketertiban, dan kebiasaan mendengarkan instruksi pada anak usia dini",
      "Mampu melayani seluruh gaya belajar anak yang berbeda-beda secara serentak",
      "Meningkatkan keterampilan berpikir tingkat tinggi (HOTS) secara maksimal",
      "Menghilangkan ketergantungan anak terhadap figur guru di kelas",
    ],
    indeksBenar: 0,
    pembahasan: "Pendekatan tradisional efektif dalam membangun pembiasaan dasar, ketertiban antre, dan rutinitas harian yang tetap dibutuhkan anak usia dini.",
  },
  {
    materiSlug: "03-pedagogik",
    kartuRujukan: "Pedagogik Kritis",
    kesulitan: "sedang",
    pertanyaan: "Guru PAUD menolak stereotip 'anak laki-laki dilarang main boneka dan anak perempuan dilarang main mobil-mobilan'. Sikap guru ini mencerminkan prinsip:",
    opsi: [
      "Pedagogik kritis yang menghargai child agency dan membebaskan anak dari pembatasan stereotip gender",
      "Pedagogik tradisional yang mengutamakan kepatuhan norma lama",
      "Pendekatan behavioristik drill stimulus",
      "Model hafalan berulang",
    ],
    indeksBenar: 0,
    pembahasan: "Pedagogik kritis menekankan keadilan, child agency, dan mendekonstruksi stereotip sempit yang membatasi potensi perkembangan anak.",
  },
  {
    materiSlug: "03-pedagogik",
    kartuRujukan: "Pedagogik Transformatif",
    kesulitan: "sulit",
    pertanyaan: "Pendekatan Reggio Emilia dalam pedagogik transformatif memandang anak usia dini sebagai:",
    opsi: [
      "Sosok yang kaya potensi, memiliki 100 bahasa ekspresi, dan belajar aktif melalui eksplorasi mendalam",
      "Kertas putih polos (tabula rasa) yang pasif menunggu coretan guru",
      "Miniatur orang dewasa yang harus dituntut serba bisa",
      "Individu yang hanya bisa belajar jika diberi imbalan hadiah eksternal",
    ],
    indeksBenar: 0,
    pembahasan: "Reggio Emilia (Loris Malaguzzi) memandang anak sebagai subjek yang kaya potensi ('The Hundred Languages of Children') yang membangun pemahaman melalui eksplorasi estetika dan lingkungan.",
  },

  // === MODUL 4: SOSIOLOGIS DAN BUDAYA ===
  {
    materiSlug: "04-sosiologis-dan-budaya",
    kartuRujukan: "Hakikat Landasan Sosiologis",
    kesulitan: "mudah",
    pertanyaan: "Tahapan sosialisasi nilai pada anak usia dini dari luar hingga menjadi bagian dari kepribadian dirinya sendiri secara runtut adalah:",
    opsi: [
      "Imitasi (meniru) -> Identifikasi (meneladani figur) -> Internalisasi (menjadi nilai pribadi)",
      "Internalisasi -> Imitasi -> Identifikasi",
      "Identifikasi -> Internalisasi -> Imitasi",
      "Hafalan -> Ujian -> Pembiasaan",
    ],
    indeksBenar: 0,
    pembahasan: "Anak mula-mula meniru (imitasi), lalu mengidentifikasi diri dengan figur teladan (identifikasi), hingga akhirnya nilai tersebut meresap ke dalam dirinya (internalisasi).",
  },
  {
    materiSlug: "04-sosiologis-dan-budaya",
    kartuRujukan: "Ekosistem Pembelajaran (Teori Bronfenbrenner)",
    kesulitan: "sedang",
    pertanyaan: "Hubungan timbal balik dan komunikasi aktif antara orang tua di rumah dengan guru PAUD di sekolah dalam teori ekologi Bronfenbrenner termasuk dalam lapisan:",
    opsi: [
      "Mesosistem, yaitu keterkaitan interaksi antar-lingkungan mikrosistem anak",
      "Mikrosistem langsung",
      "Eksosistem luar",
      "Makrosistem budaya global",
    ],
    indeksBenar: 0,
    pembahasan: "Mesosistem adalah hubungan timbal balik antara mikrosistem yang berbeda tempat anak berpartisipasi aktif, misalnya interaksi antara guru dan orang tua murid.",
  },
  {
    materiSlug: "04-sosiologis-dan-budaya",
    kartuRujukan: "Kemitraan Tri Pusat Pendidikan",
    kesulitan: "sedang",
    pertanyaan: "Gagasan Tri Pusat Pendidikan yang dicetuskan oleh Ki Hajar Dewantara menegaskan bahwa keberhasilan tumbuh kembang anak bertumpu pada kemitraan tiga pilar yaitu:",
    opsi: [
      "Keluarga, Sekolah, dan Masyarakat",
      "Guru, Kepala Sekolah, dan Pengawas",
      "Pemerintah, Dinas Sosial, dan Puskesmas",
      "Buku teks, Kurikulum, dan Ujian Nasional",
    ],
    indeksBenar: 0,
    pembahasan: "Tri Pusat Pendidikan Ki Hajar Dewantara mencakup tiga lingkungan edukatif utama: Alam Keluarga, Alam Perguruan (Sekolah), dan Alam Pemuda (Masyarakat).",
  },
  {
    materiSlug: "04-sosiologis-dan-budaya",
    kartuRujukan: "4 Korelasi Budaya dan Pedagogik",
    kesulitan: "sulit",
    pertanyaan: "Guru PAUD mengajarkan konsep berhitung dan kerja sama menggunakan permainan tradisional 'Engklek' atau 'Congklak'. Praktik ini merupakan perwujudan korelasi budaya dalam hal:",
    opsi: [
      "Kontekstualisasi pembelajaran dan pelestarian warisan budaya lokal secara bermakna bagi anak",
      "Penyeragaman materi agar anak tidak tertinggal kurikulum internasional",
      "Bentuk pemaksaan tradisi kuno pada generasi digital",
      "Mengurangi biaya operasional pembelian alat peraga modern",
    ],
    indeksBenar: 0,
    pembahasan: "Mengintegrasikan dolanan tradisional seperti congklak atau engklek ke dalam pembelajaran menghubungkan konsep akademik secara kontekstual sekaligus melestarikan budaya luhur bangsa.",
  },
];

export const BANK_SOAL_ESSAY: ItemBankEssay[] = [
  // === MODUL 1: PSIKOLOGI DAN PERKEMBANGAN ANAK ===
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "Operant Conditioning (B.F. Skinner)",
    kesulitan: "sedang",
    pertanyaan: "Seorang anak di kelas PAUD sering melempar balok saat bermain. Analisislah bagaimana guru dapat menerapkan prinsip Penguatan Positif (Positive Reinforcement) dan konsekuensi logis untuk mengubah perilaku anak tersebut tanpa menggunakan bentakan fisik!",
    kunciJawaban: "Guru dapat memberikan penguatan positif saat anak menunjukkan perilaku meletakkan balok dengan baik (pujian/apresiasi spesifik). Jika anak melempar balok, berikan konsekuensi logis seperti menghentikan sementara bermain balok dan mengajak anak merapikannya bersama secara tenang tanpa kekerasan.",
    rubrik: [
      "Menjelaskan pengertian dan contoh penguatan positif yang relevan di PAUD",
      "Menjelaskan alternatif konsekuensi edukatif yang tidak menggunakan kekerasan verbal/fisik",
      "Mengaitkan solusi dengan konsistensi bimbingan guru",
    ],
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "Teori Sosiokultural (Lev Vygotsky)",
    kesulitan: "sulit",
    pertanyaan: "Jelaskan konsep Zone of Proximal Development (ZPD) dan Scaffolding dari Lev Vygotsky! Berikan satu contoh konkret penerapannya saat membimbing anak PAUD yang sedang belajar memotong kertas dengan gunting!",
    kunciJawaban: "ZPD adalah jarak antara kemampuan mandiri anak dengan potensi yang bisa dicapai lewat bimbingan. Scaffolding adalah bantuan bertahap. Contoh: Mula-mula guru memegang tangan anak bersamaan saat menggunting, lalu beralih memegang kertasnya saja, hingga akhirnya anak mampu menggunting garis lurus secara mandiri.",
    rubrik: [
      "Mendefinisikan ZPD secara tepat",
      "Mendefinisikan konsep Scaffolding",
      "Memberikan contoh langkah konkret bantuan yang berangsur-angsur dikurangi",
    ],
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "4 Tahap Perkembangan Kognitif (Jean Piaget)",
    kesulitan: "mudah",
    pertanyaan: "Dua anak usia 4 tahun di kelas PAUD berebut satu mobil-mobilan dan keduanya sama-sama bersikeras bahwa mainan itu miliknya. Mengapa perilaku egosentris ini wajar terjadi menurut Jean Piaget pada tahap pra-operasional, dan bagaimana sikap bijak guru?",
    kunciJawaban: "Pada tahap pra-operasional (2-7 tahun), anak berpikir egosentris bukan karena egois jahat, melainkan belum mampu memahami sudut pandang orang lain secara kognitif. Sikap bijak guru: Tidak melabeli anak 'nakal', melainkan memvalidasi perasaan kedua anak, lalu menawarkan solusi bergiliran main dengan timer atau menyediakan mainan alternatif.",
    rubrik: [
      "Menjelaskan sifat egosentris tahap pra-operasional Piaget",
      "Menghindari pelabelan negatif terhadap anak",
      "Memberikan solusi bimbingan giliran bermain yang adil",
    ],
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "8 Tahap Perkembangan Psikososial (Erik Erikson)",
    kesulitan: "sedang",
    pertanyaan: "Seorang anak usia 5 tahun berinisiatif ingin menuang air minumnya sendiri ke gelas, tetapi airnya tumpah ke meja. Kaitkan situasi ini dengan krisis 'Inisiatif vs Rasa Bersalah' Erikson dan jelaskan bagaimana respon guru agar inisiatif anak tidak padam!",
    kunciJawaban: "Anak sedang berada di tahap Inisiatif vs Rasa Bersalah. Jika guru memarahi atau melarangnya, anak akan merasa bersalah dan takut mencoba hal baru di masa depan. Respon bijak: Mengapresiasi niat mandirinya ('Hebat kamu sudah mau coba tuang sendiri!'), lalu mengajak anak mengambil lap untuk membersihkan tumpahan bersama tanpa nada marah.",
    rubrik: [
      "Mengidentifikasi krisis psikososial tahap 3 Erikson",
      "Menjelaskan dampak negatif jika inisiatif anak dimarahi",
      "Menyusun respon apresiatif disertai pembiasaan tanggung jawab",
    ],
  },
  {
    materiSlug: "01-psikologi-dan-perkembangan-anak",
    kartuRujukan: "Metode Montessori (Maria Montessori)",
    kesulitan: "sulit",
    pertanyaan: "Bagaimana konsep 'Prepared Environment' (Lingkungan yang Dipersiapkan) dalam metode Montessori dapat mendorong kemandirian dan rasa percaya diri anak usia dini di kelas?",
    kunciJawaban: "Prepared Environment menyediakan perabotan proporsional sesuai ukuran tubuh anak, rak terbuka rendah, dan material belajar yang tertata rapi. Anak diberi kebebasan memilih aktivitasnya sendiri dan mengembalikan alat ke tempatnya. Hal ini menumbuhkan rasa mampu, kemandirian membuat keputusan, dan rasa hormat terhadap lingkungan.",
    rubrik: [
      "Menjelaskan ciri utama Prepared Environment Montessori",
      "Menghubungkan kebebasan memilih dengan tumbuhnya kemandirian",
      "Menekankan pembiasaan tanggung jawab terhadap material belajar",
    ],
  },

  // === MODUL 2: LEARNING ENVIRONMENT ===
  {
    materiSlug: "02-learning-environment",
    kartuRujukan: "Lingkungan Fisik",
    kesulitan: "sedang",
    pertanyaan: "Rancanglah sebuah sudut membaca (reading corner) yang ramah anak di ruang kelas PAUD berukuran 6x6 meter dengan mempertimbangkan aspek keamanan, pencahayaan, dan aksesibilitas!",
    kunciJawaban: "Sudut membaca diletakkan dekat jendela untuk pencahayaan alami yang cukup, dilengkapi karpet empuk dan bantal duduk yang bersih. Rak buku dipasang rendah setinggi anak dengan buku menghadap depan (front-facing) agar anak mudah memilih, serta bebas dari colokan listrik atau sudut meja tajam.",
    rubrik: [
      "Memperhatikan posisi dan pencahayaan yang nyaman",
      "Memastikan rak buku rendah dan mudah diakses anak",
      "Menjamin aspek keamanan fisik anak usia dini",
    ],
  },
  {
    materiSlug: "02-learning-environment",
    kartuRujukan: "Lingkungan Psikologis",
    kesulitan: "sulit",
    pertanyaan: "Di hari pertama masuk sekolah, seorang anak menangis histeris dan menolak ditinggal ibunya. Kaitkan situasi ini dengan teori Kelekatan (Bowlby) dan jelaskan 2 strategi guru untuk membangun lingkungan psikologis yang aman bagi anak tersebut!",
    kunciJawaban: "Berdasarkan teori Bowlby, anak mengalami kecemasan perpisahan karena figur lekatnya (ibu) berjarak. Strategi guru: (1) Menjadi figur lekat sekunder yang hangat, menyambut anak setara tinggi badan dengan senyuman dan pelukan ramah; (2) Mengizinkan transisi bertahap, misalnya ibu menemani di luar kelas sementara guru mengajak anak bermain mainan sensorik favoritnya.",
    rubrik: [
      "Menghubungkan kecemasan anak dengan teori kelekatan Bowlby",
      "Memberikan strategi respon emosional guru yang ramah dan menenangkan",
      "Menyusun langkah transisi adaptasi anak secara bertahap",
    ],
  },
  {
    materiSlug: "02-learning-environment",
    kartuRujukan: "Prinsip Pengaturan Lingkungan Belajar",
    kesulitan: "mudah",
    pertanyaan: "Mengapa dalam menata ruangan kelas PAUD penting untuk memisahkan antara 'Area Tenang' (Quiet Area) dengan 'Area Aktif/Bising' (Active Area)? Berikan contoh kegiatan pada masing-masing area!",
    kunciJawaban: "Pemisahan ini penting agar konsentrasi dan kenyamanan anak tidak saling terganggu. Contoh Area Tenang: Sudut membaca dan sudut puzzle/menulis yang butuh fokus hening. Contoh Area Aktif: Sudut balok, sentra main peran, dan area musik/gerak yang melibatkan banyak suara dan pergerakan fisik aktif.",
    rubrik: [
      "Menjelaskan alasan psikologis dan fokus anak dalam pemisahan area",
      "Memberikan contoh konkret kegiatan di area tenang",
      "Memberikan contoh konkret kegiatan di area aktif",
    ],
  },
  {
    materiSlug: "02-learning-environment",
    kartuRujukan: "Lingkungan Sosial",
    kesulitan: "sedang",
    pertanyaan: "Di sebuah kelas PAUD, seorang anak baru yang berasal dari luar daerah tampak menyendiri dan pemalu karena perbedaan logat bahasa. Bagaimana guru menciptakan lingkungan sosial yang hangat agar anak tersebut merasa diterima oleh teman-temannya?",
    kunciJawaban: "Guru dapat: (1) Mengadakan permainan lingkaran (circle time) yang menekankan perkenalan nama dan kesukaan bersama; (2) Mengapresiasi keberagaman bahasa secara positif; (3) Memasangkan anak tersebut dalam aktivitas kolaboratif berpasangan (misalnya menyusun puzzle besar atau menggambar bersama) dengan teman yang ramah.",
    rubrik: [
      "Menjelaskan tindakan penerimaan sosial di awal pembelajaran",
      "Memfasilitasi kegiatan kolaboratif kelompok kecil",
      "Menciptakan iklim kelas yang menghargai keberagaman latar belakang",
    ],
  },
  {
    materiSlug: "02-learning-environment",
    kartuRujukan: "Lingkungan Fisik",
    kesulitan: "sulit",
    pertanyaan: "Jelaskan keuntungan penggunaan bahan alam dan lepasan (Loose Parts) seperti ranting, kerang, biji-bijian, dan kardus bekas dalam lingkungan belajar PAUD dibandingkan hanya menggunakan mainan plastik pabrikan!",
    kunciJawaban: "Loose parts bersifat terbuka (open-ended), tidak memiliki aturan baku satu fungsi seperti mainan plastik jadi. Keuntungannya: Memicu kreativitas tanpa batas, melatih pemecahan masalah fleksibel, menstimulasi sensori tekstur alamiah, ramah lingkungan, serta mudah didapat tanpa biaya tinggi.",
    rubrik: [
      "Menjelaskan karakteristik open-ended dari loose parts",
      "Menganalisis stimulasi kreativitas dan sensori anak",
      "Menyebutkan nilai edukatif dan keberlanjutan lingkungan",
    ],
  },

  // === MODUL 3: PEDAGOGIK ===
  {
    materiSlug: "03-pedagogik",
    kartuRujukan: "Pedagogik Kritis",
    kesulitan: "sedang",
    pertanyaan: "Bandingkan pendekatan pembelajaran 'Teacher-Centered' (berpusat pada guru) dengan 'Child-Centered' (berpusat pada anak) dalam konteks pembelajaran seni menggambar di PAUD! Manakah yang lebih mengembangkan kreativitas anak dan mengapa?",
    kunciJawaban: "Teacher-centered menuntut anak meniru gambar gunung dan sawah persis contoh guru di papan tulis (hasil seragam). Child-centered memberi beragam media warna dan membebaskan anak menggambar imajinasinya sendiri lalu menceritakan karyanya. Pendekatan child-centered lebih memicu kreativitas karena memberi ruang berekspresi tanpa takut dinilai salah.",
    rubrik: [
      "Membandingkan karakteristik kedua pendekatan dalam aktivitas menggambar",
      "Menjelaskan argumen mengapa child-centered lebih memicu daya kreasi anak",
      "Menghindari penilaian tunggal benar/salah pada ekspresi seni anak",
    ],
  },
  {
    materiSlug: "03-pedagogik",
    kartuRujukan: "Pedagogik Transformatif",
    kesulitan: "sulit",
    pertanyaan: "Bagaimana guru PAUD dapat menerapkan pedagogik transformatif untuk mengajarkan empati dan kepedulian lingkungan saat anak-anak menemukan banyak sampah daun berserakan di halaman sekolah?",
    kunciJawaban: "Guru tidak hanya menyuruh anak membuang sampah, melainkan mengajak anak berdialog: 'Apa yang terjadi jika daun menumpuk? Bagaimana kita bisa memanfaatkannya?' Anak diajak mengumpulkan daun bersama, mengolahnya menjadi karya kolase seni atau kompos tanaman, sehingga terjadi perubahan cara pandang anak tentang sampah menjadi sesuatu yang berharga.",
    rubrik: [
      "Menghubungkan pengalaman nyata dengan perubahan pola pikir anak",
      "Melibatkan anak dalam dialog reflektif pemecahan masalah",
      "Menyusun kegiatan kontekstual yang berorientasi sosial/lingkungan",
    ],
  },
  {
    materiSlug: "03-pedagogik",
    kartuRujukan: "Kelebihan dan Kekurangan Tradisional",
    kesulitan: "mudah",
    pertanyaan: "Meskipun pedagogik tradisional banyak dikritik, sebutkan 2 situasi di PAUD di mana instruksi langsung dan rutinitas tegas dari guru tetap sangat diperlukan demi keselamatan dan kebaikan anak!",
    kunciJawaban: "(1) Situasi keselamatan darurat: Simulasi evakuasi kebakaran/gempa bumi atau saat menyeberang jalan, anak harus mematuhi komando langsung guru tanpa perdebatan; (2) Pembiasaan kebersihan dan kesehatan: Prosedur cuci tangan dengan sabun yang benar dan antre makan teratur membutuhkan panduan instruksional yang jelas.",
    rubrik: [
      "Mengidentifikasi situasi keselamatan/urgensi yang membutuhkan instruksi langsung",
      "Menjelaskan pentingnya pembiasaan rutinitas hidup sehat",
      "Memberikan argumen rasionalitas batas pedagogik tradisional di PAUD",
    ],
  },
  {
    materiSlug: "03-pedagogik",
    kartuRujukan: "Pedagogik Kritis",
    kesulitan: "sedang",
    pertanyaan: "Apa yang dimaksud dengan 'Child Agency' dalam pedagogik kritis, dan berikan satu contoh bagaimana guru PAUD memberikan ruang child agency saat merencanakan kegiatan main mingguan?",
    kunciJawaban: "Child agency adalah pengakuan bahwa anak adalah subjek yang memiliki kehendak, suara, dan kemampuan mengambil keputusan atas belajarnya sendiri. Contoh di PAUD: Saat awal pekan, guru menggelar rapat kelas mini menanyakan minat anak: 'Minggu ini kita ingin mengeksplorasi tentang hewan air atau tanaman buah?', lalu menyusun sentra main berdasarkan pilihan suara anak.",
    rubrik: [
      "Mendefinisikan konsep child agency secara tepat",
      "Memberikan contoh pelibatan suara anak dalam perencanaan",
      "Menunjukkan pergeseran peran guru dari pengatur mutlak menjadi fasilitator",
    ],
  },
  {
    materiSlug: "03-pedagogik",
    kartuRujukan: "Pedagogik Transformatif",
    kesulitan: "sulit",
    pertanyaan: "Jelaskan prinsip 'Dokumentasi Pedagogis' dalam pendekatan Reggio Emilia! Mengapa foto karya dan ucapan asli anak perlu dipajang di dinding kelas daripada hiasan kartun pabrikan?",
    kunciJawaban: "Dokumentasi pedagogis mencatat proses belajar anak melalui foto, video, dan kutipan kalimat anak saat berproses. Memajangnya di dinding kelas membuat proses berpikir anak menjadi terlihat (visible learning), membuat anak merasa dihargai dan bangga, serta menjadi bahan refleksi berharga bagi orang tua dan guru daripada sekadar hiasan komersial tanpa makna.",
    rubrik: [
      "Menjelaskan pengertian dokumentasi pedagogis Reggio Emilia",
      "Menganalisis dampak psikologis pajangan karya terhadap rasa percaya diri anak",
      "Membandingkan nilai edukasi karya otentik vs hiasan dekoratif pabrikan",
    ],
  },

  // === MODUL 4: SOSIOLOGIS DAN BUDAYA ===
  {
    materiSlug: "04-sosiologis-dan-budaya",
    kartuRujukan: "Ekosistem Pembelajaran (Teori Bronfenbrenner)",
    kesulitan: "sedang",
    pertanyaan: "Jelaskan bagaimana lapisan 'Eksosistem' (lingkungan yang tidak dialami langsung oleh anak) dalam teori Bronfenbrenner dapat memengaruhi kondisi belajar anak di kelas PAUD! Berikan contoh nyata dalam kehidupan sehari-hari!",
    kunciJawaban: "Eksosistem adalah lingkungan eksternal tempat anak tidak hadir langsung, namun kebijakannya memengaruhi anak. Contoh: Tempat kerja orang tua yang memiliki kebijakan lembur tanpa kompensasi membuat orang tua stres dan kelelahan di rumah, sehingga kurang memberikan perhatian pada anak dan anak menjadi rewel atau murung di kelas PAUD.",
    rubrik: [
      "Mendefinisikan eksosistem menurut teori Bronfenbrenner",
      "Memberikan contoh konkret relasi tempat kerja orang tua/kebijakan publik terhadap anak",
      "Menganalisis dampaknya terhadap perilaku anak di kelas",
    ],
  },
  {
    materiSlug: "04-sosiologis-dan-budaya",
    kartuRujukan: "Kemitraan Tri Pusat Pendidikan",
    kesulitan: "sulit",
    pertanyaan: "Sebagai calon guru PAUD profesional, rancanglah program kolaborasi nyata antara Sekolah, Keluarga, dan Masyarakat (Tri Pusat Pendidikan Ki Hajar Dewantara) untuk menanamkan karakter cinta budaya lokal pada anak usia dini!",
    kunciJawaban: "Program: 'Pekan Budaya Cilik'. Sekolah merancang kurikulum pengenalan makanan dan permainan daerah. Keluarga berperan dengan memasak makanan tradisional bersama anak di rumah untuk dibawa ke sekolah. Masyarakat (misalnya seniman lokal atau tetua adat sekitar) diundang menjadi narasumber tamu untuk memainkan gamelan atau mendongeng cerita rakyat bersama anak-anak.",
    rubrik: [
      "Mengintegrasikan peran ketiga elemen (Sekolah, Keluarga, Masyarakat)",
      "Menjelaskan aktivitas kontekstual bertema budaya lokal",
      "Menunjukkan nilai penanaman karakter dan kebersamaan",
    ],
  },
  {
    materiSlug: "04-sosiologis-dan-budaya",
    kartuRujukan: "Hakikat Landasan Sosiologis",
    kesulitan: "mudah",
    pertanyaan: "Jelaskan mengapa keteladanan perilaku guru di kelas PAUD jauh lebih berdampak pada penanaman karakter sopan santun anak dibandingkan sekadar nasihat lisan, dikaitkan dengan proses 'Imitasi' dan 'Identifikasi'!",
    kunciJawaban: "Anak usia dini belajar melalui peniruan konkret (imitasi). Ketika anak melihat guru selalu mengucapkan 'tolong', 'terima kasih', dan tersenyum ramah, anak secara alami mengidentifikasikan gurunya sebagai figur panutan. Sebaliknya, jika guru hanya menasihati secara lisan tetapi sering berkata kasar, anak akan meniru perilaku nyata guru.",
    rubrik: [
      "Mengaitkan peran keteladanan dengan konsep imitasi dan identifikasi",
      "Menjelaskan karakteristik anak usia dini yang meniru tindakan visual nyata",
      "Menyimpulkan pentingnya integritas perilaku guru sehari-hari",
    ],
  },
  {
    materiSlug: "04-sosiologis-dan-budaya",
    kartuRujukan: "Teori Sosiokultural (Lev Vygotsky)",
    kesulitan: "sedang",
    pertanyaan: "Menurut Vygotsky, bahasa adalah alat berpikir utama yang dibentuk oleh budaya. Bagaimana aktivitas mendongeng cerita fabel tradisional nusantara (seperti Kancil yang Bijak atau Burung Cendrawasih) dapat menstimulasi kemampuan kognitif dan bahasa anak PAUD?",
    kunciJawaban: "Mendongeng memperkaya kosakata anak, melatih imajinasi visual, dan menanamkan simbol-simbol nilai moral budaya. Cerita rakyat menyediakan konteks sosiokultural bermakna di mana anak belajar menghubungkan sebab-akibat tindakan tokoh dengan kehidupan nyata mereka.",
    rubrik: [
      "Menjelaskan fungsi bahasa sebagai alat berpikir kognitif menurut Vygotsky",
      "Menganalisis pengayaan kosakata dan imajinasi lewat dongeng",
      "Menghubungkan pesan moral cerita rakyat dengan konteks budaya anak",
    ],
  },
  {
    materiSlug: "04-sosiologis-dan-budaya",
    kartuRujukan: "4 Korelasi Budaya dan Pedagogik",
    kesulitan: "sulit",
    pertanyaan: "Bagaimana guru PAUD menanamkan nilai inklusivitas dan toleransi budaya ketika di dalam kelas terdapat murid dengan latar belakang suku, agama, dan tradisi keluarga yang berbeda-beda?",
    kunciJawaban: "Guru dapat merayakan keberagaman melalui 'Pentas Cerita Keluargaku', di mana tiap anak diperbolehkan membagikan tradisi khas keluarganya dengan bangga. Guru menekankan persamaan sebagai sesama sahabat yang saling menyayangi, menghindarkan prasangka, dan mengajarkan sikap saling menghormati perbedaan sejak dini.",
    rubrik: [
      "Menyusun strategi perayaan keberagaman yang inklusif",
      "Menghindari diskriminasi atau prasangka budaya di ruang kelas",
      "Menanamkan nilai empati, kasih sayang, dan toleransi sejak usia dini",
    ],
  },
];

// Helper untuk shuffle array acak
function acakArray<T>(arr: T[]): T[] {
  const salinan = [...arr];
  for (let i = salinan.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [salinan[i], salinan[j]] = [salinan[j], salinan[i]];
  }
  return salinan;
}

/**
 * Mengambil soal cadangan dari bank soal terkurasi saat AI gagal / offline.
 */
export function ambilSoalCadangan(req: GenerateQuizInput): QuizGenerateResponse {
  const { materiSlugs, jumlahPg, jumlahEssay, kesulitan } = req;

  // 1. Filter bank soal sesuai slug modul yang dipilih
  const pgTersedia = BANK_SOAL_PG.filter((q) =>
    materiSlugs.includes(q.materiSlug)
  );
  const essayTersedia = BANK_SOAL_ESSAY.filter((q) =>
    materiSlugs.includes(q.materiSlug)
  );

  // Jika filter materi tidak mencukupi, fallback ke seluruh bank soal
  const poolPg = pgTersedia.length >= jumlahPg ? pgTersedia : BANK_SOAL_PG;
  const poolEssay = essayTersedia.length >= jumlahEssay ? essayTersedia : BANK_SOAL_ESSAY;

  // 2. Acak urutan soal
  let pgAcak = acakArray(poolPg);
  let essayAcak = acakArray(poolEssay);

  // Filter preferensi kesulitan jika bukan "campur"
  if (kesulitan !== "campur") {
    const pgCocok = pgAcak.filter((q) => q.kesulitan === kesulitan);
    if (pgCocok.length >= jumlahPg) pgAcak = pgCocok;

    const essayCocok = essayAcak.filter((q) => q.kesulitan === kesulitan);
    if (essayCocok.length >= jumlahEssay) essayAcak = essayCocok;
  }

  // 3. Ambil sejumlah yang diminta
  const terpilihPg = pgAcak.slice(0, jumlahPg);
  const terpilihEssay = essayAcak.slice(0, jumlahEssay);

  // 4. Transformasikan ke format SoalPg dan lakukan server-side option shuffling
  const finalPg: SoalPg[] = terpilihPg.map((item, idx) => {
    const basePg: SoalPg = {
      id: `fallback-pg-${idx + 1}-${crypto.randomUUID().slice(0, 6)}`,
      pertanyaan: item.pertanyaan,
      opsi: item.opsi,
      indeksBenar: item.indeksBenar,
      pembahasan: item.pembahasan,
      kesulitan: item.kesulitan,
      kartuRujukan: item.kartuRujukan,
      materiSlug: item.materiSlug,
    };
    return shuffleQuestionOptions(basePg);
  });

  const finalEssay: SoalEssay[] = terpilihEssay.map((item, idx) => ({
    id: `fallback-es-${idx + 1}-${crypto.randomUUID().slice(0, 6)}`,
    pertanyaan: item.pertanyaan,
    kunciJawaban: item.kunciJawaban,
    rubrik: item.rubrik,
    kesulitan: item.kesulitan,
    kartuRujukan: item.kartuRujukan,
    materiSlug: item.materiSlug,
  }));

  return {
    quizId: `quiz-fb-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
    dibuatPada: new Date().toISOString(),
    soalPg: finalPg,
    soalEssay: finalEssay,
    sumber: "cadangan",
  };
}
