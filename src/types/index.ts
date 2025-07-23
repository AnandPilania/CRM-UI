// Common Types
export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileId: string;
  permissionSets: string[];
}

// Object Types
export interface MetadataObject {
  id: string;
  apiName: string;
  label: string;
  pluralLabel: string;
  description?: string;
  isCustom: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fields: Field[];
  recordCount?: number;
}

export type FieldType = 
  | 'Text' 
  | 'Number' 
  | 'Date' 
  | 'DateTime' 
  | 'Checkbox' 
  | 'Picklist' 
  | 'Lookup' 
  | 'MasterDetail' 
  | 'Currency' 
  | 'Percent' 
  | 'Phone' 
  | 'Email' 
  | 'URL' 
  | 'TextArea' 
  | 'RichText' 
  | 'Formula' 
  | 'AutoNumber';

export interface Field {
  id: string;
  apiName: string;
  label: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  description?: string;
  helpText?: string;
  defaultValue?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
  // Specific field type properties
  length?: number; // For Text fields
  precision?: number; // For Number fields
  scale?: number; // For Number fields
  options?: PicklistOption[]; // For Picklist fields
  referenceObject?: string; // For Lookup fields
  formula?: string; // For Formula fields
  returnType?: FieldType; // For Formula fields
  displayFormat?: string; // For AutoNumber fields
}

export interface PicklistOption {
  label: string;
  value: string;
  isDefault?: boolean;
}

// Layout Types
export interface Layout {
  id: string;
  name: string;
  objectApiName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections: LayoutSection[];
  assignedProfiles: string[];
  assignedRecordTypes?: string[];
}

export interface LayoutSection {
  id: string;
  heading: string;
  columns: number;
  expanded: boolean;
  layoutItems: LayoutItem[];
}

export interface LayoutItem {
  id: string;
  fieldApiName: string;
  isRequired: boolean;
  isReadOnly: boolean;
  width: number; // In columns
}

// Record Types
export interface RecordType {
  id: string;
  name: string;
  objectApiName: string;
  description?: string;
  isActive: boolean;
  layoutId: string;
  createdAt: string;
  updatedAt: string;
}

// Report Types
export interface Report {
  id: string;
  name: string;
  description?: string;
  folderId: string;
  objectApiName: string;
  createdAt: string;
  updatedAt: string;
  filters: ReportFilter[];
  groupings: ReportGrouping[];
  columns: ReportColumn[];
  chartType?: 'Bar' | 'Line' | 'Pie' | 'Table' | 'Funnel';
  chartOptions?: Record<string, any>;
}

export interface ReportFolder {
  id: string;
  name: string;
  parentFolderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilter {
  fieldApiName: string;
  operator: string;
  value: any;
  logicType?: 'AND' | 'OR';
}

export interface ReportGrouping {
  fieldApiName: string;
  sortDirection: 'asc' | 'desc';
  dateInterval?: 'Day' | 'Week' | 'Month' | 'Quarter' | 'Year';
}

export interface ReportColumn {
  fieldApiName: string;
  label: string;
  aggregate?: 'Sum' | 'Average' | 'Min' | 'Max' | 'Count';
}

// Permission Types
export interface Role {
  id: string;
  name: string;
  description?: string;
  parentRoleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  objectPermissions: ObjectPermission[];
  fieldPermissions: FieldPermission[];
}

export interface PermissionSet {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  objectPermissions: ObjectPermission[];
  fieldPermissions: FieldPermission[];
}

export interface ObjectPermission {
  objectApiName: string;
  create: boolean;
  read: boolean;
  edit: boolean;
  delete: boolean;
  viewAll: boolean;
  modifyAll: boolean;
}

export interface FieldPermission {
  objectApiName: string;
  fieldApiName: string;
  read: boolean;
  edit: boolean;
}

export interface SharingRule {
  id: string;
  name: string;
  objectApiName: string;
  type: 'Owner' | 'Criteria' | 'Role';
  accessLevel: 'Read' | 'ReadWrite';
  sourceField?: string;
  sourceValue?: string;
  targetType: 'Role' | 'Group' | 'User';
  targetId: string;
}

// Audit Types
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  objectApiName: string;
  recordId?: string;
  action: 'Create' | 'Update' | 'Delete' | 'View' | 'Export' | 'Login' | 'Logout';
  details: Record<string, any>;
}

// Record Data
export type Record = {
  id: string;
  [key: string]: any;
};

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
  disabled?: boolean;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

// Form Types
export interface FormError {
  field?: string;
  message: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  }
}

// Formula Field Types
export interface FormulaFunction {
  name: string;
  description: string;
  syntax: string;
  category: string;
  examples?: string[];
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}