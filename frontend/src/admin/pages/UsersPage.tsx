import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Shield,
  ShieldCheck,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../services/adminApi';
import type { AdminUser } from '../types';
import { DataTable, type Column } from '../components/DataTable';
import { FormModal } from '../components/FormModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { useAdminAuthStore } from '../store/authStore';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  // Form Fields
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'superadmin' | 'editor'>('editor');
  const [formFullName, setFormFullName] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user: currentAdmin, addToast } = useAdminAuthStore();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Access Restricted',
        message: err?.response?.data?.detail || 'Only Superadmin can view administrator accounts.',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormUsername('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('editor');
    setFormFullName('');
    setFormActive(true);
    setIsFormOpen(true);
  };

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setFormUsername(u.username);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormFullName(u.full_name || '');
    setFormActive(Boolean(u.is_active));
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await updateAdminUser(editingUser.id, {
          email: formEmail,
          role: formRole,
          full_name: formFullName,
          is_active: formActive,
        });
        addToast({ type: 'success', title: 'User Updated', message: 'Administrator profile saved.' });
      } else {
        if (!formPassword || formPassword.length < 8) {
          addToast({ type: 'error', title: 'Weak Password', message: 'Password must be at least 8 characters long.' });
          setIsSubmitting(false);
          return;
        }
        await createAdminUser({
          username: formUsername,
          email: formEmail,
          password: formPassword,
          role: formRole,
          full_name: formFullName,
        });
        addToast({ type: 'success', title: 'Admin Created', message: `Administrator ${formUsername} created.` });
      }
      setIsFormOpen(false);
      loadUsers();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Operation Failed',
        message: err?.response?.data?.detail || 'Failed to update administrator.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUserActive = async (u: AdminUser) => {
    if (u.id === currentAdmin?.id) {
      addToast({ type: 'error', title: 'Denied', message: 'You cannot deactivate your own account.' });
      return;
    }
    const nextState = !u.is_active;
    try {
      await updateAdminUser(u.id, { is_active: nextState });
      addToast({
        type: 'info',
        title: 'Status Updated',
        message: `Admin ${u.username} has been ${nextState ? 'activated' : 'deactivated'}.`,
      });
      loadUsers();
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to update active state.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAdminUser(deleteTarget.id);
      addToast({ type: 'success', title: 'Admin Removed', message: 'Administrator account deleted.' });
      setDeleteTarget(null);
      loadUsers();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err?.response?.data?.detail || 'Failed to delete administrator.',
      });
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      header: 'Administrator',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
            {u.role === 'superadmin' ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          </div>
          <div>
            <span className="font-semibold text-white block">
              {u.full_name || u.username}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">@{u.username}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Email Address',
      render: (u) => <span className="font-mono text-neutral-300 text-xs">{u.email}</span>,
    },
    {
      header: 'Role',
      render: (u) => (
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border capitalize ${
            u.role === 'superadmin'
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40 font-bold'
              : 'bg-neutral-800 text-neutral-300 border-neutral-700'
          }`}
        >
          {u.role}
        </span>
      ),
    },
    {
      header: 'Account Status',
      render: (u) => (
        <button
          onClick={() => toggleUserActive(u)}
          disabled={u.id === currentAdmin?.id}
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1.5 transition-colors ${
            u.is_active
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
          } ${u.id === currentAdmin?.id ? 'cursor-default' : 'cursor-pointer'}`}
          title={u.id === currentAdmin?.id ? 'Your account' : 'Click to toggle status'}
        >
          {u.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
          <span>{u.is_active ? 'Active' : 'Disabled'}</span>
        </button>
      ),
    },
    {
      header: 'Last Login',
      render: (u) => (
        <span className="text-[11px] text-neutral-400 font-mono">
          {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never logged in'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(u)}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            title="Edit administrator"
            aria-label="Edit administrator"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          {u.id !== currentAdmin?.id && (
            <button
              onClick={() => setDeleteTarget(u)}
              className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-red-950/20 transition-colors"
              title="Delete administrator"
              aria-label="Delete administrator"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Administrator Roster</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Superadmin privileges allow provisioning team accounts and configuring roles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D4AF37]/15"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Admin</span>
        </button>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        isLoading={loading}
        emptyMessage="No administrator accounts found."
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingUser ? `Edit Admin @${editingUser.username}` : 'Provision Administrator Account'}
        subtitle="Configure credentials and role permissions"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingUser && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Username *
              </label>
              <input
                type="text"
                required
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                placeholder="e.g. arjun_studio"
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={formFullName}
              onChange={(e) => setFormFullName(e.target.value)}
              placeholder="e.g. Arjun Sharma"
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="e.g. arjun@lensframe.com"
              className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {!editingUser && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Initial Password * (Min 8 Characters)
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                Role Permission *
              </label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as any)}
                className="w-full bg-[#181818] border border-neutral-700 text-white px-3 py-2.5 text-xs rounded focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="editor">Editor (Content & Inquiries)</option>
                <option value="superadmin">Superadmin (Full Control)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF37] rounded"
                />
                <span className="text-xs text-neutral-300 font-medium">Account Active</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2.5 rounded text-xs uppercase tracking-wider text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingUser ? 'Save Updates' : 'Provision Admin'}
            </button>
          </div>
        </form>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Revoke Administrator Account?"
        message={`Are you sure you want to permanently delete administrator account "${deleteTarget?.username}"? This cannot be undone.`}
        confirmLabel="Revoke Account"
        isDangerous={true}
      />
    </div>
  );
};
