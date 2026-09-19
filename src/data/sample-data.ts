export interface House {
  houseId: number;
  houseName: string;
  ownerName: string;
  location: string;
  numberOfRoom: number;
  peoplePerRoom: number;
  pricePerRoom: number;
  rate: number;
  phoneNumber: string;
}

const houses : House[] =  [
  {
    houseId: 1,
    houseName: "Sunrise Residence",
    ownerName: "Sok Dara",
    location: "Phnom Penh",
    numberOfRoom: 12,
    peoplePerRoom: 2,
    pricePerRoom: 250,
    rate: 4.5,
    phoneNumber: "012 345 678",
  },
  {
    houseId: 2,
    houseName: "Green Garden House",
    ownerName: "Chan Sopheap",
    location: "Siem Reap",
    numberOfRoom: 8,
    peoplePerRoom: 3,
    pricePerRoom: 180,
    rate: 4.2,
    phoneNumber: "097 234 567",
  },
  {
    houseId: 3,
    houseName: "Mekong View Residence",
    ownerName: "Lim Vannak",
    location: "Phnom Penh",
    numberOfRoom: 15,
    peoplePerRoom: 2,
    pricePerRoom: 320,
    rate: 4.7,
    phoneNumber: "010 456 789",
  },
  {
    houseId: 4,
    houseName: "Royal Garden Apartments",
    ownerName: "Keo Sreymom",
    location: "Battambang",
    numberOfRoom: 10,
    peoplePerRoom: 4,
    pricePerRoom: 200,
    rate: 4.3,
    phoneNumber: "088 567 890",
  },
  {
    houseId: 5,
    houseName: "Lotus Residence",
    ownerName: "Heng Rithy",
    location: "Kampot",
    numberOfRoom: 6,
    peoplePerRoom: 2,
    pricePerRoom: 150,
    rate: 4.6,
    phoneNumber: "096 678 901",
  },
  {
    houseId: 6,
    houseName: "Peaceful Home",
    ownerName: "Meas Bopha",
    location: "Kandal",
    numberOfRoom: 9,
    peoplePerRoom: 3,
    pricePerRoom: 170,
    rate: 4.1,
    phoneNumber: "015 789 012",
  },
  {
    houseId: 7,
    houseName: "City Star Residence",
    ownerName: "Touch Sokha",
    location: "Phnom Penh",
    numberOfRoom: 20,
    peoplePerRoom: 1,
    pricePerRoom: 400,
    rate: 4.8,
    phoneNumber: "011 890 123",
  },
  {
    houseId: 8,
    houseName: "Angkor Comfort House",
    ownerName: "Ly Chenda",
    location: "Siem Reap",
    numberOfRoom: 7,
    peoplePerRoom: 2,
    pricePerRoom: 220,
    rate: 4.4,
    phoneNumber: "092 901 234",
  },
  {
    houseId: 9,
    houseName: "Riverside Residence",
    ownerName: "Nget Visal",
    location: "Kampong Cham",
    numberOfRoom: 11,
    peoplePerRoom: 4,
    pricePerRoom: 190,
    rate: 4.0,
    phoneNumber: "078 012 345",
  },
  {
    houseId: 10,
    houseName: "Golden Home",
    ownerName: "Pich Sreyneang",
    location: "Takhmao",
    numberOfRoom: 14,
    peoplePerRoom: 3,
    pricePerRoom: 280,
    rate: 4.6,
    phoneNumber: "069 123 456",
  },
];

export default houses;