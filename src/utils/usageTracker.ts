// import { supabase } from '@/lib/supabase'; // Disabled for testing

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
   * Get current usage for user (LocalStorage only - Supabase disabled)
   */
  static async getCurrentUsage(userId?: string, email?: string): Promise<UsageData> {
    try {
      // Use LocalStorage only (Supabase disabled for testing)
      console.log('UsageTracker: getCurrentUsage called with userId:', userId, 'email:', email);
      console.log('UsageTracker: Using LocalStorage only (Supabase disabled) - VERSION 2.0');
      const result = this.getLocalUsage();
      console.log('UsageTracker: Returning LocalStorage result:', result);
      return result;
    } catch (error) {
      console.error('Error getting usage:', error);
      // Fallback to default usage
      return this.getDefaultUsage();
    }
  }

  /**
   * Track a download (LocalStorage only - Supabase disabled)
   */
  static async trackDownload(userId?: string, email?: string): Promise<UsageData> {
    try {
      // Update LocalStorage only (Supabase disabled for testing)
      console.log('UsageTracker: Tracking download with LocalStorage only (Supabase disabled)');
      const localUsage = this.incrementLocalUsage();
      
      // Return the updated usage
      return {
        downloads_this_month: localUsage.downloads_this_month,
        total_downloads: localUsage.total_downloads,
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
    console.log('UsageTracker: Checking download limit - current usage:', usage.downloads_this_month, 'limit:', this.FREE_DOWNLOAD_LIMIT);
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
   * Get server usage data from Supabase (DISABLED FOR TESTING)
   */
  private static async getServerUsage(userId?: string, email?: string): Promise<UsageData> {
    console.log('UsageTracker: getServerUsage disabled for testing');
    return this.getDefaultUsage();
  }

  /**
   * Increment server usage in Supabase (DISABLED FOR TESTING)
   */
  private static async incrementServerUsage(userId?: string, email?: string): Promise<UsageData> {
    console.log('UsageTracker: incrementServerUsage disabled for testing');
    return this.getDefaultUsage();
  }

  /**
   * Reset server usage (monthly reset) - DISABLED FOR TESTING
   */
  private static async resetServerUsage(): Promise<void> {
    console.log('UsageTracker: resetServerUsage disabled for testing');
    // Supabase calls disabled for testing
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
