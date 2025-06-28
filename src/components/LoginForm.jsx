import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ userName: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Credenciales inválidas');
        return;
      }

      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      onLogin(userData);
    } catch (err) {
      console.error('Error de login:', err);
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema de Inventario BAS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión para continuar
          </p>
        </div>
        
        {/* Información de usuarios de prueba */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Usuarios de prueba:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>Admin:</strong> warce / admin123</div>
            <div><strong>Gerente:</strong> ana.garcia / gerente123</div>
            <div><strong>Empleado:</strong> carlos.lopez / empleado123</div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
          
          <div>
            <input
              name="userName"
              type="text"
              value={form.userName}
              onChange={handleChange}
              placeholder="Usuario"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
