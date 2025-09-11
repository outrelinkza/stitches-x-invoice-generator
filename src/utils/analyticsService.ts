import { supabase, Invoice } from '@/lib/supabase';

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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching user analytics:', error);
      }

      if (data) {
        return data;
      }

      // Return default analytics if no data found
      return {
        id: '',
        user_id: user.id,
        total_invoices: 0,
        total_revenue: 0,
        paid_invoices: 0,
        pending_invoices: 0,
        overdue_invoices: 0,
        last_updated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }

  // Get recent invoices for dashboard
  static async getRecentInvoices(limit: number = 5): Promise<Invoice[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Error fetching recent invoices:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting recent invoices:', error);
      return [];
    }
  }

  // Get invoices by status
  static async getInvoicesByStatus(status: string): Promise<Invoice[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching invoices by status:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting invoices by status:', error);
      return [];
    }
  }

  // Get monthly revenue data
  static async getMonthlyRevenue(): Promise<{ month: string; revenue: number }[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('invoices')
        .select('total, created_at')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Error fetching monthly revenue:', error);
        return [];
      }

      // Group by month and sum revenue
      const monthlyData: { [key: string]: number } = {};
      data?.forEach(invoice => {
        const month = new Date(invoice.created_at).toISOString().slice(0, 7); // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + (invoice.total || 0);
      });

      return Object.entries(monthlyData).map(([month, revenue]) => ({
        month,
        revenue
      }));
    } catch (error) {
      console.error('Error getting monthly revenue:', error);
      return [];
    }
  }
}
