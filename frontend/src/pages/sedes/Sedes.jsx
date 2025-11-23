import React, { useState, useEffect } from "react";
import styles from "./sedes.module.css";
//-----Components
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import SedesButton from "./SedesButton";
import { apiService } from "../../services/api"; // Ajusta la ruta según tu estructura

export default function Sedes() {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadEstablishments();
  }, []);

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getEstablecimientos();
      
      if (response.establecimientos) {
        setEstablishments(response.establecimientos);
        console.log("✅ Establecimientos cargados:", response.establecimientos);
      } else {
        setError("No se pudieron cargar los establecimientos");
      }
    } catch (error) {
      console.error("Error cargando establecimientos:", error);
      setError("Error al cargar los establecimientos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar establecimientos según búsqueda
  const filteredEstablishments = establishments.filter(establishment =>
    establishment.Nombre_sede.toLowerCase().includes(searchTerm.toLowerCase()) ||
    establishment.Ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    establishment.Responsable?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.sedeContainer}>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Cargando establecimientos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.sedeContainer}>
      <Header />

      <div className={styles.content}>
        {/* Columna izquierda */}
        <div className={styles.locations}>
          <h2 className={styles.title}>Encuentra tu restaurante</h2>
          <input
            type="text"
            placeholder="Busca por nombre, ciudad o responsable..."
            className={styles.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {error && (
            <div className={styles.errorMessage}>
              {error}
              <button onClick={loadEstablishments} className={styles.retryButton}>
                Reintentar
              </button>
            </div>
          )}

          <div className={styles.sedesList}>
            {filteredEstablishments.length > 0 ? (
              filteredEstablishments.map((establishment) => (
                <SedesButton
                  key={establishment.Id_Establecimiento}
                  place={establishment.Nombre_sede}
                  adress={establishment.Ciudad}
                  localidad={establishment.Tipo_de_mesa || "Sede principal"}
                  responsable={establishment.Responsable}
                  mesero={establishment.Mesero}
                />
              ))
            ) : (
              <div className={styles.noResults}>
                {searchTerm ? "No se encontraron establecimientos que coincidan con tu búsqueda" : "No hay establecimientos disponibles"}
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className={styles.infoSection}>
            <h3>Nuestras Sedes</h3>
            <p>
              Contamos con {establishments.length} establecimientos 
              {establishments.length > 0 && ` en ${new Set(establishments.map(e => e.Ciudad)).size} ciudades diferentes`}.
            </p>
          </div>
        </div>

        {/* Columna derecha (Mapa) */}
        <div className={styles.mapSection}>
          <iframe
            className={styles.map}
            src="https://www.openstreetmap.org/export/embed.html?bbox=-74.1%2C4.6%2C-74.05%2C4.75&layer=mapnik"
            allowFullScreen
            title="Mapa de nuestras sedes"
          ></iframe>
          <div className={styles.mapInfo}>
            <p>📍 Ubicación aproximada de nuestras sedes en Bogotá</p>
            <small>Usa el buscador para encontrar establecimientos específicos</small>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}