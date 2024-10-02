import food_1 from "./food_1.svg";
import food_2 from "./food_2.svg";
import food_3 from "./food_3.svg";
import food_4 from "./food_4.svg";
import Makhana from "./Makhana.jpg";
import CreamMakhana from "./Creammakhana.jpg"
const choco = "https://raw.githubusercontent.com/sanjvj/Annapoorna_images/main/chocobounty.png"
const kaju = "https://raw.githubusercontent.com/sanjvj/Annapoorna_images/main/kajukatli.png"
const almond = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/Almond crunch/1.png"
const blueberry = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/blueberry/9.png"
const cashew = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/cashew crunch/2.png"
const omapodi = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/omapodi mixture/6.png"
const navaratna = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/navaratna/10.png"
const kajupineapple = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/kaju pineapple/12.png"
const kajumango = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/kaju mango roll/11.png"
const datesroll = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/dates roll/8.png"
const wheatpop = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/wheat pop/5.png"
const pistacrunch = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/pista crunch/3.png"
const kiwi = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/kiwi delight/7.png"
const strawberry = "https://raw.githubusercontent.com/Warlord09/annapoorna-images/main/strawberry delight/4.png"
const fruitpack = "https://raw.githubusercontent.com/sanjvj/Annapoorna_images/main/fruitpack.png"

import star from "./star 3.svg";

export const assets = {};

export const slides = [
  {
    url: "",
  },
  {
    url: "",
  },
  { 
    url: "",
  },
  {
    url: "",
  },
];

export const review = [
  {
    _id: "1",
    content:
      "I recently visited Annapoorna Mithai and was very impressed with the variety of sweets and snacks they had to offer. The staff was also very friendly and helpful. I would definitely recommend this shop to anyone looking for a sweet treat.",
    name: "Abhi Jani",
    stars: star,
  },
  {
    _id: "2",
    content:
      "I bought a few sweets from here and let me tell you all were amazing and the quality was awesome too I will definitely recommend this place to you guys Food: 5/5  |  Service: 5/5  |  Atmosphere: 5/5",
    name: "Amanda Wilson",
    stars: star,
  },
  {
    _id: "3",
    content: "Wow... What a place..for sweets.. must visit in Madurai",
    name: "Meena Anilkumar",
    stars: star,
  },
  {
    _id: "4",
    content:
      "This is a very good mithai shop or sweet stall and also a restaurant which sells different fast food. Among the sweets I like the typical south Indian ladu, jelebi and mysure pak.",
    name: "Lajo",
    stars: star,
  },
  {
    _id: "5",
    content:
      "Very fast processing and friendly staff. Very much satisfied by the process which is on the spot payment.",
    name: "Bhavya Sri",
    stars: star,
  },
];

