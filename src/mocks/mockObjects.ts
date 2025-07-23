import { ApiResponse, MetadataObject, FieldType } from "@/types";

// Centralized mock data for objects (standard + custom)
const mockObjects: MetadataObject[] = [
  {
    id: "obj-001",
    apiName: "Account",
    label: "Account",
    pluralLabel: "Accounts",
    description: "Companies and organizations that you do business with",
    isCustom: false,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    recordCount: 143,
    fields: [
      {
        id: "field-001",
        apiName: "Name",
        label: "Account Name",
        type: "Text" as FieldType,
        required: true,
        unique: false,
        description: "The name of the account",
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        length: 255
      },
      {
        id: "field-002",
        apiName: "Industry",
        label: "Industry",
        type: "Picklist" as FieldType,
        required: false,
        unique: false,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        options: [
          { label: "Technology", value: "Technology" },
          { label: "Finance", value: "Finance" },
          { label: "Healthcare", value: "Healthcare" },
          { label: "Retail", value: "Retail" },
          { label: "Manufacturing", value: "Manufacturing" }
        ]
      },
      {
        id: "field-003",
        apiName: "AnnualRevenue",
        label: "Annual Revenue",
        type: "Currency" as FieldType,
        required: false,
        unique: false,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        precision: 18,
        scale: 2
      }
    ]
  },
  {
    id: "obj-002",
    apiName: "Contact",
    label: "Contact",
    pluralLabel: "Contacts",
    description: "People associated with accounts",
    isCustom: false,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    recordCount: 458,
    fields: [
      {
        id: "field-004",
        apiName: "FirstName",
        label: "First Name",
        type: "Text" as FieldType,
        required: false,
        unique: false,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        length: 40
      },
      {
        id: "field-005",
        apiName: "LastName",
        label: "Last Name",
        type: "Text" as FieldType,
        required: true,
        unique: false,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        length: 80
      },
      {
        id: "field-006",
        apiName: "Email",
        label: "Email",
        type: "Email" as FieldType,
        required: false,
        unique: true,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      },
      {
        id: "field-007",
        apiName: "Phone",
        label: "Phone",
        type: "Phone" as FieldType,
        required: false,
        unique: false,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      }
    ]
  },
  {
    id: "obj-003",
    apiName: "Opportunity",
    label: "Opportunity",
    pluralLabel: "Opportunities",
    description: "Pending and completed sales",
    isCustom: false,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    recordCount: 276,
    fields: [
      {
        id: "field-008",
        apiName: "Name",
        label: "Opportunity Name",
        type: "Text" as FieldType,
        required: true,
        unique: false,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        length: 120
      },
      {
        id: "field-009",
        apiName: "StageName",
        label: "Stage",
        type: "Picklist" as FieldType,
        required: true,
        unique: false,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        options: [
          { label: "Prospecting", value: "Prospecting" },
          { label: "Qualification", value: "Qualification" },
          { label: "Needs Analysis", value: "Needs Analysis" },
          { label: "Value Proposition", value: "Value Proposition" },
          { label: "Negotiation", value: "Negotiation" },
          { label: "Closed Won", value: "Closed Won" },
          { label: "Closed Lost", value: "Closed Lost" }
        ]
      },
      {
        id: "field-010",
        apiName: "Amount",
        label: "Amount",
        type: "Currency" as FieldType,
        required: false,
        unique: false,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
        precision: 18,
        scale: 2
      },
      {
        id: "field-011",
        apiName: "CloseDate",
        label: "Close Date",
        type: "Date" as FieldType,
        required: true,
        unique: false,
        isCustom: false,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z"
      }
    ]
  },
  {
    id: "obj-004",
    apiName: "Project__c",
    label: "Project",
    pluralLabel: "Projects",
    description: "Client projects being worked on",
    isCustom: true,
    isActive: true,
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2023-03-15T00:00:00Z",
    recordCount: 42,
    fields: [
      {
        id: "field-012",
        apiName: "Name",
        label: "Project Name",
        type: "Text" as FieldType,
        required: true,
        unique: false,
        isCustom: false,
        createdAt: "2023-03-15T00:00:00Z",
        updatedAt: "2023-03-15T00:00:00Z",
        length: 255
      },
      {
        id: "field-013",
        apiName: "Status__c",
        label: "Status",
        type: "Picklist" as FieldType,
        required: true,
        unique: false,
        isCustom: true,
        createdAt: "2023-03-15T00:00:00Z",
        updatedAt: "2023-03-15T00:00:00Z",
        options: [
          { label: "Not Started", value: "Not Started" },
          { label: "In Progress", value: "In Progress" },
          { label: "On Hold", value: "On Hold" },
          { label: "Completed", value: "Completed" },
          { label: "Cancelled", value: "Cancelled" }
        ]
      },
      {
        id: "field-014",
        apiName: "StartDate__c",
        label: "Start Date",
        type: "Date" as FieldType,
        required: true,
        unique: false,
        isCustom: true,
        createdAt: "2023-03-15T00:00:00Z",
        updatedAt: "2023-03-15T00:00:00Z"
      },
      {
        id: "field-015",
        apiName: "EndDate__c",
        label: "End Date",
        type: "Date" as FieldType,
        required: false,
        unique: false,
        isCustom: true,
        createdAt: "2023-03-15T00:00:00Z",
        updatedAt: "2023-03-15T00:00:00Z"
      },
      {
        id: "field-016",
        apiName: "Budget__c",
        label: "Budget",
        type: "Currency" as FieldType,
        required: false,
        unique: false,
        isCustom: true,
        createdAt: "2023-03-15T00:00:00Z",
        updatedAt: "2023-03-15T00:00:00Z",
        precision: 18,
        scale: 2
      },
      {
        id: "field-017",
        apiName: "Account__c",
        label: "Account",
        type: "Lookup" as FieldType,
        required: true,
        unique: false,
        isCustom: true,
        createdAt: "2023-03-15T00:00:00Z",
        updatedAt: "2023-03-15T00:00:00Z",
        referenceObject: "Account"
      },
      {
        id: "field-018",
        apiName: "DaysRemaining__c",
        label: "Days Remaining",
        type: "Formula" as FieldType,
        required: false,
        unique: false,
        isCustom: true,
        createdAt: "2023-03-15T00:00:00Z",
        updatedAt: "2023-03-15T00:00:00Z",
        formula: "TODAY() - EndDate__c",
        returnType: "Number"
      }
    ]
  }
];

export const mockObjectsResponse: ApiResponse<MetadataObject[]> = {
  data: mockObjects,
  status: "success",
  message: "Fetched objects successfully"
}; 