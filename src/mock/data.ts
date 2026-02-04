export type DemoUser = {
  id: string;
  organisationId: string;
  email: string;
  name: string;
  role: string;
};

export type DemoGroup = {
  id: string;
  name: string;
  color: string;
};

export type DemoChild = {
  id: string;
  organisationId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string | null;
  entryDate: Date;
  exitDate: Date | null;
  isActive: boolean;
  allergies: string | null;
  doctorInfo: string | null;
  specialNotes: string | null;
  photoUrl?: string | null;
};

export type DemoPartner = {
  id: string;
  organisationId: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  bankAccount: string | null;
  taxId: string | null;
  notes: string | null;
  isActive: boolean;
};

export type DemoChildPartner = {
  id: string;
  childId: string;
  partnerId: string;
  relationship: string;
  isPrimary: boolean;
};

export type DemoEnrollment = {
  id: string;
  childId: string;
  groupId: string;
  status: string;
};

export type DemoEmergencyContact = {
  id: string;
  childId: string;
  name: string;
  relationship: string;
  phone: string;
};

export type DemoDailyReport = {
  id: string;
  childId: string;
  date: Date;
  content: string;
  mood?: string | null;
  sleep?: string | null;
  meals?: string | null;
  activities?: string | null;
};

export type DemoInvoice = {
  id: string;
  partnerId: string;
  number: string;
  date: Date;
  total: number;
  outstandingAmount: number;
  status: string;
};

export type DemoChildBooking = {
  id: string;
  childId: string;
  groupId: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  isExtra: boolean;
  notes?: string | null;
};

export type DemoStaff = {
  id: string;
  organisationId: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  isActive: boolean;
};

export type DemoStaffShift = {
  id: string;
  staffId: string;
  groupId: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  shiftType: string;
};

export const demoUser: DemoUser = {
  id: "user_demo",
  organisationId: "org_demo",
  email: "demo@kita.ch",
  name: "Demo Admin",
  role: "ADMIN",
};

const demoGroups: DemoGroup[] = [
  { id: "group_sun", name: "Sonnengruppe", color: "#E88D4E" },
  { id: "group_moon", name: "Mondgruppe", color: "#4A9D8E" },
];

const demoChildren: DemoChild[] = [
  {
    id: "child_lina",
    organisationId: "org_demo",
    firstName: "Lina",
    lastName: "Meier",
    dateOfBirth: new Date(2021, 4, 12),
    gender: "F",
    entryDate: new Date(2024, 0, 8),
    exitDate: null,
    isActive: true,
    allergies: "Erdnüsse",
    doctorInfo: "Dr. Muster · 044 123 45 67 · Musterstrasse 1",
    specialNotes: "Braucht mittags eine Ruhepause.",
    photoUrl: null,
  },
  {
    id: "child_emil",
    organisationId: "org_demo",
    firstName: "Emil",
    lastName: "Keller",
    dateOfBirth: new Date(2020, 9, 3),
    gender: "M",
    entryDate: new Date(2023, 8, 1),
    exitDate: null,
    isActive: true,
    allergies: null,
    doctorInfo: null,
    specialNotes: "Liebt Basteln und Musik.",
    photoUrl: null,
  },
];

const demoPartners: DemoPartner[] = [
  {
    id: "partner_meier",
    organisationId: "org_demo",
    firstName: "Anna",
    lastName: "Meier",
    companyName: null,
    email: "anna.meier@example.com",
    phone: "044 555 12 12",
    mobile: "079 123 45 67",
    address: "Musterweg 10",
    city: "Zürich",
    zip: "8001",
    country: "CH",
    bankAccount: "CH93 0076 2011 6238 5295 7",
    taxId: "CHE-123.456.789",
    notes: "Bevorzugt E-Mail.",
    isActive: true,
  },
  {
    id: "partner_keller",
    organisationId: "org_demo",
    firstName: "Markus",
    lastName: "Keller",
    companyName: null,
    email: "markus.keller@example.com",
    phone: "044 555 44 44",
    mobile: "078 222 11 00",
    address: "Seestrasse 5",
    city: "Zürich",
    zip: "8002",
    country: "CH",
    bankAccount: null,
    taxId: null,
    notes: null,
    isActive: true,
  },
];

const demoChildPartners: DemoChildPartner[] = [
  { id: "cp_lina_mom", childId: "child_lina", partnerId: "partner_meier", relationship: "MOTHER", isPrimary: true },
  { id: "cp_emil_dad", childId: "child_emil", partnerId: "partner_keller", relationship: "FATHER", isPrimary: true },
];

const demoEnrollments: DemoEnrollment[] = [
  { id: "enroll_lina", childId: "child_lina", groupId: "group_moon", status: "ACTIVE" },
  { id: "enroll_emil", childId: "child_emil", groupId: "group_sun", status: "ACTIVE" },
];

const demoEmergencyContacts: DemoEmergencyContact[] = [
  { id: "ec_lina_1", childId: "child_lina", name: "Oma Erika", relationship: "Grossmutter", phone: "079 555 66 77" },
];

const demoDailyReports: DemoDailyReport[] = [
  {
    id: "rep_lina_1",
    childId: "child_lina",
    date: new Date(),
    content: "Tagesprotokoll erstellt",
    mood: "HAPPY",
    sleep: "GOOD",
    meals: "ALL",
    activities: "Malen, Spielplatz und Musikrunde.",
  },
  {
    id: "rep_emil_1",
    childId: "child_emil",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    content: "Tagesprotokoll aktualisiert",
    mood: "NEUTRAL",
    sleep: "OK",
    meals: "MOST",
    activities: "Bastelprojekt und Vorlesen.",
  },
];

