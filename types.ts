
export type Language = 'TH' | 'EN';

export enum SupportType {
  FOOD = 'FOOD',
  DESSERT = 'DESSERT',
  SNACK = 'SNACK',
  DRINK = 'DRINK'
}

export enum Program {
  THAI = 'THAI',
  ENGLISH = 'ENGLISH'
}

export interface FormData {
  parentName: string;
  phone: string;
  lineId: string;
  email: string;
  studentName: string;
  grade: string;
  program: Program;
  supportType: SupportType[];
  itemName: string;
  quantity: string;
  cookOnSite: boolean;
  setupTime: string;
  needTable: boolean;
  notes: string;
}

export interface Translation {
  title: string;
  schoolName: string;
  eventDate: string;
  eventTime: string;
  setupInfo: string;
  parentInfo: string;
  studentInfo: string;
  supportDetails: string;
  logistics: string;
  others: string;
  required: string;
  optional: string;
  submit: string;
  submitting: string;
  success: string;
  back: string;
  // Fields
  labelParentName: string;
  labelPhone: string;
  labelLineId: string;
  labelEmail: string;
  labelStudentName: string;
  labelGrade: string;
  labelProgram: string;
  labelSupportType: string;
  labelItemName: string;
  labelQuantity: string;
  labelCookOnSite: string;
  labelParticipationMode: string;
  labelSetupTime: string;
  labelNeedTable: string;
  labelNotes: string;
  // Options
  optThaiProg: string;
  optEngProg: string;
  optFood: string;
  optDessert: string;
  optSnack: string;
  optDrink: string;
  optSelf: string;
  optYes: string;
  optNo: string;
  placeholderName: string;
  placeholderPhone: string;
  placeholderItem: string;
  placeholderQty: string;
}
