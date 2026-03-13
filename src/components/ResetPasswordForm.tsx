import React, { useState, useEffect } from 'react';

interface ResetPasswordFormProps {
  onReset: (password: string) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export default function ResetPasswordForm({
  onReset,
  loading,
  error,
  success,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (success) {
      setPassword('');
    }
  }, [success]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onReset(password.trim());
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="whitespace-nowrap text-lg font-bold text-gray-500">Set New Password</h2>
      <p className="text-sm text-gray-600">
        Enter a temporary password for the user. They can change it after logging in.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className="px-2 py-1 border border-gray-300 rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !password.trim()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting Password...' : 'Set Password'}
        </button>
      </form>
      {success && <p className="text-green-700 text-sm">✓ {success}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}