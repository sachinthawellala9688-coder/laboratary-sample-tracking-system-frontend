import React, { useEffect, useState } from 'react';
import { Plus, Trash, Edit, X } from 'lucide-react';
import api from '../../api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  // Create form (top panel)
  const [createData, setCreateData] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'manager',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Edit popup
  const [editData, setEditData] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'manager',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user');
      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------- CREATE ----------
  const resetCreateForm = () => {
    setCreateData({
      user_id: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'manager',
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user', createData);
      alert('User created');
      resetCreateForm();
      setShowCreateForm(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Error creating user');
    }
  };

  // ---------- EDIT (POPUP) ----------
  const openEditModal = (user) => {
    setEditData({
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });
    setEditingUserId(user.user_id);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUserId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // do NOT include password here
      await api.put(`/user/updateuser/${editingUserId}`, editData);
      alert('User updated');
      closeEditModal();
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Error updating user');
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (user_id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/user/${user_id}`);
      alert('User deleted');
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Error deleting user');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          {showCreateForm ? <X size={18} /> : <Plus size={18} />}
          {showCreateForm ? 'Close' : 'Add User'}
        </button>
      </div>

      {/* Create User Form (top panel) */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New User</h3>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="ID"
              className="border p-2 rounded"
              value={createData.user_id}
              onChange={(e) =>
                setCreateData({
                  ...createData,
                  user_id: parseInt(e.target.value),
                })
              }
              required
            />
            <input
              type="text"
              placeholder="First Name"
              className="border p-2 rounded"
              value={createData.first_name}
              onChange={(e) =>
                setCreateData({ ...createData, first_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border p-2 rounded"
              value={createData.last_name}
              onChange={(e) =>
                setCreateData({ ...createData, last_name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              value={createData.email}
              onChange={(e) =>
                setCreateData({ ...createData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              value={createData.password}
              onChange={(e) =>
                setCreateData({ ...createData, password: e.target.value })
              }
              required
            />
            <select
              className="border p-2 rounded"
              value={createData.role}
              onChange={(e) =>
                setCreateData({ ...createData, role: e.target.value })
              }
            >
              <option value="manager">Manager</option>
              <option value="lab technician">Lab Technician</option>
            </select>
            <button
              type="submit"
              className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Save User
            </button>
          </form>
        </div>
      )}

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="px-6 py-4">{user.user_id}</td>
                <td className="px-6 py-4">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'manager'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => openEditModal(user)}
                    className="inline-flex items-center px-3 py-1 text-sm rounded-md border mr-2 hover:bg-gray-100"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="inline-flex items-center px-3 py-1 text-sm rounded-md border border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <Trash size={16} className="mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal (Popup Window) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="number"
                className="border p-2 rounded bg-gray-100"
                value={editData.user_id}
                disabled
              />
              <div /> {/* empty to keep grid alignment */}
              <input
                type="text"
                placeholder="First Name"
                className="border p-2 rounded"
                value={editData.first_name}
                onChange={(e) =>
                  setEditData({ ...editData, first_name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border p-2 rounded"
                value={editData.last_name}
                onChange={(e) =>
                  setEditData({ ...editData, last_name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                required
              />
              <select
                className="border p-2 rounded"
                value={editData.role}
                onChange={(e) =>
                  setEditData({ ...editData, role: e.target.value })
                }
              >
                <option value="manager">Manager</option>
                <option value="lab technician">Lab Technician</option>
              </select>

              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
