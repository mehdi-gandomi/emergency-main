// services/typeEventService.ts
export interface TypeEventNode {
  id: number;
  title: string;
  en_title?: string;
  ar_title?: string;
  icon_path?: string | null;
  coding?: string | null;
  children?: TypeEventNode[];
}

// Add TypeEvent interface with has_children property for compatibility
export interface TypeEvent {
  id: number;
  title: string;
  en_title?: string;
  ar_title?: string;
  icon_path?: string | null;
  coding?: string | null;
  has_children?: boolean;
  children?: TypeEvent[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const typeEventService = {
  // درخت کامل
  async getTypeEventsTree(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/type-events/tree`);
      const json = await res.json();
      
      // Check if response has data property
      if (json.data) {
        return json.data;
      }
      // If it's a direct array response
      if (Array.isArray(json)) {
        return json;
      }
      
      throw new Error("Unexpected response shape from /type-events/tree");
    } catch (err) {
      console.error("Error fetching type events tree:", err);
      throw err;
    }
  },

  async getTypeEvents(): Promise<TypeEvent[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/type-events`);
      const json = await res.json();
      
      // Check if response has data property
      if (json.data) {
        return json.data;
      }
      // If it's a direct array response
      if (Array.isArray(json)) {
        return json;
      }
      
      throw new Error("Unexpected response shape from /type-events");
    } catch (err) {
      console.error("Error fetching type events:", err);
      // Return empty array instead of throwing to prevent UI crash
      return [];
    }
  },

  // Add the missing getSubcategories method
  async getSubcategories(parentId: number): Promise<TypeEvent[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/type-events/${parentId}/subcategories`);
      const json = await res.json();
      
      // Check if response has data property
      if (json.data) {
        return json.data;
      }
      // If it's a direct array response
      if (Array.isArray(json)) {
        return json;
      }
      
      return [];
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      return [];
    }
  },

  // اگر هنوز جایی نیاز به زیرمجموعه‌ها باشد، از درخت محلی استخراج می‌کنیم
  getSubcategoriesFromTree(tree: TypeEventNode[], parentId: number): TypeEventNode[] {
    const stack = [...tree];
    while (stack.length) {
      const n = stack.pop()!;
      if (n.id === parentId) {
        return n.children ?? [];
      }
      if (n.children?.length) stack.push(...n.children);
    }
    return [];
  },
};