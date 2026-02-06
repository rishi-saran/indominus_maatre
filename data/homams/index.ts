// ===============================
// HOMAM DETAIL DATA (slug pages)
// ===============================
import { image } from "motion/react-m";
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
  { title: "Aavahanthi Homam", image: "/services/virtual/Aavahanthi Homom.png", href: "/services/homam/aavahanthi-homam" },
  { title: "Aavani Avittam",image: "/services/virtual/Aavani Avittam.png", href: "/services/homam/aavani-avittam" },
  { title: "Abdha Poorthi Ayush Homam", image: "/services/homam/Abdha Poorthi Ayush Homam.png", href: "/services/homam/abdha-poorthi-ayush-homam" },
  { title: "Ayusha Homam (Ayushya Homam)", image: "/services/chanting/ayusha-homam.png", href: "/services/homam/ayusha-homam" },
  { title: "Ayyappa Pooja", image: "/services/virtual/AYYAPPA POOJA.jpeg", href: "/services/homam/ayyappa-pooja" },
  { title: "Bheemaratha Shanti", image: "/services/homam/Bheemaratha Shanti.png", href: "/services/homam/bheemaratha-shanti" },
  { title: "Bhoomi Puja", image: "/services/homam/Bhoomi Puja.png", href: "/services/homam/bhoomi-puja" },
  { title: "Chandi Homam (Sapta Sati)", image: "/services/virtual/Chandi Homam (Sapta Sati).jpeg", href: "/services/homam/chandi-homam" },
  { title: "Dhanvantari Homam",image: "/services/homam/Dhanvantari Homam .png", href: "/services/homam/dhanvantari-homam" },
  { title: "Dhanvantari Homam (Alt)", image: "/services/homam/Dhanvantari Homam (Alt).png", href: "/services/homam/dhanvantari-homam-alt" },
  { title: "Durga Homam", image: "/services/homam/durga homam.png",href: "/services/homam/durga-homam" },
  { title: "Durga Shanti Homam", image: "/services/homam/durga shanti homam.png",href: "/services/homam/durga-shanti-homam" },
  { title: "Engagement", image: "/services/homam/engagement.png", href: "/services/homam/engagement" },
  { title: "Ganapathi Homam", image: "/services/homam/Ganapathi Homam.png", href: "/services/homam/ganapathi-homam" },
  { title: "Ganesh / Vinayagar Chathurthi Pooja Package", image: "/services/homam/ganesh vinayagar chathurthi pooja package.png", href: "/services/homam/ganesh-vinyagar-chathurthi-pooja" },
  { title: "Haridra Ganapathy Homam", image: "/services/homam/haridra ganapathy homam.png", href: "/services/homam/haridra-ganapathy-homam" },
  { title: "Hiranya Srardham", image: "/services/homam/Hiranya Srardham.png",href: "/services/homam/hiranya-srardham" },
  { title: "Housewarming / Grihapravesham", image: "/services/homam/housewarming.png", href: "/services/homam/housewarming" },
  { title: "Jathakarma", image: "/services/homam/jathakarma.png", href: "/services/homam/jathakarma" },
  { title: "Kanakabhishekam", image: "/services/homam/Kanakabhishekam.png", href: "/services/homam/kanakabishekam" },

  // PAGE 2
  { title: "Lakshmi Kubera Homam", image: "/services/virtual/Lakshmi Kubera Homam.jpeg", href: "/services/homam/lakshmi-kubera-homam" },
  { title: "Maha Mrutyunjaya Homam", image: "/services/virtual/Maha Mrutyunjaya Homam.jpeg",href: "/services/homam/maha-mrutynjaya-homam" },
  { title: "Mahalakshmi Homam", image: "/services/virtual/MAHALAKSHMI HOMAM.jpeg", href: "/services/homam/mahalakshmi-homam" },
  { title: "Mahalakshmi Puja", image: "/services/virtual/MAHALAKSHMI PUJA.jpeg", href: "/services/homam/mahalakshmi-puja" },
  { title: "Marriage (Vivaham)", image: "/services/homam/marriage.png", href: "/services/homam/marriage-vivaham" },
  { title: "Mrutyunjaya Homam", image: "/services/virtual/Mrutyunjaya Homam.jpeg", href: "/services/homam/mrutyunjaya-homam" },
  { title: "Navagraha Homam", image: "/services/virtual/Navagraha Homam.jpeg", href: "/services/homam/navagraha-homam" },
  { title: "Nichayathartham (Engagement)", image: "/services/homam/nichayathartham.png", href: "/services/homam/nichayathartham" },
  { title: "Pratyangira Badrakali Homam", image: "/services/virtual/Badrakali Homam.jpeg", href: "/services/homam/pratyangira-badrakali" },
  { title: "Punyaha Vachanam", image: "/services/homam/Punyaha Vachanam.png", href: "/services/homam/punyaha-vachanam" },
  { title: "Rudra Ekadashi Homam", image: "/services/virtual/rudra-ekadashi-homam.png", href: "/services/homam/rudra-ekadashi" },
  { title: "Rudrabhishekam", image: "/services/chanting/rudrabishegam.png", href: "/services/homam/rudrabhishekam" },
  { title: "Sadakshari Durga Gayatri Homam", image: "/services/virtual/Sadakshari Durga Gayatri Homam.jpeg", href: "/services/homam/sadakshari-durga-gayatri" },
  { title: "Saraswathi Poojai", image: "/services/virtual/SARASWATHI POOJAI.png", href: "/services/homam/saraswathi-poojai" },
  { title: "Sathabhishekam", image: "/services/homam/sathabhishekam.png", href: "/services/homam/sathabhishekam" },
  { title: "Sathyanarayana Puja", image: "/services/virtual/SATHYANARAYANA PUJA.jpeg", href: "/services/homam/sathyanarayana-puja" },
  { title: "Seemantham", image: "/services/homam/seemantham.png", href: "/services/homam/seemantham" },
  { title: "Shashtyabdapoorthi", image: "/services/homam/shashtyabdapoorthi.png", href: "/services/homam/shashtyabdapoorthiy" },
  { title: "Shatru Samhara Homam", image: "/services/virtual/Shatru Samhara Homam.jpeg", href: "/services/homam/shatru-samhara-homam" },
  { title: "Sidhi Vinayaga Puja", image: "/services/virtual/SIDHI VINAYAGA PUJA.jpeg", href: "/services/homam/sidhi-vinayaga-puja" },
  { title: "Srardham", image: "/services/homam/srardham.png", href: "/services/homam/srardham" },
  { title: "Maha Sudarshana Homam", image: "/services/virtual/Maha Sudarshana Homam.jpeg", href: "/services/homam/sudarshana-homam" },
  { title: "Swayamvara Parvathi Homam", image: "/services/virtual/Swayamvara Parvathi Homam.png", href: "/services/homam/swayamvara-parvathi" },
  { title: "Ugraratha Shanti", image: "/services/homam/Ugraratha Shanti.png", href: "/services/homam/ugraratha-shanti" },

  // PAGE 3
  { title: "Upanayanam", image: "/services/homam/upanayanam.png", href: "/services/homam/upanayanam" },
  { title: "Vancha Kalpalatha Maha Ganapathi Homam", image: "/services/virtual/Vancha Kalpalatha Maha Ganapathi Homam.png", href: "/services/homam/vancha-kalpalatha-ganapathi" },
  { title: "Vastu Shanthi", image: "/services/homam/Vastu Shanthi.png", href: "/services/homam/vastu-shanthi" },
  { title: "Vijayaratha Shanti", image: "/services/homam/Vijayaratha Shanti.png", href: "/services/homam/vijayaratha-shanti" },
];
