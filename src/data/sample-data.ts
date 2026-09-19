interface House {
  houseId: number;
  houseName: string;
  location: string;
  numberOfRoom: number;
  pricePerRoom: number;
  rate: number;
  phoneNumber: string;
}

const houses : House[] =  [
  {
    houseId: 1,
    houseName: "Sunrise Residence",
    location: "Phnom Penh",
    numberOfRoom: 12,
    pricePerRoom: 250,
    rate: 4.5,
    phoneNumber: "012 345 678",
  },
  {
    houseId: 2,
    houseName: "Green Garden House",
    location: "Siem Reap",
    numberOfRoom: 8,
    pricePerRoom: 180,
    rate: 4.2,
    phoneNumber: "097 234 567",
  },
  {
    houseId: 3,
    houseName: "Mekong View Residence",
    location: "Phnom Penh",
    numberOfRoom: 15,
    pricePerRoom: 320,
    rate: 4.7,
    phoneNumber: "010 456 789",
  },
  {
    houseId: 4,
    houseName: "Royal Garden Apartments",
    location: "Battambang",
    numberOfRoom: 10,
    pricePerRoom: 200,
    rate: 4.3,
    phoneNumber: "088 567 890",
  },
  {
    houseId: 5,
    houseName: "Lotus Residence",
    location: "Kampot",
    numberOfRoom: 6,
    pricePerRoom: 150,
    rate: 4.6,
    phoneNumber: "096 678 901",
  },
  {
    houseId: 6,
    houseName: "Peaceful Home",
    location: "Kandal",
    numberOfRoom: 9,
    pricePerRoom: 170,
    rate: 4.1,
    phoneNumber: "015 789 012",
  },
  {
    houseId: 7,
    houseName: "City Star Residence",
    location: "Phnom Penh",
    numberOfRoom: 20,
    pricePerRoom: 400,
    rate: 4.8,
    phoneNumber: "011 890 123",
  },
  {
    houseId: 8,
    houseName: "Angkor Comfort House",
    location: "Siem Reap",
    numberOfRoom: 7,
    pricePerRoom: 220,
    rate: 4.4,
    phoneNumber: "092 901 234",
  },
  {
    houseId: 9,
    houseName: "Riverside Residence",
    location: "Kampong Cham",
    numberOfRoom: 11,
    pricePerRoom: 190,
    rate: 4.0,
    phoneNumber: "078 012 345",
  },
  {
    houseId: 10,
    houseName: "Golden Home",
    location: "Takhmao",
    numberOfRoom: 14,
    pricePerRoom: 280,
    rate: 4.6,
    phoneNumber: "069 123 456",
  },
];

export default houses;