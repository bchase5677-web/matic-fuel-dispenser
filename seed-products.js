import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6xvtf7GRiCz0CazRTf9WNmHfWYbMDvlI",
  authDomain: "gen-lang-client-0469091192.firebaseapp.com",
  projectId: "gen-lang-client-0469091192",
  storageBucket: "gen-lang-client-0469091192.firebasestorage.app",
  messagingSenderId: "935651895215",
  appId: "1:935651895215:web:5b9bc814c7eb4a7508f15a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-200659df-3cfd-4d84-ad0b-f6dce11c6edc");

const sampleProducts = [
  {
    name: "Golden Flow Pro Dispenser",
    price: 12500,
    category: "Dispensers",
    label: "Best Seller",
    description: "High-end luxury fuel dispenser with dual nozzles and premium golden finish.",
    imageUrl: "https://images.unsplash.com/photo-1545464333-9cbd1f263054?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Matic Silver Line Single",
    price: 8500,
    category: "Dispensers",
    label: "Standard",
    description: "Reliable single nozzle dispenser with advanced metering capabilities.",
    imageUrl: "https://images.unsplash.com/photo-1600868884976-9694e9766ee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Pro-Flow Meter 5000",
    price: 1200,
    category: "Spare Parts",
    label: "Essential",
    description: "Precision fuel meter replacement for accurate delivery.",
    imageUrl: "https://images.unsplash.com/photo-1530983821817-482a033ce3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Heavy Duty Nozzle XL",
    price: 350,
    category: "Spare Parts",
    label: "New",
    description: "Durable fuel nozzle with splash guard and ergonomic grip.",
    imageUrl: "https://images.unsplash.com/photo-1621619856624-42fd193a0661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Digital Display Module",
    price: 850,
    category: "Spare Parts",
    label: "Electronics",
    description: "Replacement high-contrast LED display module for Matic dispensers.",
    imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  },
  {
    name: "Premium Steel Hose 5m",
    price: 220,
    category: "Spare Parts",
    label: "Durable",
    description: "Reinforced 5-meter fuel delivery hose, weather resistant.",
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date().toISOString()
  }
];

async function seed() {
  console.log("Seeding products...");
  for (const p of sampleProducts) {
    await addDoc(collection(db, 'products'), p);
  }
  console.log("Done!");
}

seed();
