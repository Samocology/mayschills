export const orders = [
  { id: "#SFR-20491", customer: "Amara Nwosu", email: "amara@email.com", items: ["Mango Bliss × 2", "Green Detox"], itemCount: 3, amount: 11779, status: "Out for Delivery", payment: "Visa ••••4242", deliveryType: "Home Delivery", rider: "Tunde A.", time: "12:02 PM", date: "Jan 20" },
  { id: "#SFR-20490", customer: "Emeka Eze", email: "emeka@email.com", items: ["Watermelon Breeze × 2"], itemCount: 2, amount: 7200, status: "Preparing", payment: "Wallet", deliveryType: "Home Delivery", rider: null, time: "11:48 AM", date: "Jan 20" },
  { id: "#SFR-20489", customer: "Chisom Adike", email: "chisom@email.com", items: ["Pineapple Punch", "Salad Bowl"], itemCount: 5, amount: 19450, status: "Delivered", payment: "Bank Transfer", deliveryType: "Home Delivery", rider: "Kola B.", time: "10:15 AM", date: "Jan 20" },
  { id: "#SFR-20488", customer: "Bayo Adeleke", email: "bayo@email.com", items: ["Green Detox Smoothie"], itemCount: 1, amount: 3500, status: "Pending", payment: "Card", deliveryType: "Pickup", rider: null, time: "9:30 AM", date: "Jan 20" },
  { id: "#SFR-20487", customer: "Ngozi Obi", email: "ngozi@email.com", items: ["Mango Bliss", "Wrap Combo × 3"], itemCount: 4, amount: 14300, status: "Cancelled", payment: "Wallet", deliveryType: "Home Delivery", rider: null, time: "6:10 PM", date: "Jan 19" },
  { id: "#SFR-20486", customer: "Seun Fasanya", email: "seun@email.com", items: ["Pineapple Punch × 3"], itemCount: 3, amount: 8850, status: "Delivered", payment: "Visa ••••9901", deliveryType: "Home Delivery", rider: "Dele O.", time: "3:45 PM", date: "Jan 19" },
  { id: "#SFR-20485", customer: "Fatima Bello", email: "fatima@email.com", items: ["Detox Bowl", "Salad Bowl"], itemCount: 2, amount: 9200, status: "Packed", payment: "Subscription", deliveryType: "Home Delivery", rider: null, time: "2:12 PM", date: "Jan 19" },
  { id: "#SFR-20484", customer: "Victor Olusegun", email: "victor@email.com", items: ["Mango Bliss", "Green Detox × 2"], itemCount: 3, amount: 16950, status: "Delivered", payment: "Bank Transfer", deliveryType: "Pickup", rider: null, time: "11:00 AM", date: "Jan 19" },
];

export const riders = [
  { name: "Tunde Adewale", phone: "+234 803 111 2233", deliveries: 3, status: "On Delivery" },
  { name: "Kola Babatunde", phone: "+234 802 456 7890", deliveries: 2, status: "On Delivery" },
  { name: "Dele Okafor", phone: "+234 801 987 6543", deliveries: 4, status: "Delayed" },
  { name: "Emeka James", phone: "+234 805 654 3210", deliveries: 2, status: "On Delivery" },
  { name: "Segun Musa", phone: "+234 808 222 9988", deliveries: 0, status: "Available" },
  { name: "Femi Lawal", phone: "+234 807 445 6677", deliveries: 1, status: "Available" },
  { name: "Bello Ibrahim", phone: "+234 809 331 0022", deliveries: 0, status: "Offline" },
];

export const customers = [
  { name: "Amara Nwosu", email: "amara@email.com", phone: "+234 801 234 5678", orders: 28, spent: 412500, joined: "Mar 2024", status: "VIP", lastOrder: "Today" },
  { name: "Emeka Eze", email: "emeka@email.com", phone: "+234 802 345 6789", orders: 15, spent: 198000, joined: "Apr 2024", status: "Active", lastOrder: "Today" },
  { name: "Chisom Adike", email: "chisom@email.com", phone: "+234 803 456 7890", orders: 42, spent: 685000, joined: "Jan 2024", status: "VIP", lastOrder: "Today" },
  { name: "Bayo Adeleke", email: "bayo@email.com", phone: "+234 804 567 8901", orders: 6, spent: 32400, joined: "Nov 2024", status: "New", lastOrder: "Today" },
  { name: "Ngozi Obi", email: "ngozi@email.com", phone: "+234 805 678 9012", orders: 11, spent: 89200, joined: "Jul 2024", status: "Active", lastOrder: "Yesterday" },
  { name: "Seun Fasanya", email: "seun@email.com", phone: "+234 806 789 0123", orders: 19, spent: 256000, joined: "May 2024", status: "Active", lastOrder: "Yesterday" },
  { name: "Fatima Bello", email: "fatima@email.com", phone: "+234 807 890 1234", orders: 33, spent: 487000, joined: "Feb 2024", status: "VIP", lastOrder: "Yesterday" },
  { name: "Victor Olusegun", email: "victor@email.com", phone: "+234 808 901 2345", orders: 8, spent: 68000, joined: "Sep 2024", status: "Active", lastOrder: "Yesterday" },
];

export const revenueData = [
  { day: "Jan 1", revenue: 145000, previous: 132000 },
  { day: "Jan 3", revenue: 162000, previous: 148000 },
  { day: "Jan 5", revenue: 138000, previous: 155000 },
  { day: "Jan 7", revenue: 195000, previous: 162000 },
  { day: "Jan 9", revenue: 215000, previous: 178000 },
  { day: "Jan 11", revenue: 248000, previous: 195000 },
  { day: "Jan 13", revenue: 232000, previous: 210000 },
  { day: "Jan 15", revenue: 268000, previous: 225000 },
  { day: "Jan 17", revenue: 295000, previous: 248000 },
  { day: "Jan 20", revenue: 312000, previous: 265000 },
];

export const salesByCategory = [
  { name: "Smoothies", value: 48, color: "oklch(0.5 0.15 152)" },
  { name: "Juices", value: 27, color: "oklch(0.7 0.18 45)" },
  { name: "Salads", value: 14, color: "oklch(0.6 0.15 220)" },
  { name: "Wraps", value: 11, color: "oklch(0.75 0.15 85)" },
];

export const couponList = [
  { code: "FLASH25", uses: 184, discount: "25% off", status: "Active" },
  { code: "DETOX20", uses: 91, discount: "20% off", status: "Active" },
  { code: "GOLD15", uses: 43, discount: "15% off", status: "Active" },
  { code: "WELCOME10", uses: 620, discount: "10% off", status: "Expired" },
];
