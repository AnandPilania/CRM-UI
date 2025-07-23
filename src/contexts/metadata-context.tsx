import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MetadataObject, Field, FieldType } from "../types";
import { mockObjectsResponse } from "@/mocks";

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

const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export function MetadataProvider({ children }: { children: ReactNode }) {
  const [objects, setObjects] = useState<MetadataObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulating loading data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setObjects(mockObjectsResponse.data);
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