import { BIZ_DATA } from './businessData'

export const PU_ROLE_LABEL = {
  wh_manager: 'Warehouse Manager',
  wh_staff: 'Warehouse Staff',
  store_manager: 'Store Manager',
  store_staff: 'Store Staff',
  cashier: 'Cashier',
  customer: 'Customer',
}

export const PU_ROLE_COLOR = {
  wh_manager: 'bg-brand-blue/10 text-brand-blue',
  wh_staff: 'bg-brand-blue/10 text-brand-blue',
  store_manager: 'bg-navy/10 text-navy',
  store_staff: 'bg-navy/10 text-navy',
  cashier: 'bg-brand-green/10 text-brand-green',
  customer: 'bg-brand-purple/10 text-brand-purple',
}

// Realistic name pool for synthesizing staff (ported from PU_NAME_POOL).
const PU_NAME_POOL = [
  'Ali Raza', 'Sana Malik', 'Bilal Sheikh', 'Hira Aslam', 'Fahad Qureshi', 'Mahnoor Iqbal', 'Zeeshan Abbas', 'Komal Yousuf',
  'Adeel Nawaz', 'Sidra Farooq', 'Shahid Baig', 'Nida Rauf', 'Waqas Tariq', 'Anum Siddiqui', 'Kamran Shah', 'Rabia Noor',
  'Faisal Mir', 'Sobia Riaz', 'Imran Butt', 'Farah Hussain', 'Asad Khan', 'Mariam Chaudhry', 'Zohaib Aslam', 'Iqra Saeed',
  'Noman Ahmed', 'Aiman Malik', 'Tariq Jamil', 'Sumaira Nasir', 'Junaid Iqbal', 'Amber Fatima', 'Rizwan Sarwar', 'Laiba Anwar',
  'Hamza Latif', 'Warda Ashraf', 'Usama Bashir', 'Nimra Zafar', 'Adnan Farid', 'Tooba Ilyas', 'Shoaib Ejaz', 'Alishba Khalid',
]

function puSlug(name) {
  return name.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, '.')
}

// Deterministically build the platform user directory from BIZ_DATA so every
// business's stores (and one warehouse per business) surface real users here.
function genPlatformUsers() {
  let nameIdx = 0
  const nextName = () => PU_NAME_POOL[nameIdx++ % PU_NAME_POOL.length]
  let uid = 1
  const users = []

  BIZ_DATA.forEach((biz) => {
    if (biz.status === 'pending') return

    const domain =
      (biz.ownerEmail && biz.ownerEmail.split('@')[1]) ||
      biz.name.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com'

    const stores = biz.storeList
      ? biz.storeList
      : Array.from({ length: Math.max(biz.stores, 0) }, (_, i) => ({
          name: `${biz.name} Store ${i + 1}`,
          status: 'active',
        }))

    stores.forEach((store) => {
      if (store.status === 'inactive') return

      const managerName = store.manager || nextName()
      uid++
      users.push({
        id: uid, name: managerName, email: puSlug(managerName) + '@' + domain,
        role: 'store_manager', bizName: biz.name, location: store.name,
        status: uid % 17 === 0 ? 'suspended' : 'active', joined: biz.joined,
      })

      const staffName = nextName()
      uid++
      users.push({
        id: uid, name: staffName, email: puSlug(staffName) + '@' + domain,
        role: 'store_staff', bizName: biz.name, location: store.name,
        status: uid % 17 === 0 ? 'suspended' : 'active', joined: biz.joined,
      })

      const cashierName = nextName()
      uid++
      users.push({
        id: uid, name: cashierName, email: puSlug(cashierName) + '@' + domain,
        role: 'cashier', bizName: biz.name, location: store.name,
        status: uid % 17 === 0 ? 'suspended' : 'active', joined: biz.joined,
      })
    })

    if (biz.stores > 0) {
      const whManagerName = nextName()
      uid++
      users.push({
        id: uid, name: whManagerName, email: puSlug(whManagerName) + '@' + domain,
        role: 'wh_manager', bizName: biz.name, location: `${biz.city} Central Warehouse`,
        status: 'active', joined: biz.joined,
      })

      const whStaffName = nextName()
      uid++
      users.push({
        id: uid, name: whStaffName, email: puSlug(whStaffName) + '@' + domain,
        role: 'wh_staff', bizName: biz.name, location: `${biz.city} Central Warehouse`,
        status: 'active', joined: biz.joined,
      })
    }
  })

  // Customers are platform-wide, never scoped to a single business.
  const customers = [
    { name: 'Mahnoor Ali', email: 'mahnoor.ali@gmail.com', joined: 'Jan 12, 2025', status: 'active' },
    { name: 'Hassan Baig', email: 'hassan.baig@gmail.com', joined: 'Jan 18, 2025', status: 'active' },
    { name: 'Areeba Khan', email: 'areeba.khan@gmail.com', joined: 'Feb 1, 2025', status: 'active' },
    { name: 'Waleed Farooq', email: 'waleed.farooq@gmail.com', joined: 'Feb 14, 2025', status: 'active' },
    { name: 'Sadaf Naeem', email: 'sadaf.naeem@gmail.com', joined: 'Feb 20, 2025', status: 'suspended' },
    { name: 'Yusra Malik', email: 'yusra.malik@gmail.com', joined: 'Mar 2, 2025', status: 'active' },
    { name: 'Imran Sheikh', email: 'imran.sheikh@gmail.com', joined: 'Mar 15, 2025', status: 'active' },
    { name: 'Noor Fatima', email: 'noor.fatima@gmail.com', joined: 'Mar 28, 2025', status: 'active' },
  ]
  customers.forEach((c) => {
    uid++
    users.push({ id: uid, name: c.name, email: c.email, role: 'customer', bizName: '—', location: '—', status: c.status, joined: c.joined })
  })

  return users
}

export const PU_DATA = genPlatformUsers()

export const PU_ROLE_OPTIONS = [
  { value: 'wh_manager', label: 'Warehouse Manager' },
  { value: 'wh_staff', label: 'Warehouse Staff' },
  { value: 'store_manager', label: 'Store Manager' },
  { value: 'store_staff', label: 'Store Staff' },
  { value: 'cashier', label: 'Cashier' },
  { value: 'customer', label: 'Customer' },
]

// Unique business names that actually have users (for the filter dropdown).
export const PU_BIZ_NAMES = [...new Set(PU_DATA.filter((u) => u.bizName !== '—').map((u) => u.bizName))].sort()
