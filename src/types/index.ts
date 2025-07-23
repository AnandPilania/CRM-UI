// User types
export interface User {
  id: string;
  name: string;
  email: string;
  profileId: string;
  roleId?: string;
  permissionSetIds?: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  modifiedAt: string;
}

// CRM Object types
export interface CRMObject {
  id: string;
  name: string;
  apiName: string;
  label: string;
  labelPlural: string;
  isCustom: boolean;
  description?: string;
  fields: Field[];
  createdAt: string;
  modifiedAt: string;
}

// Field types
export type FieldType =
  | "Text"
  | "Number"
  | "Date"
  | "DateTime"
  | "Checkbox"
  | "Picklist"
  | "MultiPicklist"
  | "Lookup"
  | "MasterDetail"
  | "URL"
  | "Email"
  | "Phone"
  | "TextArea"
  | "LongTextArea"
  | "RichText"
  | "Currency"
  | "Percent"
  | "AutoNumber"
  | "Formula"
  | "Geolocation"
  | "Encrypted";

export interface PicklistValue {
  value: string;
  label: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface Field {
  id: string;
  name: string;
  label: string;
  apiName: string;
  type: FieldType;
  isCustom: boolean;
  isRequired: boolean;
  helpText?: string;
  description?: string;
  defaultValue?: string;
  length?: number;
  precision?: number;
  scale?: number;
  picklistValues?: PicklistValue[];
  relationshipObject?: string;
  relationshipField?: string;
  formula?: string;
  formulaReturnType?: string;
}

// Layout types
export interface LayoutItem {
  fieldApiName: string;
  isRequired: boolean;
  isReadOnly: boolean;
}

export interface LayoutSection {
  id: string;
  heading: string;
  columns: number;
  isCollapsible: boolean;
  isCollapsed: boolean;
  layoutItems: LayoutItem[][];
}

export interface LayoutButton {
  name: string;
  label: string;
  position: "Top" | "Bottom";
}

export interface RelatedList {
  objectApiName: string;
  fields: string[];
  buttons: string[];
}

export interface LayoutAssignment {
  object: string;
  layout: string;
}

export interface Layout {
  id: string;
  name: string;
  objectApiName: string;
  sections: LayoutSection[];
  buttons: LayoutButton[];
  relatedLists: RelatedList[];
  createdAt: string;
  modifiedAt: string;
  assignedProfiles: string[];
}

// Permission types
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
  fieldApiName: string;
  read: boolean;
  edit: boolean;
}

export interface Profile {
  id: string;
  type: "Profile";
  name: string;
  description?: string;
  objectPermissions: ObjectPermission[];
  fieldPermissions: FieldPermission[];
  userLicense: string;
  layoutAssignments: LayoutAssignment[];
}

export interface PermissionSet {
  id: string;
  type: "PermissionSet";
  name: string;
  description?: string;
  objectPermissions: ObjectPermission[];
  fieldPermissions: FieldPermission[];
}

export interface Role {
  id: string;
  type: "Role";
  name: string;
  description?: string;
  parentRole?: string;
  subordinateRoles: string[];
  users: string[];
}

export interface SharingRule {
  id: string;
  type: "SharingRule";
  name: string;
  description?: string;
  sourceObject: string;
  targetObject: string;
  accessLevel: "Read" | "ReadWrite" | "Full";
  criteriaField?: string;
  criteriaValue?: string;
  sharedWith: string[];
}

export interface OrgWideDefaults {
  objectApiName: string;
  defaultAccess: "Private" | "Public" | "PublicReadWrite" | "ControlledByParent";
  grantAccessUsing?: "Hierarchy";
}

// Audit types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityId?: string;
  entityType?: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

// Report types
export interface ReportColumn {
  fieldApiName: string;
  label: string;
  type: string;
  width?: number;
  sortDirection?: "asc" | "desc";
  groupingLevel?: number;
}

export interface ReportFilter {
  fieldApiName: string;
  operator: string;
  value: string;
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  objectApiName: string;
  columns: ReportColumn[];
  filters: ReportFilter[];
  groupings?: string[];
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}