import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Layout, LayoutSection, LayoutItem } from "../types";
import { mockLayoutsResponse } from "@/mocks";

interface LayoutContextType {
  layouts: Layout[];
  isLoading: boolean;
  error: string | null;
  getLayoutById: (id: string) => Layout | undefined;
  getLayoutsByObjectApiName: (objectApiName: string) => Layout[];
  createLayout: (layout: Partial<Layout>) => Promise<Layout>;
  updateLayout: (id: string, layout: Partial<Layout>) => Promise<Layout>;
  deleteLayout: (id: string) => Promise<void>;
  addSectionToLayout: (layoutId: string, section: Partial<LayoutSection>) => Promise<LayoutSection>;
  updateLayoutSection: (layoutId: string, sectionId: string, section: Partial<LayoutSection>) => Promise<LayoutSection>;
  deleteLayoutSection: (layoutId: string, sectionId: string) => Promise<void>;
  addItemToSection: (layoutId: string, sectionId: string, item: Partial<LayoutItem>) => Promise<LayoutItem>;
  updateLayoutItem: (layoutId: string, sectionId: string, itemId: string, item: Partial<LayoutItem>) => Promise<LayoutItem>;
  deleteLayoutItem: (layoutId: string, sectionId: string, itemId: string) => Promise<void>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulating loading data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setLayouts(mockLayoutsResponse.data);
      } catch (err) {
        setError("Failed to load layouts");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getLayoutById = (id: string): Layout | undefined => {
    return layouts.find(layout => layout.id === id);
  };

  const getLayoutsByObjectApiName = (objectApiName: string): Layout[] => {
    return layouts.filter(layout => layout.objectApiName === objectApiName);
  };

  const createLayout = async (layout: Partial<Layout>): Promise<Layout> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newLayout: Layout = {
      id: `layout-${Date.now()}`,
      name: layout.name || "",
      objectApiName: layout.objectApiName || "",
      isActive: layout.isActive !== undefined ? layout.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: layout.sections || [],
      assignedProfiles: layout.assignedProfiles || [],
      assignedRecordTypes: layout.assignedRecordTypes || []
    };

    setLayouts(prevLayouts => [...prevLayouts, newLayout]);
    return newLayout;
  };

  const updateLayout = async (id: string, layoutData: Partial<Layout>): Promise<Layout> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedLayouts = layouts.map(layout => {
      if (layout.id === id) {
        return {
          ...layout,
          ...layoutData,
          updatedAt: new Date().toISOString()
        };
      }
      return layout;
    });

    setLayouts(updatedLayouts);
    const updatedLayout = updatedLayouts.find(layout => layout.id === id);
    
    if (!updatedLayout) {
      throw new Error("Layout not found");
    }
    
    return updatedLayout;
  };

  const deleteLayout = async (id: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filteredLayouts = layouts.filter(layout => layout.id !== id);
    setLayouts(filteredLayouts);
  };

  const addSectionToLayout = async (layoutId: string, section: Partial<LayoutSection>): Promise<LayoutSection> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newSection: LayoutSection = {
      id: `section-${Date.now()}`,
      heading: section.heading || "New Section",
      columns: section.columns || 2,
      expanded: section.expanded !== undefined ? section.expanded : true,
      layoutItems: section.layoutItems || []
    };

    const updatedLayouts = layouts.map(layout => {
      if (layout.id === layoutId) {
        return {
          ...layout,
          sections: [...layout.sections, newSection],
          updatedAt: new Date().toISOString()
        };
      }
      return layout;
    });

    setLayouts(updatedLayouts);
    return newSection;
  };

  const updateLayoutSection = async (layoutId: string, sectionId: string, sectionData: Partial<LayoutSection>): Promise<LayoutSection> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedSection: LayoutSection | undefined;
    
    const updatedLayouts = layouts.map(layout => {
      if (layout.id === layoutId) {
        const updatedSections = layout.sections.map(section => {
          if (section.id === sectionId) {
            updatedSection = {
              ...section,
              ...sectionData
            };
            return updatedSection;
          }
          return section;
        });
        
        return {
          ...layout,
          sections: updatedSections,
          updatedAt: new Date().toISOString()
        };
      }
      return layout;
    });

    setLayouts(updatedLayouts);
    
    if (!updatedSection) {
      throw new Error("Section not found");
    }
    
    return updatedSection;
  };

  const deleteLayoutSection = async (layoutId: string, sectionId: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedLayouts = layouts.map(layout => {
      if (layout.id === layoutId) {
        return {
          ...layout,
          sections: layout.sections.filter(section => section.id !== sectionId),
          updatedAt: new Date().toISOString()
        };
      }
      return layout;
    });

    setLayouts(updatedLayouts);
  };

  const addItemToSection = async (layoutId: string, sectionId: string, item: Partial<LayoutItem>): Promise<LayoutItem> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newItem: LayoutItem = {
      id: `item-${Date.now()}`,
      fieldApiName: item.fieldApiName || "",
      isRequired: item.isRequired || false,
      isReadOnly: item.isReadOnly || false,
      width: item.width || 1
    };

    const updatedLayouts = layouts.map(layout => {
      if (layout.id === layoutId) {
        const updatedSections = layout.sections.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              layoutItems: [...section.layoutItems, newItem]
            };
          }
          return section;
        });
        
        return {
          ...layout,
          sections: updatedSections,
          updatedAt: new Date().toISOString()
        };
      }
      return layout;
    });

    setLayouts(updatedLayouts);
    return newItem;
  };

  const updateLayoutItem = async (layoutId: string, sectionId: string, itemId: string, itemData: Partial<LayoutItem>): Promise<LayoutItem> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedItem: LayoutItem | undefined;
    
    const updatedLayouts = layouts.map(layout => {
      if (layout.id === layoutId) {
        const updatedSections = layout.sections.map(section => {
          if (section.id === sectionId) {
            const updatedItems = section.layoutItems.map(item => {
              if (item.id === itemId) {
                updatedItem = {
                  ...item,
                  ...itemData
                };
                return updatedItem;
              }
              return item;
            });
            
            return {
              ...section,
              layoutItems: updatedItems
            };
          }
          return section;
        });
        
        return {
          ...layout,
          sections: updatedSections,
          updatedAt: new Date().toISOString()
        };
      }
      return layout;
    });

    setLayouts(updatedLayouts);
    
    if (!updatedItem) {
      throw new Error("Layout item not found");
    }
    
    return updatedItem;
  };

  const deleteLayoutItem = async (layoutId: string, sectionId: string, itemId: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedLayouts = layouts.map(layout => {
      if (layout.id === layoutId) {
        const updatedSections = layout.sections.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              layoutItems: section.layoutItems.filter(item => item.id !== itemId)
            };
          }
          return section;
        });
        
        return {
          ...layout,
          sections: updatedSections,
          updatedAt: new Date().toISOString()
        };
      }
      return layout;
    });

    setLayouts(updatedLayouts);
  };

  const value = {
    layouts,
    isLoading,
    error,
    getLayoutById,
    getLayoutsByObjectApiName,
    createLayout,
    updateLayout,
    deleteLayout,
    addSectionToLayout,
    updateLayoutSection,
    deleteLayoutSection,
    addItemToSection,
    updateLayoutItem,
    deleteLayoutItem
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};