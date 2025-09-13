// Standardized notification system for consistent UI across the app

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface NotificationOptions {
  type: NotificationType;
  message: string;
  duration?: number; // in milliseconds, default 3000
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const getNotificationStyles = (type: NotificationType): string => {
  const baseStyles = 'fixed top-20 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out transform glass-effect border border-white/20';
  
  switch (type) {
    case 'success':
      return `${baseStyles} text-white`;
    case 'error':
      return `${baseStyles} text-white`;
    case 'warning':
      return `${baseStyles} text-white`;
    case 'info':
      return `${baseStyles} text-white`;
    case 'loading':
      return `${baseStyles} text-white`;
    default:
      return `${baseStyles} text-white`;
  }
};

const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✗';
    case 'warning':
      return '!';
    case 'info':
      return 'i';
    case 'loading':
      return '...';
    default:
      return '•';
  }
};

export const showNotification = (options: NotificationOptions): void => {
  const { type, message, duration = 3000, position = 'top-right' } = options;
  
  // Remove any existing notifications to prevent stacking
  const existingNotifications = document.querySelectorAll('.notification-toast');
  existingNotifications.forEach(notification => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  });
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification-toast ${getNotificationStyles(type)}`;
  
  // Add position classes
  if (position === 'top-left') {
    notification.className = notification.className.replace('right-4', 'left-4');
  } else if (position === 'bottom-right') {
    notification.className = notification.className.replace('top-20', 'bottom-20');
  } else if (position === 'bottom-left') {
    notification.className = notification.className.replace('top-20 right-4', 'bottom-20 left-4');
  }
  
  // Add content
  const icon = getNotificationIcon(type);
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-lg">${icon}</span>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0) scale(1)';
    notification.style.opacity = '1';
  }, 10);
  
  // Auto remove after duration
  if (duration > 0) {
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.transform = 'translateX(100%) scale(0.95)';
        notification.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, duration);
  }
  
  // Add click to dismiss
  notification.addEventListener('click', () => {
    if (document.body.contains(notification)) {
      notification.style.transform = 'translateX(100%) scale(0.95)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  });
};

// Convenience functions for common notification types
export const showSuccess = (message: string, duration?: number) => {
  showNotification({ type: 'success', message, duration });
};

export const showError = (message: string, duration?: number) => {
  showNotification({ type: 'error', message, duration });
};

export const showWarning = (message: string, duration?: number) => {
  showNotification({ type: 'warning', message, duration });
};

export const showInfo = (message: string, duration?: number) => {
  showNotification({ type: 'info', message, duration });
};

export const showLoading = (message: string) => {
  return showNotification({ type: 'loading', message, duration: 0 }); // No auto-dismiss for loading
};

export const hideNotification = () => {
  const existingNotifications = document.querySelectorAll('.notification-toast');
  existingNotifications.forEach(notification => {
    if (document.body.contains(notification)) {
      const htmlElement = notification as HTMLElement;
      htmlElement.style.transform = 'translateX(100%) scale(0.95)';
      htmlElement.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  });
};
