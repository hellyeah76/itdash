import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', email: '', division: '', problem: '', solving: '', date: new Date() });

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date) => {
    setForm({ ...form, date });
  };

  const handleAdd = () => {
    const newUsers = [...users, { ...form, id: users.length + 1 }];
    setUsers(newUsers);
    saveUsers(newUsers);
    setForm({ id: '', name: '', email: '', division: '', problem: '', solving: '', date: new Date() });
  };

  const handleUpdate = (id: number) => {
    const updatedUsers = users.map(user => (user.id === id ? form : user));
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setForm({ id: '', name: '', email: '', division: '', problem: '', solving: '', date: new Date() });
  };

  const handleDelete = (id: number) => {
    const filteredUsers = users.filter(user => user.id !== id);
    setUsers(filteredUsers);
    saveUsers(filteredUsers);
  };

  const handleEdit = (user: { id: number; name: string; email: string; division: string; problem: string; solving: string; date: Date }) => {
    setForm(user);
  };

  const saveUsers = (users: any) => {
    fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(users),
    });
  };

  return (
    <div className="App p-4 bg-blue-400 h-screen">
      <h1 className="text-2xl font-bold mb-4">TROUBLESHOOT</h1>
      {/* <div className='flex justify-between items-center my-2'>
        <p className=''>Tanggal</p>
        <p>Nama</p>
        <p>Divisi</p>
        <p>Problem</p>
        <p>Solusi</p>
        <p>Iki Tombol</p>
      </div> */}
      <form className="flex items-center justify-between">
        <DatePicker
          selected={form.date}
          onChange={handleDateChange}
          className="rounded"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="rounded-lg p-1"
        />
        <input
          type="text"
          name="division"
          placeholder="Division"
          value={form.division}
          onChange={handleChange}
          className="rounded-lg p-1"
        />
        <input
          type="text"
          name="problem"
          placeholder="Problem"
          value={form.problem}
          onChange={handleChange}
          className="rounded-lg p-1"
        />
        <input
          type="text"
          name="solving"
          placeholder="Solving"
          value={form.solving}
          onChange={handleChange}
          className="rounded-lg p-1"
        />
        <button
          type="button"
          onClick={form.id ? () => handleUpdate(Number(form.id)) : handleAdd}
          className="bg-green-500 rounded-lg w-24 flex items-center justify-center "
        >
          {form.id ? 'Update' : 'Add'}
        </button>
      </form>
      <table className="text-slate-200 min-w-full mt-4 bg-slate-600 border border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Division</th>
            <th className="py-2 px-4 border-b">Problem</th>
            <th className="py-2 px-4 border-b">Solving</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody className='text-black'>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-100 rounded-lg border-b-2 border-slate-500 border border-separate bg-slate-400">
              <td className="py-2 px-4">{user.id}</td>
              <td className="py-2 px-4">{new Date(user.date).toLocaleDateString()}</td>
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.division}</td>
              <td className="py-2 px-4">{user.problem}</td>
              <td className="py-2 px-4">{user.solving}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;