// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      showToast('Bienvenido al sistema SIGMA-LAB UNI', 'success');
      navigate('/');
    } else {
      setError(result.error);
      showToast(result.error, 'error');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-surface font-body text-on-surface antialiased selection:bg-surface-variant selection:text-primary">
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low items-center justify-center p-xxl overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 w-full max-w-lg aspect-square soft-shadow bg-surface-container-lowest rounded-[32px] p-xl flex flex-col items-center justify-center">
          <img
            className="w-full h-auto object-contain drop-shadow-xl rounded-xl"
            src="https://www.axceleducation.id/wp-content/uploads/2025/01/Layanan-Axcel-Education-Komputer.jpg"
            alt="Laboratorio UNI"
          />
        </div>
        <div className="absolute bottom-lg left-lg text-primary opacity-50 flex items-center space-x-sm">
          <span className="material-symbols-outlined text-[20px]">science</span>
          <span className="font-label text-label uppercase tracking-wider">Predictive Management</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-surface-container-lowest p-lg sm:p-xxl relative z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="w-full max-w-[400px] flex flex-col space-y-xl">
          <div className="space-y-sm text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-sm mb-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-primary tracking-tight">SIGMA-LAB UNI</h1>
            </div>
            <p className="font-body text-lg text-on-surface-variant">
              Gestion de laboratorios mas simple y organizada.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg mt-xl">
            {error && (
              <div className="bg-error-container text-on-error-container text-sm p-3 rounded-lg border border-error">
                {error}
              </div>
            )}

            <div className="flex flex-col space-y-xs">
              <label className="font-label text-label text-on-surface-variant" htmlFor="email">Correo institucional</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@uni.edu.ni"
                  required
                  className="form-input-lab w-full pl-[40px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-on-surface placeholder-outline-variant focus:ring-0"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-xs">
              <label className="font-label text-label text-on-surface-variant" htmlFor="password">Contrasena</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
                  required
                  className="form-input-lab w-full pl-[40px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-on-surface placeholder-outline-variant focus:ring-0"
                />
              </div>
            </div>

            <div className="flex items-center justify-end w-full">
              <a className="font-label text-label text-primary hover:text-primary-container hover:underline transition-colors" href="#">
                Olvidaste tu contrasena?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-label text-label py-[12px] px-lg rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] flex justify-center items-center space-x-sm disabled:opacity-50"
            >
              <span>{loading ? 'Iniciando sesion...' : 'Iniciar sesion'}</span>
              <span className="material-symbols-outlined text-[18px]">login</span>
            </button>
          </form>

          <div className="mt-xxl pt-lg border-t border-surface-variant text-center">
            <p className="font-body text-sm text-outline">
              Sistema Integrado de Gestion Predictiva
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}