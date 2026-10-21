export const BRANCHES = ["Dumanjug", "Moalboal"] as const;
export type Branch = (typeof BRANCHES)[number];
export type BranchFilter = Branch | "all";

export const PAYMENT_METHODS = [
  "Cash",
  "GCash",
  "Bank Transfer",
  "Card",
  "Credit/Pay Later",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const EXPENSE_CATEGORIES = [
  "Dental supplies",
  "Laboratory",
  "Electric bill",
  "Water bill",
  "Rent",
  "Marketing",
  "Repairs",
  "Equipment",
  "Transportation",
  "Miscellaneous",
  "Salaries",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number] | "Utilities";

export const ROLES = ["Dentist", "Assistant", "Receptionist", "Manager", "Other"] as const;
export type Role = (typeof ROLES)[number];

export type Sale = {
  id: string;
  date: string;
  branch: Branch;
  patient: string;
  dentistId: string;
  serviceId: string;
  paymentMethod: PaymentMethod;
  gross: number;
  discount: number;
  paid: number;
};

export type Expense = {
  id: string;
  date: string;
  branch: Branch;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paidBy: string;
  notes: string;
};

export type Employee = {
  id: string;
  name: string;
  role: Role;
  branch: Branch | "Both";
  active: boolean;
  rank: number;
  detail: string;
};

export type Payroll = {
  id: string;
  employeeId: string;
  date: string;
  salary: number;
  commission: number;
  paid: boolean;
};

export type Service = {
  id: string;
  name: string;
  price: number;
  active: boolean;
};

export type DailySale = {
  id: string;
  date: string;
  branch: Branch;
  amount: number;
};

export type PatientBalance = {
  id: string;
  date: string;
  branch: Branch;
  patient: string;
  amount: number;
  note: string;
};

export type OtherPayment = {
  id: string;
  date: string;
  branch: Branch;
  direction: "in" | "out";
  description: string;
  amount: number;
};

export type Advance = {
  id: string;
  date: string;
  branch: Branch;
  patient: string;
  amount: number;
  note: string;
};

export type LedgerData = {
  sales: Sale[];
  dailySales: DailySale[];
  balances: PatientBalance[];
  advances: Advance[];
  expenses: Expense[];
  employees: Employee[];
  payroll: Payroll[];
  services: Service[];
  others: OtherPayment[];
  beginnings: Record<string, number>;
  welcomed: boolean;
};

export type RangeMode = "month" | "quarter" | "year";

export type View =
  | "home"
  | "sales"
  | "expenses"
  | "payroll"
  | "services"
  | "monthly"
  | "branches"
  | "cash";
