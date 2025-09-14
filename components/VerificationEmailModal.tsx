import React from 'react';

interface VerificationEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  emailBody: string;
}

const VerificationEmailModal: React.FC<VerificationEmailModalProps> = ({
  isOpen,
  onClose,
  code,
  emailBody,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-100" id="modal-title">
            Simulated Verification Email
          </h3>
          <div className="mt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This is a simulation. You have not been sent a real email. Please use the code below to continue.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-t border-b border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
            {emailBody}
          </p>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Your code is:</p>
            <p className="text-3xl font-bold tracking-widest text-sky-600 dark:text-sky-400 bg-slate-200 dark:bg-slate-700 rounded-md py-2 mt-1">
              {code}
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800"
            >
                Got it, let's verify
            </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationEmailModal;