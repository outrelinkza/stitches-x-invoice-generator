import { supabase } from '@/lib/supabase';

export interface UsageData {
  downloads_this_month: number;
  total_downloads: number;
  last_download_date: string;
  is_guest: boolean;
}

export class UsageTracker {
  private static readonly FREE_DOWNLOAD_LIMIT = 2;
  private static readonly STORAGE_KEY = 'invoicepro_usage';
  private static readonly MONTHLY_RESET_KEY = 'invoicepro_monthly_reset';

  /**
   * Get current usage for user (hybrid: LocalStorage + Supabase)
   */
  static async getCurrentUsage(userId?: string, email?: string): Promise<UsageData> {
    try {
      // Get LocalStorage data first (fast)
      const localUsage = this.getLocalUsage();
      
      // Get Supabase data (reliable)
      const serverUsage = await this.getServerUsage(userId, email);
      
      // Use the higher count (most restrictive)
      const downloads_this_month = Math.max(
        localUsage.downloads_this_month,
        serverUsage.downloads_this_month
      );
      
      const total_downloads = Math.max(
        localUsage.total_downloads,
        serverUsage.total_downloads
      );

      return {
        downloads_this_month,
        total_downloads,
        last_download_date: serverUsage.last_download_date || localUsage.last_download_date,
        is_guest: !userId && !email
      };
    } catch (error) {
      console.error('Error getting usage:', error);
      // Fallback to LocalStorage only
      return this.getLocalUsage();
    }
  }

  /**
   * Track a download (update both LocalStorage and Supabase)
   */
  static async trackDownload(userId?: string, email?: string): Promise<UsageData> {
    try {
      // Update LocalStorage first (instant feedback)
      const localUsage = this.incrementLocalUsage();
      
      // Update Supabase (reliable storage)
      const serverUsage = await this.incrementServerUsage(userId, email);
      
      // Return the updated usage
      return {
        downloads_this_month: Math.max(localUsage.downloads_this_month, serverUsage.downloads_this_month),
        total_downloads: Math.max(localUsage.total_downloads, serverUsage.total_downloads),
        last_download_date: new Date().toISOString(),
        is_guest: !userId && !email
      };
    } catch (error) {
      console.error('Error tracking download:', error);
      // Return LocalStorage data as fallback
      return this.getLocalUsage();
    }
  }

  /**
   * Check if user can download (has remaining free downloads)
   */
  static async canDownload(userId?: string, email?: string): Promise<boolean> {
    const usage = await this.getCurrentUsage(userId, email);
    return usage.downloads_this_month < this.FREE_DOWNLOAD_LIMIT;
  }

  /**
   * Get remaining free downloads
   */
  static async getRemainingDownloads(userId?: string, email?: string): Promise<number> {
    const usage = await this.getCurrentUsage(userId, email);
    return Math.max(0, this.FREE_DOWNLOAD_LIMIT - usage.downloads_this_month);
  }

  /**
   * Check if user has reached download limit
   */
  static async hasReachedLimit(userId?: string, email?: string): Promise<boolean> {
    const usage = await this.getCurrentUsage(userId, email);
    return usage.downloads_this_month >= this.FREE_DOWNLOAD_LIMIT;
  }

  /**
   * Reset monthly usage (called on new month)
   */
  static async resetMonthlyUsage(): Promise<void> {
    try {
      // Reset LocalStorage
      this.resetLocalUsage();
      
      // Reset Supabase
      await this.resetServerUsage();
    } catch (error) {
      console.error('Error resetting monthly usage:', error);
    }
  }

  /**
   * Get LocalStorage usage data
   */
  private static getLocalUsage(): UsageData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Check if we need to reset for new month
        if (this.shouldResetMonthly()) {
          this.resetLocalUsage();
          return this.getDefaultUsage();
        }
        return data;
      }
    } catch (error) {
      console.error('Error reading LocalStorage:', error);
    }
    return this.getDefaultUsage();
  }

  /**
   * Increment LocalStorage usage
   */
  private static incrementLocalUsage(): UsageData {
    const current = this.getLocalUsage();
    const updated = {
      ...current,
      downloads_this_month: current.downloads_this_month + 1,
      total_downloads: current.total_downloads + 1,
      last_download_date: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving to LocalStorage:', error);
    }
    
    return updated;
  }

  /**
   * Reset LocalStorage usage
   */
  private static resetLocalUsage(): void {
    try {
      const resetData = this.getDefaultUsage();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetData));
      localStorage.setItem(this.MONTHLY_RESET_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error resetting LocalStorage:', error);
    }
  }

  /**
   * Get server usage data from Supabase
   */
  private static async getServerUsage(userId?: string, email?: string): Promise<UsageData> {
    try {
      if (!userId && !email) {
        return this.getDefaultUsage();
      }

      console.log('UsageTracker: Querying user_usage table with userId:', userId, 'email:', email);

      // Test table existence first
      const { data: testData, error: testError } = await supabase
        .from('user_usage')
        .select('count')
        .limit(1);
      
      console.log('UsageTracker: Table test - data:', testData, 'error:', testError);

      let query = supabase.from('user_usage').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      } else if (email) {
        query = query.eq('email', email).is('user_id', null);
      }

      const { data, error } = await query.single();
      
      console.log('UsageTracker: Query result - data:', data, 'error:', error);
      
      // Log the full error details
      if (error) {
        console.error('UsageTracker: Full error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      }

      // Handle 406 error specifically (RLS policy issues)
      if (error && error.code === '406') {
        console.warn('RLS policy error (406) - falling back to LocalStorage only');
        return this.getDefaultUsage();
      }

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.warn('Supabase query error:', error);
        return this.getDefaultUsage();
      }

      if (data) {
        // Check if we need to reset for new month
        if (this.shouldResetMonthly(data.last_download_date)) {
          await this.resetServerUsage();
          return this.getDefaultUsage();
        }
        
        return {
          downloads_this_month: data.downloads_this_month || 0,
          total_downloads: data.total_downloads || 0,
          last_download_date: data.last_download_date,
          is_guest: !userId
        };
      }

      return this.getDefaultUsage();
    } catch (error) {
      console.error('Error getting server usage:', error);
      return this.getDefaultUsage();
    }
  }

  /**
   * Increment server usage in Supabase
   */
  private static async incrementServerUsage(userId?: string, email?: string): Promise<UsageData> {
    try {
      if (!userId && !email) {
        return this.getDefaultUsage();
      }

      const now = new Date().toISOString();
      
      // Try to update existing record
      let query = supabase.from('user_usage').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      } else if (email) {
        query = query.eq('email', email).is('user_id', null);
      }

      const { data: existing, error: selectError } = await query.single();

      // Handle 406 error specifically (RLS policy issues)
      if (selectError && selectError.code === '406') {
        console.warn('RLS policy error (406) - falling back to LocalStorage only');
        return this.getDefaultUsage();
      }

      if (existing && !selectError) {
        // Update existing record
        const { data, error } = await supabase
          .from('user_usage')
          .update({
            downloads_this_month: existing.downloads_this_month + 1,
            total_downloads: existing.total_downloads + 1,
            last_download_date: now,
            updated_at: now
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          if (error.code === '406') {
            console.warn('RLS policy error (406) - falling back to LocalStorage only');
            return this.getDefaultUsage();
          }
          throw error;
        }

        return {
          downloads_this_month: data.downloads_this_month,
          total_downloads: data.total_downloads,
          last_download_date: data.last_download_date,
          is_guest: !userId
        };
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('user_usage')
          .insert({
            user_id: userId || null,
            email: email || null,
            downloads_this_month: 1,
            total_downloads: 1,
            last_download_date: now
          })
          .select()
          .single();

        if (error) {
          if (error.code === '406') {
            console.warn('RLS policy error (406) - falling back to LocalStorage only');
            return this.getDefaultUsage();
          }
          throw error;
        }

        return {
          downloads_this_month: data.downloads_this_month,
          total_downloads: data.total_downloads,
          last_download_date: data.last_download_date,
          is_guest: !userId
        };
      }
    } catch (error) {
      console.error('Error incrementing server usage:', error);
      return this.getDefaultUsage();
    }
  }

  /**
   * Reset server usage (monthly reset)
   */
  private static async resetServerUsage(): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_usage')
        .update({
          downloads_this_month: 0,
          updated_at: new Date().toISOString()
        })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all records

      if (error) throw error;
    } catch (error) {
      console.error('Error resetting server usage:', error);
    }
  }

  /**
   * Check if we should reset monthly usage
   */
  private static shouldResetMonthly(lastReset?: string): boolean {
    try {
      const now = new Date();
      const lastResetDate = lastReset ? new Date(lastReset) : new Date(0);
      
      // Reset if it's a new month
      return now.getMonth() !== lastResetDate.getMonth() || 
             now.getFullYear() !== lastResetDate.getFullYear();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get default usage data
   */
  private static getDefaultUsage(): UsageData {
    return {
      downloads_this_month: 0,
      total_downloads: 0,
      last_download_date: '',
      is_guest: true
    };
  }
}
