// Define types for the application
export type Permission = {
    id: string;
    name: string;
    description: string;
};

export type FieldPermission = {
    id: string;
    fieldId: string;
    profileId?: string;
    permissionSetId?: string;
    permissionType: 'read' | 'edit' | 'none';
};

export type ObjectPermission = {
    id: string;
    objectId: string;
    profileId?: string;
    permissionSetId?: string;
    create: boolean;
    read: boolean;
    edit: boolean;
    delete: boolean;
    viewAll: boolean;
    modifyAll: boolean;
};

export type Profile = {
    id: string;
    name: string;
    description: string;
    isStandard: boolean;
};

export type PermissionSet = {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
};

export type PermissionSetGroup = {
    id: string;
    name: string;
    description: string;
    permissionSetIds: string[];
};

export type ObjectField = {
    id: string;
    objectId: string;
    name: string;
    label: string;
    apiName: string;
    dataType: string;
    isRequired: boolean;
    isUnique: boolean;
    defaultValue?: string;
    helpText?: string;
    isCustom: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type CustomObject = {
    id: string;
    name: string;
    label: string;
    apiName: string;
    pluralLabel: string;
    description: string;
    isCustom: boolean;
    isActive: boolean;
    fields: ObjectField[];
    createdAt: Date;
    updatedAt: Date;
};

export type Layout = {
    id: string;
    objectId: string;
    name: string;
    sections: LayoutSection[];
    assignedProfiles: string[];
    isActive: boolean;
};

export type LayoutSection = {
    id: string;
    name: string;
    columns: number;
    isCollapsible: boolean;
    fieldIds: string[];
};

export type SharingRule = {
    id: string;
    objectId: string;
    name: string;
    description: string;
    ruleType: 'ownership' | 'criteria';
    sourceField?: string;
    sourceValue?: string;
    criteria?: string;
    accessLevel: 'read' | 'edit';
};

export type Tab = {
    id: string;
    label: string;
    icon: string;
    path?: string;
};

export type SubTab = {
    id: string;
    parentId: string;
    label: string;
    path: string;
};

export type AuditLog = {
    id: string;
    entityId: string;
    entityType: string;
    action: 'create' | 'update' | 'delete';
    userId: string;
    changes: Record<string, { old: unknown; new: unknown }>;
    timestamp: Date;
};

export type SearchResult = {
    id: string;
    objectType: string;
    title: string;
    subtitle?: string;
    lastModified: Date;
};
