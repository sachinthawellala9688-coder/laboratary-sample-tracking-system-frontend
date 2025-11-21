import React, { useEffect, useState } from 'react';
import api from '../../api';

const SampleTypes = () => {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const fetchTypes = async () => {
    const res = await api.get('/sampletype/sample-types');
    setTypes(res.data.sample_types || []);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/sampletype/sample-types', { name, description: desc });
    setName('');
    setDesc('');
    fetchTypes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sample type?')) return;

    try {
      await api.delete(`/sampletype/sample-types/${id}`);
      alert('Sample type deleted');
      fetchTypes();
    } catch (error) {
      console.error('Delete error:', error);
      // if foreign key constraint fails (used by samples), backend may send 500
      alert('Cannot delete: This sample type might be used by existing samples.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Sample Types Definition</h2>

      {/* Create form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Type Name</label>
            <input
              className="w-full border p-2 rounded"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex-[2]">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <input
              className="w-full border p-2 rounded"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
            />
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Add Type
          </button>
        </form>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {types.map(type => (
          <div
            key={type.sample_type_id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-lg text-indigo-700">{type.name}</h3>
              <p className="text-gray-600 mt-2">{type.description}</p>
            </div>
            <button
              onClick={() => handleDelete(type.sample_type_id)}
              className="mt-4 self-end text-sm px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ))}
        {types.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full">No sample types defined.</p>
        )}
      </div>
    </div>
  );
};

export default SampleTypes;
