import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Plus, Trash } from 'lucide-react';

const ProductionLines = () => {
  const [lines, setLines] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('');

  useEffect(() => {
    fetchLines();
  }, []);

  const fetchLines = async () => {
    const res = await api.get('/production/production-lines');
    setLines(res.data.production_lines || []);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this line?")) return;
    await api.delete(`/production/production-lines/${id}`);
    fetchLines();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/production/production-lines', { line_code: newCode, line_name: newName, line_type: newType });
    setNewCode(''); setNewName(''); setNewType('');
    fetchLines();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Production Lines</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creation Form */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h3 className="font-bold mb-4 text-lg">Add New Line</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <input className="w-full border p-2 rounded" placeholder="Line Code (e.g., p101)" value={newCode} onChange={e => setNewCode(e.target.value)} required />
            <input className="w-full border p-2 rounded" placeholder="Line Name" value={newName} onChange={e => setNewName(e.target.value)} required />
            <input className="w-full border p-2 rounded" placeholder="Line Type" value={newType} onChange={e => setNewType(e.target.value)} required />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"onClick={() =>handleCreate }>Create Line</button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lines.map((line) => (
                <tr key={line.production_id}>
                  <td className="px-6 py-4 font-mono text-sm">{line.line_code}</td>
                  <td className="px-6 py-4">{line.line_name}</td>
                  <td className="px-6 py-4">{line.line_type}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(line.production_id)} className="text-red-600 hover:text-red-800">
                      <Trash size={18} />
                    </button>
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

export default ProductionLines;