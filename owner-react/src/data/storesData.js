// Stores — ported from STORES_DATA in owner-responsive.html.
export const INITIAL_STORES = [
  { id: 1, name: 'Al Fatah Main Branch', code: 'RS-001', type: 'Retail', city: 'Lahore', area: 'Gulberg III', manager: 'Hassan Ali', staff: 12, revenue: 'Rs.284,000', status: 'active' },
  { id: 2, name: 'Al Fatah DHA Branch', code: 'RS-002', type: 'Retail', city: 'Lahore', area: 'DHA Phase 5', manager: 'Amna Siddiqui', staff: 9, revenue: 'Rs.198,000', status: 'active' },
  { id: 3, name: 'Al Fatah Johar Town', code: 'RS-003', type: 'Retail', city: 'Lahore', area: 'Johar Town', manager: 'Omar Farooq', staff: 7, revenue: 'Rs.142,000', status: 'active' },
  { id: 4, name: 'Al Fatah Model Town', code: 'RS-004', type: 'Retail', city: 'Lahore', area: 'Model Town', manager: 'Sana Butt', staff: 8, revenue: 'Rs.167,000', status: 'active' },
  { id: 5, name: 'Al Fatah Bahria Town', code: 'RS-005', type: 'Retail', city: 'Lahore', area: 'Bahria Town', manager: '—', staff: 0, revenue: '—', status: 'inactive' },
  { id: 6, name: 'Al Fatah Faisalabad', code: 'RS-006', type: 'Retail', city: 'Faisalabad', area: 'D-Ground', manager: 'Rizwan Chaudhry', staff: 6, revenue: 'Rs.121,000', status: 'active' },
  { id: 7, name: 'Al Fatah Islamabad', code: 'RS-007', type: 'Retail', city: 'Islamabad', area: 'F-10 Markaz', manager: 'Ayesha Naveed', staff: 5, revenue: 'Rs.98,000', status: 'active' },
  { id: 8, name: 'Central Warehouse', code: 'WH-001', type: 'Warehouse', city: 'Lahore', area: 'Sundar Ind. Estate', manager: 'Tariq Mehmood', staff: 7, revenue: '—', status: 'active' },
]

export const STORES_PAGE_SIZE = 6

const AVATAR_COLORS = ['#1a2d6b', '#3366cc', '#7c4dff', '#2dd36f', '#ff9800', '#0891b2', '#dc2626']

export function storeAvatarColor(name) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) & 0xffff
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export const PROVINCE_CITIES = {
  Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan'],
  Sindh: ['Karachi', 'Hyderabad', 'Sukkur'],
  KPK: ['Peshawar', 'Abbottabad', 'Swat'],
  Balochistan: ['Quetta', 'Gwadar'],
  'Gilgit-Baltistan': ['Gilgit', 'Skardu'],
  AJK: ['Muzaffarabad', 'Mirpur'],
}

export const PROVINCES = Object.keys(PROVINCE_CITIES)

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
