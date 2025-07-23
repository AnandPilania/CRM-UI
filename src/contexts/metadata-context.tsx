import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MetadataObject, Field, FieldType } from "../types";

interface MetadataContextType {
  objects: MetadataObject[];
  isLoading: boolean;
  error: string | null;
  getObjectByApiName: (apiName: string) => MetadataObject | undefined;
  getFieldsByObjectApiName: (objectApiName: string) => Field[];
  createObject: (object: Partial<MetadataObject>) => Promise<MetadataObject>;
  updateObject: (id: string, object: Partial<MetadataObject>) => Promise<MetadataObject>;
  deleteObject: (id: string) => Promise<void>;
  createField: (objectApiName: string, field: Partial<Field>) => Promise<Field>;
  updateField: (objectApiName: string, fieldId: string, field: Partial<Field>) => Promise<Field>;
  deleteField: (objectApiName: string, fieldId: string) => Promise<void>;
}

// Mock data for development
const MOCK_STANDARD_OBJECTS: MetadataObject[] = [
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
  }
];

const MOCK_CUSTOM_OBJECTS: MetadataObject[] = [
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

const MOCK_OBJECTS = [...MOCK_STANDARD_OBJECTS, ...MOCK_CUSTOM_OBJECTS];

const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export function MetadataProvider({ children }: { children: ReactNode }) {
  const [objects, setObjects] = useState<MetadataObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulating loading data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, this would be an API call
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setObjects(MOCK_OBJECTS);
      } catch (err) {
        setError("Failed to load metadata objects");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getObjectByApiName = (apiName: string): MetadataObject | undefined => {
    return objects.find(obj => obj.apiName === apiName);
  };

  const getFieldsByObjectApiName = (objectApiName: string): Field[] => {
    const object = getObjectByApiName(objectApiName);
    return object ? object.fields : [];
  };

  const createObject = async (object: Partial<MetadataObject>): Promise<MetadataObject> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newObject: MetadataObject = {
      id: `obj-${Date.now()}`,
      apiName: object.apiName || "",
      label: object.label || "",
      pluralLabel: object.pluralLabel || "",
      description: object.description || "",
      isCustom: object.isCustom || true,
      isActive: object.isActive !== undefined ? object.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: object.fields || [],
      recordCount: 0
    };

    setObjects(prevObjects => [...prevObjects, newObject]);
    return newObject;
  };

  const updateObject = async (id: string, objectData: Partial<MetadataObject>): Promise<MetadataObject> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedObjects = objects.map(obj => {
      if (obj.id === id) {
        return {
          ...obj,
          ...objectData,
          updatedAt: new Date().toISOString()
        };
      }
      return obj;
    });

    setObjects(updatedObjects);
    const updatedObject = updatedObjects.find(obj => obj.id === id);
    
    if (!updatedObject) {
      throw new Error("Object not found");
    }
    
    return updatedObject;
  };

  const deleteObject = async (id: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filteredObjects = objects.filter(obj => obj.id !== id);
    setObjects(filteredObjects);
  };

  const createField = async (objectApiName: string, field: Partial<Field>): Promise<Field> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newField: Field = {
      id: `field-${Date.now()}`,
      apiName: field.apiName || "",
      label: field.label || "",
      type: field.type || "Text",
      required: field.required || false,
      unique: field.unique || false,
      description: field.description || "",
      helpText: field.helpText || "",
      isCustom: field.isCustom !== undefined ? field.isCustom : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...field
    };

    const updatedObjects = objects.map(obj => {
      if (obj.apiName === objectApiName) {
        return {
          ...obj,
          fields: [...obj.fields, newField],
          updatedAt: new Date().toISOString()
        };
      }
      return obj;
    });

    setObjects(updatedObjects);
    return newField;
  };

  const updateField = async (objectApiName: string, fieldId: string, fieldData: Partial<Field>): Promise<Field> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedField: Field | undefined;
    
    const updatedObjects = objects.map(obj => {
      if (obj.apiName === objectApiName) {
        const updatedFields = obj.fields.map(field => {
          if (field.id === fieldId) {
            updatedField = {
              ...field,
              ...fieldData,
              updatedAt: new Date().toISOString()
            };
            return updatedField;
          }
          return field;
        });
        
        return {
          ...obj,
          fields: updatedFields,
          updatedAt: new Date().toISOString()
        };
      }
      return obj;
    });

    setObjects(updatedObjects);
    
    if (!updatedField) {
      throw new Error("Field not found");
    }
    
    return updatedField;
  };

  const deleteField = async (objectApiName: string, fieldId: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedObjects = objects.map(obj => {
      if (obj.apiName === objectApiName) {
        return {
          ...obj,
          fields: obj.fields.filter(field => field.id !== fieldId),
          updatedAt: new Date().toISOString()
        };
      }
      return obj;
    });

    setObjects(updatedObjects);
  };

  const value = {
    objects,
    isLoading,
    error,
    getObjectByApiName,
    getFieldsByObjectApiName,
    createObject,
    updateObject,
    deleteObject,
    createField,
    updateField,
    deleteField
  };

  return (
    <MetadataContext.Provider value={value}>
      {children}
    </MetadataContext.Provider>
  );
}

export const useMetadata = (): MetadataContextType => {
  const context = useContext(MetadataContext);
  if (context === undefined) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
};