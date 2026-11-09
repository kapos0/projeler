import type { Recipe } from "../types/recipe";

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Köz Patlıcanlı Shakshuka",
    category: "Akşam",
    time: "35 dk",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    author: "Lezizo mutfağı",
    description:
      "Közlenmiş patlıcanın isli lezzeti, domatesin tazeliği ve yumurtanın yumuşak dokusuyla tek tavada hazırlanan nefis bir sofra klasiği.",
    ingredients: [
      "2 adet patlıcan",
      "3 adet domates",
      "1 adet kapya biber",
      "2 diş sarımsak",
      "4 adet yumurta",
      "Zeytinyağı, tuz, kimyon",
    ],
    instructions:
      "Patlıcanları közleyip kabuklarını soyun ve iri iri doğrayın. Tavada zeytinyağıyla soğan, kapya biber ve sarımsağı yumuşayana kadar soteleyin. Domatesleri ve baharatları ekleyip sos koyulaşana kadar pişirin. Köz patlıcanları tavaya alıp karıştırın, ardından dört yuva açarak yumurtaları kırın. Kapağı kapatıp yumurtaların beyazları pişene kadar yaklaşık 5 dakika bekletin ve sıcak servis edin.",
    nutrition: [
      { label: "Protein", value: "18 g", percent: 42, color: "#e7a24e" },
      { label: "Karbonhidrat", value: "28 g", percent: 62, color: "#7a9b70" },
      { label: "Yağ", value: "14 g", percent: 35, color: "#c75d4d" },
    ],
  },
  {
    id: 2,
    title: "İpeksi Mercimek Çorbası",
    category: "Çorba",
    time: "25 dk",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    author: "Zeynep Kaya",
    description:
      "Soğuk günlerin en sıcak tarifi. Baharatlı, pürüzsüz ve her kaşıkta ev hissi veren mercimek çorbası.",
    ingredients: [
      "1 su bardağı kırmızı mercimek",
      "1 adet soğan",
      "1 adet havuç",
      "1 tatlı kaşığı biber salçası",
      "Kimyon ve nane",
    ],
    instructions:
      "Soğanı ve havucu tencerede zeytinyağıyla birkaç dakika kavurun. Salçayı ekleyip kokusu çıkana kadar çevirin. Yıkanmış mercimeği ve üzerini geçecek kadar sıcak suyu ilave edin. Mercimekler tamamen yumuşayana kadar yaklaşık 20 dakika pişirin. Çorbayı blenderdan geçirip kimyon ve naneyle tatlandırarak servis edin.",
    nutrition: [
      { label: "Protein", value: "12 g", percent: 50, color: "#e7a24e" },
      { label: "Karbonhidrat", value: "32 g", percent: 70, color: "#7a9b70" },
      { label: "Yağ", value: "6 g", percent: 20, color: "#c75d4d" },
    ],
  },
  {
    id: 3,
    title: "Çıtır Mantarlı Tost",
    category: "Pratik",
    time: "15 dk",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85",
    author: "Mert Yıldız",
    description:
      "Karamelize mantar, eriyen peynir ve ekşi mayalı ekmeğin buluştuğu pratik ama çok şık bir atıştırmalık.",
    ingredients: [
      "4 dilim ekşi maya ekmeği",
      "200 g kültür mantarı",
      "Kaşar peyniri",
      "Taze kekik",
      "Tereyağı",
    ],
    instructions:
      "Mantarları ince dilimleyip tereyağında yüksek ateşte suyunu salıp çekene kadar soteleyin. Taze kekik ve bir tutam tuz ekleyin. Ekmek dilimlerini tavada hafifçe kızartın. Bir dilimin üzerine mantarları ve kaşar peynirini yerleştirip diğer ekmek dilimiyle kapatın. Peynir eriyene kadar tost makinesinde veya tavada pişirin.",
    nutrition: [
      { label: "Protein", value: "20 g", percent: 55, color: "#e7a24e" },
      { label: "Karbonhidrat", value: "35 g", percent: 75, color: "#7a9b70" },
      { label: "Yağ", value: "19 g", percent: 45, color: "#c75d4d" },
    ],
  },
  {
    id: 4,
    title: "Nar Ekşili Kısır",
    category: "Vejetaryen",
    time: "20 dk",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    author: "Elif Demir",
    description:
      "Bol yeşillikli, nar ekşisinin dokunuşuyla dengelenmiş, sofranın yıldızı olmaya aday taptaze bir kısır.",
    ingredients: [
      "2 su bardağı ince bulgur",
      "Domates ve salatalık",
      "Maydanoz ve taze nane",
      "Nar ekşisi",
      "Zeytinyağı ve limon",
    ],
    instructions:
      "İnce bulguru geniş bir kaba alıp üzerine sıcak su ekleyin ve kapağını kapatıp 10 dakika dinlendirin. Bulguru çatalla havalandırın. Salça, nar ekşisi, limon ve zeytinyağını ekleyip iyice karıştırın. Küp doğranmış sebzeleri ve ince kıyılmış yeşillikleri ilave edin. Baharatları ayarlayıp 10 dakika dinlendirdikten sonra servis edin.",
    nutrition: [
      { label: "Protein", value: "8 g", percent: 30, color: "#e7a24e" },
      { label: "Karbonhidrat", value: "40 g", percent: 82, color: "#7a9b70" },
      { label: "Yağ", value: "9 g", percent: 25, color: "#c75d4d" },
    ],
  },
];
