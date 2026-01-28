import React from 'react';
import {ShieldAlert} from 'lucide-react';
import {clsx} from 'clsx';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type: 'success' | 'error';
}

/**
 * TOAST NOTIFICATION
 *
 * A simple floating alert that appears at the bottom of the screen.
 * Used for "Copied!", "Error", or "Done" messages.
 */
export const Toast = ({message, isVisible, type}: ToastProps) => {
  return (
    <div
      className={clsx(
        'fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 transition-all duration-300 flex items-center gap-3 font-medium border',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-10 opacity-0 pointer-events-none',
        type === 'error'
          ? 'bg-red-600 text-white border-red-400'
          : 'bg-gleam-dark text-white border-gray-700',
      )}
    >
      {type === 'error' ? (
        <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
      ) : (
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
      )}
      {message}
    </div>
  );
};
