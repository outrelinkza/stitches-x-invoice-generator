'use client';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export default function ErrorModal({ 
  isOpen, 
  onClose, 
  title = "Payment Failed",
  message = "We couldn't process your payment. Please try again.",
  buttonText = "Dismiss"
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-900/10 p-4 font-sans backdrop-blur-sm">
      <div className="error-accent relative w-full max-w-sm overflow-hidden rounded-xl bg-white/80 shadow-2xl backdrop-blur-xl ring-1 ring-black/5">
        <div className="p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-[var(--accent-color)]">
            error
          </span>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-gray-600">
            {message}
          </p>
          <div className="mt-8">
            <button 
              onClick={onClose}
              className="w-full cursor-pointer rounded-lg bg-[var(--accent-color)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
