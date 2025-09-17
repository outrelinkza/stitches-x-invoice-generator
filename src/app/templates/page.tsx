'use client';

import { useState, useEffect } from 'react';
import NavHeader from '@/components/NavHeader';
import FloatingCalculator from '@/components/FloatingCalculator';
import { TemplateService } from '@/utils/templateService';
import { useAuth } from '@/contexts/AuthContext';

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [showPreview, setShowPreview] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadTemplates = async () => {
      // Always set loading to false first
      setLoading(false);
      
      // If no user, just return with empty templates
      if (!user) {
        setTemplates([]);
        return;
      }

      try {
        // Load real templates from database
        const userTemplates = await TemplateService.getUserTemplates();
          setTemplates(userTemplates);
      } catch (error) {
        console.log('Failed to load templates, continuing with empty templates');
        setTemplates([]);
      }
    };

    loadTemplates();
  }, [user]);

  const handleTemplateSelect = (templateName: string) => {
    // Redirect to individual template page
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTemplate', templateName);
      window.location.href = `/templates/${templateName}`;
    }
  };

  // Define all available templates with their details
  const allTemplates = [
    {
      id: 'custom',
      name: 'Custom Builder',
      description: 'Design your own template with colors, fonts, and layouts.',
      icon: 'palette',
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-300',
      isInteractive: true,
      isDefault: false
    },
    {
      id: 'business-professional',
      name: 'Business Professional',
      description: 'Corporate branding space with logo and color scheme.',
      icon: 'business',
      gradient: 'from-slate-900/30 to-gray-900/30',
      iconColor: 'text-slate-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'consulting',
      name: 'Consulting',
      description: 'Professional template for consulting and advisory services.',
      icon: 'business_center',
      gradient: 'from-gray-900/40 to-slate-900/40',
      iconColor: 'text-gray-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'creative-agency',
      name: 'Creative Agency',
      description: 'Bold and colorful design for creative professionals.',
      icon: 'palette',
      gradient: 'from-pink-900/30 to-orange-900/30',
      iconColor: 'text-pink-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'elegant-luxury',
      name: 'Elegant Luxury',
      description: 'Premium amber theme for high-end services and luxury brands.',
      icon: 'diamond',
      gradient: 'from-amber-900/30 to-yellow-900/30',
      iconColor: 'text-amber-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'freelancer-creative',
      name: 'Freelancer Creative',
      description: 'Includes project name, hourly rate, and portfolio link.',
      icon: 'palette',
      gradient: 'from-indigo-900/30 to-purple-900/30',
      iconColor: 'text-indigo-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Clean emerald theme designed for medical professionals.',
      icon: 'medical_services',
      gradient: 'from-emerald-900/30 to-green-900/30',
      iconColor: 'text-emerald-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'international-invoice',
      name: 'International Invoice',
      description: 'Supports multiple currencies, VAT/GST fields, and IBAN/SWIFT.',
      icon: 'public',
      gradient: 'from-blue-900/30 to-cyan-900/30',
      iconColor: 'text-blue-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'legal',
      name: 'Legal',
      description: 'Professional slate theme for law firms and legal services.',
      icon: 'gavel',
      gradient: 'from-slate-900/40 to-gray-900/40',
      iconColor: 'text-slate-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'minimalist-dark',
      name: 'Minimalist Dark',
      description: 'A sleek, modern dark theme for contemporary businesses.',
      icon: 'dark_mode',
      gradient: 'from-gray-900/40 to-black/40',
      iconColor: 'text-gray-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'modern-gradient',
      name: 'Modern Gradient',
      description: 'Trendy design with pastels and gradients for creatives.',
      icon: 'gradient',
      gradient: 'from-pink-500/20 to-purple-500/20',
      iconColor: 'text-pink-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'product-invoice',
      name: 'Product Invoice',
      description: 'Table optimized for quantity, SKU, and shipping address.',
      icon: 'inventory',
      gradient: 'from-emerald-900/30 to-teal-900/30',
      iconColor: 'text-emerald-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'receipt-paid',
      name: 'Receipt / Paid Invoice',
      description: 'Slim format confirming payment received.',
      icon: 'receipt',
      gradient: 'from-green-900/30 to-emerald-900/30',
      iconColor: 'text-green-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'recurring-clients',
      name: 'Recurring Clients',
      description: 'Optimized for repeat customers and subscription services.',
      icon: 'repeat',
      gradient: 'from-blue-900/30 to-purple-900/30',
      iconColor: 'text-blue-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      description: 'Warm orange theme perfect for food service and hospitality.',
      icon: 'restaurant',
      gradient: 'from-orange-900/30 to-red-900/30',
      iconColor: 'text-orange-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'retail',
      name: 'Retail Template',
      description: 'Perfect for retail stores with product descriptions, SKUs, and shipping info.',
      icon: 'shopping_bag',
      gradient: 'from-green-900/30 to-emerald-900/30',
      iconColor: 'text-green-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'standard',
      name: 'Standard Template',
      description: 'Clean and professional design for all business types.',
      icon: 'description',
      gradient: 'from-blue-900/30 to-indigo-900/30',
      iconColor: 'text-blue-300',
      isInteractive: false,
      isDefault: true
    },
    {
      id: 'subscription-invoice',
      name: 'Subscription Invoice',
      description: 'Recurring billing style layout for monthly services.',
      icon: 'repeat',
      gradient: 'from-violet-900/30 to-purple-900/30',
      iconColor: 'text-violet-300',
      isInteractive: false,
      isDefault: false
    },
    {
      id: 'tech',
      name: 'Tech Solutions',
      description: 'Professional tech template with customizable project details and developer information.',
      icon: 'computer',
      gradient: 'from-cyan-900/30 to-blue-900/30',
      iconColor: 'text-cyan-300',
      isInteractive: false,
      isDefault: false
    }
  ];

  // Filter templates based on search query
  const filteredTemplates = allTemplates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get search suggestions based on popular search terms
  const getSearchSuggestions = () => {
    const suggestions = [
      'business', 'creative', 'professional', 'medical', 'legal', 'restaurant', 
      'tech', 'retail', 'luxury', 'minimalist', 'dark', 'gradient', 'custom'
    ];
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(searchQuery.toLowerCase()) && 
      suggestion.toLowerCase() !== searchQuery.toLowerCase()
    ).slice(0, 3);
  };

  const searchSuggestions = searchQuery.length > 1 ? getSearchSuggestions() : [];


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading your templates...</p>
          <p className="text-white/60 text-sm mt-2">Fetching template data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavHeader currentPage="/templates" />
      {/* Main Content */}
      <main className="w-full pt-24">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-10 animate-enter" style={{animationDelay: '200ms'}}>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Templates</h1>
            <p className="mt-1 text-base sm:text-lg text-white/70">Browse and manage your invoice templates.</p>
            
            {/* Search Input */}
            <div className="mt-6 w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-white/50 text-xl">search</span>
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 text-sm sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/70 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                )}
                
                {/* Search Suggestions Dropdown */}
                {searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-10">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(suggestion)}
                        className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span className="material-symbols-outlined text-sm mr-2">search</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 flex items-center gap-4">
                  <p className="text-sm text-white/60">
                    {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-sm text-white/50 hover:text-white/70 transition-colors underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Template Cards */}
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template, index) => (
                <div 
                  key={template.id}
                  className={`glass-effect rounded-2xl shadow-sm border border-white/20 p-4 sm:p-6 animate-enter hover-tilt ${
                    template.isInteractive ? 'border-dashed border-2 border-white/30' : ''
                  }`}
                  style={{animationDelay: `${300 + (index * 100)}ms`}}
                >
                  <div className={`w-full h-32 bg-gradient-to-br ${template.gradient} rounded-lg flex items-center justify-center mb-4`}>
                    <span className={`material-symbols-outlined ${template.iconColor} text-4xl`}>{template.icon}</span>
              </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{template.name}</h3>
                  <p className="text-xs sm:text-sm text-white/70 mb-4">{template.description}</p>
              <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      template.isDefault 
                        ? 'text-white bg-blue-500 px-2 py-1 rounded-full font-medium' 
                        : 'text-white/60'
                    }`}>
                      {template.isDefault ? 'Default' : template.isInteractive ? 'Interactive' : 'Available'}
                    </span>
                    {template.isInteractive ? (
                      <a 
                        href="/templates/custom"
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                            localStorage.setItem('selectedTemplate', template.id);
                          }
                        }}
                      >
                        Open Builder
                      </a>
                    ) : (
                <button 
                        className="px-3 sm:px-4 py-2 bg-[var(--primary-color)] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={() => handleTemplateSelect(template.id)}
                >
                  Use Template
                </button>
                    )}
              </div>
            </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 sm:py-12">
                <div className="text-white/50 text-4xl sm:text-6xl mb-4">
                  <span className="material-symbols-outlined">search_off</span>
              </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No templates found</h3>
                <p className="text-sm sm:text-base text-white/70 mb-4 px-4">
                  No templates match your search for "{searchQuery}". Try a different search term.
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-3 sm:px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  Clear Search
                </button>
              </div>
            )}

          </div>


        </div>
      </main>
      
      {/* Floating Calculator */}
      <FloatingCalculator />

      {/* Template Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Template Preview</h3>
              <button 
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => setShowPreview(false)}
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 text-gray-800">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">INVOICE</h1>
                <p className="text-gray-600">#INV-001</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold mb-2">From:</h3>
                  <p>Your Company Name</p>
                  <p>123 Business St</p>
                  <p>City, State 12345</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">To:</h3>
                  <p>Client Name</p>
                  <p>Client Address</p>
                  <p>Client City, State</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">This is a preview of how your invoice will look with the selected template.</p>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button 
                className="px-4 py-2 border border-white/20 text-white/70 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => {
                  handleTemplateSelect('minimalist-dark');
                    setShowPreview(false);
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
