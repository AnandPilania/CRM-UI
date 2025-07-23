import { ApiResponse } from "@/types";

export interface SearchResult {
  id: string;
  name: string;
  type?: string;
  objectName?: string;
}

export interface SearchResponse {
  objects: SearchResult[];
  fields: SearchResult[];
  records: SearchResult[];
  layouts: SearchResult[];
  reports: SearchResult[];
}

export const mockSearchResponse: ApiResponse<SearchResponse> = {
  data: {
    objects: [
      { id: "1", name: "Account", type: "Standard Object" },
      { id: "2", name: "Contact", type: "Standard Object" },
      { id: "3", name: "Opportunity", type: "Standard Object" },
      { id: "4", name: "CustomObject__c", type: "Custom Object" },
    ],
    fields: [
      { id: "1", name: "Name", objectName: "Account", type: "Text" },
      { id: "2", name: "Email", objectName: "Contact", type: "Email" },
      { id: "3", name: "Amount", objectName: "Opportunity", type: "Currency" },
    ],
    records: [
      { id: "1", name: "Acme Corp", type: "Account" },
      { id: "2", name: "John Doe", type: "Contact" },
      { id: "3", name: "Enterprise Deal", type: "Opportunity" },
    ],
    layouts: [
      { id: "1", name: "Account Layout", objectName: "Account" },
      { id: "2", name: "Contact Layout", objectName: "Contact" },
    ],
    reports: [
      { id: "1", name: "Sales Pipeline", type: "Report" },
      { id: "2", name: "Customer Contacts", type: "Report" },
    ],
  },
  status: "success",
  message: "Fetched search results successfully"
}; 