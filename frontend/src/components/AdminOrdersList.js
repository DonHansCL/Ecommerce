import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function AdminOrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/pedidos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        throw new Error(data.error || 'Error al cargar los pedidos.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar los pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`http://localhost:5000/api/pedidos/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ estado: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Estado del pedido actualizado.');
        fetchOrders();
      } else {
        throw new Error(data.error || 'Error al actualizar el estado del pedido.');
      }
    } catch (err) {
      toast.error(err.message);
      console.error('Error al actualizar el estado del pedido:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Listado de Pedidos</h3>
      {loading ? (
        <div>Cargando pedidos...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div>No hay pedidos disponibles.</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Cliente</th>
              <th className="py-2">Dirección</th>
              <th className="py-2">Método de Pago</th>
              <th className="py-2">Total</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="text-center border-t">
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.User ? order.User.nombre : 'N/A'}</td>
                <td className="py-2">{order.direccionEnvio}</td>
                <td className="py-2">{order.metodoPago}</td>
                <td className="py-2">${order.total}</td>
                <td className="py-2">
                  <select
                    value={order.estado}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded p-1"
                    disabled={updatingOrderId === order.id}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleStatusChange(order.id, 'Entregado')}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                    disabled={updatingOrderId === order.id}
                  >
                    Marcar como Entregado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrdersList;