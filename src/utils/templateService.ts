import { supabase } from '@/lib/supabase';

export interface InvoiceTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  template_data: Record<string, unknown>;
  is_default: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export class TemplateService {
  // Get all templates for current user
  static async getUserTemplates(): Promise<InvoiceTemplate[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user found, returning empty templates');
      return []; // Return empty array instead of throwing error
    }

    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Failed to fetch templates:', error.message);
      return []; // Return empty array instead of throwing error
    }

    return data || [];
  }

  // Get public templates
  static async getPublicTemplates(): Promise<InvoiceTemplate[]> {
    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch public templates: ${error.message}`);
    }

    return data || [];
  }

  // Create new template
  static async createTemplate(templateData: Omit<InvoiceTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<InvoiceTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user found, cannot create template');
      throw new Error('User must be authenticated to create templates');
    }

    // Double-check user authentication with session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No active session found, cannot create template');
      throw new Error('No active session found. Please log in again.');
    }

    const { data, error } = await supabase
      .from('invoice_templates')
      .insert({
        user_id: user.id,
        ...templateData
      })
      .select()
      .single();

    if (error) {
      console.error('Template creation error:', error);
      if (error.message.includes('row-level security policy') || error.message.includes('permission denied')) {
        throw new Error('Permission denied: Please make sure you are logged in and try again.');
      }
      if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
        throw new Error('A template with this name already exists. Please choose a different name.');
      }
      throw new Error(`Failed to create template: ${error.message}`);
    }

    return data;
  }

  // Update template
  static async updateTemplate(templateId: string, updates: Partial<InvoiceTemplate>): Promise<InvoiceTemplate> {
    const { data, error } = await supabase
      .from('invoice_templates')
      .update(updates)
      .eq('id', templateId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update template: ${error.message}`);
    }

    return data;
  }

  // Delete template
  static async deleteTemplate(templateId: string): Promise<void> {
    const { error } = await supabase
      .from('invoice_templates')
      .delete()
      .eq('id', templateId);

    if (error) {
      throw new Error(`Failed to delete template: ${error.message}`);
    }
  }

  // Set default template
  static async setDefaultTemplate(templateId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to set default template');
    }

    // First, unset all other default templates for this user
    await supabase
      .from('invoice_templates')
      .update({ is_default: false })
      .eq('user_id', user.id);

    // Then set the selected template as default
    const { error } = await supabase
      .from('invoice_templates')
      .update({ is_default: true })
      .eq('id', templateId)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to set default template: ${error.message}`);
    }
  }

  // Get default template for user
  static async getDefaultTemplate(): Promise<InvoiceTemplate | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to get default template');
    }

    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single();

    if (error) {
      // No default template found, return null
      return null;
    }

    return data;
  }

  // Create default templates for new user
  static async createDefaultTemplates(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user found, skipping default template creation');
      return; // Don't throw error, just return silently
    }

    // Double-check user authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No active session found, skipping default template creation');
      return; // Don't throw error, just return silently
    }

    // Check if user already has templates to avoid unnecessary creation
    try {
      const existingTemplates = await this.getUserTemplates();
      if (existingTemplates.length > 0) {
        console.log('User already has templates, skipping default template creation');
        return; // User already has templates
      }
    } catch (error) {
      console.error('Error checking existing templates:', error);
      // Continue with creation if we can't check existing templates
    }

    const defaultTemplates = [
      {
        name: 'Standard Template',
        description: 'Clean and professional design for all business types.',
        template_data: {
          style: 'standard',
          colors: { primary: '#3B82F6', secondary: '#1E40AF' },
          layout: 'standard'
        },
        is_default: true,
        is_public: false
      },
      {
        name: 'Minimalist Dark',
        description: 'Sleek dark theme with minimal design elements.',
        template_data: {
          style: 'minimalist-dark',
          colors: { primary: '#6B7280', secondary: '#374151' },
          layout: 'minimal'
        },
        is_default: false,
        is_public: false
      },
      {
        name: 'Creative Agency',
        description: 'Bold and creative design perfect for agencies.',
        template_data: {
          style: 'creative-agency',
          colors: { primary: '#EC4899', secondary: '#BE185D' },
          layout: 'creative'
        },
        is_default: false,
        is_public: false
      }
    ];

    // Create default templates
    for (const template of defaultTemplates) {
      await this.createTemplate(template);
    }
  }
}
