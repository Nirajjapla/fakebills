import { AddressProfile } from '../types';

export interface CityData {
  city: string;
  state: string;
  stateCode: string;
  localities: Array<{ name: string; pincode: string; landmark?: string }>;
  roads: string[];
  fuelDealers: Array<{ name: string; brand: 'HP' | 'IOCL' | 'BPCL' | 'SHELL' }>;
  gyms: string[];
  restaurants: string[];
  pharmacies: string[];
}

export const INDIAN_CITIES_DATA: Record<string, CityData> = {
  'Bengaluru': {
    city: 'Bengaluru',
    state: 'Karnataka',
    stateCode: '29',
    localities: [
      { name: 'Indiranagar', pincode: '560038', landmark: 'Near 100ft Road Junction' },
      { name: 'Koramangala 4th Block', pincode: '560034', landmark: 'Opposite Sony World Signal' },
      { name: 'HSR Layout Sector 2', pincode: '560102', landmark: 'Near BDA Complex' },
      { name: 'Bellandur Outer Ring Road', pincode: '560103', landmark: 'Near EcoSpace Tech Park' },
      { name: 'Whitefield', pincode: '560066', landmark: 'Near ITPL Main Gate' },
      { name: 'Jayanagar 4th Block', pincode: '560011', landmark: 'Near Shopping Complex' },
      { name: 'Electronic City Phase 1', pincode: '560100', landmark: 'Near Infosys Gate 1' },
      { name: 'Malleshwaram 8th Cross', pincode: '560003', landmark: 'Near Margosa Road' }
    ],
    roads: ['100ft Road', 'CMH Road', 'Sarjapur Main Road', 'Old Airport Road', 'Hosur Main Road', 'Outer Ring Road'],
    fuelDealers: [
      { name: 'SRI VENKATESHWARA FUELS', brand: 'IOCL' },
      { name: 'SHREE BALAJI PETROLEUM', brand: 'BPCL' },
      { name: 'ETTAKODI MALUR FILLING STATION', brand: 'HP' },
      { name: 'SHELL INDIA AUTO RETAIL', brand: 'SHELL' }
    ],
    gyms: ['Gold\'s Gym Indiranagar', 'Cult.fit Koramangala', 'Anytime Fitness HSR', 'Snap Fitness Whitefield'],
    restaurants: ['The Royal Bistro & Cafe', 'Truffles Indiranagar', 'Toit Brewpub', 'CTR Shri Sagar', 'Meghana Foods'],
    pharmacies: ['Apollo 24/7 Pharmacy HSR', 'MedPlus Bellandur', 'Fortis Health World', 'Wellness Forever']
  },
  'Mumbai': {
    city: 'Mumbai',
    state: 'Maharashtra',
    stateCode: '27',
    localities: [
      { name: 'Bandra West', pincode: '400050', landmark: 'Near Mehboob Studio, Hill Road' },
      { name: 'Andheri East', pincode: '400069', landmark: 'Near MIDC Central Road' },
      { name: 'Powai Hiranandani', pincode: '400076', landmark: 'Opposite Galleria Shopping Mall' },
      { name: 'Malad West', pincode: '400064', landmark: 'Near Inorbit Mall, Link Road' },
      { name: 'Nariman Point', pincode: '400021', landmark: 'Near Maker Chambers IV' },
      { name: 'Juhu Scheme', pincode: '400049', landmark: 'Near J.W. Marriott Circle' },
      { name: 'Worli Sea Face', pincode: '400018', landmark: 'Opposite Worli Dairy' },
      { name: 'Malwani Malad', pincode: '400095', landmark: 'Gate No 5, Old Collector Compound' }
    ],
    roads: ['Linking Road', 'S.V. Road', 'Western Express Highway', 'L.B.S. Marg', 'Veera Desai Road', 'Turner Road'],
    fuelDealers: [
      { name: 'BANDRA AUTO SERVICES', brand: 'HP' },
      { name: 'POWAI HIGHWAY FILLING STN', brand: 'BPCL' },
      { name: 'MAHALAXMI MOTORS FUEL', brand: 'IOCL' },
      { name: 'SHELL BKC RETAIL HUB', brand: 'SHELL' }
    ],
    gyms: ['Gold\'s Gym Bandra', 'Cult.fit Andheri West', 'Nitro Fitness Worli', 'Body Sculpt Juhu'],
    restaurants: ['Bastian Bandra', 'The Bombay Canteen Lower Parel', 'Pizza By The Bay', 'Cafe Mondegar', 'Britannia & Co.'],
    pharmacies: ['Wellness Forever Bandra', 'Apollo Pharmacy Andheri East', 'Noble Plus Chemist Juhu', 'Relief Medico']
  },
  'Delhi NCR': {
    city: 'New Delhi',
    state: 'Delhi',
    stateCode: '07',
    localities: [
      { name: 'Connaught Place', pincode: '110001', landmark: 'Inner Circle, Block C' },
      { name: 'Hauz Khas Enclave', pincode: '110016', landmark: 'Near Hauz Khas Metro Gate 2' },
      { name: 'Cyber City Gurugram', pincode: '122002', landmark: 'DLF Building 10, Sector 24' },
      { name: 'Sector 62 Noida', pincode: '201301', landmark: 'Near Electronic City Metro' },
      { name: 'South Extension Part 2', pincode: '110049', landmark: 'Main Market Block E' },
      { name: 'Saket District Centre', pincode: '110017', landmark: 'Near Select Citywalk Mall' },
      { name: 'Karol Bagh', pincode: '110005', landmark: 'Pusa Road, Near Metro Pillar 92' }
    ],
    roads: ['Ring Road', 'Barakhamba Road', 'Golf Course Road Gurugram', 'MG Road', 'Mathura Road', 'NH 48'],
    fuelDealers: [
      { name: 'CONNAUGHT SERVICE STATION', brand: 'IOCL' },
      { name: 'CYBER CITY AUTO CARE', brand: 'HP' },
      { name: 'DELHI ROAD HIGHWAY FUEL', brand: 'BPCL' },
      { name: 'SHELL GOLF COURSE ROAD', brand: 'SHELL' }
    ],
    gyms: ['Gold\'s Gym Dayanand Vihar', 'Cult.fit Saket', 'Anytime Fitness South Ex', 'Club Soul Gurugram'],
    restaurants: ['Karim\'s Jama Masjid', 'Bukhara ITC Maurya', 'Diggin Chanakyapuri', 'Farzi Cafe Cyber Hub', 'Social Hauz Khas'],
    pharmacies: ['Apollo Pharmacy Connaught Place', 'Guardian Pharmacy South Ex', 'MedPlus Saket', 'Dawaa Dost']
  },
  'Hyderabad': {
    city: 'Hyderabad',
    state: 'Telangana',
    stateCode: '36',
    localities: [
      { name: 'Hitec City', pincode: '500081', landmark: 'Near Mindspace IT Park Gate 2' },
      { name: 'Madhapur', pincode: '500086', landmark: 'Near Ayyappa Society 100ft Rd' },
      { name: 'Jubilee Hills Road No 36', pincode: '500033', landmark: 'Near Peddamma Temple Metro' },
      { name: 'Banjara Hills Road No 12', pincode: '500034', landmark: 'Near MLA Colony' },
      { name: 'Gachibowli', pincode: '500032', landmark: 'Near Financial District Junction' },
      { name: 'Vanasthalipuram Phase 1', pincode: '500070', landmark: 'Near Sai Baba Temple, Vijayapuri' },
      { name: 'Secunderabad MG Road', pincode: '500003', landmark: 'Near Clock Tower' }
    ],
    roads: ['Gachibowli-Miyapur Road', 'Outer Ring Road', 'Road No 36 Jubilee Hills', 'Raj Bhavan Road', 'PVNR Expressway'],
    fuelDealers: [
      { name: 'CYBERABAD FUEL STATION', brand: 'HP' },
      { name: 'JUBILEE HILLS FILLING CENTRE', brand: 'BPCL' },
      { name: 'HYDERABAD METRO PETROLEUM', brand: 'IOCL' },
      { name: 'SHELL GACHIBOWLI AUTO', brand: 'SHELL' }
    ],
    gyms: ['Cult.fit Jubilee Hills', 'Gold\'s Gym Banjara Hills', 'F45 Gachibowli', 'Kollab Fitness Hitec City'],
    restaurants: ['Paradise Biryani Secunderabad', 'Chutneys Banjara Hills', 'Concu Bakery Jubilee Hills', 'Bawarchi RTC X Roads', 'Roastery Coffee House'],
    pharmacies: ['Apollo Pharmacy Hitec City', 'MedPlus Jubilee Hills', 'Hetero Pharmacy Madhapur', 'HealthPlus Pharmacy']
  },
  'Chennai': {
    city: 'Chennai',
    state: 'Tamil Nadu',
    stateCode: '33',
    localities: [
      { name: 'T Nagar', pincode: '600017', landmark: 'Near Panagal Park, Usman Road' },
      { name: 'Adyar', pincode: '600020', landmark: 'Near Adyar Bridge & Malar Hospital' },
      { name: 'Anna Nagar West', pincode: '600040', landmark: 'Near Anna Nagar Roundtana' },
      { name: 'OMR Thoraipakkam', pincode: '600097', landmark: 'Near Chandrasekhar Avenue' },
      { name: 'Velachery Main Road', pincode: '600042', landmark: 'Near Phoenix Market City' },
      { name: 'Alwarpet', pincode: '600018', landmark: 'Near TTK Road Junction' }
    ],
    roads: ['Mount Road / Anna Salai', 'Rajiv Gandhi OMR Expressway', 'Poonamallee High Road', 'Cathedral Road', 'ECR Road'],
    fuelDealers: [
      { name: 'CHENNAI CORPN PETROL PUMP', brand: 'IOCL' },
      { name: 'ADYAR AUTO ENTERPRISES', brand: 'HP' },
      { name: 'OMR HIGHWAY FILLING STN', brand: 'BPCL' },
      { name: 'SHELL SHOLINGANALLUR', brand: 'SHELL' }
    ],
    gyms: ['Slam Fitness Anna Nagar', 'Gold\'s Gym Alwarpet', 'Cult.fit T Nagar', 'Chisel Fitness Adyar'],
    restaurants: ['Saravana Bhavan T Nagar', 'Murugan Idli Shop', 'Annalakshmi Restaurant', 'Sandy\'s Chocolate Laboratory', 'Amethyst Cafe'],
    pharmacies: ['Apollo Pharmacy Adyar', 'MedPlus Anna Nagar', 'Sundar Pharmacy T Nagar', 'Wellness Forever OMR']
  },
  'Kolkata': {
    city: 'Kolkata',
    state: 'West Bengal',
    stateCode: '19',
    localities: [
      { name: 'Salt Lake Sector V', pincode: '700091', landmark: 'Near Godrej Waterside & Electronics Complex' },
      { name: 'Park Street', pincode: '700016', landmark: 'Near Camac Street Crossing' },
      { name: 'New Town Action Area 1', pincode: '700156', landmark: 'Near Eco Park Gate 2' },
      { name: 'Ballygunge', pincode: '700019', landmark: 'Near Gariahat Flyover' },
      { name: 'Alipore', pincode: '700027', landmark: 'Near National Library' },
      { name: 'Siliguri Darjeeling Road', pincode: '734006', landmark: 'East Vivekananda Pally, Rabindra Nagar' }
    ],
    roads: ['EM Bypass', 'VIP Road', 'Rashbehari Avenue', 'Strand Road', 'Chowringhee Road', 'Major Arterial Road New Town'],
    fuelDealers: [
      { name: 'SALT LAKE PETROLEUM CO', brand: 'IOCL' },
      { name: 'PARK CIRCUS FILLING STN', brand: 'HP' },
      { name: 'KOLKATA EXPRESS FUEL HUB', brand: 'BPCL' },
      { name: 'SHELL NEW TOWN BYPASS', brand: 'SHELL' }
    ],
    gyms: ['Gold\'s Gym Salt Lake', 'Rave Fitness Park Street', 'Cult.fit Ballygunge', 'Karma Fitness New Town'],
    restaurants: ['Peter Cat Park Street', 'Mocambo Restaurant', 'Flurys Tea Room', 'Arsalan Restaurant Park Circus', '6 Ballygunge Place'],
    pharmacies: ['Apollo Pharmacy Sector V', 'Frank Ross Pharmacy Park Street', 'MedPlus Salt Lake', 'Dhanwantary Chemist']
  },
  'Pune': {
    city: 'Pune',
    state: 'Maharashtra',
    stateCode: '27',
    localities: [
      { name: 'Koregaon Park', pincode: '411001', landmark: 'Near North Main Road Lane 7' },
      { name: 'Baner Main Road', pincode: '411045', landmark: 'Near Balewadi High Street' },
      { name: 'Hinjawadi Phase 1', pincode: '411057', landmark: 'Near Rajiv Gandhi Infotech Park' },
      { name: 'Viman Nagar', pincode: '411014', landmark: 'Near Phoenix Marketcity' },
      { name: 'Kothrud', pincode: '411038', landmark: 'Near Karve Statue, Paud Road' },
      { name: 'Aundh', pincode: '411007', landmark: 'Near Parihar Chowk' }
    ],
    roads: ['Senapati Bapat Road', 'FC Road', 'JM Road', 'Pune-Bangalore Highway', 'Nagar Road'],
    fuelDealers: [
      { name: 'PUNYACHA AUTO FUEL', brand: 'BPCL' },
      { name: 'HINJAWADI TECH PETROLEUM', brand: 'HP' },
      { name: 'KOREGAON PARK SERVICE STN', brand: 'IOCL' },
      { name: 'SHELL BANER HIGH STREET', brand: 'SHELL' }
    ],
    gyms: ['Gold\'s Gym Kalyani Nagar', 'Cult.fit Baner', 'Multifit Koregaon Park', 'First Fitt Hinjawadi'],
    restaurants: ['German Bakery Koregaon Park', 'Vaishali Restaurant FC Road', 'Goodluck Cafe FC Road', 'Malaka Spice', 'George Restaurant'],
    pharmacies: ['Wellness Forever Baner', 'Apollo Pharmacy Viman Nagar', 'MedPlus Kothrud', 'Noble Chemist']
  },
  'Jaipur': {
    city: 'Jaipur',
    state: 'Rajasthan',
    stateCode: '08',
    localities: [
      { name: 'C-Scheme', pincode: '302001', landmark: 'Near Statue Circle, Ashok Nagar' },
      { name: 'Malviya Nagar', pincode: '302017', landmark: 'Near Gaurav Tower GT Mall' },
      { name: 'Vaishali Nagar', pincode: '302021', landmark: 'Near Amrapali Circle' },
      { name: 'Mansarovar Sector 5', pincode: '302020', landmark: 'Near Metro Pillar 14' },
      { name: 'Raja Park', pincode: '302004', landmark: 'Near LBS College Road' }
    ],
    roads: ['Tonk Road', 'MI Road', 'JLNS Marg', 'Ajmer Road', 'Queens Road'],
    fuelDealers: [
      { name: 'RAJASTHAN AUTO SERVICE PUMP', brand: 'IOCL' },
      { name: 'PINK CITY PETROL & GAS', brand: 'HP' },
      { name: 'JAIPUR HIGHWAY FILLING STN', brand: 'BPCL' }
    ],
    gyms: ['Gold\'s Gym Malviya Nagar', 'Cult.fit C-Scheme', 'FitPulse Vaishali Nagar'],
    restaurants: ['LMB Laxmi Mishthan Bhandar', 'Rawat Mishthan Bhandar', 'Tapri Central C-Scheme', 'Handi Restaurant MI Road'],
    pharmacies: ['Apollo Pharmacy Tonk Road', 'MedPlus Malviya Nagar', 'Dawaa Dost Raja Park']
  },
  'Ahmedabad': {
    city: 'Ahmedabad',
    state: 'Gujarat',
    stateCode: '24',
    localities: [
      { name: 'Bodakdev', pincode: '380054', landmark: 'Near Sindhu Bhavan Road' },
      { name: 'Navrangpura', pincode: '380009', landmark: 'Near CG Road & Law Garden' },
      { name: 'Prahlad Nagar', pincode: '380015', landmark: 'Near Prahlad Nagar Garden' },
      { name: 'Vastrapur', pincode: '380015', landmark: 'Near Vastrapur Lake & Alpha One Mall' },
      { name: 'Satellite Road', pincode: '380015', landmark: 'Near Shivranjani Cross Roads' }
    ],
    roads: ['SG Highway', 'CG Road', 'Sindhu Bhavan Marg', 'Drive In Road', 'Ashram Road'],
    fuelDealers: [
      { name: 'GUJARAT MOTORS PETROLEUM', brand: 'IOCL' },
      { name: 'AHMEDABAD CITY AUTO FUEL', brand: 'BPCL' },
      { name: 'SINDHU BHAVAN FILLING STN', brand: 'HP' },
      { name: 'SHELL SG HIGHWAY RETAIL', brand: 'SHELL' }
    ],
    gyms: ['Gold\'s Gym Bodakdev', 'Cult.fit Sindhu Bhavan', 'Anytime Fitness Prahlad Nagar'],
    restaurants: ['Agashiye House of MG', 'Gordhan Thal SG Highway', 'Manek Chowk Night Food Stalls', 'Mocha Cafe Gulbai Tekra'],
    pharmacies: ['Apollo Pharmacy Satellite', 'MedPlus Navrangpura', 'Planet Health CG Road']
  },
  'Lucknow': {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    stateCode: '09',
    localities: [
      { name: 'Hazratganj', pincode: '226001', landmark: 'Near Halwasiya Market & Janpath' },
      { name: 'Gomti Nagar', pincode: '226010', landmark: 'Near Patrakar Puram & Riverside Mall' },
      { name: 'Aliganj Sector B', pincode: '226024', landmark: 'Near Kapoorthala Crossing' },
      { name: 'Indira Nagar Block A', pincode: '226016', landmark: 'Near Munshipulia Metro' }
    ],
    roads: ['MG Marg', 'Faizabad Road', 'Amar Shaheed Path', 'Vidhan Sabha Marg'],
    fuelDealers: [
      { name: 'AWADH FILLING STATION', brand: 'HP' },
      { name: 'GOMTI NAGAR SERVICE PUMP', brand: 'IOCL' },
      { name: 'LUCKNOW HIGHWAY PETROLEUM', brand: 'BPCL' }
    ],
    gyms: ['Gold\'s Gym Gomti Nagar', 'Cult.fit Hazratganj', 'Anytime Fitness Aliganj'],
    restaurants: ['Tunday Kababi Aminabad', 'Dastarkhwan Hazratganj', 'Royal Cafe Hazratganj', 'Idrees Biryani Chowk'],
    pharmacies: ['Apollo Pharmacy Gomti Nagar', 'Frank Ross Chemist Hazratganj', 'MedPlus Aliganj']
  },
  'Chandigarh': {
    city: 'Chandigarh',
    state: 'Chandigarh',
    stateCode: '04',
    localities: [
      { name: 'Sector 17 Plaza', pincode: '160017', landmark: 'Near Central Bank Building' },
      { name: 'Sector 35-B', pincode: '160035', landmark: 'Near Aroma Hotel Chowk' },
      { name: 'Sector 26 Timber Market', pincode: '160019', landmark: 'Near Madhya Marg' },
      { name: 'IT Park Phase 1', pincode: '160101', landmark: 'Near DT Mall & DLF Tower' }
    ],
    roads: ['Madhya Marg', 'Dakshin Marg', 'Himalaya Marg', 'Jan Marg', 'Vidyapath'],
    fuelDealers: [
      { name: 'CHANDIGARH AUTO SERVICES', brand: 'IOCL' },
      { name: 'SECTOR 35 FUEL MART', brand: 'HP' },
      { name: 'MADHYA MARG PETROL CENTRE', brand: 'BPCL' }
    ],
    gyms: ['Gold\'s Gym Sector 26', 'Cult.fit Sector 35', 'Bodyzone Sector 9'],
    restaurants: ['Pal Dhaba Sector 28', 'Garg Chaat Sector 23', 'Virgin Courtyard Sector 7', 'Nik Baker\'s Sector 35'],
    pharmacies: ['Apollo Pharmacy Sector 35', 'MedPlus Sector 17', 'Chemist Sector 22']
  }
};

