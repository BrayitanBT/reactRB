import { Pizza } from 'lucide-react';
import './footer.css'

export default function Footer (){
    return(
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <div className='footer-logo'>
                        <Pizza size={55}/>
                        <span>Fastie</span>
                    </div>
                    <h2 className="footer-text">
                        Sabor auténtico y servicio de calidad desde 2024.
                    </h2>
                </div>
                <div className="footer-section">
                    <h3>Enlaces</h3>
                    <ul>
                        <li><a href="#">Inicio</a></li>
                        <li><a href="#">Sedes</a></li>
                        <li><a href="#">Domicilios</a></li>
                        <li><a href="#">Reservas</a></li>
                        <li><a href="#">Sobre Nosotros</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contacto</h3>
                    <ul>
                        <li><p>📞  +57 315 642 6181</p></li>
                        <li><p>📧  ServicioAlCliente@fastie.com</p></li>
                        <li><p>📍  Bogotá, Colombia</p></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Fastie. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}