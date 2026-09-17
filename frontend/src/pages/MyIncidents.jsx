// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function MyIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get('/api/incidents/my');
        setIncidents(response.data);
      } catch (error) {
        console.error('Error fetching my incidents', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const getStatusBadge = (status) => {
    const map = {
      PENDING: 'badge-warning',
      ASSIGNED: 'badge-info',
      DIAGNOSING: 'badge-info',
      REPAIRING: 'badge-info',
      RESOLVED: 'badge-success',
      CLOSED: 'badge-gray'
    };
    return map[status] || 'badge-gray';
  };

  const filteredIncidents = filter === 'ALL' ? incidents : incidents.filter(i => i.status === filter);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando incidentes...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis incidentes</h1>

        <div className="flex gap-2 flex-wrap">
          {['ALL', 'PENDING', 'ASSIGNED', 'DIAGNOSING', 'REPAIRING', 'RESOLVED', 'CLOSED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {status === 'ALL' ? 'Todos' : status}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">No tienes incidentes reportados</p>
              <Link to="/report" className="btn-primary mt-4 inline-block">Reportar incidente</Link>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <Link key={incident.id} to={`/incidents/${incident.id}`} className="block card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-primary-600">{incident.code}</p>
                    <p className="text-gray-700">{incident.title}</p>
                    <p className="text-sm text-gray-500">{incident.asset?.name} - {incident.lab?.name}</p>
                  </div>
                  <span className={`badge ${getStatusBadge(incident.status)}`}>{incident.status}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}