import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../components/ToastContainer';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useAuth } from "../context/AuthContext";

const USERS_PER_PAGE = 10;
const API_BASE_URL = 'http://127.0.0.1:8000';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalAction, setModalAction] =
    useState<'activate' | 'deactivate' | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
  if (!token) return;

  setLoading(true);
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/admin/users?page=${currentPage}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    setUsers(data);
  } catch (err) {
    showToast("Unauthorized or session expired", "error");
  } finally {
    setLoading(false);
  }
};

  const handleOpenModal = (user: User, action: 'activate' | 'deactivate') => {
    setSelectedUser(user);
    setModalAction(action);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalAction(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !modalAction) return;

    try {
      const endpoint =
        modalAction === 'activate'
          ? `/admin/users/${selectedUser.id}/activate`
          : `/admin/users/${selectedUser.id}/deactivate`;

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Action failed');

      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? { ...user, is_active: modalAction === 'activate' }
            : user
        )
      );

      showToast(
        `User ${modalAction === 'activate' ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
    } catch (error) {
      showToast('Action failed', 'error');
    } finally {
      handleCloseModal();
    }
  };

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.full_name}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_active ? (
                      <Button
                        variant="destructive"
                        onClick={() => handleOpenModal(user, 'deactivate')}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => handleOpenModal(user, 'activate')}
                      >
                        Activate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4 border-t">
            <Button
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft />
            </Button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!modalAction}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={`${modalAction === 'activate' ? 'Activate' : 'Deactivate'} User`}
        confirmText={modalAction === 'activate' ? 'Activate' : 'Deactivate'}
        confirmVariant={modalAction === 'deactivate' ? 'destructive' : 'primary'}
      >
        Are you sure you want to {modalAction}{' '}
        <b>{selectedUser?.email}</b>?
      </Modal>
    </div>
  );
}