export function getAllIndianCities(): string[] {
  return Object.keys(INDIAN_CITIES_DATA);
}

/**
 * Generates a realistic address in a chosen Indian city
 */
export function generateRealCityAddress(cityName: string, category: 'vendor' | 'personal' | 'business' | 'landlord'): AddressProfile {
  const cityInfo = INDIAN_CITIES_DATA[cityName] || INDIAN_CITIES_DATA['Bengaluru'];
  const locality = cityInfo.localities[Math.floor(Math.random() * cityInfo.localities.length)];
  const road = cityInfo.roads[Math.floor(Math.random() * cityInfo.roads.length)];
  const plotNo = Math.floor(10 + Math.random() * 490);
  const flatNo = Math.floor(101 + Math.random() * 800);
  const randNum = Math.floor(1000 + Math.random() * 9000);

  const phonePrefixes = ['98450', '98201', '98110', '98765', '94340', '97412', '99001'];
  const phone = `${phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)]}${Math.floor(10000 + Math.random() * 89999)}`;

  const panLetters = 'ABCDE';
  const panLetter = panLetters[Math.floor(Math.random() * panLetters.length)];
  const pan = `${panLetter}ABC${category === 'personal' || category === 'landlord' ? 'P' : 'C'}${randNum}F`;
  const gstin = `${cityInfo.stateCode}${pan}1Z${Math.floor(1 + Math.random() * 9)}`;

  if (category === 'vendor') {
    const fuel = cityInfo.fuelDealers[Math.floor(Math.random() * cityInfo.fuelDealers.length)];
    return {
      id: `addr-vendor-${Date.now()}-${randNum}`,
      label: `${fuel.name} (${cityName})`,
      category: 'vendor',
      fullName: fuel.name,
      companyName: `${fuel.brand} Authorized Dealership`,
      addressLine1: `Plot No. ${plotNo}, ${road}`,
      addressLine2: `${locality.name}`,
      landmark: locality.landmark,
      city: cityInfo.city,
      state: cityInfo.state,
      pincode: locality.pincode,
      phone: phone,
      gstin: gstin,
      pan: pan,
      email: `dealer.${cityName.toLowerCase().replace(/\s+/g, '')}@petrolpump.in`
    };
  } else if (category === 'landlord') {
    const landlordNames = ['Suresh Chandra Sharma', 'Ramesh Kumar Verma', 'Anand Rao Kulkarni', 'Mohanlal Mehta', 'Subrata Mukherjee'];
    const name = landlordNames[Math.floor(Math.random() * landlordNames.length)];
    return {
      id: `addr-landlord-${Date.now()}-${randNum}`,
      label: `Landlord - ${name.split(' ')[0]} (${cityName})`,
      category: 'landlord',
      fullName: name,
      addressLine1: `Flat ${flatNo}, Royal Residency, ${road}`,
      addressLine2: locality.name,
      landmark: locality.landmark,
      city: cityInfo.city,
      state: cityInfo.state,
      pincode: locality.pincode,
      phone: phone,
      pan: pan,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}${randNum % 100}@gmail.com`
    };
  } else if (category === 'business') {
    const bizNames = ['Nexus Technologies India Pvt Ltd', 'AcroDynamics Systems LLP', 'Apex Cloud Solutions India', 'Trident Infotech Ltd'];
    const bName = bizNames[Math.floor(Math.random() * bizNames.length)];
    return {
      id: `addr-biz-${Date.now()}-${randNum}`,
      label: `${bName.split(' ')[0]} HQ (${cityName})`,
      category: 'business',
      fullName: bName,
      companyName: bName,
      addressLine1: `Tower ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}, Level ${Math.floor(2 + Math.random() * 12)}, Mindspace Tech Park`,
      addressLine2: `${locality.name}, ${road}`,
      landmark: locality.landmark,
      city: cityInfo.city,
      state: cityInfo.state,
      pincode: locality.pincode,
      phone: `0${cityInfo.stateCode === '29' ? '80' : cityInfo.stateCode === '27' ? '22' : cityInfo.stateCode === '07' ? '11' : '40'}-${Math.floor(20000000 + Math.random() * 70000000)}`,
      email: `accounts@${bName.toLowerCase().split(' ')[0]}.in`,
      gstin: gstin,
      pan: pan
    };
  } else {
    const names = ['Mohammad Mubasshir', 'N V Ram Babu Choppala', 'Subhra Prakash De', 'Rahul Vardhan', 'Pooja Nair', 'Aditya Sen'];
    const pName = names[Math.floor(Math.random() * names.length)];
    return {
      id: `addr-user-${Date.now()}-${randNum}`,
      label: `Home (${pName.split(' ')[0]} - ${cityName})`,
      category: 'personal',
      fullName: pName,
      addressLine1: `House No. ${plotNo}/${flatNo % 100}, ${road}`,
      addressLine2: locality.name,
      landmark: locality.landmark,
      city: cityInfo.city,
      state: cityInfo.state,
      pincode: locality.pincode,
      phone: phone,
      email: `${pName.toLowerCase().replace(/\s+/g, '')}${randNum % 100}@gmail.com`,
      pan: pan
    };
  }
}
