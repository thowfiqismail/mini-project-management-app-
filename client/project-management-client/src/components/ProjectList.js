import React, { useEffect, useState } from 'react';
import API from '../api';
import connection from '../signalrConnection';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  const showToast = (message) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50",
    }).showToast();
  };

  const fetchProjects = async () => {
    const response = await API.get('/Projects');
    setProjects(response.data);
  };

  const fetchNotifications = async () => {
    const response = await API.get('/Projects/notifications');
    setNotifications(response.data);
  };

  const createProject = async () => {
    if (!name.trim() || !description.trim()) {
      alert('Name and Description required!');
      return;
    }

    await API.post(
      '/Projects',
      { name, description },
      { headers: { Role: user.role } }
    );
    setName('');
    setDescription('');
    showToast("✅ Project created!");
  };

  const deleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await API.delete(`/Projects/${id}`, {
        headers: { Role: user.role },
      });
      showToast("🗑️ Project deleted!");
    }
  };

  const updateProject = async (id) => {
    const newName = prompt('Enter new name:');
    const newDescription = prompt('Enter new description:');
    if (newName && newDescription) {
      await API.put(
        `/Projects/${id}`,
        { name: newName, description: newDescription },
        { headers: { Role: user.role } }
      );
      showToast("✏️ Project updated!");
    }
  };

  const markNotificationRead = async (id) => {
    await API.post(`/Projects/notifications/${id}/mark-read`);
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      await API.delete(`/Projects/notifications/${id}`);
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchNotifications();

    connection.start().then(() => {
      connection.on('ProjectCreated', () => {
        fetchProjects();
        fetchNotifications();
      });
      connection.on('ProjectUpdated', () => {
        fetchProjects();
        fetchNotifications();
      });
      connection.on('ProjectDeleted', () => {
        fetchProjects();
        fetchNotifications();
      });
    });

    return () => connection.stop();
  }, []);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📂 Project Management</h2>

      {/* ✅ Notifications */}
      <div className="card p-3 mb-4">
        <h5>🔔 Notifications</h5>
        {notifications.length === 0 && <p>No notifications yet.</p>}
        {notifications.map(n => (
          <div
            key={n.id}
            className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2"
          >
            <div>
              {n.isRead ? "✅" : "🆕"} {n.message}
            </div>
            <div>
              {!n.isRead && (
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => markNotificationRead(n.id)}
                >
                  Mark Read
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => deleteNotification(n.id)}
              >
                Delete 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Search */}
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="🔍 Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ✅ Admin Create */}
      {user.role === 'Admin' && (
        <div className="card p-3 mb-4">
          <h5>Create New Project</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn btn-success" onClick={createProject}>
            ➕ Create
          </button>
        </div>
      )}

      <div className="list-group">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((p) => (
            <div
              key={p.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{p.name}</strong> — {p.description}
              </div>
              {user.role === 'Admin' && (
                <div>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => updateProject(p.id)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProject(p.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>
    </div>
  );
}