export const food_list = [
  {
    _id: "1",
    name: "Kaju katli",
    image:
      [kaju],
    weights: [
      { weight: "250G", price: 310, mrp: 326 },
      { weight: "500G", price: 620, mrp: 651 },
      { weight: "1 KG", price: 1240, mrp: 1302 },
    ],
    offer: 1500,
    description:
      "Crispy Cashew nuts soaked then grinded into fine dough and elegantly served with silver leaf.",
    category: "Sweets",
    life: "2 Months",
  },
  {
    _id: "2",
    name: "Choco Bounty",
    image:[choco],
    weights: [
      { weight: "500G", price: 348, mrp: 365 },
      { weight: "1 KG", price: 695, mrp: 730 },
    ],
    offer: 25,
    description:
      "Desiccated coconut with the condensed milk wrapped with Fresh Chocolate. ",
    ingredient: "Fresh Coconut, Chocolate, Kova from Milk, Sugar",
    category: "Sweets",
    life: "10 Days",
  },
  {
    _id: "3",
    name: "Royal Fruits and Nuts",
    image:
      [fruitpack,kajupineapple,kajumango,strawberry,blueberry,datesroll],
    weights: [
      { weight: "500G", price: 715, mrp: 750 },
      { weight: "1 KG", price: 1429, mrp: 1500 },
    ],
    offer: 1500,
    description:
      "Kaju Pineapple, Kaju Kiwi, Kaju strawberry, Kaju Mango, Kaju Blueberry, Anjeer Roll, Kaju Dates Roll",
    category: "Sweets",
    life: "5 Days",
  },
  {
    _id: "4",
    name: "Crunchy Pack",
    image: [almond,pistacrunch,cashew],
    weights: [
      { weight: "500G", price: 715, mrp: 750 },
      { weight: "1 KG", price: 1429, mrp: 1500 },
    ],
    offer: 1500,
    description: "Almond Crunch, Pista Crunch and Cashew Crunch",
    category: "Sweets",
    life: "5 Days",
  },

  {
    _id: "5",
    name: "Elite Gift Pack",
    image: [food_2],
    weights: [
      { weight: "500G", price: 430, mrp: 1240 },
      { weight: "1 KG", price: 810, mrp: 1240 },
    ],
    offer: 1500,
    description:
      "Mixed & Ghee sweets such as Ghee mysore pak, kesar peda, white peda, motichoor laddu, doda burfee, gujiya, milk cake, soan papdi and milk burfee will be packed as per the availability of the items at the store currently. Note: the mentioned items are not guaranteed.",
    category: "Sweets",
    life: "5 Days",
  },
  {
    _id: "6",
    name: "Real Fruit Sweets",
    image: [food_3],
    weights: [
      { weight: "250G", price: 357, mrp: 375 },
      { weight: "500G", price: 715, mrp: 750 },
      { weight: "1 KG", price: 1429, mrp: 1500 },
    ],
    offer: 1500,
    description:
      "Fresh Sabudhana comes Roasted peanuts, Sev, and Mixture. Made with Air Fryer Technology",
    category: "Savouries",
    life: "5 Days",
  },
  {
    _id: "7",
    name: "Kambu Pori",
    image: [food_4],
    weights: [
      { weight: "100G", price: 53, mrp: 80 },
      { weight: "250G", price: 133, mrp: 200 },
    ],
    offer: 1500,
    description:
      "Quinoa is a great source of fiber. Fiber can prevent or treat constipation and may lower your risk of intestinal cancers. It also helps you feel full longer, so it may help with weight loss. The fiber in quinoa can also help with cholesterol and blood sugar levels, lowering your risk of diabetes and heart disease. Quinoa is rich in antioxidants, which can prevent damage to your heart and other organs.",
    category: "Savouries",
    life: "3 Months",
  },
  {
    _id: "8",
    name: "Seemai Thinnai Mixture",
    image: [food_1],
    weights: [
      { weight: "100G", price: 53, mrp: 80 },
      { weight: "250G", price: 133, mrp: 200 },
    ],
    offer: 1500,
    description:
      "Food provides essential nutrients for overall health and well-being",
    category: "Savouries",
    life: "3 Months",
  },
  {
    _id: "9",
    name: "Potato Chips",
    image: [food_2],
    weights: [{ weight: "100G", price: 60, mrp: 90 }],
    offer: 1500,
    description:
      "Potato wafers, also known as potato chips or crisps, are thin slices of potatoes that are deep-fried until they become crispy and golden brown. They are a popular snack enjoyed by people all over the world. Potato wafers are loved for their crunchy texture, savory flavor, and versatility. They can be enjoyed on their own as a snack or used as a topping for sandwiches, burgers, or salads.",
    category: "Savouries",
    life: "1 Month",
  },
  {
    _id: "10",
    name: "Oma podi",
    image: [omapodi],
    weights: [
      { weight: "100G", price: 53, mrp: 80 },
      { weight: "250G", price: 133, mrp: 200 },
    ],
    offer: 1500,
    description:
      "Omapodi is a delicious and crispy South Indian snack of sev laced with the aroma and flavor of ajwain or carom seeds.",
    category: "Savouries",
    life: "2 Months",
  },
  {
    _id: "11",
    name: "Wheat pop",
    image: [wheatpop],
    weights: [{ weight: "100G", price: 62, mrp: 95 }],
    offer: 1500,
    description:
      "Fresh Whole Wheat made into puff with Air Fryer Cooking Technology - One of the Best low calorie Snack.",
    category: "Savouries",
    life: "2 Months",
  },
  {
    _id: "12",
    name: "Kavuni Arisi Halwa",
    image: [food_4],
    weights: [{ weight: "100G", price: 70, mrp: 100 }],
    offer: 1500,
    description:
      "Fresh Whole Wheat made into puff with Air Fryer Cooking Technology - One of the Best low calorie Snack.",
    category: "Savouries",
    life: "2 Months",
  },
  {
    _id: "13",
    name: "Dry Fruit Sweets",
    image: [kiwi,strawberry],
    weights: [
      { weight: "250G", price: 357, mrp: 375 },
      { weight: "500G", price: 715, mrp: 750 },
      { weight: "1 KG", price: 1429, mrp: 1500 },
    ],
    offer: 1500,
    description: " Dry Fruits such like Kiwi, Strawberry ",
    category: "Sweets",
    life: "2 Months",
  },
  {
    _id: "14",
    name: "Cheese Makhanas",
    image: [Makhana],
    weights: [{ weight: "80G", price: 170, mrp: 240 }],
    offer: 1500,
    description:
      "Popped water lily (Lotus) seeds roasted with whole whear flour, Citric Acid, Cheddar cheese & Salt",
    category: "Savouries",
    life: "4 Months",
  },
  {
    _id: "15",
    name: "Cream Onion Makhana",
    image: [CreamMakhana],
    weights: [{ weight: "80G", price: 170, mrp: 240 }],
    offer: 1500,
    description:
      "Popped water lily (Lotus) seeds roasted with whole whear flour, Citric Acid, Cheddar cheese & Salt",
    category: "Savouries",
    life: "4 Months",
  },
  {
    _id: "16",
    name: "Breakfast Mixture",
    image: [food_1],
    weights: [{ weight: "250G", price: 275, mrp: 400 }],
    offer: 1500,
    description:
      "A combo of Oats, Honey, Pumpkin Seeds, Amonds, Wheat Flakes, Corn Flakes, Cranberry, Black Currant.",
    life: "2 Months",
  },
  {
    _id: "17",
    name: "Choco Dip Badam",
    image: [almond],
    weights: [{ weight: "150G", price: 225, mrp: 300 }],
    offer: 1500,
    description:
      " Roasted Almond Coated with Chocolate.",
    life: "2 Months",
  },
  {
    _id: "18",
    name: "Karupati Kadalai Mithai",
    image: [Makhana],
    weights: [{ weight: "200G", price: 125, mrp: 190 }],
    offer: 1500,
    description:
      "A combo of Oats, Honey, Pumpkin Seeds, Amonds, Wheat Flakes, Corn Flakes, Cranberry, Black Currant.",
    life: "2 Months",
  },
];

// const story = [
//   {
//     _id: "1",
//     video: "video1",
//   },
// ];
