import { ApiResponse, Layout } from "@/types";

// Centralized mock data for layouts
const mockLayouts: Layout[] = [
  {
    id: "layout-001",
    name: "Account Standard Layout",
    objectApiName: "Account",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    assignedProfiles: ["System Administrator", "Sales User"],
    sections: [
      {
        id: "section-001",
        heading: "Account Information",
        columns: 2,
        expanded: true,
        layoutItems: [
          {
            id: "item-001",
            fieldApiName: "Name",
            isRequired: true,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-002",
            fieldApiName: "Industry",
            isRequired: false,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-003",
            fieldApiName: "AnnualRevenue",
            isRequired: false,
            isReadOnly: false,
            width: 1
          }
        ]
      },
      {
        id: "section-002",
        heading: "Address Information",
        columns: 2,
        expanded: true,
        layoutItems: [
          {
            id: "item-004",
            fieldApiName: "BillingStreet",
            isRequired: false,
            isReadOnly: false,
            width: 2
          },
          {
            id: "item-005",
            fieldApiName: "BillingCity",
            isRequired: false,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-006",
            fieldApiName: "BillingState",
            isRequired: false,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-007",
            fieldApiName: "BillingPostalCode",
            isRequired: false,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-008",
            fieldApiName: "BillingCountry",
            isRequired: false,
            isReadOnly: false,
            width: 1
          }
        ]
      }
    ]
  },
  {
    id: "layout-002",
    name: "Contact Standard Layout",
    objectApiName: "Contact",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    assignedProfiles: ["System Administrator", "Sales User"],
    sections: [
      {
        id: "section-003",
        heading: "Contact Information",
        columns: 2,
        expanded: true,
        layoutItems: [
          {
            id: "item-009",
            fieldApiName: "FirstName",
            isRequired: false,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-010",
            fieldApiName: "LastName",
            isRequired: true,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-011",
            fieldApiName: "Email",
            isRequired: false,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-012",
            fieldApiName: "Phone",
            isRequired: false,
            isReadOnly: false,
            width: 1
          }
        ]
      }
    ]
  },
  {
    id: "layout-003",
    name: "Project Layout",
    objectApiName: "Project__c",
    isActive: true,
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2023-03-15T00:00:00Z",
    assignedProfiles: ["System Administrator", "Project Manager"],
    sections: [
      {
        id: "section-004",
        heading: "Project Details",
        columns: 2,
        expanded: true,
        layoutItems: [
          {
            id: "item-013",
            fieldApiName: "Name",
            isRequired: true,
            isReadOnly: false,
            width: 2
          },
          {
            id: "item-014",
            fieldApiName: "Status__c",
            isRequired: true,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-015",
            fieldApiName: "Account__c",
            isRequired: true,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-016",
            fieldApiName: "StartDate__c",
            isRequired: true,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-017",
            fieldApiName: "EndDate__c",
            isRequired: false,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-018",
            fieldApiName: "Budget__c",
            isRequired: false,
            isReadOnly: false,
            width: 1
          },
          {
            id: "item-019",
            fieldApiName: "DaysRemaining__c",
            isRequired: false,
            isReadOnly: true,
            width: 1
          }
        ]
      }
    ]
  }
];

export const mockLayoutsResponse: ApiResponse<Layout[]> = {
  data: mockLayouts,
  status: "success",
  message: "Fetched layouts successfully"
}; 