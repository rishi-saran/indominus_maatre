// ===============================
// HOMAM DETAIL DATA (slug pages)
// ===============================
import { homamsGroup01 } from "./homams-group-01";
import { homamsGroup02 } from "./homams-group-02";
import { homamsGroup03 } from "./homams-group-03";
import { homamsGroup04 } from "./homams-group-04";
import { homamsGroup05 } from "./homams-group-05";
import { homamsGroup06 } from "./homams-group-06";
import { homamsGroup07 } from "./homams-group-07";
//import { homamsGroup08 } from "./homams-group-08";
//import { homamsGroup09 } from "./homams-group-09";

export const homams = {
  ...homamsGroup01,
  ...homamsGroup02,
  ...homamsGroup03,
  ...homamsGroup04,
  ...homamsGroup05,
  ...homamsGroup06,
  ...homamsGroup07,
  //...homamsGroup08,
  //...homamsGroup09,
};

// ===============================
// HOMAM LISTING DATA (cards page)
// ===============================
export const homamServices = [
  // PAGE 1
  { title: "Aavahanthi Homam", image: "/services/homam/aavanthii-homam.png", href: "/services/homam/aavahanthi-homam" },
  { title: "Aavani Avittam", image: "/services/homam/aavani-avittam.png", href: "/services/homam/aavani-avittam" },
  { title: "Abdha Poorthi Ayush Homam", image: "/services/homam/abdha poorthi-ayush-homam.png", href: "/services/homam/abdha-poorthi-ayush-homam" },
  { title: "Ayusha Homam (Ayushya Homam)", image: "/services/homam/ayushya-homam.png", href: "/services/homam/ayusha-homam" },
  { title: "Ayyappa Pooja", image: "/services/homam/ayyapra-pooja.png", href: "/services/homam/ayyappa-pooja" },
  { title: "Bheemaratha Shanti", image: "/services/homam/bheemerattha-shanti.png", href: "/services/homam/bheemaratha-shanti" },
  { title: "Bhoomi Puja", image: "/services/homam/bhoomi-puja.png", href: "/services/homam/bhoomi-puja" },
  { title: "Chandi Homam (Sapta Sati)", image: "/services/homam/chandi-homam-satpa.png", href: "/services/homam/chandi-homam" },
  { title: "Dhanvantari Homam", image: "/services/homam/dhanvantari-homam.png", href: "/services/homam/dhanvantari-homam" },
  { title: "Dhanvantari Homam (Alt)", image: "/services/homam/dhanvantari-homam-alt.png", href: "/services/homam/dhanvantari-homam-alt" },
  { title: "Durga Homam", image: "/services/homam/durga-homam.png", href: "/services/homam/durga-homam" },
  { title: "Durga Shanti Homam", image: "/services/homam/durga-shanti-homam.png", href: "/services/homam/durga-shanti-homam" },
  { title: "Engagement", image: "/services/homam/engagement.png", href: "/services/homam/engagement" },
  { title: "Ganapathi Homam", image: "/services/homam/ganapathi-homam.png", href: "/services/homam/ganapathi-homam" },
  { title: "Ganesh / Vinayagar Chathurthi Pooja", image: "/services/homam/ganesh-vinyagar.png", href: "/services/homam/ganesh-vinyagar-chathurthi-pooja" },
  { title: "Haridra Ganapathy Homam", image: "/services/homam/harini-ganapathy-homam.png", href: "/services/homam/haridra-ganapathy-homam" },
  { title: "Hiranya Srardham", image: "/services/homam/hiranya-shraadh.png", href: "/services/homam/hiranya-srardham" },
  { title: "Housewarming / Grihapravesham", image: "/services/homam/housewarming.png", href: "/services/homam/housewarming" },
  { title: "Jathakarma", image: "/services/homam/jathakarma.png", href: "/services/homam/jathakarma" },
  { title: "Kanakabhishekam", image: "/services/homam/kanakabishekam.png", href: "/services/homam/kanakabishekam" },

  // PAGE 2
  { title: "Lakshmi Kubera Homam", image: "/services/homam/lakshmi-kubera-homam.png", href: "/services/homam/lakshmi-kubera-homam" },
  { title: "Maha Mrutyunjaya Homam", image: "/services/homam/maha-mrutyunjaya.png", href: "/services/homam/maha-mrutynjaya-homam" },
  { title: "Mahalakshmi Homam", image: "/services/homam/mahalakshmi.png", href: "/services/homam/mahalakshmi-homam" },
  { title: "Mahalakshmi Puja", image: "/services/homam/mahalakshmi-puja.png", href: "/services/homam/mahalakshmi-puja" },
  { title: "Marriage (Vivaham)", image: "/services/homam/marriage.png", href: "/services/homam/marriage-vivaham" },
  { title: "Mrutyunjaya Homam", image: "/services/homam/mrutyunjaya-homam.png", href: "/services/homam/mrutyunjaya-homam" },
  { title: "Navagraha Homam", image: "/services/homam/navagraha-homam.png", href: "/services/homam/navagraha-homam" },
  { title: "Nichayathartham (Engagement)", image: "/services/homam/nichayathartham.png", href: "/services/homam/nichayathartham" },
  { title: "Pratyangira Badrakali Homam", image: "/services/homam/pratyangira.png", href: "/services/homam/pratyangira-badrakali" },
  { title: "Punyaha Vachanam", image: "/services/homam/punyaha-vachanam.png", href: "/services/homam/punyaha-vachanam" },
  { title: "Rudra Ekadashi Homam", image: "/services/homam/rudra.png", href: "/services/homam/rudra-ekadashi" },
  { title: "Rudrabhishekam", image: "/services/homam/rudrabhishekam.png", href: "/services/homam/rudrabhishekam" },
  { title: "Sadakshari Durga Gayatri Homam", image: "/services/homam/sadakshari.png", href: "/services/homam/sadakshari-durga-gayatri" },
  { title: "Saraswathi Poojai", image: "/services/homam/saraswathi.png", href: "/services/homam/saraswathi-poojai" },
  { title: "Sathabhishekam", image: "/services/homam/sathabhishekam.png", href: "/services/homam/sathabhishekam" },
  { title: "Sathyanarayana Puja", image: "/services/homam/satyanarayana.png", href: "/services/homam/sathyanarayana-puja" },
  { title: "Seemantham", image: "/services/homam/seemantham.png", href: "/services/homam/seemantham" },
  { title: "Shashtyabdapoorthi", image: "/services/homam/shashtyabdapoorthi.png", href: "/services/homam/shashtyabdapoorthiy" },
  { title: "Shatru Samhara Homam", image: "/services/homam/shatru-samhara.png", href: "/services/homam/shatru-samhara-homam" },
  { title: "Sidhi Vinayaga Puja", image: "/services/homam/sidhi-vinayaga.png", href: "/services/homam/sidhi-vinayaga-puja" },
  { title: "Srardham", image: "/services/homam/srardham.png", href: "/services/homam/srardham" },
  { title: "Maha Sudarshana Homam", image: "/services/homam/sudarshana.png", href: "/services/homam/sudarshana-homam" },
  { title: "Swayamvara Parvathi Homam", image: "/services/homam/swayamvara.png", href: "/services/homam/swayamvara-parvathi" },
  { title: "Ugraratha Shanti", image: "/services/homam/ugraratha.png", href: "/services/homam/ugraratha-shanti" },

  // PAGE 3
  { title: "Upanayanam", image: "/services/homam/upanayanam.png", href: "/services/homam/upanayanam" },
  { title: "Vancha Kalpalatha Maha Ganapathi Homam", image: "/services/homam/vancha.png", href: "/services/homam/vancha-kalpalatha-ganapathi" },
  { title: "Vastu Shanthi", image: "/services/homam/vastu-shanthi.png", href: "/services/homam/vastu-shanthi" },
  { title: "Vijayaratha Shanti", image: "/services/homam/vijayaratha.png", href: "/services/homam/vijayaratha-shanti" },
];