const demoInvoices: DemoInvoice[] = [
  {
    id: "inv_meier_1",
    partnerId: "partner_meier",
    number: "2026-001",
    date: new Date(2026, 0, 31),
    total: 1200,
    outstandingAmount: 200,
    status: "SENT",
  },
  {
    id: "inv_keller_1",
    partnerId: "partner_keller",
    number: "2026-002",
    date: new Date(2026, 0, 31),
    total: 980,
    outstandingAmount: 0,
    status: "PAID",
  },
];

const demoChildBookings: DemoChildBooking[] = [
  {
    id: "book_lina_1",
    childId: "child_lina",
    groupId: "group_moon",
    date: new Date(),
    startTime: "08:00",
    endTime: "16:00",
    isExtra: false,
  },
  {
    id: "book_emil_1",
    childId: "child_emil",
    groupId: "group_sun",
    date: new Date(),
    startTime: "08:30",
    endTime: "15:30",
    isExtra: false,
  },
];

const demoStaff: DemoStaff[] = [
  {
    id: "staff_anna",
    organisationId: "org_demo",
    firstName: "Anna",
    lastName: "Schmid",
    email: "anna.schmid@example.com",
    phone: "044 111 22 33",
    position: "Erzieherin",
    isActive: true,
  },
  {
    id: "staff_lukas",
    organisationId: "org_demo",
    firstName: "Lukas",
    lastName: "Huber",
    email: "lukas.huber@example.com",
    phone: "044 444 55 66",
    position: "Erzieher",
    isActive: true,
  },
];

const demoStaffShifts: DemoStaffShift[] = [
  {
    id: "shift_anna_1",
    staffId: "staff_anna",
    groupId: "group_moon",
    date: new Date(),
    startTime: "07:30",
    endTime: "15:30",
    shiftType: "FULL_DAY",
  },
  {
    id: "shift_lukas_1",
    staffId: "staff_lukas",
    groupId: "group_sun",
    date: new Date(),
    startTime: "08:00",
    endTime: "16:00",
    shiftType: "FULL_DAY",
  },
];

const groupById = new Map(demoGroups.map((group) => [group.id, group]));
const partnerById = new Map(demoPartners.map((partner) => [partner.id, partner]));
const childById = new Map(demoChildren.map((child) => [child.id, child]));

export function getDemoGroups() {
  return demoGroups;
}

export function getDemoChildren() {
  return demoChildren.map((child) => ({
    ...child,
    partners: demoChildPartners
      .filter((cp) => cp.childId === child.id)
      .map((cp) => ({ ...cp, partner: partnerById.get(cp.partnerId)! })),
    enrollments: demoEnrollments
      .filter((enroll) => enroll.childId === child.id && enroll.status === "ACTIVE")
      .map((enroll) => ({ ...enroll, group: groupById.get(enroll.groupId)! })),
    reports: demoDailyReports.filter((report) => report.childId === child.id),
  }));
}

export function getDemoChildById(id: string) {
  const child = demoChildren.find((c) => c.id === id);
  if (!child) return null;
  return {
    ...child,
    partners: demoChildPartners
      .filter((cp) => cp.childId === child.id)
      .map((cp) => ({ ...cp, partner: partnerById.get(cp.partnerId)! })),
    emergencyContacts: demoEmergencyContacts.filter((c) => c.childId === child.id),
    enrollments: demoEnrollments
      .filter((enroll) => enroll.childId === child.id && enroll.status === "ACTIVE")
      .map((enroll) => ({ ...enroll, group: groupById.get(enroll.groupId)! })),
  };
}

export function getDemoDailyReportsByChildId(childId: string) {
  return demoDailyReports.filter((report) => report.childId === childId);
}

export function getDemoPartners() {
  return demoPartners.map((partner) => ({
    ...partner,
    children: demoChildPartners
      .filter((cp) => cp.partnerId === partner.id)
      .map((cp) => ({ ...cp, child: childById.get(cp.childId)! })),
    invoices: demoInvoices.filter((inv) => inv.partnerId === partner.id),
    _count: {
      invoices: demoInvoices.filter((inv) => inv.partnerId === partner.id).length,
      ledgerEntries: 0,
    },
  }));
}

export function getDemoPartnerById(id: string) {
  const partner = demoPartners.find((p) => p.id === id);
  if (!partner) return null;
  return {
    ...partner,
    children: demoChildPartners
      .filter((cp) => cp.partnerId === partner.id)
      .map((cp) => ({ ...cp, child: childById.get(cp.childId)! })),
    invoices: demoInvoices.filter((inv) => inv.partnerId === partner.id),
  };
}

export function getDemoAvailableChildren(excludeIds: string[]) {
  return demoChildren
    .filter((child) => child.isActive && !excludeIds.includes(child.id))
    .map((child) => ({ id: child.id, firstName: child.firstName, lastName: child.lastName }));
}

export function getDemoChildBookings() {
  return demoChildBookings.map((booking) => ({
    ...booking,
    child: childById.get(booking.childId)!,
    group: booking.groupId ? groupById.get(booking.groupId) ?? null : null,
  }));
}

export function getDemoStaff() {
  return demoStaff;
}

export function getDemoStaffShifts() {
  return demoStaffShifts.map((shift) => ({
    ...shift,
    staff: demoStaff.find((s) => s.id === shift.staffId)!,
    group: shift.groupId ? groupById.get(shift.groupId) ?? null : null,
  }));
}
