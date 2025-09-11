import { supabase } from '@/lib/supabase';

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  id?: string;
  user_id?: string;
  invoice_number: string;
  company_name?: string;
  company_address?: string;
  company_contact?: string;
  client_name?: string;
  client_address?: string;
  client_contact?: string;
  date?: string;
  due_date?: string;
  payment_terms?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  additional_notes?: string;
  template: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  pdf_url?: string;
  created_at?: string;
  updated_at?: string;
}

export class InvoiceService {
  // Save invoice to Supabase
  static async saveInvoice(invoiceData: Omit<InvoiceData, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<InvoiceData> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to save invoices');
    }

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        ...invoiceData
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save invoice: ${error.message}`);
    }

    return data;
  }

  // Update existing invoice
  static async updateInvoice(invoiceId: string, updates: Partial<InvoiceData>): Promise<InvoiceData> {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update invoice: ${error.message}`);
    }

    return data;
  }

  // Get all invoices for current user
  static async getUserInvoices(): Promise<InvoiceData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to fetch invoices');
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch invoices: ${error.message}`);
    }

    return data || [];
  }

  // Get single invoice by ID
  static async getInvoice(invoiceId: string): Promise<InvoiceData> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch invoice: ${error.message}`);
    }

    return data;
  }

  // Delete invoice
  static async deleteInvoice(invoiceId: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId);

    if (error) {
      throw new Error(`Failed to delete invoice: ${error.message}`);
    }
  }

  // Generate next invoice number
  static async getNextInvoiceNumber(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return 'INV-001';
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return 'INV-001';
    }

    const lastInvoiceNumber = data[0].invoice_number;
    const match = lastInvoiceNumber.match(/INV-(\d+)/);
    
    if (match) {
      const nextNumber = parseInt(match[1]) + 1;
      return `INV-${nextNumber.toString().padStart(3, '0')}`;
    }

    return 'INV-001';
  }

  // Save draft invoice
  static async saveDraft(formData: FormData): Promise<InvoiceData> {
    const invoiceData = this.extractInvoiceDataFromForm(formData);
    invoiceData.status = 'draft';
    
    return this.saveInvoice(invoiceData);
  }

  // Extract invoice data from form
  private static extractInvoiceDataFromForm(formData: FormData): Omit<InvoiceData, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
    const items: InvoiceItem[] = [];
    let itemIndex = 0;

    // Extract items from form
    while (formData.get(`items[${itemIndex}][description]`)) {
      const description = formData.get(`items[${itemIndex}][description]`) as string;
      const quantity = parseFloat(formData.get(`items[${itemIndex}][quantity]`) as string) || 0;
      const rate = parseFloat(formData.get(`items[${itemIndex}][rate]`) as string) || 0;
      const amount = quantity * rate;

      items.push({ description, quantity, rate, amount });
      itemIndex++;
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = parseFloat(formData.get('taxRate') as string) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    return {
      invoice_number: formData.get('invoiceNumber') as string || '',
      company_name: formData.get('companyName') as string || '',
      company_address: formData.get('companyAddress') as string || '',
      company_contact: formData.get('companyContact') as string || '',
      client_name: formData.get('clientName') as string || '',
      client_address: formData.get('clientAddress') as string || '',
      client_contact: formData.get('clientContact') as string || '',
      date: formData.get('date') as string || new Date().toISOString().split('T')[0],
      due_date: formData.get('dueDate') as string || '',
      payment_terms: formData.get('paymentTerms') as string || '',
      items,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      additional_notes: formData.get('additionalNotes') as string || '',
      template: formData.get('template') as string || 'standard',
      status: 'draft' as const
    };
  }
}
