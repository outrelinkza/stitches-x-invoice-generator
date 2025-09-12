import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const deletionResults = {
      user_profile: false,
      user_settings: false,
      invoices: false,
      templates: false,
      analytics: false,
    };

    // Delete user invoices
    const { error: invoicesError } = await supabase
      .from('invoices')
      .delete()
      .eq('user_id', userId);

    if (!invoicesError) {
      deletionResults.invoices = true;
    }

    // Delete user templates
    const { error: templatesError } = await supabase
      .from('invoice_templates')
      .delete()
      .eq('user_id', userId);

    if (!templatesError) {
      deletionResults.templates = true;
    }

    // Delete user analytics
    const { error: analyticsError } = await supabase
      .from('user_analytics')
      .delete()
      .eq('user_id', userId);

    if (!analyticsError) {
      deletionResults.analytics = true;
    }

    // Delete user settings
    const { error: settingsError } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', userId);

    if (!settingsError) {
      deletionResults.user_settings = true;
    }

    // Delete user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (!profileError) {
      deletionResults.user_profile = true;
    }

    // Check if all deletions were successful
    const allSuccessful = Object.values(deletionResults).every(result => result === true);
    
    if (!allSuccessful) {
      console.warn('Some data deletion operations failed:', deletionResults);
    }

    // Delete the user account from Supabase Auth
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);
    
    if (deleteUserError) {
      console.error('Failed to delete user account:', deleteUserError);
      return NextResponse.json(
        { 
          error: 'Failed to delete user account',
          details: deleteUserError.message,
          partial_success: deletionResults
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'All user data has been successfully deleted',
      deleted_data: deletionResults,
      user_id: userId,
      deletion_date: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Delete user data error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user data' },
      { status: 500 }
    );
  }
}
