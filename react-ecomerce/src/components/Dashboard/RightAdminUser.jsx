import React, { useEffect, useState } from "react";
import { FiBell, FiChevronsLeft } from "react-icons/fi";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://backendlombaecomerce-production.up.railway.app/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div className="w-full bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-3 flex justify-between items-center border-b-2 border-gray-200">
          <button className="text-gray-600 hover:text-gray-900">
            <FiChevronsLeft className="text-xl" />
          </button>
          <div className="flex gap-3 items-center">
            <button className="relative text-gray-600 hover:text-gray-900">
              <FiBell className="text-xl" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <p className="text-sm sm:text-base font-medium text-gray-700">
              Prof admin
            </p>
          </div>
        </div>
      </div>
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Daftar Pengguna</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-black text-white font-medium">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Dibuat</th>
              <th className="px-4 py-3">Diperbarui</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{user.first_name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {new Date(user.updated_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default UserList;
