import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TableProperties, Database, Plus, ChevronRight, LayoutTemplate, BarChart2, X, GripVertical, Filter, Columns, Clock, Menu, Settings, ChevronLeft, ShieldCheck, User, Users, UserCog } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragStartEvent, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import cronstrue from 'cronstrue';

interface Role {
    id: number;
    name: string;
    parentId: number | null;
    users: string[];
    children?: Role[];
}
interface Profile {
    id: number;
    name: string;
    description: string;
    users: string[];
}

interface PermissionSet {
    id: number;
    name: string;
    description?: string;
}
interface PermissionSetGroup {
    id: number;
    name: string;
    description?: string;
    permissionSetIds: number[];
}

interface SharingRule {
    id: number;
    objectId: number;
    accessLevel: 'Read' | 'Read/Write';
    type: 'criteria' | 'owner';
    criteria?: { field: string; operator: string; value: string }[];
    shareWith: { type: 'role' | 'group' | 'user'; id: number };
}

const FIELD_TYPE_METADATA: Record<string, {
    label: string;
    options: { name: string; label: string; type: string }[];
    validations: { name: string; label: string; type: string }[];
}> = {
    autonumber: {
        label: 'Auto Number',
        options: [
            { name: 'display_format', label: 'Display Format', type: 'string' },
            { name: 'starting_number', label: 'Starting Number', type: 'number' }
        ],
        validations: []
    },
    formula: {
        label: 'Formula',
        options: [
            { name: 'formula', label: 'Formula Expression', type: 'string' },
            { name: 'return_type', label: 'Return Type', type: 'string' }
        ],
        validations: []
    },
    lookup: {
        label: 'Lookup Relationship',
        options: [
            { name: 'related_object', label: 'Related Object', type: 'object' },
            { name: 'relationship_name', label: 'Relationship Name', type: 'string' }
        ],
        validations: []
    },
    masterdetail: {
        label: 'Master-Detail Relationship',
        options: [
            { name: 'related_object', label: 'Related Object', type: 'object' },
            { name: 'relationship_name', label: 'Relationship Name', type: 'string' }
        ],
        validations: []
    },
    checkbox: {
        label: 'Checkbox',
        options: [
            { name: 'default', label: 'Default Value', type: 'boolean' }
        ],
        validations: []
    },
    currency: {
        label: 'Currency',
        options: [
            { name: 'precision', label: 'Precision', type: 'number' },
            { name: 'scale', label: 'Decimal Places', type: 'number' },
            { name: 'default', label: 'Default Value', type: 'number' }
        ],
        validations: [
            { name: 'min', label: 'Min Value', type: 'number' },
            { name: 'max', label: 'Max Value', type: 'number' }
        ]
    },
    date: {
        label: 'Date',
        options: [
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    datetime: {
        label: 'Date/Time',
        options: [
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    email: {
        label: 'Email',
        options: [
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    geolocation: {
        label: 'Geolocation',
        options: [
            { name: 'decimal_places', label: 'Decimal Places', type: 'number' }
        ],
        validations: []
    },
    number: {
        label: 'Number',
        options: [
            { name: 'precision', label: 'Precision', type: 'number' },
            { name: 'scale', label: 'Decimal Places', type: 'number' },
            { name: 'default', label: 'Default Value', type: 'number' }
        ],
        validations: [
            { name: 'min', label: 'Min Value', type: 'number' },
            { name: 'max', label: 'Max Value', type: 'number' }
        ]
    },
    percent: {
        label: 'Percent',
        options: [
            { name: 'precision', label: 'Precision', type: 'number' },
            { name: 'scale', label: 'Decimal Places', type: 'number' },
            { name: 'default', label: 'Default Value', type: 'number' }
        ],
        validations: [
            { name: 'min', label: 'Min Value', type: 'number' },
            { name: 'max', label: 'Max Value', type: 'number' }
        ]
    },
    phone: {
        label: 'Phone',
        options: [
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    picklist: {
        label: 'Picklist',
        options: [
            { name: 'picklist_options', label: 'Picklist Options', type: 'string[]' },
            { name: 'default', label: 'Default Value', type: 'string' },
            { name: 'restricted', label: 'Restrict to Values', type: 'boolean' }
        ],
        validations: []
    },
    multipicklist: {
        label: 'Picklist (Multi-Select)',
        options: [
            { name: 'picklist_options', label: 'Picklist Options', type: 'string[]' },
            { name: 'default', label: 'Default Value', type: 'string[]' },
            { name: 'restricted', label: 'Restrict to Values', type: 'boolean' }
        ],
        validations: []
    },
    text: {
        label: 'Text',
        options: [
            { name: 'length', label: 'Length', type: 'number' },
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    textarea: {
        label: 'Text Area',
        options: [
            { name: 'length', label: 'Length', type: 'number' },
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    longtextarea: {
        label: 'Text Area (Long)',
        options: [
            { name: 'length', label: 'Length', type: 'number' },
            { name: 'visible_lines', label: 'Visible Lines', type: 'number' },
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    richtextarea: {
        label: 'Text Area (Rich)',
        options: [
            { name: 'length', label: 'Length', type: 'number' },
            { name: 'visible_lines', label: 'Visible Lines', type: 'number' },
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    encryptedtext: {
        label: 'Text (Encrypted)',
        options: [
            { name: 'length', label: 'Length', type: 'number' },
            { name: 'mask_type', label: 'Mask Type', type: 'string' },
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    time: {
        label: 'Time',
        options: [
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    url: {
        label: 'URL',
        options: [
            { name: 'default', label: 'Default Value', type: 'string' }
        ],
        validations: []
    },
    externallookup: {
        label: 'External Lookup',
        options: [
            { name: 'related_object', label: 'Related Object', type: 'object' },
            { name: 'relationship_name', label: 'Relationship Name', type: 'string' }
        ],
        validations: []
    },
    indirectlookup: {
        label: 'Indirect Lookup',
        options: [
            { name: 'related_object', label: 'Related Object', type: 'object' },
            { name: 'relationship_name', label: 'Relationship Name', type: 'string' }
        ],
        validations: []
    },
    file: {
        label: 'File',
        options: [
            { name: 'file_types', label: 'Allowed File Types', type: 'string[]' },
            { name: 'max_size', label: 'Max File Size (MB)', type: 'number' }
        ],
        validations: []
    },
    metadatarelationship: {
        label: 'Metadata Relationship',
        options: [
            { name: 'related_metadata_type', label: 'Related Metadata Type', type: 'string' }
        ],
        validations: []
    },
};

const formatCronExpression = (cron: string) => {
    const parts = cron.split(' ');
    if (parts.length === 5) {
        const [minute, hour, day, month, weekday] = parts;
        if (weekday !== '*') {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return `${hour}:${minute} ${days[parseInt(weekday)]}`;
        }
        if (day !== '*') {
            return `${hour}:${minute} ${month}/${day}`;
        }
        return `${hour}:${minute} daily`;
    }
    return cron;
};

function toApiName(name: string): string {
    return `custom_${name.toLowerCase().replace(/\s+/g, '_')}`;
}

function useSidebarCollapse(defaultCollapsed = false) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768;
        }
        return defaultCollapsed;
    });
    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return [collapsed, setCollapsed] as const;
}

function useModal() {
    const [isOpen, setIsOpen] = useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
}

function useFormState<T>(initial: T) {
    const [state, setState] = useState<T>(initial);
    const handleChange = (key: keyof T, value: any) => setState(prev => ({ ...prev, [key]: value }));
    return [state, handleChange, setState] as const;
}

interface FormFieldProps {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
    helpText?: string;
    required?: boolean;
}
const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, children, helpText, required }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {helpText && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helpText}</p>}
    </div>
);

interface DataTableColumn<T> {
    key: string;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}
interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    emptyMessage?: string;
}
function DataTable<T extends Record<string, any> & { id: number | string }>({ columns, data, emptyMessage }: DataTableProps<T>) {
    return (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    {columns.map(col => (
                        <th key={String(col.key)} scope="col" className="px-6 py-3">{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? data.map(row => (
                    <tr key={row.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        {columns.map(col => (
                            <td key={String(col.key)} className="px-6 py-4">
                                {col.render ? col.render(row[col.key], row) : row[col.key] as React.ReactNode}
                            </td>
                        ))}
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={columns.length} className="text-center p-10 text-gray-500">{emptyMessage || 'No data found.'}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

interface SidebarProps {
    title: string;
    sections: { title: string; items: { id: number | string; name: string; }[] }[];
    collapsed: boolean;
    onCollapse: () => void;
    onSelect: (item: { id: number | string; name: string; }) => void;
    selectedId: number | string | undefined;
}

const Sidebar: React.FC<SidebarProps> = ({ title, sections, collapsed, onCollapse, onSelect, selectedId }) => (
    <div className={`transition-all duration-200 flex flex-col ${collapsed ? 'w-12 min-w-12 items-center justify-center' : 'w-64'} border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="font-bold text-gray-800 dark:text-gray-200">{title}</span>
            <button onClick={onCollapse} className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
        </div>
        {!collapsed && sections.map(section => (
            <div key={section.title}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-gray-800 dark:text-gray-200">{section.title}</span>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <ul>
                        {section.items.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => onSelect(item)}
                                    className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none ${selectedId === item.id ? 'bg-indigo-50 dark:bg-indigo-900/50' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`font-semibold ${selectedId === item.id ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>{item.name}</span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        ))}
    </div>
);

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title: string;
    maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, title, maxWidth = "max-w-md" }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full ${maxWidth} transform transition-all my-8`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-1.5">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface SObject {
    id: number;
    uuid: string;
    name: string;
    table_name: string;
    created_at: string;
}

interface SField {
    id: number;
    label: string;
    column_name: string;
    data_type: string;
    is_required: boolean;
    lookup_object_id?: number;
    picklist_options?: string[];
}

interface FieldData {
    label: string;
    data_type: string;
    is_required: boolean;
    lookup_object_id?: number;
    picklist_options?: string[];
}

interface Filter {
    id: number;
    field: string;
    operator: string;
    value: string;
}

interface ObjectData {
    name: string;
}

interface Task {
    id: number;
    name: string;
    command: string;
    cron: string;
    is_enabled: boolean;
    timezone?: string;
    args?: Record<string, any>;
    opts?: Record<string, any>;
}

interface TaskData {
    name: string;
    command: string;
    cron: string;
    is_enabled: boolean;
    timezone?: string;
    args?: Record<string, any>;
    opts?: Record<string, any>;
}

interface CommandArgOption {
    name: string;
    type: 'string' | 'integer' | 'boolean' | 'array';
    required: boolean;
    isOption?: boolean;
    description?: string;
    array?: boolean;
    default?: any;
}

const timezones = [
    'UTC', 'GMT', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Dubai', 'Australia/Sydney'
];

interface CommandMeta {
    name: string;
    description: string;
    arguments: CommandArgOption[];
    options: CommandArgOption[];
}

type OWDLevel = 'Private' | 'Read' | 'Read/Write';

const initialMockData = {
    objects: [
        { id: 1, uuid: 'OBJ-01H8X...', name: 'Project Task', table_name: 'custom_project_tasks', created_at: '2025-07-20T10:00:00Z' },
        { id: 2, uuid: 'OBJ-01H8Y...', name: 'Sales Lead', table_name: 'custom_sales_leads', created_at: '2025-07-19T14:30:00Z' },
        { id: 3, uuid: 'OBJ-01H8Z...', name: 'Support Ticket', table_name: 'custom_support_tickets', created_at: '2025-07-18T09:00:00Z' },
    ],
    fields: {
        1: [
            { id: 101, label: 'Task Name', column_name: 'task_name', data_type: 'string', is_required: true },
            { id: 102, label: 'Due Date', column_name: 'due_date', data_type: 'datetime', is_required: true },
            { id: 103, label: 'Status', column_name: 'status', data_type: 'string', is_required: false },
            { id: 104, label: 'Description', column_name: 'description', data_type: 'text', is_required: false },
        ],
        2: [
            { id: 201, label: 'Lead Source', column_name: 'lead_source', data_type: 'string', is_required: true },
            { id: 202, label: 'Contact Email', column_name: 'contact_email', data_type: 'string', is_required: true },
            { id: 203, label: 'Estimated Value', column_name: 'estimated_value', data_type: 'integer', is_required: false },
        ],
        3: [],
    } as Record<number, SField[]>,
    layouts: [
        { id: 1, name: 'Default Project Task Layout', objectId: 1, fieldOrder: [101, 102, 103] },
        { id: 2, name: 'Sales Lead Compact', objectId: 2, fieldOrder: [201, 202] },
    ] as Layout[],
    tasks: [
        { id: 1, name: 'Daily Salesforce Sync', command: 'sync:salesforce', args: { object: 'Lead' }, opts: { force: true, ids: ['ID1', 'ID2'] }, cron: '0 2 * * *', is_enabled: true },
        { id: 2, name: 'Weekly System Backup', command: 'backup:run', args: {}, opts: { disk: 's3', notify: true }, cron: '0 4 * * 1', is_enabled: true },
        { id: 3, name: 'Send Monthly Invoices', command: 'invoices:send-monthly', args: { month: '2025-08' }, opts: { 'dry-run': true }, cron: '0 9 1 * *', is_enabled: false },
    ],
    commands: [
        {
            name: 'sync:salesforce',
            description: 'Sync data with Salesforce',
            arguments: [
                { name: 'object', type: 'string', required: true, description: 'Object to sync (e.g., Account, Lead)' },
            ],
            options: [
                { name: 'force', type: 'boolean', required: false, isOption: true, description: 'Force sync even if up-to-date' },
                { name: 'ids', type: 'array', required: false, isOption: true, description: 'IDs to sync (comma separated)', array: true },
            ],
        },
        {
            name: 'backup:run',
            description: 'Run system backup',
            arguments: [],
            options: [
                { name: 'disk', type: 'string', required: false, isOption: true, description: 'Backup disk name' },
                { name: 'notify', type: 'boolean', required: false, isOption: true, description: 'Send notification after backup' },
            ],
        },
        {
            name: 'invoices:send-monthly',
            description: 'Send monthly invoices',
            arguments: [
                { name: 'month', type: 'string', required: false, description: 'Month to send invoices for (YYYY-MM)' },
            ],
            options: [
                { name: 'dry-run', type: 'boolean', required: false, isOption: true, description: 'Preview only, do not send' },
            ],
        },
    ] as CommandMeta[],
    roles: [
        { id: 1, name: 'CEO', parentId: null },
        { id: 2, name: 'Sales Manager', parentId: 1 },
        { id: 3, name: 'Support Manager', parentId: 1 },
        { id: 4, name: 'Sales Rep', parentId: 2 },
        { id: 5, name: 'Support Agent', parentId: 3 },
    ] as Role[],
    profiles: [
        { id: 1, name: 'System Administrator', description: 'Manages all aspects of the system' },
        { id: 2, name: 'Sales User', description: 'Handles sales-related tasks' },
        { id: 3, name: 'Support User', description: 'Provides support for users' },
    ] as Profile[],
    permissionSets: [
        { id: 1, name: 'View Reports', description: 'Can view all reports' },
        { id: 2, name: 'Manage Users', description: 'Can add/edit/delete users' },
    ],
    permissionSetGroups: [
        { id: 1, name: 'Admin Group', description: 'All admin permissions', permissionSetIds: [1, 2] },
    ],
    fieldPermissions: [
        { id: 1, objectId: 1, field: 'Task Name', profileId: 1, canRead: true, canEdit: true },
        { id: 2, objectId: 1, field: 'Due Date', profileId: 1, canRead: true, canEdit: false },
    ] as FieldPermission[],
    users: [
        { id: 1, name: 'Alice Admin', email: 'alice@example.com', roleId: 1, profileId: 1, permissionSetIds: [], permissionSetGroupIds: [] },
        { id: 2, name: 'Bob Sales', email: 'bob@example.com', roleId: 2, profileId: 2, permissionSetIds: [], permissionSetGroupIds: [] },
        { id: 3, name: 'Carol Rep', email: 'carol@example.com', roleId: 4, profileId: 2, permissionSetIds: [], permissionSetGroupIds: [] },
        { id: 4, name: 'Dave Support', email: 'dave@example.com', roleId: 5, profileId: 3, permissionSetIds: [], permissionSetGroupIds: [] },
    ] as User[],
    objectPermissions: [
        { id: 1, objectId: 1, profileId: 1, canCreate: true, canRead: true, canUpdate: true, canDelete: true },
        { id: 2, objectId: 1, permissionSetId: 1, canCreate: false, canRead: true, canUpdate: false, canDelete: false },
    ] as ObjectPermission[],
    OWD: {
        1: 'Read/Write',
        2: 'Read',
        3: 'Private',
    } as Record<number, OWDLevel>,
    sharingRules: [
        {
            id: 1,
            objectId: 1,
            accessLevel: 'Read/Write',
            type: 'criteria',
            criteria: [{ field: 'status', operator: '=', value: 'Urgent' }],
            shareWith: { type: 'role', id: 2 },
        },
    ] as SharingRule[],
};

interface SortableFieldProps {
    field: SField;
}

const SortableField: React.FC<SortableFieldProps> = ({ field }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm cursor-grab touch-none">
            <GripVertical size={16} className="text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{field.label}</span>
        </div>
    );
};

interface FieldDropZoneProps {
    id: string;
    fields: SField[];
}

const FieldDropZone: React.FC<FieldDropZoneProps> = ({ id, fields }) => {
    return (
        <SortableContext id={id} items={fields} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[300px]">
                {fields.map(field => <SortableField key={field.id} field={field} />)}
            </div>
        </SortableContext>
    );
};

interface CreateObjectFormProps {
    onSave: (data: ObjectData) => void;
    onCancel: () => void;
    initialValues?: Partial<ObjectData>;
}

const CreateObjectForm: React.FC<CreateObjectFormProps> = ({ onSave, onCancel, initialValues }) => {
    const [name, setName] = useState(initialValues?.name || '');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({ name });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Object Name" htmlFor="object-name" helpText="This will become the display name for your object." required>
                <input
                    type="text"
                    id="object-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Customer Invoice"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </FormField>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">Create Object</button>
            </div>
        </form>
    );
};

interface AddFieldFormProps {
    onSave: (data: FieldData) => void;
    onCancel: () => void;
    objects: SObject[];
    initialValues?: Partial<FieldData>;
}

const AddFieldForm: React.FC<AddFieldFormProps> = ({ onSave, onCancel, objects, initialValues }) => {
    const [label, setLabel] = useState(initialValues?.label || '');
    const [dataType, setDataType] = useState(initialValues?.data_type || 'string');
    const [isRequired, setIsRequired] = useState(initialValues?.is_required || false);
    const [optionsState, setOptionsState] = useState<Record<string, any>>(() => {
        const meta = FIELD_TYPE_METADATA[initialValues?.data_type || 'string'];
        const state: Record<string, any> = {};
        if (meta && meta.options) {
            for (const opt of meta.options) {
                if (initialValues && (initialValues as any)[opt.name] !== undefined) {
                    state[opt.name] = (initialValues as any)[opt.name];
                } else if (opt.type === 'boolean') {
                    state[opt.name] = false;
                } else if (opt.type === 'string[]') {
                    state[opt.name] = '';
                } else {
                    state[opt.name] = '';
                }
            }
        }
        return state;
    });
    const [validationsState, setValidationsState] = useState<Record<string, any>>(() => {
        const meta = FIELD_TYPE_METADATA[initialValues?.data_type || 'string'];
        const state: Record<string, any> = {};
        if (meta && meta.validations) {
            for (const val of meta.validations) {
                if (initialValues && (initialValues as any)[val.name] !== undefined) {
                    state[val.name] = (initialValues as any)[val.name];
                } else {
                    state[val.name] = '';
                }
            }
        }
        return state;
    });

    useEffect(() => {
        const meta = FIELD_TYPE_METADATA[dataType];
        const newOptions: Record<string, any> = {};
        if (meta && meta.options) {
            for (const opt of meta.options) {
                if (optionsState[opt.name] !== undefined) {
                    newOptions[opt.name] = optionsState[opt.name];
                } else if (opt.type === 'boolean') {
                    newOptions[opt.name] = false;
                } else if (opt.type === 'string[]') {
                    newOptions[opt.name] = '';
                } else {
                    newOptions[opt.name] = '';
                }
            }
        }
        setOptionsState(newOptions);
        const newValidations: Record<string, any> = {};
        if (meta && meta.validations) {
            for (const val of meta.validations) {
                if (validationsState[val.name] !== undefined) {
                    newValidations[val.name] = validationsState[val.name];
                } else {
                    newValidations[val.name] = '';
                }
            }
        }
        setValidationsState(newValidations);
    }, [dataType]);

    const handleOptionChange = (name: string, value: any) => {
        setOptionsState(prev => ({ ...prev, [name]: value }));
    };
    const handleValidationChange = (name: string, value: any) => {
        setValidationsState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fieldData: FieldData = {
            label,
            data_type: dataType,
            is_required: isRequired,
            ...optionsState,
            ...validationsState,
        };
        onSave(fieldData);
    };

    const meta = FIELD_TYPE_METADATA[dataType];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Field Label" htmlFor="field-label" required>
                <input
                    type="text"
                    id="field-label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g., Priority Level"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </FormField>
            <FormField label="Data Type" htmlFor="data-type">
                <select
                    id="data-type"
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                >
                    {Object.entries(FIELD_TYPE_METADATA).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                    ))}
                </select>
            </FormField>
            {meta && meta.options && meta.options.map((opt: any) => (
                <FormField key={opt.name} label={opt.label} htmlFor={opt.name}>
                    {opt.type === 'boolean' ? (
                        <input
                            type="checkbox"
                            id={opt.name}
                            checked={!!optionsState[opt.name]}
                            onChange={e => handleOptionChange(opt.name, e.target.checked)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                    ) : opt.type === 'string[]' ? (
                        <textarea
                            id={opt.name}
                            rows={3}
                            value={optionsState[opt.name] || ''}
                            onChange={e => handleOptionChange(opt.name, e.target.value)}
                            placeholder="Enter one value per line"
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                        />
                    ) : opt.type === 'object' ? (
                        <select
                            id={opt.name}
                            value={optionsState[opt.name] || objects[0]?.id || ''}
                            onChange={e => handleOptionChange(opt.name, parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            {objects.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    ) : (
                        <input
                            type={opt.type === 'number' ? 'number' : 'text'}
                            id={opt.name}
                            value={optionsState[opt.name] || ''}
                            onChange={e => handleOptionChange(opt.name, e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                        />
                    )}
                </FormField>
            ))}
            {meta && meta.validations && meta.validations.map((val: any) => (
                <FormField key={val.name} label={val.label} htmlFor={val.name}>
                    <input
                        type={val.type === 'number' ? 'number' : 'text'}
                        id={val.name}
                        value={validationsState[val.name] || ''}
                        onChange={e => handleValidationChange(val.name, e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                    />
                </FormField>
            ))}
            <div className="flex items-center">
                <input
                    id="is-required" type="checkbox" checked={isRequired}
                    onChange={(e) => setIsRequired(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="is-required" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">This field is required</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">{initialValues ? 'Update Field' : 'Add Field'}</button>
            </div>
        </form>
    );
};

interface ObjectManagerProps {
    objects: SObject[];
    fields: Record<number, SField[]>;
    onAddObject: (object: SObject) => void;
    onAddField: (objectId: number, field: SField) => void;
    setObjects: React.Dispatch<React.SetStateAction<SObject[]>>;
    setFields: React.Dispatch<React.SetStateAction<Record<number, SField[]>>>;
}

const ObjectManager: React.FC<ObjectManagerProps> = ({ objects, fields, onAddObject, onAddField, setObjects, setFields }) => {
    const [selectedObject, setSelectedObject] = useState<SObject | null>(objects[0] || null);
    const [isObjectModalOpen, setObjectModalOpen] = useState(false);
    const [isFieldModalOpen, setFieldModalOpen] = useState(false);
    const selectedObjectFields = useMemo(() => {
        return selectedObject ? fields[selectedObject.id] || [] : [];
    }, [selectedObject, fields]);

    const [editingField, setEditingField] = useState<SField | null>(null);
    const [isFieldEditModalOpen, setFieldEditModalOpen] = useState(false);
    const [owd, setOwd] = useState<Record<number, OWDLevel>>(initialMockData.OWD);
    const [owdModalObject, setOwdModalObject] = useState<SObject | null>(null);
    const [owdValue, setOwdValue] = useState<OWDLevel>('Private');
    const [objectActionAnchor, setObjectActionAnchor] = useState<number | null>(null);
    const [objectToEdit, setObjectToEdit] = useState<SObject | null>(null);
    const [objectToDelete, setObjectToDelete] = useState<SObject | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();

    const handleAddObject = (data: ObjectData) => {
        const newObject: SObject = {
            id: Math.max(0, ...objects.map(o => o.id)) + 1,
            uuid: `OBJ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            name: data.name,
            table_name: `custom_${data.name.toLowerCase().replace(/\s+/g, '_')}`,
            created_at: new Date().toISOString(),
        };
        onAddObject(newObject);
        setObjectModalOpen(false);
        setSelectedObject(newObject);
    };

    const handleAddField = (data: FieldData) => {
        const newField: SField = {
            id: Math.max(0, ...Object.values(fields).flat().map(f => (f as SField).id)) + 1,
            column_name: data.label.toLowerCase().replace(/\s+/g, '_'),
            ...data
        };
        if (selectedObject) {
            onAddField(selectedObject.id, newField);
        }
        setFieldModalOpen(false);
    };

    const handleObjectSelect = (object: SObject) => {
        setSelectedObject(object);
    };

    const handleEditField = (field: SField) => {
        setEditingField(field);
        setFieldEditModalOpen(true);
    };
    const handleUpdateField = (data: FieldData) => {
        if (!selectedObject || !editingField) return;
        setFields((prev: typeof fields) => ({
            ...prev,
            [selectedObject.id]: prev[selectedObject.id].map((f: SField) =>
                f.id === editingField.id ? { ...editingField, ...data, column_name: data.label.toLowerCase().replace(/\s+/g, '_') } : f
            )
        }));
        setEditingField(null);
        setFieldEditModalOpen(false);
    };
    const handleDeleteField = (fieldId: number) => {
        if (!selectedObject) return;
        setFields((prev: typeof fields) => ({
            ...prev,
            [selectedObject.id]: prev[selectedObject.id].filter((f: SField) => f.id !== fieldId)
        }));
    };

    const handleOpenOwdModal = (obj: SObject) => {
        setOwdModalObject(obj);
        setOwdValue(owd[obj.id] || 'Private');
        setObjectActionAnchor(null);
    };
    const handleSaveOwd = () => {
        if (owdModalObject) {
            setOwd(prev => ({ ...prev, [owdModalObject.id]: owdValue }));
            setOwdModalObject(null);
        }
    };
    const handleOpenCreateObject = () => {
        setObjectModalOpen(true);
        setObjectToEdit(null);
    };
    const confirmDeleteObject = () => {
        if (objectToDelete) {
            setObjects((prev: SObject[]) => {
                const updated = prev.filter((o: SObject) => o.id !== objectToDelete.id);
                if (selectedObject?.id === objectToDelete.id) {
                    setSelectedObject(updated[0] || null);
                }
                return updated;
            });
            setFields((prev: Record<number, SField[]>) => {
                const newFields = { ...prev };
                delete newFields[objectToDelete.id];
                return newFields;
            });
            setObjectToDelete(null);
        }
    };

    const fieldColumns: DataTableColumn<SField>[] = [
        { key: 'label', label: 'Field Label' },
        { key: 'column_name', label: 'Column Name', render: (v: string) => <span className="font-mono">{v}</span> },
        { key: 'data_type', label: 'Data Type', render: (v: string) => <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{v}</span> },
        { key: 'is_required', label: 'Required', render: (v: boolean) => v ? 'Yes' : 'No' },
        {
            key: 'id', label: 'Actions', render: (_: any, row: SField) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleEditField(row)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                    >Edit</button>
                    <button
                        onClick={() => handleDeleteField(row.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                    >Delete</button>
                </div>
            )
        },
    ];

    return (
        <div className="flex h-full">
            <div className={`transition-all duration-200 flex flex-col ${sidebarCollapsed ? 'w-12 min-w-12 items-center justify-center' : 'w-64'} border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    {!sidebarCollapsed && <span className="font-bold text-gray-800 dark:text-gray-200"><span className="font-bold text-gray-800 dark:text-gray-200">Objects</span></span>}
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                        {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
                <div className="flex-grow p-2 space-y-2">
                    {objects.map(obj => (
                        <SidebarSection key={obj.id} icon={<TableProperties size={20} />} label={obj.name} collapsed={sidebarCollapsed} active={selectedObject?.id === obj.id} onClick={() => handleObjectSelect(obj)} />
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col min-w-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        {selectedObject && (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{selectedObject.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">API Name: <span className="font-mono">{selectedObject.table_name}</span></p>
                            </>
                        )}
                    </div>
                    {selectedObject && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleOpenOwdModal(selectedObject)}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <Settings size={16} className="mr-2" />
                                Settings
                            </button>
                            <button
                                onClick={() => setFieldModalOpen(true)}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                            >
                                <Plus size={16} className="mr-2" />
                                Add Field
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                    {selectedObject ? (
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
                            <DataTable columns={fieldColumns} data={selectedObjectFields} emptyMessage="No custom fields defined for this object yet." />
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <p className="mb-4">Select an object to see its details and fields.</p>
                                <button
                                    onClick={handleOpenCreateObject}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                                >
                                    <Plus size={16} className="mr-2 inline" />
                                    Create First Object
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Only show create modal if not editing */}
            <Modal isOpen={isObjectModalOpen && !objectToEdit} onClose={() => setObjectModalOpen(false)} title="Create New Object">
                <CreateObjectForm onSave={handleAddObject} onCancel={() => setObjectModalOpen(false)} />
            </Modal>
            {/* Only show edit modal if editing */}
            <Modal isOpen={!!objectToEdit} onClose={() => setObjectToEdit(null)} title="Edit Object">
                {objectToEdit && (
                    <CreateObjectForm
                        onSave={data => {
                            const updated: SObject = { ...objectToEdit, name: data.name, table_name: `custom_${data.name.toLowerCase().replace(/\s+/g, '_')}` };
                            setObjects((prev: SObject[]) => prev.map((o: SObject) => o.id === objectToEdit.id ? updated : o));
                            setObjectToEdit(null);
                        }}
                        onCancel={() => setObjectToEdit(null)}
                        initialValues={{ name: objectToEdit.name }}
                    />
                )}
            </Modal>
            {selectedObject && (
                <Modal isOpen={isFieldModalOpen} onClose={() => setFieldModalOpen(false)} title={`Add Field to "${selectedObject.name}"`}>
                    <AddFieldForm onSave={handleAddField} onCancel={() => setFieldModalOpen(false)} objects={objects} initialValues={{ label: selectedObject.name, data_type: 'string', is_required: true }} />
                </Modal>
            )}
            {selectedObject && editingField && (
                <Modal isOpen={isFieldEditModalOpen} onClose={() => { setEditingField(null); setFieldEditModalOpen(false); }} title={`Edit Field in "${selectedObject.name}"`}>
                    <AddFieldForm
                        onSave={handleUpdateField}
                        onCancel={() => { setEditingField(null); setFieldEditModalOpen(false); }}
                        objects={objects}
                        initialValues={editingField}
                    />
                </Modal>
            )}
            {/* OWD Modal */}
            <Modal isOpen={!!owdModalObject} onClose={() => setOwdModalObject(null)} title={`Object Settings: ${owdModalObject?.name || ''}`}>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-md font-semibold mb-2">Org-Wide Default</h3>
                        <label className="block text-sm font-medium mb-2">Default Access</label>
                        <select
                            value={owdValue}
                            onChange={e => setOwdValue(e.target.value as OWDLevel)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            <option value="Private">Private</option>
                            <option value="Read">Read</option>
                            <option value="Read/Write">Read/Write</option>
                        </select>
                    </div>
                    {/* Future settings sections can go here */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setOwdModalObject(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                        <button onClick={handleSaveOwd} className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700">Save</button>
                    </div>
                </div>
            </Modal>
            {/* Delete confirmation modal */}
            <Modal isOpen={!!objectToDelete} onClose={() => setObjectToDelete(null)} title="Delete Object?">
                <div className="space-y-4">
                    <p>Are you sure you want to delete <b>{objectToDelete?.name}</b>? This cannot be undone.</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setObjectToDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button>
                        <button onClick={confirmDeleteObject} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

interface LayoutBuilderProps {
    objects: SObject[];
    fields: Record<number, SField[]>;
}

interface Layout {
    id: number;
    name: string;
    objectId: number;
    fieldOrder: number[];
}

const DraggableField: React.FC<{ field: SField }> = ({ field }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: field.id });
    if (isDragging) return null;
    const style = {
        transform: CSS.Transform.toString(transform),
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm cursor-grab touch-none">
            <GripVertical size={16} className="text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{field.label}</span>
        </div>
    );
};

const DroppableContainer: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ id, children, className }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={className + (isOver ? ' ring-2 ring-indigo-400' : '')}>
            {children}
        </div>
    );
};

const LayoutBuilder: React.FC<LayoutBuilderProps> = ({ objects, fields: allFields }) => {
    const [selectedObject, setSelectedObject] = useState<SObject | null>(objects[0] || null);
    const [availableFields, setAvailableFields] = useState<SField[]>([]);
    const [layoutFields, setLayoutFields] = useState<SField[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [layouts, setLayouts] = useState<Layout[]>(initialMockData.layouts);
    const [selectedLayout, setSelectedLayout] = useState<Layout | null>(initialMockData.layouts[0] || null);
    const [mode, setMode] = useState<'view' | 'edit' | 'new'>('view');
    const [layoutName, setLayoutName] = useState('');
    const [lastSelectedLayout, setLastSelectedLayout] = useState<Layout | null>(selectedLayout);
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();

    useEffect(() => {
        if (mode === 'edit' && selectedLayout) {
            setLayoutName(selectedLayout.name);
            setLastSelectedLayout(selectedLayout);
        } else if (mode === 'new') {
            setLayoutName('');
            setLastSelectedLayout(selectedLayout);
        }
    }, [mode, selectedLayout]);

    const handleSaveLayout = () => {
        // TODO: Implement save logic
        setMode('view');
    };

    const initializeFields = (object: SObject, layout: Layout | null, mode: 'view' | 'edit' | 'new') => {
        const allObjectFields = allFields[object.id as number] || [];
        if ((mode === 'view' || mode === 'edit') && layout && layout.objectId === object.id) {
            setLayoutFields(layout.fieldOrder.map((fid: number) => allObjectFields.find((f: SField) => f.id === fid)).filter((f): f is SField => Boolean(f)));
            setAvailableFields(allObjectFields.filter((f: SField) => !layout.fieldOrder.includes(f.id)));
        } else {
            setLayoutFields([]);
            setAvailableFields(allObjectFields);
        }
    };

    useEffect(() => {
        if (selectedObject) {
            initializeFields(selectedObject, selectedLayout, mode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedObject, selectedLayout, mode]);

    const handleEditLayout = () => {
        if (selectedObject && selectedLayout) {
            initializeFields(selectedObject, selectedLayout, 'edit');
            setMode('edit');
        }
    };
    const handleNewLayout = () => {
        if (selectedObject) {
            initializeFields(selectedObject, null, 'new');
            setSelectedLayout(null);
            setMode('new');
        }
    };
    const handleSelectLayout = (layout: Layout) => {
        setSelectedLayout(layout);
        setMode('view');
    };
    const handleSelectObject = (object: SObject) => {
        setSelectedObject(object);
        const firstLayout = layouts.find(l => l.objectId === object.id) || null;
        setSelectedLayout(firstLayout);
        setMode('view');
    };

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const fieldIdToContainer = (id: UniqueIdentifier) => {
        if (availableFields.some(f => f.id === id)) return 'available';
        if (layoutFields.some(f => f.id === id)) return 'layout';
        return null;
    };

    const getItems = (container: string) => {
        return container === 'available' ? availableFields : layoutFields;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;
        const activeContainer = fieldIdToContainer(active.id);
        const overContainer = fieldIdToContainer(over.id) || (over.id === 'available' ? 'available' : over.id === 'layout' ? 'layout' : null);
        if (!activeContainer || !overContainer) return;
        if (activeContainer === overContainer) {
            const items = getItems(activeContainer);
            const oldIndex = items.findIndex(f => f.id === active.id);
            const newIndex = items.findIndex(f => f.id === over.id);
            if (activeContainer === 'available') {
                setAvailableFields(prev => arrayMove(prev, oldIndex, newIndex));
            } else {
                setLayoutFields(prev => arrayMove(prev, oldIndex, newIndex));
            }
        } else {
            let movedField: SField | undefined;
            if (activeContainer === 'available') {
                movedField = availableFields.find(f => f.id === active.id);
                if (movedField) {
                    setAvailableFields(prev => prev.filter(f => f.id !== active.id));
                    setLayoutFields(prev => {
                        const overIndex = layoutFields.findIndex(f => f.id === over.id);
                        if (overIndex === -1) return [...prev, movedField!];
                        return [...prev.slice(0, overIndex), movedField!, ...prev.slice(overIndex)];
                    });
                }
            } else {
                movedField = layoutFields.find(f => f.id === active.id);
                if (movedField) {
                    setLayoutFields(prev => prev.filter(f => f.id !== active.id));
                    setAvailableFields(prev => {
                        const overIndex = availableFields.findIndex(f => f.id === over.id);
                        if (overIndex === -1) return [...prev, movedField!];
                        return [...prev.slice(0, overIndex), movedField!, ...prev.slice(overIndex)];
                    });
                }
            }
        }
    };

    const activeField = activeId ? [...availableFields, ...layoutFields].find(f => f.id === activeId) : null;

    const handleCancelLayout = () => {
        if (lastSelectedLayout) {
            setSelectedLayout(lastSelectedLayout);
        } else {
            const first = layouts.find(l => l.objectId === selectedObject?.id) || null;
            setSelectedLayout(first);
        }
        setMode('view');
    };

    return (
        <div className="flex h-full">
            <div className={`transition-all duration-200 flex flex-col ${sidebarCollapsed ? 'w-12 min-w-12 items-center justify-center' : 'w-64'} border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    {!sidebarCollapsed && <span className="font-bold text-gray-800 dark:text-gray-200"><span className="font-bold text-gray-800 dark:text-gray-200">Layouts</span></span>}
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                        {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
                <div className="flex-grow p-2 space-y-2">
                    {!sidebarCollapsed && (<><div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <label htmlFor="layout-object-select" className="block text-sm font-medium mb-1">Select Object:</label>
                        <select
                            id="layout-object-select"
                            value={selectedObject?.id || ''}
                            onChange={e => {
                                const obj = objects.find(o => o.id === parseInt(e.target.value));
                                if (obj) handleSelectObject(obj);
                            }}
                            className="w-full max-w-xs px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            {objects.map((o: SObject) => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span className="font-bold text-gray-800 dark:text-gray-200">Layouts</span>
                            <button
                                onClick={handleNewLayout}
                                className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                            >New</button>
                        </div></>)}
                    <div className="flex-grow p-2 space-y-2">
                        {layouts.filter((l: Layout) => l.objectId === selectedObject?.id).map((layout: Layout) => (
                            <SidebarSection key={layout.id} icon={<ShieldCheck size={20} />} label={layout.name} collapsed={sidebarCollapsed} active={selectedLayout?.id === layout.id} onClick={() => handleSelectLayout(layout)} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                {mode === 'view' && selectedLayout ? (
                    <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-2">{selectedLayout.name}</h2>
                            </div>
                            <div className="flex justify-end gap-2 mb-4">
                                <button
                                    onClick={handleEditLayout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                                >Edit Layout</button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                                {layoutFields.map((f: SField) => (
                                    <span key={f.id} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">{f.label}</span>
                                ))}
                            </div>
                        </div>
                    </>
                ) : mode === 'view' && !selectedLayout ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500 text-lg">No layouts found for this object.</div>
                    </div>
                ) : (mode === 'edit' || mode === 'new') && selectedObject ? (
                    <>
                        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-4 gap-2">
                            <input
                                type="text"
                                className="text-lg font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 mr-4"
                                placeholder="Layout Name"
                                value={layoutName}
                                onChange={e => setLayoutName(e.target.value)}
                                style={{ minWidth: 180 }}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveLayout}
                                    className="px-4 py-2 font-medium text-white bg-green-600 rounded hover:bg-green-700"
                                >Save</button>
                                <button
                                    onClick={handleCancelLayout}
                                    className="px-4 py-2 font-medium text-gray-200 bg-gray-700 rounded hover:bg-gray-600"
                                >Cancel</button>
                            </div>
                        </div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 p-4">
                                <div className="lg:col-span-1">
                                    <h2 className="font-semibold mb-3">Available Fields</h2>
                                    <DroppableContainer id="available" className="space-y-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[200px]">
                                        {availableFields.map((field: SField) => <DraggableField key={field.id} field={field} />)}
                                    </DroppableContainer>
                                </div>
                                <div className="lg:col-span-2">
                                    <h2 className="font-semibold mb-3">{selectedObject.name} Layout</h2>
                                    <DroppableContainer id="layout" className="space-y-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[200px]">
                                        {layoutFields.map((field: SField) => <DraggableField key={field.id} field={field} />)}
                                    </DroppableContainer>
                                </div>
                            </div>
                            <DragOverlay>
                                {activeId && activeField ? (
                                    <div className="w-60">
                                        <DraggableField field={activeField} />
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    </>
                ) : null}
            </div>
        </div>
    );
};

interface Report {
    id: number;
    name: string;
    objectId: number;
    columns: number[];
    filters: Filter[];
}

const mockReports: Report[] = [
    { id: 1, name: 'All Project Tasks', objectId: 1, columns: [101, 102, 103], filters: [] },
    { id: 2, name: 'Open Sales Leads', objectId: 2, columns: [201, 202], filters: [{ id: 1, field: 'status', operator: '=', value: 'Open' }] },
];

const ReportBuilder: React.FC<{ objects: SObject[]; fields: Record<number, SField[]>; }> = ({ objects, fields: allFields }) => {
    const [reports, setReports] = useState<Report[]>(mockReports);
    const [selectedReport, setSelectedReport] = useState<Report | null>(mockReports[0] || null);
    const [mode, setMode] = useState<'view' | 'edit' | 'new'>('view');
    const [selectedObject, setSelectedObject] = useState<SObject | null>(
        selectedReport ? objects.find(o => o.id === selectedReport.objectId) || null : objects[0] || null
    );
    const [columns, setColumns] = useState<SField[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [reportName, setReportName] = useState('');
    const [lastSelectedReport, setLastSelectedReport] = useState<Report | null>(selectedReport);
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();

    useEffect(() => {
        if (mode === 'edit' && selectedReport) {
            setReportName(selectedReport.name);
            setLastSelectedReport(selectedReport);
        } else if (mode === 'new') {
            setReportName('');
            setLastSelectedReport(selectedReport);
        }
    }, [mode, selectedReport]);

    const handleSelectObject = (object: SObject) => {
        setSelectedObject(object);
        const firstReport = reports.find(r => r.objectId === object.id) || null;
        setSelectedReport(firstReport);
        setMode('view');
    };

    useEffect(() => {
        if (selectedReport && mode === 'view') {
            const objectFields = allFields[selectedReport.objectId as number] || [];
            setColumns(selectedReport.columns.map(fid => objectFields.find(f => f.id === fid)).filter(Boolean) as SField[]);
            setFilters(selectedReport.filters);
            setSelectedObject(objects.find(o => o.id === selectedReport.objectId) || null);
        } else if (selectedReport && mode === 'edit') {
            const objectFields = allFields[selectedReport.objectId as number] || [];
            setColumns(selectedReport.columns.map(fid => objectFields.find(f => f.id === fid)).filter(Boolean) as SField[]);
            setFilters(selectedReport.filters);
            setSelectedObject(objects.find(o => o.id === selectedReport.objectId) || null);
        } else if (selectedObject && mode === 'new') {
            setColumns([]);
            setFilters([]);
        }
    }, [selectedReport, mode, selectedObject, allFields, objects]);

    const availableFields = useMemo(() => {
        if (!selectedObject) return [];
        const objectFields = allFields[selectedObject.id as number] || [];
        return objectFields.filter(field => !columns.some(c => c.id === field.id));
    }, [selectedObject, allFields, columns]);

    const addColumn = (field: SField) => {
        setColumns(prev => [...prev, field]);
    };

    const removeColumn = (fieldId: number) => {
        setColumns(prev => prev.filter(c => c.id !== fieldId));
    };

    const addFilter = () => {
        const firstField = allFields[selectedObject?.id as number]?.[0];
        if (firstField) {
            setFilters(prev => [...prev, { id: Date.now(), field: firstField.column_name, operator: '=', value: '' }]);
        }
    };

    const updateFilter = (id: number, part: keyof Filter, value: string) => {
        setFilters(prev => prev.map(f => f.id === id ? { ...f, [part]: value } : f));
    };

    const removeFilter = (id: number) => {
        setFilters(prev => prev.filter(f => f.id !== id));
    };

    const handleSaveReport = () => {
        // TODO: Implement save logic
        setMode('view');
    };

    const handleCancelReport = () => {
        if (lastSelectedReport) {
            setSelectedReport(lastSelectedReport);
        } else {
            const first = reports.find(r => r.objectId === selectedObject?.id) || null;
            setSelectedReport(first);
        }
        setMode('view');
    };

    return (
        <div className="flex h-full">
            <div className={`transition-all duration-200 flex flex-col ${sidebarCollapsed ? 'w-12 min-w-12 items-center justify-center' : 'w-64'} border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    {!sidebarCollapsed && <span className="font-bold text-gray-800 dark:text-gray-200"><span className="font-bold text-gray-800 dark:text-gray-200">Reports</span></span>}
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                        {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
                <div className="flex-grow p-2 space-y-2">
                    {!sidebarCollapsed && (<><div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <label htmlFor="report-object-select" className="block text-sm font-medium mb-1">Select Object:</label>
                        <select
                            id="report-object-select"
                            value={selectedObject?.id || ''}
                            onChange={e => {
                                const obj = objects.find(o => o.id === parseInt(e.target.value));
                                if (obj) handleSelectObject(obj);
                            }}
                            className="w-full max-w-xs px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            {objects.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span className="font-bold text-gray-800 dark:text-gray-200">Reports</span>
                            <button
                                onClick={() => { setMode('new'); setSelectedReport(null); }}
                                className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                            >New</button>
                        </div></>)}
                    <div className="flex-grow p-2 space-y-2">
                        {reports.filter(r => r.objectId === selectedObject?.id).map(report => (
                            <SidebarSection key={report.id} icon={<ShieldCheck size={20} />} label={report.name} collapsed={sidebarCollapsed} active={selectedReport?.id === report.id} onClick={() => { setSelectedReport(report); setMode('view'); }} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                {(mode === 'edit' || mode === 'new') ? (
                    <>
                        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-4 gap-2">
                            <input
                                type="text"
                                className="text-lg font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 mr-4"
                                placeholder="Report Name"
                                value={reportName}
                                onChange={e => setReportName(e.target.value)}
                                style={{ minWidth: 180 }}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveReport}
                                    className="px-4 py-2 font-medium text-white bg-green-600 rounded hover:bg-green-700"
                                >Save</button>
                                <button
                                    onClick={handleCancelReport}
                                    className="px-4 py-2 font-medium text-gray-200 bg-gray-700 rounded hover:bg-gray-600"
                                >Cancel</button>
                            </div>
                        </div>
                        {selectedObject && (
                            <div className="p-4">
                                <h1 className="text-2xl font-bold mb-4">Report Builder</h1>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="text-sm font-medium">Available Fields</label>
                                        <div className="mt-1 border rounded-md h-48 overflow-y-auto p-2 space-y-1 bg-gray-50 dark:bg-gray-900">
                                            {availableFields.map(field => (
                                                <button key={field.id} onClick={() => addColumn(field)} className="w-full text-left p-2 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 flex justify-between items-center">
                                                    <span>{field.label}</span>
                                                    <Plus size={16} className="text-green-500" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Selected Columns</label>
                                        <div className="mt-1 border rounded-md h-48 overflow-y-auto p-2 space-y-1 bg-gray-50 dark:bg-gray-900">
                                            {columns.map(field => (
                                                <div key={field.id} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 flex justify-between items-center shadow-sm">
                                                    <span>{field.label}</span>
                                                    <button onClick={() => removeColumn(field.id)}>
                                                        <X size={16} className="text-red-500" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-6 mt-6">
                                    <h2 className="text-lg font-semibold mb-4">Filters</h2>
                                    <div className="mt-4 space-y-3">
                                        {filters.map(filter => (
                                            <div key={filter.id} className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
                                                <select value={filter.field} onChange={e => updateFilter(filter.id, 'field', e.target.value)} className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                                    {(allFields[selectedObject.id as number] || []).map(f => <option key={f.id} value={f.column_name}>{f.label}</option>)}
                                                </select>
                                                <select value={filter.operator} onChange={e => updateFilter(filter.id, 'operator', e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                                    <option value="=">equals</option>
                                                    <option value="!=">not equal to</option>
                                                    <option value=">">greater than</option>
                                                    <option value="<">less than</option>
                                                    <option value="contains">contains</option>
                                                </select>
                                                <input type="text" value={filter.value} onChange={e => updateFilter(filter.id, 'value', e.target.value)} className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                                                <button onClick={() => removeFilter(filter.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full"><X size={16} /></button>
                                            </div>
                                        ))}
                                        <button onClick={addFilter} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                                            <Plus size={16} className="mr-1" /> Add Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : mode === 'view' && selectedReport ? (
                    <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-2">{selectedReport.name}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {columns.map(f => (
                                        <span key={f.id} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">{f.label}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setMode('edit')}
                                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                                >Edit Report</button>
                            </div>
                        </div>
                    </>
                ) : mode === 'view' && !selectedReport ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500 text-lg">No reports found for this object.</div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

interface TaskFormProps {
    onSave: (data: TaskData) => void;
    onCancel: () => void;
    task?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave, onCancel, task }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState<string>(task?.name || '');
    const [command, setCommand] = useState<string>(task?.command || initialMockData.commands[0].name);
    const [cron, setCron] = useState<string>(task?.cron || '');
    const [isEnabled, setIsEnabled] = useState<boolean>(task?.is_enabled ?? true);
    const [timezone, setTimezone] = useState<string>(task?.timezone || 'UTC');

    const initialSchedule = useMemo(() => {
        const defaultSchedule = { frequency: 'daily', time: '02:00', daysOfWeek: ['1'], dayOfMonth: '1', month: '1', interval: 1 };
        if (!task?.cron) return defaultSchedule;
        const parts = task.cron.split(' ');
        if (parts.length !== 5) return defaultSchedule;

        const [minute, hour, dayOfMonth, monthVal, dayOfWeek] = parts;
        const time = `${hour === '*' ? '00' : hour.padStart(2, '0')}:${minute === '*' ? '00' : minute.padStart(2, '0')}`;

        if (monthVal === '1,4,7,10' && dayOfMonth === '1' && hour === '0' && minute === '0') return { ...defaultSchedule, frequency: 'quarterly', time: '00:00' };
        if (dayOfWeek !== '*' && dayOfMonth === '*') { // Weekly
            return { ...defaultSchedule, frequency: 'weekly', time, daysOfWeek: dayOfWeek.split(',') };
        }
        if (dayOfMonth.startsWith('*/')) { // Every X days
            return { ...defaultSchedule, frequency: 'daily', time, interval: parseInt(dayOfMonth.substring(2)) || 1 };
        }
        if (monthVal.startsWith('*/')) { // Every X months
            return { ...defaultSchedule, frequency: 'monthly', time, dayOfMonth, interval: parseInt(monthVal.substring(2)) || 1 };
        }
        if (dayOfMonth !== '*' && dayOfWeek === '*') { // Monthly
            return { ...defaultSchedule, frequency: 'monthly', time, dayOfMonth };
        }
        if (dayOfMonth !== '*' && monthVal !== '*' && dayOfWeek === '*') { // Yearly
            return { ...defaultSchedule, frequency: 'yearly', time, dayOfMonth, month: monthVal };
        }
        if (hour.startsWith('*/') || minute.startsWith('*/')) {
            const freqMap: Record<string, string> = { '*/30': 'everyThirtyMinutes', '*/15': 'everyFifteenMinutes', '*/10': 'everyTenMinutes', '*/5': 'everyFiveMinutes', '*/2': 'everyTwoMinutes' };
            const key = minute.startsWith('*/') ? minute : hour;
            if (freqMap[key]) return { ...defaultSchedule, frequency: freqMap[key] };
        }
        if (hour !== '*' && minute !== '*') return { ...defaultSchedule, frequency: 'daily', time };
        if (hour !== '*' && minute === '0') return { ...defaultSchedule, frequency: 'hourly', time };
        if (hour === '*' && minute !== '*') return { ...defaultSchedule, frequency: 'hourlyAt', customMinute: minute, time };

        return defaultSchedule; // Fallback
    }, [task]);

    const [frequency, setFrequency] = useState<string>(initialSchedule.frequency);
    const [time, setTime] = useState<string>(initialSchedule.time);
    const [daysOfWeek, setDaysOfWeek] = useState<string[]>(initialSchedule.daysOfWeek);
    const [dayOfMonth, setDayOfMonth] = useState<string>(initialSchedule.dayOfMonth);
    const [month, setMonth] = useState<string>(initialSchedule.month);
    const [interval, setInterval] = useState<number>(initialSchedule.interval);
    const [customMinute, setCustomMinute] = useState<string>('15');
    const [args, setArgs] = useState<Record<string, any>>({});
    const [opts, setOpts] = useState<Record<string, any>>({});
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [cronDescription, setCronDescription] = useState<string>('');

    const selectedCommand = initialMockData.commands.find(c => c.name === command) || initialMockData.commands[0];

    useEffect(() => {
        const newArgs = task?.args || {};
        const newOpts = task?.opts || {};

        if (!task || task.command !== command) {
            selectedCommand.arguments.forEach(arg => {
                if (newArgs[arg.name] === undefined) newArgs[arg.name] = arg.default ?? '';
            });
            selectedCommand.options.forEach(opt => {
                if (newOpts[opt.name] === undefined) {
                    if (opt.type === 'boolean') newOpts[opt.name] = false;
                    else if (opt.array) newOpts[opt.name] = [''];
                    else newOpts[opt.name] = opt.default ?? '';
                }
            });
        }
        setArgs(newArgs);
        setOpts(newOpts);
    }, [command, selectedCommand, task]);

    useEffect(() => {
        if (cron) {
            try {
                setCronDescription(cronstrue.toString(cron));
            } catch (e) {
                setCronDescription('Invalid cron expression');
            }
        } else {
            setCronDescription('');
        }
    }, [cron]);

    const handleArgChange = (name: string, value: any) => {
        setArgs(prev => ({ ...prev, [name]: value }));
    };
    const handleOptChange = (name: string, value: any) => {
        setOpts(prev => ({ ...prev, [name]: value }));
    };
    const handleOptArrayChange = (name: string, idx: number, value: any) => {
        setOpts(prev => ({ ...prev, [name]: prev[name].map((v: any, i: number) => i === idx ? value : v) }));
    };
    const addOptArrayItem = (name: string) => {
        setOpts(prev => ({ ...prev, [name]: [...prev[name], ''] }));
    };
    const removeOptArrayItem = (name: string, idx: number) => {
        setOpts(prev => ({ ...prev, [name]: prev[name].filter((_: any, i: number) => i !== idx) }));
    };

    const validateStep1 = () => {
        const errs: string[] = [];
        if (!name.trim()) errs.push('Task name is required.');
        if (!command) errs.push('Command is required.');
        selectedCommand.arguments.forEach(arg => {
            if (arg.required && !args[arg.name]) errs.push(`Argument "${arg.name}" is required.`);
        });
        selectedCommand.options.forEach(opt => {
            if (opt.required && (opt.array ? !opts[opt.name]?.length || opts[opt.name].some((v: any) => !v) : opts[opt.name] === '' || opts[opt.name] === undefined)) {
                errs.push(`Option "${opt.name}" is required.`);
            }
        });
        setErrors(errs);
        return errs.length === 0;
    };

    const handleBack = () => {
        setStep(s => s - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            if (step === 1) {
                if (validateStep1()) setStep(2);
            } else if (step === 2) {
                setStep(3);
            }
        } else {
            const cronExpression = showAdvanced ? cron : generateCronExpression;
            onSave({
                name: name.trim(),
                command,
                cron: cronExpression,
                is_enabled: isEnabled,
                timezone,
                args,
                opts,
            });
        }
    };

    const generateCronExpression = useMemo(() => {
        const [hourStr, minuteStr] = time.split(':');
        const hour = parseInt(hourStr, 10) || 0;
        const minute = parseInt(minuteStr, 10) || 0;
        switch (frequency) {
            case 'everyMinute': return `* * * * *`;
            case 'everyTwoMinutes': return `*/2 * * * *`;
            case 'everyFiveMinutes': return `*/5 * * * *`;
            case 'everyTenMinutes': return `*/10 * * * *`;
            case 'everyFifteenMinutes': return `*/15 * * * *`;
            case 'everyThirtyMinutes': return `*/30 * * * *`;
            case 'hourly': return `0 * * * *`;
            case 'hourlyAt': return `${customMinute} * * * *`;
            case 'daily': return `${minute} ${hour} */${interval} * *`;
            case 'weekly': return `${minute} ${hour} * * ${daysOfWeek.join(',')}`;
            case 'monthly': return `${minute} ${hour} ${dayOfMonth} */${interval} *`;
            case 'quarterly': return `0 0 1 */${interval * 3} *`;
            case 'yearly': return `${minute} ${hour} ${dayOfMonth} ${month} *`;
            default: return `* * * * *`;
        }
    }, [frequency, time, daysOfWeek, dayOfMonth, month, interval, customMinute]);

    useEffect(() => {
        const expression = showAdvanced ? cron : generateCronExpression;
        if (expression) {
            try {
                setCronDescription(cronstrue.toString(expression));
            } catch (e) {
                setCronDescription('Invalid cron expression');
            }
        } else {
            setCronDescription('');
        }
    }, [cron, generateCronExpression, showAdvanced]);

    const steps = ['Task Details', 'Scheduling', 'Summary'];

    return (
        <>
            {/* Static Stepper at the top of the modal */}
            <div className="mb-6 sticky -top-6 z-10 bg-white dark:bg-gray-900 p-4 shadow-sm -ml-6 -mt-6 -mr-6">
                <div className="flex justify-between mb-1">
                    {steps.map((stepName, index) => (
                        <div key={stepName} className={`text-xs font-semibold ${index + 1 <= step ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
                            {stepName}
                        </div>
                    ))}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${(step - 1) / (steps.length - 1) * 100}%` }}></div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
                {errors.length > 0 && (
                    <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                        {errors.map((err, i) => <div key={i}>{err}</div>)}
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="task-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Task Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="task-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Daily Salesforce Sync"
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="task-command" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Artisan Command <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="task-command"
                                value={command}
                                onChange={e => setCommand(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            >
                                {initialMockData.commands.map(cmd => (
                                    <option key={cmd.name} value={cmd.name}>{cmd.name} - {cmd.description}</option>
                                ))}
                            </select>
                        </div>
                        {selectedCommand.arguments.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Arguments</h4>
                                {selectedCommand.arguments.map(arg => (
                                    <div key={arg.name} className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {arg.name} {arg.required && <span className="text-red-500">*</span>}
                                            {arg.description && (
                                                <span className="ml-1 text-xs text-gray-400" title={arg.description}>?</span>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            value={args[arg.name] || ''}
                                            onChange={e => handleArgChange(arg.name, e.target.value)}
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                            required={arg.required}
                                            placeholder={arg.description}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedCommand.options.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Options</h4>
                                {selectedCommand.options.map(opt => (
                                    <div key={opt.name} className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            --{opt.name} {opt.required && <span className="text-red-500">*</span>}
                                            {opt.description && (
                                                <span className="ml-1 text-xs text-gray-400" title={opt.description}>?</span>
                                            )}
                                        </label>
                                        {opt.type === 'boolean' ? (
                                            <input
                                                type="checkbox"
                                                checked={!!opts[opt.name]}
                                                onChange={e => handleOptChange(opt.name, e.target.checked)}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                        ) : opt.array ? (
                                            <div>
                                                {(opts[opt.name] || []).map((v: string, idx: number) => (
                                                    <div key={idx} className="flex items-center mb-1">
                                                        <input
                                                            type="text"
                                                            value={v}
                                                            onChange={e => handleOptArrayChange(opt.name, idx, e.target.value)}
                                                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                                            required={opt.required}
                                                        />
                                                        <button type="button" onClick={() => removeOptArrayItem(opt.name, idx)} className="ml-2 text-red-500">Remove</button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => addOptArrayItem(opt.name)} className="text-xs text-indigo-600 hover:underline">Add Value</button>
                                            </div>
                                        ) : (
                                            <input
                                                type={opt.type === 'integer' ? 'number' : 'text'}
                                                value={opts[opt.name] || ''}
                                                onChange={e => handleOptChange(opt.name, e.target.value)}
                                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                                required={opt.required}
                                                placeholder={opt.description}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="task-timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Timezone
                            </label>
                            <select
                                id="task-timezone"
                                value={timezone}
                                onChange={e => setTimezone(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                            >
                                {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                            </select>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Schedule
                                </label>
                                <button type="button" className="text-xs text-indigo-600 hover:underline" onClick={() => setShowAdvanced(v => !v)}>
                                    {showAdvanced ? 'Use Builder' : 'Advanced (Cron Expression)'}
                                </button>
                            </div>
                            <div className="mt-1">
                                {showAdvanced ? (
                                    <>
                                        <input
                                            type="text"
                                            id="cron-expression"
                                            value={cron}
                                            onChange={(e) => setCron(e.target.value)}
                                            placeholder="e.g., 0 2 * * *"
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                        />
                                        {cron && (
                                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                {cronDescription}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700">
                                        <div className="flex items-center gap-2 flex-wrap text-sm">
                                            <span>Run task</span>
                                            <select
                                                id="frequency"
                                                value={frequency}
                                                onChange={(e) => setFrequency(e.target.value)}
                                                className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                            >
                                                <option value="everyMinute">Every Minute</option>
                                                <option value="everyTwoMinutes">Every Two Minutes</option>
                                                <option value="everyFiveMinutes">Every Five Minutes</option>
                                                <option value="everyTenMinutes">Every Ten Minutes</option>
                                                <option value="everyFifteenMinutes">Every Fifteen Minutes</option>
                                                <option value="everyThirtyMinutes">Every Thirty Minutes</option>
                                                <option value="hourly">Hourly</option>
                                                <option value="hourlyAt">Hourly At</option>
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="quarterly">Quarterly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>

                                            {['daily', 'monthly', 'quarterly'].includes(frequency) && (
                                                <>
                                                    <span>every</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={interval}
                                                        onChange={e => setInterval(parseInt(e.target.value))}
                                                        className="w-16 px-2 py-1 bg-white dark:bg-gray-700 border rounded"
                                                    />
                                                    <span>{frequency === 'daily' ? 'day(s)' : frequency === 'monthly' ? 'month(s)' : 'quarter(s)'}</span>
                                                </>
                                            )}

                                            {frequency === 'hourlyAt' && (
                                                <>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="59"
                                                        value={customMinute}
                                                        onChange={e => setCustomMinute(e.target.value)}
                                                        className="w-20 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                                    />
                                                    <span>minutes past the hour</span>
                                                </>
                                            )}

                                            {['daily', 'weekly', 'monthly', 'yearly'].includes(frequency) && (
                                                <>
                                                    {frequency === 'weekly' && (
                                                        <>
                                                            <span>on:</span>
                                                            <div className="flex gap-2">
                                                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
                                                                    <label key={dayName} className="flex items-center gap-1 text-xs">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={index}
                                                                            checked={daysOfWeek.includes(String(index))}
                                                                            onChange={e => {
                                                                                const day = e.target.value;
                                                                                setDaysOfWeek(prev =>
                                                                                    e.target.checked
                                                                                        ? [...prev, day].sort()
                                                                                        : prev.filter(d => d !== day)
                                                                                );
                                                                            }}
                                                                        />
                                                                        {dayName}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                    {(frequency === 'monthly' || frequency === 'yearly') && (
                                                        <>
                                                            <span>on day</span>
                                                            <input
                                                                type="number"
                                                                id="monthday"
                                                                min="1"
                                                                max="31"
                                                                value={dayOfMonth}
                                                                onChange={(e) => setDayOfMonth(e.target.value)}
                                                                className="w-20 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                                            />
                                                        </>
                                                    )}
                                                    {frequency === 'yearly' && (
                                                        <>
                                                            <span>of</span>
                                                            <select
                                                                id="month"
                                                                value={month}
                                                                onChange={(e) => setMonth(e.target.value)}
                                                                className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                                            >
                                                                <option value="1">January</option>
                                                                <option value="2">February</option>
                                                                <option value="3">March</option>
                                                                <option value="4">April</option>
                                                                <option value="5">May</option>
                                                                <option value="6">June</option>
                                                                <option value="7">July</option>
                                                                <option value="8">August</option>
                                                                <option value="9">September</option>
                                                                <option value="10">October</option>
                                                                <option value="11">November</option>
                                                                <option value="12">December</option>
                                                            </select>
                                                        </>
                                                    )}
                                                    <span>at</span>
                                                    <input
                                                        type="time"
                                                        id="time"
                                                        value={time}
                                                        onChange={(e) => setTime(e.target.value)}
                                                        className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <p>Cron: <span className="font-mono text-gray-700 dark:text-gray-300">{generateCronExpression}</span></p>
                                            <p className="capitalize">{cronDescription}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold mb-4">Confirm Task Details</h3>
                        <TaskDetails task={{
                            id: task?.id || 0,
                            name,
                            command,
                            cron: showAdvanced ? cron : generateCronExpression,
                            is_enabled: isEnabled,
                            timezone,
                            args,
                            opts,
                        }} />
                        <div className="flex items-center mt-4">
                            <input
                                id="is-enabled"
                                type="checkbox"
                                checked={isEnabled}
                                onChange={(e) => setIsEnabled(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="is-enabled" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Enable this task upon saving
                            </label>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <div className="flex items-center gap-2">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                Back
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                            >
                                {task ? 'Update Task' : 'Create Task'}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
};

interface TaskSchedulerProps {
    tasks?: Task[];
    onAddTask?: (task: Task) => void;
    onUpdateTask?: (task: Task) => void;
    onDeleteTask?: (taskId: number) => void;
    onToggleTask?: (taskId: number, enabled: boolean) => void;
}

const TaskScheduler: React.FC<TaskSchedulerProps> = ({
    tasks = initialMockData.tasks,
    onAddTask,
    onUpdateTask,
    onDeleteTask,
    onToggleTask
}) => {
    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [viewingTask, setViewingTask] = useState<Task | null>(null);

    const handleAddTask = (data: TaskData) => {
        const newTask: Task = {
            id: Math.max(0, ...localTasks.map(t => t.id)) + 1,
            ...data
        };
        const updatedTasks = [...localTasks, newTask];
        setLocalTasks(updatedTasks);
        onAddTask?.(newTask);
        setModalOpen(false);
    };

    const handleUpdateTask = (data: TaskData) => {
        if (!editingTask) return;
        const updatedTask: Task = {
            ...editingTask,
            ...data
        };
        const updatedTasks = localTasks.map(t => t.id === editingTask.id ? updatedTask : t);
        setLocalTasks(updatedTasks);
        onUpdateTask?.(updatedTask);
        setEditingTask(null);
        setModalOpen(false);
    };

    const handleDeleteTask = (taskId: number) => {
        const updatedTasks = localTasks.filter(t => t.id !== taskId);
        setLocalTasks(updatedTasks);
        onDeleteTask?.(taskId);
    };

    const handleToggleTask = (taskId: number, enabled: boolean) => {
        const updatedTasks = localTasks.map(t =>
            t.id === taskId ? { ...t, is_enabled: enabled } : t
        );
        setLocalTasks(updatedTasks);
        onToggleTask?.(taskId, enabled);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleViewTask = (task: Task) => {
        setViewingTask(task);
    };

    const handleCancel = () => {
        setEditingTask(null);
        setModalOpen(false);
    };

    const taskColumns: DataTableColumn<Task>[] = [
        { key: 'name', label: 'Task Name' },
        { key: 'command', label: 'Command', render: (v: string) => <span className="font-mono text-sm">{v}</span> },
        { key: 'cron', label: 'Schedule', render: (_: string, row: Task) => <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{formatCronExpression(row.cron)}</span> },
        { key: 'is_enabled', label: 'Status', render: (v: boolean) => v ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Inactive</span> },
        {
            key: 'id', label: 'Actions', render: (_: any, row: Task) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleViewTask(row)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleToggleTask(row.id, !row.is_enabled)}
                        className={`px-2 py-1 text-xs rounded ${row.is_enabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
                            }`}
                    >
                        {row.is_enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                        onClick={() => handleEditTask(row)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteTask(row.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                    >
                        Delete
                    </button>
                </div>
            )
        },
    ];

    return (
        <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Scheduler</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                >
                    <Plus size={16} className="mr-2 inline" />
                    New
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Scheduled Tasks</h2>
                </div>
                <div className="overflow-x-auto">
                    <DataTable columns={taskColumns} data={localTasks} emptyMessage="No scheduled tasks found. Create your first task to get started." />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCancel}
                title={editingTask ? 'Edit Task' : 'Create New Task'}
            >
                <TaskForm
                    key={editingTask ? editingTask.id : 'new-task'}
                    onSave={editingTask ? handleUpdateTask : handleAddTask}
                    onCancel={handleCancel}
                    task={editingTask || undefined}
                />
            </Modal>

            <Modal isOpen={!!viewingTask} onClose={() => setViewingTask(null)} title="View Task Details">
                {viewingTask && <TaskDetails task={viewingTask} />}
            </Modal>
        </div>
    );
};

const TaskDetails: React.FC<{ task: Task }> = ({ task }) => {
    const selectedCommand = initialMockData.commands.find(c => c.name === task.command);
    const cronDescription = useMemo(() => {
        try {
            return cronstrue.toString(task.cron);
        } catch (e) {
            return 'Invalid cron expression';
        }
    }, [task.cron]);

    const renderValue = (value: any) => {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        return value || <span className="text-gray-400">(empty)</span>;
    }

    return (
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
                <strong className="font-semibold text-gray-900 dark:text-white">Name:</strong>
                <p>{task.name}</p>
            </div>
            <div>
                <strong className="font-semibold text-gray-900 dark:text-white">Command:</strong>
                <p className="font-mono">{task.command}</p>
            </div>
            {selectedCommand && task.args && Object.keys(task.args).length > 0 && (
                <div>
                    <strong className="font-semibold text-gray-900 dark:text-white">Arguments:</strong>
                    <ul className="ml-4 list-disc space-y-1 mt-1">
                        {Object.entries(task.args).map(([key, value]) => (
                            <li key={key}><strong className="font-medium">{key}:</strong> {renderValue(value)}</li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedCommand && task.opts && Object.keys(task.opts).length > 0 && (
                <div>
                    <strong className="font-semibold text-gray-900 dark:text-white">Options:</strong>
                    <ul className="ml-4 list-disc space-y-1 mt-1">
                        {Object.entries(task.opts).map(([key, value]) => (
                            <li key={key}><strong className="font-medium">--{key}:</strong> {renderValue(value)}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div>
                <strong className="font-semibold text-gray-900 dark:text-white">Schedule:</strong>
                <p className="font-mono">{task.cron}</p>
                <p className="text-xs text-gray-500 capitalize">{cronDescription}</p>
            </div>
            {task.timezone && (
                <div>
                    <strong className="font-semibold text-gray-900 dark:text-white">Timezone:</strong>
                    <p>{task.timezone}</p>
                </div>
            )}
            <div>
                <strong className="font-semibold text-gray-900 dark:text-white">Status:</strong>
                <p>{task.is_enabled ? 'Enabled' : 'Disabled'}</p>
            </div>
        </div>
    );
};

function buildRoleTree(roles: Role[], parentId: number | null = null): Role[] {
    return roles.filter((r: Role) => r.parentId === parentId).map((r: Role) => ({
        ...r,
        children: buildRoleTree(roles, r.id)
    }));
}

const RoleManager: React.FC<{
    ContentOnly?: boolean;
    openAdd?: (cb: () => void) => void;
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
    users: User[];
}> = ({ ContentOnly, openAdd, roles, setRoles, users }) => {
    const [expanded, setExpanded] = useState<number[]>(() => roles.map(r => r.id));
    const [modalOpen, setModalOpen] = useState(false);
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [form, setForm] = useState<{ name: string; parentId: number | null }>({ name: '', parentId: null });
    const [deleteRole, setDeleteRole] = useState<Role | null>(null);
    const tree = buildRoleTree(roles);
    const handleExpand = (id: number) => setExpanded(exp => exp.includes(id) ? exp.filter(e => e !== id) : [...exp, id]);
    const openAddInternal = (parentId: number | null = null) => { setEditRole(null); setForm({ name: '', parentId }); setModalOpen(true); };
    useEffect(() => { if (openAdd) openAdd(() => openAddInternal(null)); }, [openAdd]);
    const openEdit = (role: Role) => { setEditRole(role); setForm({ name: role.name, parentId: role.parentId }); setModalOpen(true); };
    const handleSave = () => {
        if (editRole) {
            setRoles(rs => rs.map(r => r.id === editRole.id ? { ...r, name: form.name, parentId: form.parentId } : r));
        } else {
            setRoles(rs => [...rs, { id: Math.max(0, ...rs.map(r => r.id)) + 1, name: form.name, parentId: form.parentId, users: [] }]);
        }
        setModalOpen(false);
    };
    const handleDelete = () => {
        if (!deleteRole) return;
        setRoles(rs => rs.filter(r => r.id !== deleteRole.id && r.parentId !== deleteRole.id));
        setDeleteRole(null);
    };
    const renderTree = (nodes: Role[], level: number = 0): React.ReactNode => nodes.map((node: Role) => (
        <div key={node.id} className="ml-4 mt-2">
            <div className="flex items-center gap-2">
                {node.children && node.children.length > 0 && (
                    <button onClick={() => handleExpand(node.id)} className="text-xs text-gray-500">{expanded.includes(node.id) ? '-' : '+'}</button>
                )}
                <span className="font-semibold text-gray-800 dark:text-gray-200">{node.name}</span>
                <span className="text-xs text-gray-400">({users.filter(u => u.roleId === node.id).length} users)</span>
                <button onClick={() => openAddInternal(node.id)} className="text-xs text-indigo-600 hover:underline">Add Child</button>
                <button onClick={() => openEdit(node)} className="text-xs text-blue-600 hover:underline">Edit</button>
                <button onClick={() => setDeleteRole(node)} className="text-xs text-red-600 hover:underline">Delete</button>
            </div>
            {expanded.includes(node.id) && node.children && node.children.length > 0 && (
                <div>{renderTree(node.children, level + 1)}</div>
            )}
        </div>
    ));
    if (ContentOnly) {
        return <div className="p-4">{renderTree(tree)}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editRole ? 'Edit Role' : 'Add Role'}>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Role Name</label>
                        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Parent Role</label>
                        <select value={form.parentId || ''} onChange={e => setForm(f => ({ ...f, parentId: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                            <option value="">None</option>
                            {roles.filter(r => !editRole || r.id !== editRole.id).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700">Save</button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={!!deleteRole} onClose={() => setDeleteRole(null)} title="Delete Role?">
                <div className="space-y-4">
                    <p>Are you sure you want to delete <b>{deleteRole?.name}</b> and its children?</p>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setDeleteRole(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>;
    }
    return null;
};

interface FieldPermission {
    id: number;
    objectId: number;
    field: string;
    profileId?: number;
    permissionSetId?: number;
    canRead: boolean;
    canEdit: boolean;
}

const FieldPermissionsMatrix: React.FC<{
    objectId: number;
    fields: SField[];
    profileId?: number;
    permissionSetId?: number;
    fieldPermissions: FieldPermission[];
    setFieldPermissions: React.Dispatch<React.SetStateAction<FieldPermission[]>>;
}> = ({ objectId, fields, profileId, permissionSetId, fieldPermissions, setFieldPermissions }) => {
    const handleToggle = (field: string, perm: 'canRead' | 'canEdit') => {
        setFieldPermissions(prev => {
            let entry = prev.find(fp => fp.objectId === objectId && fp.field === field && (profileId ? fp.profileId === profileId : fp.permissionSetId === permissionSetId));
            if (!entry) {
                entry = {
                    id: Math.max(0, ...prev.map(fp => fp.id)) + 1,
                    objectId,
                    field,
                    profileId,
                    permissionSetId,
                    canRead: false,
                    canEdit: false,
                };
                prev = [...prev, entry];
            }
            return prev.map(fp => {
                if (fp === entry) {
                    return { ...fp, [perm]: !fp[perm] };
                }
                return fp;
            });
        });
    };
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="p-2 text-left">Field</th>
                        <th className="p-2 text-center">Read</th>
                        <th className="p-2 text-center">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map(f => {
                        const entry = fieldPermissions.find(fp => fp.objectId === objectId && fp.field === f.label && (profileId ? fp.profileId === profileId : fp.permissionSetId === permissionSetId));
                        return (
                            <tr key={f.id} className="border-b">
                                <td className="p-2 font-semibold">{f.label}</td>
                                {(['canRead', 'canEdit'] as const).map(perm => (
                                    <td key={perm} className="p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={!!entry?.[perm]}
                                            onChange={() => handleToggle(f.label, perm)}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const LayoutPermissionsManager: React.FC<{
    layouts: Layout[];
    profileId?: number;
    permissionSetId?: number;
}> = ({ layouts, profileId, permissionSetId }) => {
    const [assignments, setAssignments] = useState<Record<number, boolean>>({});

    // TODO: Fetch/update assignments from a shared state/API
    const handleToggle = (layoutId: number) => {
        setAssignments(prev => ({ ...prev, [layoutId]: !prev[layoutId] }));
    };

    return (
        <table className="min-w-full text-sm border">
            <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="p-2 text-left">Layout Name</th>
                    <th className="p-2 text-center">Assigned</th>
                </tr>
            </thead>
            <tbody>
                {layouts.map(layout => (
                    <tr key={layout.id} className="border-b">
                        <td className="p-2 font-semibold">{layout.name}</td>
                        <td className="p-2 text-center">
                            <input
                                type="checkbox"
                                checked={!!assignments[layout.id]}
                                onChange={() => handleToggle(layout.id)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// Refactor ProfileManager to show details/tabs for selected profile
const ProfileManager: React.FC<{
    ContentOnly?: boolean;
    openAdd?: (cb: () => void) => void;
    profiles: Profile[];
    setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
    users: User[];
    objects: SObject[];
    fields: Record<number, SField[]>;
    objectPermissions: ObjectPermission[];
    setObjectPermissions: React.Dispatch<React.SetStateAction<ObjectPermission[]>>;
    fieldPermissions: FieldPermission[];
    setFieldPermissions: React.Dispatch<React.SetStateAction<FieldPermission[]>>;
    layouts: Layout[];
}> = ({ ContentOnly, openAdd, profiles, setProfiles, users, objects, fields, objectPermissions, setObjectPermissions, fieldPermissions, setFieldPermissions, layouts }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editProfile, setEditProfile] = useState<Profile | null>(null);
    const [form, setForm] = useState<{ name: string }>({ name: '' });
    const [deleteProfile, setDeleteProfile] = useState<Profile | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [tab, setTab] = useState<'details' | 'object' | 'field' | 'layout'>('details');
    const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
    const openAddInternal = () => { setEditProfile(null); setForm({ name: '' }); setModalOpen(true); };
    useEffect(() => { if (openAdd) openAdd(() => openAddInternal()); }, [openAdd]);
    const openEdit = (profile: Profile) => { setEditProfile(profile); setForm({ name: profile.name }); setModalOpen(true); };
    const handleSave = () => {
        if (editProfile) {
            setProfiles(ps => ps.map(p => p.id === editProfile.id ? { ...p, name: form.name } : p));
        } else {
            setProfiles(ps => [...ps, { id: Math.max(0, ...ps.map(p => p.id)) + 1, name: form.name, description: '', users: [] }]);
        }
        setModalOpen(false);
    };
    const handleDelete = () => {
        if (!deleteProfile) return;
        setProfiles(ps => ps.filter(p => p.id !== deleteProfile.id));
        setDeleteProfile(null);
    };
    // DataTable columns
    const columns: DataTableColumn<Profile>[] = [
        { key: 'name', label: 'Profile Name' },
        { key: 'users', label: 'Users', render: (_, row: Profile) => <span>{users.filter(u => u.profileId === row.id).length} Users</span> },
        {
            key: 'id', label: 'Actions', render: (_: any, row: Profile) => (
                <div className="flex gap-2">
                    <button onClick={() => { setSelectedProfile(row); setSelectedObjectId(objects[0]?.id || null); }} className="text-xs text-indigo-600 hover:underline">View</button>
                    <button onClick={() => openEdit(row)} className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => setDeleteProfile(row)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
            )
        },
    ];
    if (ContentOnly) {
        if (selectedProfile) {
            return (
                <div className="p-4">
                    <div className="mb-4 flex items-center gap-4">
                        <button onClick={() => setSelectedProfile(null)} className="text-xs text-gray-500 hover:underline">&larr; Back to Profiles</button>
                        <h3 className="text-xl font-bold">{selectedProfile.name}</h3>
                        <div className="ml-auto flex gap-2 hidden">
                            <button onClick={() => openEdit(selectedProfile)} className="text-xs text-blue-600 hover:underline">Edit</button>
                            <button onClick={() => setDeleteProfile(selectedProfile)} className="text-xs text-red-600 hover:underline">Delete</button>
                        </div>
                    </div>
                    <div className="mb-4 flex gap-2 border-b">
                        <button onClick={() => setTab('details')} className={`px-4 py-2 font-medium border-b-2 ${tab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Details</button>
                        <button onClick={() => setTab('object')} className={`px-4 py-2 font-medium border-b-2 ${tab === 'object' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Object Permissions</button>
                        <button onClick={() => setTab('field')} className={`px-4 py-2 font-medium border-b-2 ${tab === 'field' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Field Permissions</button>
                        <button onClick={() => setTab('layout')} className={`px-4 py-2 font-medium border-b-2 ${tab === 'layout' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Layout Permissions</button>
                    </div>
                    {tab === 'details' && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="text-lg font-semibold mb-2">Profile Details</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Name</label>
                                    <p>{selectedProfile.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Description</label>
                                    <p>{selectedProfile.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {tab === 'object' && (
                        <ObjectPermissionsManager
                            objects={objects}
                            profiles={[selectedProfile]}
                            permissionSets={[]}
                            objectPermissions={objectPermissions}
                            setObjectPermissions={setObjectPermissions}
                        />
                    )}
                    {tab === 'field' && (
                        <div>
                            <label className="block mb-2 font-medium">Select Object:</label>
                            <select value={selectedObjectId || ''} onChange={e => setSelectedObjectId(Number(e.target.value))} className="mb-4 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                                <option value="">-- Select --</option>
                                {Object.values(objects).map((obj: any) => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                            </select>
                            {selectedObjectId && fields[selectedObjectId] && (
                                <FieldPermissionsMatrix
                                    objectId={selectedObjectId}
                                    fields={fields[selectedObjectId]}
                                    profileId={selectedProfile.id}
                                    fieldPermissions={fieldPermissions}
                                    setFieldPermissions={setFieldPermissions}
                                />
                            )}
                        </div>
                    )}
                    {tab === 'layout' && (
                        <div>
                            <label className="block mb-2 font-medium">Select Object:</label>
                            <select value={selectedObjectId || ''} onChange={e => setSelectedObjectId(Number(e.target.value))} className="mb-4 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                                <option value="">-- Select --</option>
                                {Object.values(objects).map((obj: any) => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                            </select>
                            {selectedObjectId && (
                                <LayoutPermissionsManager
                                    layouts={layouts.filter(l => l.objectId === selectedObjectId)}
                                    profileId={selectedProfile.id}
                                />
                            )}
                        </div>
                    )}
                </div>
            );
        }
        return (
            <div className="p-4">
                <DataTable columns={columns} data={profiles} emptyMessage="No profiles found." />
                <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editProfile ? 'Edit Profile' : 'Add Profile'}>
                    <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Profile Name</label>
                            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded" required />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700">Save</button>
                        </div>
                    </form>
                </Modal>
                <Modal isOpen={!!deleteProfile} onClose={() => setDeleteProfile(null)} title="Delete Profile?">
                    <div className="space-y-4">
                        <p>Are you sure you want to delete <b>{deleteProfile?.name}</b>?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteProfile(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
    return null;
};

interface User {
    id: number;
    name: string;
    email: string;
    roleId: number | null;
    profileId: number | null;
    permissionSetIds?: number[];
    permissionSetGroupIds?: number[];
}

const UsersManager: React.FC<{
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    roles: Role[];
    profiles: Profile[];
    permissionSets: PermissionSet[];
    permissionSetGroups: PermissionSetGroup[];
    openAdd?: (cb: () => void) => void;
}> = ({ users, setUsers, roles, profiles, permissionSets, permissionSetGroups, openAdd }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [form, setForm] = useState<{ name: string; email: string; roleId: number | null; profileId: number | null; permissionSetIds: number[]; permissionSetGroupIds: number[] }>({ name: '', email: '', roleId: null, profileId: null, permissionSetIds: [], permissionSetGroupIds: [] });
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const openAddInternal = () => { setEditUser(null); setForm({ name: '', email: '', roleId: roles[0]?.id || null, profileId: profiles[0]?.id || null, permissionSetIds: [], permissionSetGroupIds: [] }); setModalOpen(true); };
    useEffect(() => { if (openAdd) openAdd(() => openAddInternal()); }, [openAdd]);
    const openEdit = (user: User) => { setEditUser(user); setForm({ name: user.name, email: user.email, roleId: user.roleId, profileId: user.profileId, permissionSetIds: user.permissionSetIds || [], permissionSetGroupIds: user.permissionSetGroupIds || [] }); setModalOpen(true); };
    const handleSave = () => {
        if (editUser) {
            setUsers(us => us.map(u => u.id === editUser.id ? { ...editUser, ...form } : u));
        } else {
            setUsers(us => [...us, { id: Math.max(0, ...us.map(u => u.id)) + 1, ...form }]);
        }
        setModalOpen(false);
    };
    const handleDelete = () => {
        if (!deleteUser) return;
        setUsers(us => us.filter(u => u.id !== deleteUser.id));
        setDeleteUser(null);
    };
    const columns: DataTableColumn<User>[] = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'roleId', label: 'Role', render: (v, row) => roles.find(r => r.id === row.roleId)?.name || <span className="text-gray-400">None</span> },
        { key: 'profileId', label: 'Profile', render: (v, row) => profiles.find(p => p.id === row.profileId)?.name || <span className="text-gray-400">None</span> },
        { key: 'permissionSetIds', label: 'Permission Sets', render: (v, row) => (row.permissionSetIds || []).map(id => permissionSets.find(s => s.id === id)?.name).filter(Boolean).join(', ') || <span className="text-gray-400">None</span> },
        { key: 'permissionSetGroupIds', label: 'Permission Set Groups', render: (v, row) => (row.permissionSetGroupIds || []).map(id => permissionSetGroups.find(g => g.id === id)?.name).filter(Boolean).join(', ') || <span className="text-gray-400">None</span> },
        {
            key: 'id', label: 'Actions', render: (_: any, row: User) => (
                <div className="flex gap-2">
                    <button onClick={() => openEdit(row)} className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => setDeleteUser(row)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
            )
        },
    ];
    return (
        <div className="p-4">
            <div className="overflow-x-auto max-h-[60vh]">
                <DataTable columns={columns} data={users} emptyMessage="No users found." />
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? 'Edit User' : 'Add User'}>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select value={form.roleId || ''} onChange={e => setForm(f => ({ ...f, roleId: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                            <option value="">None</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Profile</label>
                        <select value={form.profileId || ''} onChange={e => setForm(f => ({ ...f, profileId: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                            <option value="">None</option>
                            {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Permission Sets</label>
                        <select multiple value={form.permissionSetIds.map(String)} onChange={e => {
                            const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                            setForm(f => ({ ...f, permissionSetIds: selected }));
                        }} className="w-full px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                            {permissionSets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Permission Set Groups</label>
                        <select multiple value={form.permissionSetGroupIds.map(String)} onChange={e => {
                            const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                            setForm(f => ({ ...f, permissionSetGroupIds: selected }));
                        }} className="w-full px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                            {permissionSetGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700">Save</button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={!!deleteUser} onClose={() => setDeleteUser(null)} title="Delete User?">
                <div className="space-y-4">
                    <p>Are you sure you want to delete <b>{deleteUser?.name}</b>?</p>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setDeleteUser(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const PermissionSetsManager: React.FC<{
    permissionSets: PermissionSet[];
    setPermissionSets: React.Dispatch<React.SetStateAction<PermissionSet[]>>;
    openAdd?: (cb: () => void) => void;
    objects: SObject[];
    fields: Record<number, SField[]>;
    objectPermissions: ObjectPermission[];
    setObjectPermissions: React.Dispatch<React.SetStateAction<ObjectPermission[]>>;
    fieldPermissions: FieldPermission[];
    setFieldPermissions: React.Dispatch<React.SetStateAction<FieldPermission[]>>;
    layouts: Layout[];
}> = ({ permissionSets, setPermissionSets, openAdd, objects, fields, objectPermissions, setObjectPermissions, fieldPermissions, setFieldPermissions, layouts }) => {
    const [selectedSet, setSelectedSet] = useState<PermissionSet | null>(null);
    const [tab, setTab] = useState<'details' | 'object' | 'field' | 'layout'>('details');
    const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editSet, setEditSet] = useState<PermissionSet | null>(null);
    const [form, setForm] = useState<{ name: string; description: string }>({ name: '', description: '' });
    const [deleteSet, setDeleteSet] = useState<PermissionSet | null>(null);
    const openAddInternal = () => { setEditSet(null); setForm({ name: '', description: '' }); setModalOpen(true); };
    useEffect(() => { if (openAdd) openAdd(() => openAddInternal()); }, [openAdd]);
    const openEdit = (set: PermissionSet) => { setEditSet(set); setForm({ name: set.name, description: set.description || '' }); setModalOpen(true); };
    const handleSave = () => {
        if (editSet) {
            setPermissionSets(ps => ps.map(s => s.id === editSet.id ? { ...editSet, ...form } : s));
        } else {
            setPermissionSets(ps => [...ps, { id: Math.max(0, ...ps.map(s => s.id)) + 1, ...form }]);
        }
        setModalOpen(false);
    };
    const handleDelete = () => {
        if (!deleteSet) return;
        setPermissionSets(ps => ps.filter(s => s.id !== deleteSet.id));
        setDeleteSet(null);
    };
    const columns: DataTableColumn<PermissionSet>[] = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        {
            key: 'id', label: 'Actions', render: (_: any, row: PermissionSet) => (
                <div className="flex gap-2">
                    <button onClick={() => { setSelectedSet(row); setSelectedObjectId(objects[0]?.id || null); }} className="text-xs text-indigo-600 hover:underline">View</button>
                    <button onClick={() => openEdit(row)} className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => setDeleteSet(row)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
            )
        },
    ];
    if (selectedSet) {
        return (
            <div className="p-4">
                <div className="mb-4 flex items-center gap-4">
                    <button onClick={() => setSelectedSet(null)} className="text-xs text-gray-500 hover:underline">&larr; Back to Permission Sets</button>
                    <h3 className="text-xl font-bold">{selectedSet.name}</h3>
                    {/* ... edit/delete buttons for detail view ... */}
                </div>
                <div className="mb-4 flex gap-2 border-b">
                    <button onClick={() => setTab('details')} className={`px-4 py-2 font-medium border-b-2 ${tab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Details</button>
                    <button onClick={() => setTab('object')} className={`px-4 py-2 font-medium border-b-2 ${tab === 'object' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Object Permissions</button>
                    <button onClick={() => setTab('field')} className={`px-4 py-2 font-medium border-b-2 ${tab === 'field' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Field Permissions</button>
                    <button onClick={() => setTab('layout')} className={`px-4 py-2 font-medium border-b-2 ${tab === 'layout' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>Layout Permissions</button>
                </div>
                {tab === 'details' && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">Permission Set Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Name</label>
                                <p>{selectedSet.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Description</label>
                                <p>{selectedSet.description}</p>
                            </div>
                        </div>
                    </div>
                )}
                {tab === 'object' && <ObjectPermissionsManager objects={objects} profiles={[]} permissionSets={[selectedSet]} objectPermissions={objectPermissions} setObjectPermissions={setObjectPermissions} />}
                {tab === 'field' && (
                    <div>
                        <label className="block mb-2 font-medium">Select Object:</label>
                        <select value={selectedObjectId || ''} onChange={e => setSelectedObjectId(Number(e.target.value))} className="mb-4 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                            {objects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                        </select>
                        {selectedObjectId && fields[selectedObjectId] && (
                            <FieldPermissionsMatrix
                                objectId={selectedObjectId}
                                fields={fields[selectedObjectId]}
                                permissionSetId={selectedSet.id}
                                fieldPermissions={fieldPermissions}
                                setFieldPermissions={setFieldPermissions}
                            />
                        )}
                    </div>
                )}
                {tab === 'layout' && (
                    <div>
                        <label className="block mb-2 font-medium">Select Object:</label>
                        <select value={selectedObjectId || ''} onChange={e => setSelectedObjectId(Number(e.target.value))} className="mb-4 px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                            {objects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                        </select>
                        {selectedObjectId && (
                            <LayoutPermissionsManager
                                layouts={layouts.filter(l => l.objectId === selectedObjectId)}
                                permissionSetId={selectedSet.id}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }
    return (
        <div className="p-4">
            <DataTable columns={columns} data={permissionSets} emptyMessage="No permission sets found." />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editSet ? 'Edit Permission Set' : 'Add Permission Set'}>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700">Save</button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={!!deleteSet} onClose={() => setDeleteSet(null)} title="Delete Permission Set?">
                <div className="space-y-4">
                    <p>Are you sure you want to delete <b>{deleteSet?.name}</b>?</p>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setDeleteSet(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const PermissionSetGroupsManager: React.FC<{
    groups: PermissionSetGroup[];
    setGroups: React.Dispatch<React.SetStateAction<PermissionSetGroup[]>>;
    permissionSets: PermissionSet[];
    openAdd?: (cb: () => void) => void;
}> = ({ groups, setGroups, permissionSets, openAdd }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editGroup, setEditGroup] = useState<PermissionSetGroup | null>(null);
    const [form, setForm] = useState<{ name: string; description: string; permissionSetIds: number[] }>({ name: '', description: '', permissionSetIds: [] });
    const [deleteGroup, setDeleteGroup] = useState<PermissionSetGroup | null>(null);
    const openAddInternal = () => { setEditGroup(null); setForm({ name: '', description: '', permissionSetIds: [] }); setModalOpen(true); };
    useEffect(() => { if (openAdd) openAdd(() => openAddInternal()); }, [openAdd]);
    const openEdit = (group: PermissionSetGroup) => { setEditGroup(group); setForm({ name: group.name, description: group.description || '', permissionSetIds: group.permissionSetIds }); setModalOpen(true); };
    const handleSave = () => {
        if (editGroup) {
            setGroups(gs => gs.map(g => g.id === editGroup.id ? { ...editGroup, ...form } : g));
        } else {
            setGroups(gs => [...gs, { id: Math.max(0, ...gs.map(g => g.id)) + 1, ...form }]);
        }
        setModalOpen(false);
    };
    const handleDelete = () => {
        if (!deleteGroup) return;
        setGroups(gs => gs.filter(g => g.id !== deleteGroup.id));
        setDeleteGroup(null);
    };
    const columns: DataTableColumn<PermissionSetGroup>[] = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'permissionSetIds', label: 'Included Sets', render: (v, row) => row.permissionSetIds.map(id => permissionSets.find(s => s.id === id)?.name).filter(Boolean).join(', ') || <span className="text-gray-400">None</span> },
        {
            key: 'id', label: 'Actions', render: (_: any, row: PermissionSetGroup) => (
                <div className="flex gap-2">
                    <button onClick={() => openEdit(row)} className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => setDeleteGroup(row)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
            )
        },
    ];
    return (
        <div className="p-4">
            <DataTable columns={columns} data={groups} emptyMessage="No permission set groups found." />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editGroup ? 'Edit Permission Set Group' : 'Add Permission Set Group'}>
                <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Included Permission Sets</label>
                        <select multiple value={form.permissionSetIds.map(String)} onChange={e => {
                            const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                            setForm(f => ({ ...f, permissionSetIds: selected }));
                        }} className="w-full px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                            {permissionSets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700">Save</button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={!!deleteGroup} onClose={() => setDeleteGroup(null)} title="Delete Permission Set Group?">
                <div className="space-y-4">
                    <p>Are you sure you want to delete <b>{deleteGroup?.name}</b>?</p>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setDeleteGroup(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const SidebarSection: React.FC<{
    icon: React.ReactNode;
    label: string;
    collapsed: boolean;
    active: boolean;
    onClick: () => void;
}> = ({ icon, label, collapsed, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center p-2 rounded-lg text-left transition-colors duration-200 ${active
            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${collapsed ? 'justify-center' : 'px-3'}`}
        title={collapsed ? label : undefined}
    >
        {icon}
        {!collapsed && <span className="ml-3 font-semibold">{label}</span>}
    </button>
);

const FieldPermissionOverviewMatrix: React.FC<{
    objects: SObject[];
    fields: Record<number, SField[]>;
    profiles: Profile[];
    permissionSets: PermissionSet[];
    fieldPermissions: FieldPermission[];
    setFieldPermissions: React.Dispatch<React.SetStateAction<FieldPermission[]>>;
}> = ({ objects, fields, profiles, permissionSets, fieldPermissions, setFieldPermissions }) => {
    const [selectedObjectId, setSelectedObjectId] = useState<number | null>(objects[0]?.id || null);
    const [viewMode, setViewMode] = useState<'profiles' | 'permsets'>('profiles');
    const currentList = viewMode === 'profiles' ? profiles : permissionSets;

    const handleToggle = (itemId: number, fieldName: string, perm: keyof Pick<FieldPermission, 'canRead' | 'canEdit'>) => {
        if (!selectedObjectId) return;
        const isProfileMode = viewMode === 'profiles';
        const existingPermIndex = fieldPermissions.findIndex(p => p.field === fieldName && (isProfileMode ? p.profileId === itemId : p.permissionSetId === itemId));

        if (existingPermIndex > -1) {
            const newPerms = [...fieldPermissions];
            const currentPerm = newPerms[existingPermIndex];
            newPerms[existingPermIndex] = { ...currentPerm, [perm]: !currentPerm[perm] };
            setFieldPermissions(newPerms);
        } else {
            const newPerm: FieldPermission = {
                id: Date.now(),
                objectId: selectedObjectId,
                field: fieldName,
                profileId: isProfileMode ? itemId : undefined,
                permissionSetId: !isProfileMode ? itemId : undefined,
                canRead: false,
                canEdit: false,
                [perm]: true,
            };
            setFieldPermissions(prev => [...prev, newPerm]);
        }
    };

    const getPermission = (itemId: number, fieldName: string) => {
        const isProfileMode = viewMode === 'profiles';
        return fieldPermissions.find(p => p.field === fieldName && (isProfileMode ? p.profileId === itemId : p.permissionSetId === itemId));
    };

    const currentFields = selectedObjectId ? fields[selectedObjectId] || [] : [];

    return (
        <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
                <label className="font-medium">Object:</label>
                <select value={selectedObjectId || ''} onChange={e => setSelectedObjectId(Number(e.target.value))} className="px-3 py-2 border rounded bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600">
                    {objects.map(obj => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                </select>
                <label className="font-medium">View:</label>
                <div className="flex gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <button onClick={() => setViewMode('profiles')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'profiles' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Profiles</button>
                    <button onClick={() => setViewMode('permsets')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'permsets' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Permission Sets</button>
                </div>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                            {currentList.map(item => (
                                <th key={item.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{item.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentFields.map(field => (
                            <tr key={field.id}>
                                <td className="px-4 py-4 whitespace-nowrap font-medium">{field.label}</td>
                                {currentList.map(item => {
                                    const perm = getPermission(item.id, field.label);
                                    return (
                                        <td key={item.id} className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="flex flex-col items-center">
                                                    <label className="text-xs text-gray-500">R</label>
                                                    <input type="checkbox" checked={perm?.canRead || false} onChange={() => handleToggle(item.id, field.label, 'canRead')} className="form-checkbox h-4 w-4 text-indigo-600" />
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <label className="text-xs text-gray-500">E</label>
                                                    <input type="checkbox" checked={perm?.canEdit || false} onChange={() => handleToggle(item.id, field.label, 'canEdit')} className="form-checkbox h-4 w-4 text-indigo-600" />
                                                </div>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PermissionsManager: React.FC<{ objects: SObject[]; fields: Record<number, SField[]> }> = ({ objects, fields }) => {
    const [permissionsSection, setPermissionsSection] = useState<'overview' | 'fieldoverview' | 'roles' | 'profiles' | 'users' | 'permsets' | 'permgroups' | 'sharing'>('overview');
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();
    const roleAddRef = useRef<() => void>(null);
    const profileAddRef = useRef<() => void>(null);
    const userAddRef = useRef<() => void>(null);
    const permSetAddRef = useRef<() => void>(null);
    const permGroupAddRef = useRef<() => void>(null);
    const [rolesState, setRolesState] = useState<Role[]>(initialMockData.roles);
    const [profilesState, setProfilesState] = useState<Profile[]>(initialMockData.profiles);
    const [usersState, setUsersState] = useState<User[]>(initialMockData.users);
    const [permSetsState, setPermSetsState] = useState<PermissionSet[]>(initialMockData.permissionSets);
    const [permGroupsState, setPermGroupsState] = useState<PermissionSetGroup[]>(initialMockData.permissionSetGroups);
    const [objectPermissions, setObjectPermissions] = useState<ObjectPermission[]>(initialMockData.objectPermissions);
    const [fieldPermissions, setFieldPermissions] = useState<FieldPermission[]>(initialMockData.fieldPermissions);
    const [layouts, setLayouts] = useState<Layout[]>(initialMockData.layouts);
    const [sharingRules, setSharingRules] = useState<SharingRule[]>(initialMockData.sharingRules);
    return (
        <div className="flex h-full">
            <div className={`transition-all duration-200 flex flex-col ${sidebarCollapsed ? 'w-12 min-w-12 items-center justify-center' : 'w-64'} border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    {!sidebarCollapsed && <span className="font-bold text-gray-800 dark:text-gray-200"><span className="font-bold text-gray-800 dark:text-gray-200">Permissions</span></span>}
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                        {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
                <div className="flex-grow p-2 space-y-2">
                    <SidebarSection icon={<User size={20} />} label="Users" collapsed={sidebarCollapsed} active={permissionsSection === 'users'} onClick={() => setPermissionsSection('users')} />
                    <SidebarSection icon={<Users size={20} />} label="Roles" collapsed={sidebarCollapsed} active={permissionsSection === 'roles'} onClick={() => setPermissionsSection('roles')} />
                    <SidebarSection icon={<UserCog size={20} />} label="Profiles" collapsed={sidebarCollapsed} active={permissionsSection === 'profiles'} onClick={() => setPermissionsSection('profiles')} />
                    <SidebarSection icon={<BarChart2 size={20} />} label="Permission Sets" collapsed={sidebarCollapsed} active={permissionsSection === 'permsets'} onClick={() => setPermissionsSection('permsets')} />
                    <SidebarSection icon={<GripVertical size={20} />} label="Permission Set Groups" collapsed={sidebarCollapsed} active={permissionsSection === 'permgroups'} onClick={() => setPermissionsSection('permgroups')} />
                    <SidebarSection icon={<ShieldCheck size={20} />} label="Object Permissions" collapsed={sidebarCollapsed} active={permissionsSection === 'overview'} onClick={() => setPermissionsSection('overview')} />
                    <SidebarSection icon={<Columns size={20} />} label="Field Permissions" collapsed={sidebarCollapsed} active={permissionsSection === 'fieldoverview'} onClick={() => setPermissionsSection('fieldoverview')} />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between min-h-[57px]">
                    <h2 className="text-xl font-bold">
                        {permissionsSection === 'overview' && 'Object Permissions'}
                        {permissionsSection === 'fieldoverview' && 'Field Permissions'}
                        {permissionsSection === 'roles' && 'Roles'}
                        {permissionsSection === 'profiles' && 'Profiles'}
                        {permissionsSection === 'users' && 'Users'}
                        {permissionsSection === 'permsets' && 'Permission Sets'}
                        {permissionsSection === 'permgroups' && 'Permission Set Groups'}
                    </h2>
                    {permissionsSection === 'roles' && (
                        <button onClick={() => roleAddRef.current && roleAddRef.current()} className="px-3 py-1 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700">Add</button>
                    )}
                    {permissionsSection === 'profiles' && (
                        <button onClick={() => profileAddRef.current && profileAddRef.current()} className="px-3 py-1 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700">Add</button>
                    )}
                    {permissionsSection === 'users' && (
                        <button onClick={() => userAddRef.current && userAddRef.current()} className="px-3 py-1 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700">Add</button>
                    )}
                    {permissionsSection === 'permsets' && (
                        <button onClick={() => permSetAddRef.current && permSetAddRef.current()} className="px-3 py-1 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700">Add</button>
                    )}
                    {permissionsSection === 'permgroups' && (
                        <button onClick={() => permGroupAddRef.current && permGroupAddRef.current()} className="px-3 py-1 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700">Add</button>
                    )}
                </div>
                <div>
                    {permissionsSection === 'overview' && <PermissionOverviewMatrix objects={objects} profiles={profilesState} permissionSets={permSetsState} objectPermissions={objectPermissions} setObjectPermissions={setObjectPermissions} />}
                    {permissionsSection === 'fieldoverview' && <FieldPermissionOverviewMatrix objects={objects} fields={fields} profiles={profilesState} permissionSets={permSetsState} fieldPermissions={fieldPermissions} setFieldPermissions={setFieldPermissions} />}
                    {permissionsSection === 'roles' && <RoleManager ContentOnly openAdd={cb => { roleAddRef.current = cb; }} roles={rolesState} setRoles={setRolesState} users={usersState} />}
                    {permissionsSection === 'profiles' && <ProfileManager ContentOnly openAdd={cb => { profileAddRef.current = cb; }} profiles={profilesState} setProfiles={setProfilesState} users={usersState} objects={objects} fields={fields} objectPermissions={objectPermissions} setObjectPermissions={setObjectPermissions} fieldPermissions={fieldPermissions} setFieldPermissions={setFieldPermissions} layouts={layouts} />}
                    {permissionsSection === 'users' && <UsersManager users={usersState} setUsers={setUsersState} roles={rolesState} profiles={profilesState} permissionSets={permSetsState} permissionSetGroups={permGroupsState} openAdd={cb => { userAddRef.current = cb; }} />}
                    {permissionsSection === 'permsets' && <PermissionSetsManager permissionSets={permSetsState} setPermissionSets={setPermSetsState} openAdd={cb => { permSetAddRef.current = cb; }} objects={objects} fields={fields} objectPermissions={objectPermissions} setObjectPermissions={setObjectPermissions} fieldPermissions={fieldPermissions} setFieldPermissions={setFieldPermissions} layouts={layouts} />}
                    {permissionsSection === 'permgroups' && <PermissionSetGroupsManager groups={permGroupsState} setGroups={setPermGroupsState} permissionSets={permSetsState} openAdd={cb => { permGroupAddRef.current = cb; }} />}
                </div>
            </div>
        </div>
    );
};

interface ObjectPermission {
    id: number;
    objectId: number;
    profileId?: number;
    permissionSetId?: number;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

type ObjectPermissionsManagerProps = {
    objects: SObject[];
    profiles: Profile[];
    permissionSets: PermissionSet[];
    objectPermissions: ObjectPermission[];
    setObjectPermissions: React.Dispatch<React.SetStateAction<ObjectPermission[]>>;
};

const ObjectPermissionsManager: React.FC<ObjectPermissionsManagerProps> = ({
    objects,
    profiles,
    permissionSets,
    objectPermissions,
    setObjectPermissions,
}) => {
    const isProfileMode = profiles.length > 0 && permissionSets.length === 0;
    const currentEntity = isProfileMode ? profiles[0] : permissionSets[0];
    const selectedId = currentEntity?.id;

    if (!currentEntity) {
        return <div className="p-4 text-gray-500">Select a profile or permission set to manage object permissions.</div>;
    }

    const handleToggle = (objectId: number, perm: keyof Pick<ObjectPermission, 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'>) => {
        if (!selectedId) return;
        setObjectPermissions(prev => {
            let entry = prev.find(op => op.objectId === objectId && (isProfileMode ? op.profileId === selectedId : op.permissionSetId === selectedId));
            if (!entry) {
                entry = {
                    id: Math.max(0, ...prev.map(op => op.id)) + 1,
                    objectId,
                    profileId: isProfileMode ? selectedId : undefined,
                    permissionSetId: !isProfileMode ? selectedId : undefined,
                    canCreate: false, canRead: false, canUpdate: false, canDelete: false,
                };
                prev = [...prev, entry];
            }
            return prev.map(op => {
                if (op === entry) {
                    return { ...op, [perm]: !op[perm] };
                }
                return op;
            });
        });
    };

    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <label className="font-medium text-gray-600 dark:text-gray-400">Permissions for:</label>
                <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                    {isProfileMode ? 'Profile' : 'Permission Set'}: {currentEntity.name}
                </span>
            </div>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="p-2 text-left">Object</th>
                        <th className="p-2 text-center">Create</th>
                        <th className="p-2 text-center">Read</th>
                        <th className="p-2 text-center">Update</th>
                        <th className="p-2 text-center">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {objects.map(obj => {
                        const entry = objectPermissions.find(op => op.objectId === obj.id && (isProfileMode ? op.profileId === selectedId : op.permissionSetId === selectedId));
                        return (
                            <tr key={obj.id} className="border-b">
                                <td className="p-2 font-semibold">{obj.name}</td>
                                {(['canCreate', 'canRead', 'canUpdate', 'canDelete'] as const).map(perm => (
                                    <td key={perm} className="p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={!!entry?.[perm]}
                                            onChange={() => handleToggle(obj.id, perm)}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const PermissionOverviewMatrix: React.FC<ObjectPermissionsManagerProps> = ({ objects, profiles, permissionSets, objectPermissions, setObjectPermissions }) => {
    const [viewMode, setViewMode] = useState<'profiles' | 'permsets'>('profiles');
    const currentList = viewMode === 'profiles' ? profiles : permissionSets;

    const handleToggle = (itemId: number, objectId: number, perm: keyof Pick<ObjectPermission, 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'>) => {
        const isProfileMode = viewMode === 'profiles';
        const existingPermIndex = objectPermissions.findIndex(p => p.objectId === objectId && (isProfileMode ? p.profileId === itemId : p.permissionSetId === itemId));

        if (existingPermIndex > -1) {
            const newPerms = [...objectPermissions];
            const currentPerm = newPerms[existingPermIndex];
            newPerms[existingPermIndex] = { ...currentPerm, [perm]: !currentPerm[perm] };
            setObjectPermissions(newPerms);
        } else {
            const newPerm: ObjectPermission = {
                id: Date.now(),
                profileId: isProfileMode ? itemId : undefined,
                permissionSetId: !isProfileMode ? itemId : undefined,
                objectId: objectId,
                canCreate: false,
                canRead: false,
                canUpdate: false,
                canDelete: false,
                [perm]: true,
            };
            setObjectPermissions(prev => [...prev, newPerm]);
        }
    };

    const getPermission = (itemId: number, objectId: number) => {
        const isProfileMode = viewMode === 'profiles';
        return objectPermissions.find(p => p.objectId === objectId && (isProfileMode ? p.profileId === itemId : p.permissionSetId === itemId));
    };

    return (
        <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
                <label className="font-medium">View:</label>
                <div className="flex gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <button onClick={() => setViewMode('profiles')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'profiles' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Profiles</button>
                    <button onClick={() => setViewMode('permsets')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'permsets' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Permission Sets</button>
                </div>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Object</th>
                            {currentList.map(item => (
                                <th key={item.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{item.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {objects.map(obj => (
                            <tr key={obj.id}>
                                <td className="px-4 py-4 whitespace-nowrap font-medium">{obj.name}</td>
                                {currentList.map(item => {
                                    const perm = getPermission(item.id, obj.id);
                                    return (
                                        <td key={item.id} className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="flex flex-col items-center">
                                                    <label className="text-xs text-gray-500">C</label>
                                                    <input type="checkbox" checked={perm?.canCreate || false} onChange={() => handleToggle(item.id, obj.id, 'canCreate')} className="form-checkbox h-4 w-4 text-indigo-600" />
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <label className="text-xs text-gray-500">R</label>
                                                    <input type="checkbox" checked={perm?.canRead || false} onChange={() => handleToggle(item.id, obj.id, 'canRead')} className="form-checkbox h-4 w-4 text-indigo-600" />
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <label className="text-xs text-gray-500">U</label>
                                                    <input type="checkbox" checked={perm?.canUpdate || false} onChange={() => handleToggle(item.id, obj.id, 'canUpdate')} className="form-checkbox h-4 w-4 text-indigo-600" />
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <label className="text-xs text-gray-500">D</label>
                                                    <input type="checkbox" checked={perm?.canDelete || false} onChange={() => handleToggle(item.id, obj.id, 'canDelete')} className="form-checkbox h-4 w-4 text-indigo-600" />
                                                </div>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const App = () => {
    const [view, setView] = useState('objects');
    const [objects, setObjects] = useState(initialMockData.objects);
    const [fields, setFields] = useState(initialMockData.fields);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleAddObject = (newObject: SObject) => {
        setObjects(prev => [...prev, newObject]);
        setFields(prev => ({ ...prev, [newObject.id]: [] }));
    };

    const handleAddField = (objectId: number, newField: SField) => {
        setFields(prev => ({
            ...prev,
            [objectId]: [...(prev[objectId] || []), newField]
        }));
    };

    const NavItem = ({ icon: Icon, label, viewName }: { icon: typeof Plus, label: string, viewName: string }) => (
        <li>
            <button
                onClick={() => {
                    setView(viewName);
                    setIsSidebarOpen(false);
                }}
                className={`flex items-center p-3 w-full text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${view === viewName ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
            >
                <Icon size={20} className="mr-3" />
                <span>{label}</span>
            </button>
        </li>
    );

    return (
        <div className="h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex font-sans">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                transform transition-transform duration-300 ease-in-out lg:transition-none
                flex flex-col
            `}>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Nucleus</h1>
                    <p className="text-xs text-gray-500">Laravel Salesforce Bridge</p>
                </div>
                <nav className="p-4 flex-grow">
                    <ul className="space-y-2">
                        <NavItem icon={Database} label="Object Manager" viewName="objects" />
                        <NavItem icon={LayoutTemplate} label="Layout Builder" viewName="layouts" />
                        <NavItem icon={BarChart2} label="Report Builder" viewName="reports" />
                        <NavItem icon={Clock} label="Task Scheduler" viewName="scheduler" />
                        <NavItem icon={Columns} label="Permissions" viewName="permissions" />
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-400">
                    Version 0.1.0
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {view === 'objects' && 'Object Manager'}
                        {view === 'layouts' && 'Layout Builder'}
                        {view === 'reports' && 'Report Builder'}
                        {view === 'scheduler' && 'Task Scheduler'}
                        {view === 'permissions' && 'Permissions'}
                    </h1>
                    <div className="w-8"></div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
                    {view === 'objects' && <ObjectManager objects={objects} fields={fields} onAddObject={handleAddObject} onAddField={handleAddField} setObjects={setObjects} setFields={setFields} />}
                    {view === 'layouts' && <LayoutBuilder objects={objects} fields={fields} />}
                    {view === 'reports' && <ReportBuilder objects={objects} fields={fields} />}
                    {view === 'scheduler' && <TaskScheduler />}
                    {view === 'permissions' && <PermissionsManager objects={objects} fields={fields} />}
                </div>
            </main>
        </div>
    );
};

export default App; 