import { supabase } from '@/lib/supabase';

export interface UserAnalytics {
  id: string;
  user_id: string;
  total_invoices: number;
  total_revenue: number;
  paid_invoices: number;
  pending_invoices: number;
  overdue_invoices: number;
  last_updated: string;
}

export class AnalyticsService {
  // Get user analytics
  static async getUserAnalytics(): Promise<UserAnalytics | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to fetch analytics');
    }

    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }

    return data;
  }

  // Get recent invoices for dashboard
  static async getRecentInvoices(limit: number = 5): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to fetch invoices');
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent invoices: ${error.message}`);
    }

    return data || [];
  }

  // Get invoices by status
  static async getInvoicesByStatus(status: string): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to fetch invoices');
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch invoices by status: ${error.message}`);
    }

    return data || [];
  }

  // Get monthly revenue data
  static async getMonthlyRevenue(): Promise<{ month: string; revenue: number }[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to fetch revenue data');
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('total, created_at')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch revenue data: ${error.message}`);
    }

    // Group by month
    const monthlyData: { [key: string]: number } = {};
    
    data?.forEach(invoice => {
      const month = new Date(invoice.created_at).toISOString().slice(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + parseFloat(invoice.total);
    });

    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    }));
  }
}
