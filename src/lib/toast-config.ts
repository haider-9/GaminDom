import toast, { ToastOptions } from 'react-hot-toast';

// Custom toast styles that match your app theme
const defaultToastOptions: ToastOptions = {
  duration: 4000,
  style: {
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: 'var(--font-Orbitron)',
    backdropFilter: 'blur(10px)',
  },
  iconTheme: {
    primary: '#bb3b3b',
    secondary: '#fff',
  },
};

// Custom toast functions with your app's styling
export const showToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...defaultToastOptions, ...options }),
    
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...defaultToastOptions, ...options }),
    
  loading: (message: string, options?: ToastOptions) =>
    toast.loading(message, { ...defaultToastOptions, ...options }),
    
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: string) => string);
    },
    options?: ToastOptions
  ) =>
    toast.promise(promise, messages, { ...defaultToastOptions, ...options }),
    
  custom: (message: string, options?: ToastOptions) =>
    toast(message, { ...defaultToastOptions, ...options }),
    
  dismiss: (toastId?: string) => toast.dismiss(toastId),
  
  remove: (toastId?: string) => toast.remove(toastId),
};

// Network error helper
export const handleNetworkError = (error: object) => {
  if (error instanceof Error) {
    if (error.message.includes('fetch')) {
      showToast.error('Network connection failed. Please check your internet.');
      return;
    }
    if (error.message.includes('timeout')) {
      showToast.error('Request timed out. Please try again.');
      return;
    }
    if (error.message.includes('404')) {
      showToast.error('Resource not found.');
      return;
    }
    if (error.message.includes('500')) {
      showToast.error('Server error. Please try again later.');
      return;
    }
  }
  showToast.error('Something went wrong. Please try again.');
};

// API error helper
export const handleApiError = (response: Response, defaultMessage: string = 'Request failed') => {
  if (response.status === 404) {
    showToast.error('Resource not found');
  } else if (response.status === 429) {
    showToast.error('Too many requests. Please wait a moment.');
  } else if (response.status >= 500) {
    showToast.error('Server error. Please try again later.');
  } else if (response.status === 403) {
    showToast.error('Access denied');
  } else if (response.status === 401) {
    showToast.error('Authentication required');
  } else {
    showToast.error(defaultMessage);
  }
};