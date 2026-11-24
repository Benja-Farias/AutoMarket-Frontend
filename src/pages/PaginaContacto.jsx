import ContactForm from '../components/ContactForm.jsx';
import { api } from '../utils/api.js';
export default function ContactPage() {
  return <div className="container my-5"><div className="card shadow-sm border-0 form-card mx-auto"><div className="card-body p-4">
    <h1 className="h3 fw-bold">Contacto</h1>
    <p className="text-muted">Envíanos tu consulta.</p>
    <ContactForm onSubmit={datos => api('/contacto', { method: 'POST', body: JSON.stringify(datos) })} />
  </div></div></div>;
}
