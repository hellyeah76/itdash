import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import html2canvas from 'html2canvas';
import './index.css';
import logo from './logo.png'; // Import the logo image
import Navbar from './components/Navbar'; // Import the Navbar component
import Menu2 from './pages/menu2';
import Menu3 from './pages/menu3';

interface User {
  id: number;
  name: string;
  division: string;
  problem: string;
  solving: string;
  date: Date;
  device: string;
}

interface Device {
  id: number;
  name: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<User>({ id: 0, name: '', division: '', problem: '', solving: '', date: new Date(), device: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const itemsPerPage = 15;

  useEffect(() => {
    console.log('Fetching data...');
    setLoading(true);
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
        const sortedData = data.sort((a: User, b: User) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setUsers(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });

    fetch('http://localhost:5000/api/devices')
      .then(response => response.json())
      .then(data => {
        console.log('Devices fetched:', data);
        setDevices(data);
      })
      .catch(error => console.error('Error fetching devices:', error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormDateChange = (date: Date | null) => {
    if (date) {
      setForm({ ...form, date });
    }
  };

  const handleFilterDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleAdd = () => {
    const newUsers = [{ ...form, id: users.length + 1 }, ...users];
    setUsers(newUsers);
    saveUsers(newUsers);
    setForm({ id: 0, name: '', division: '', problem: '', solving: '', date: new Date(), device: '' });
  };

  const handleUpdate = (id: number) => {
    const updatedUsers = users.map(user => (user.id === id ? form : user));
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    const filteredUsers = users.filter(user => user.id !== id);
    setUsers(filteredUsers);
    saveUsers(filteredUsers);
  };

  const handleEdit = (user: User) => {
    setForm(user);
    setEditingId(user.id);
  };

  const handleSave = (id: number) => {
    handleUpdate(id);
    setForm({ id: 0, name: '', division: '', problem: '', solving: '', date: new Date(), device: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ id: 0, name: '', division: '', problem: '', solving: '', date: new Date(), device: '' });
  };

  const saveUsers = (users: User[]) => {
    fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(users),
    });
  };

  const handleSort = () => {
    const sortedUsers = [...users].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setUsers(sortedUsers);
    setIsSorted(!isSorted);
  };

  const handleClearFilter = () => {
    setSelectedDate(null);
  };

  const handleExport = () => {
    const table = document.getElementById('data-table');
    if (table) {
      html2canvas(table, { backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = 'table-data.jpg';
        link.click();
      });
    }
  };

  const filteredUsers = selectedDate
    ? users.filter(user => new Date(user.date).toDateString() === selectedDate.toDateString())
    : users;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="App p-4 bg-slate-200 min-h-screen flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <div className='flex text-white align-middle'>
                  <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
                  <h1 className="text-2xl text-black font-bold mb-4">TROUBLESHOOTING IT JARINGAN</h1>
                </div>
                <form className="mb-4 flex flex-wrap gap-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="User"
                    value={form.name}
                    onChange={handleChange}
                    className="border-2 p-2 disabled:border-gray-500 rounded w-full md:w-auto focus:border-blue-500 focus:ring focus:outline-none focus:ring-blue-200"
                    disabled={editingId !== null}
                  />
                  <input
                    type="text"
                    name="division"
                    placeholder="Divisi"
                    value={form.division}
                    onChange={handleChange}
                    className="border-2 p-2 disabled:border-gray-500 rounded w-full md:w-auto focus:border-blue-500 focus:ring focus:outline-none focus:ring-blue-200"
                    disabled={editingId !== null}
                  />
                  <input
                    type="text"
                    name="problem"
                    placeholder="Masalah"
                    value={form.problem}
                    onChange={handleChange}
                    className="border-2 p-2 disabled:border-gray-500 rounded w-full md:w-auto focus:border-blue-500 focus:ring focus:outline-none focus:ring-blue-200"
                    disabled={editingId !== null}
                  />
                  <input
                    type="text"
                    name="solving"
                    placeholder="Solving"
                    value={form.solving}
                    onChange={handleChange}
                    className="border-2 p-2 disabled:border-gray-500 rounded w-full md:w-auto focus:border-blue-500 focus:ring focus:outline-none focus:ring-blue-200"
                    disabled={editingId !== null}
                  />
                  <DatePicker
                    selected={form.date}
                    onChange={handleFormDateChange}
                    className="border-2 p-2 disabled:border-gray-500 rounded w-full md:w-auto focus:border-blue-500 focus:ring focus:outline-none focus:ring-blue-200"
                    disabled={editingId !== null}
                  />
                  <select
                    name="device"
                    value={form.device}
                    onChange={handleChange}
                    className="border-2 p-2 disabled:border-gray-500 rounded w-full md:w-auto focus:border-blue-500 focus:ring focus:outline-none focus:ring-blue-200"
                    disabled={editingId !== null}
                  >
                    <option value="">Device</option>
                    {devices.map(device => (
                      <option key={device.id} value={device.name}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                  {editingId === null && (
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                      Tambah Masalah
                    </button>
                  )}
                </form>
                <div className="flex mb-4">
                  {/* <button
                    onClick={handleSort}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Sort by Date
                  </button> */}
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleFilterDateChange}
                    className="border-2 p-2 disabled:border-gray-500 rounded w-full md:w-auto focus:border-blue-500 focus:ring focus:outline-none focus:ring-blue-200"
                    placeholderText="Filter by Date"
                  />
                  <button
                    onClick={handleClearFilter}
                    className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:gray-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 mx-2"
                  >
                    Clear Filter
                  </button>
                  <button
                    onClick={handleExport}
                    className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
                  >
                    Export to JPG
                  </button>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table id="data-table" className="min-w-full border backdrop-blur-3xl border-gray-200 rounded-lg">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b bg-gray-100">Tanggal</th>
                          <th className="py-2 px-4 border-b bg-gray-100">Nama</th>
                          <th className="py-2 px-4 border-b bg-gray-100">Divisi</th>
                          <th className="py-2 px-4 border-b bg-gray-100">Masalah</th>
                          <th className="py-2 px-4 border-b bg-gray-100">Solving</th>
                          <th className="py-2 px-4 border-b bg-gray-100">Device</th>
                          <th className="py-2 px-4 border-b bg-gray-100">Actions</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {currentUsers.map(user => (
                          <tr key={user.id} className="hover:bg-blue-100">
                            <td className="py-2 px-4 border-b">
                              {editingId === user.id ? (
                                <DatePicker
                                  selected={form.date}
                                  onChange={handleFormDateChange}
                                  className="border p-2 rounded w-full text-black focus:border-blue-500"
                                />
                              ) : (
                                new Date(user.date).toLocaleDateString()
                              )}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {editingId === user.id ? (
                                <input
                                  type="text"
                                  name="name"
                                  value={form.name}
                                  onChange={handleChange}
                                  className="border p-2 rounded w-full text-black focus:border-blue-500"
                                />
                              ) : (
                                user.name
                              )}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {editingId === user.id ? (
                                <input
                                  type="text"
                                  name="division"
                                  value={form.division}
                                  onChange={handleChange}
                                  className="border p-2 rounded w-full text-black focus:border-blue-500"
                                />
                              ) : (
                                user.division
                              )}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {editingId === user.id ? (
                                <input
                                  type="text"
                                  name="problem"
                                  value={form.problem}
                                  onChange={handleChange}
                                  className="border p-2 rounded w-full text-black focus:border-blue-500"
                                />
                              ) : (
                                user.problem
                              )}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {editingId === user.id ? (
                                <input
                                  type="text"
                                  name="solving"
                                  value={form.solving}
                                  onChange={handleChange}
                                  className="border p-2 rounded w-full text-black focus:border-blue-500"
                                />
                              ) : (
                                user.solving
                              )}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {editingId === user.id ? (
                                <select
                                  name="device"
                                  value={form.device}
                                  onChange={handleChange}
                                  className="border p-2 rounded w-full text-black focus:border-blue-500"
                                >
                                  <option value="">Select Device</option>
                                  {devices.map(device => (
                                    <option key={device.id} value={device.name}>
                                      {device.name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                user.device
                              )}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {editingId === user.id ? (
                                <>
                                  <button
                                    onClick={() => handleSave(user.id)}
                                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 my-1"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:gray-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 my-2"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEdit(user)}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    disabled={editingId !== null}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                    disabled={editingId !== null}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex justify-center items-center mt-4">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            }
          />
          <Route path="/menu2" element={<Menu2 />} />
          <Route path="/menu3" element={<Menu3 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;