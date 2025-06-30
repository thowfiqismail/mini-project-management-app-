import React, { useState, useEffect } from 'react';
import API from '../api';

export default function ProjectForm({ selected, clearSelected }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selected) {
      setName(selected.name);
      setDescription(selected.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected) {
      await API.put(`/Projects/${selected.id}`, {
        id: selected.id,
        name,
        description,
      });
    } else {
      await API.post('/Projects', {
        name,
        description,
      });
    }

    clearSelected();
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>{selected ? 'Edit Project' : 'Add Project'}</h5>
      <div className="mb-2">
        <label>Name</label>
        <input
          className="form-control"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label>Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button className="btn btn-success" type="submit">
        {selected ? 'Update' : 'Add'}
      </button>
      {selected && (
        <button
          className="btn btn-secondary ms-2"
          onClick={clearSelected}
          type="button"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
