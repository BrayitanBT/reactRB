import React from "react";
import styles from "./SedesButton.module.css"; // Crea este archivo CSS

export default function SedesButton({ place, adress, localidad, responsable, mesero }) {
  return (
    <div className={styles.sedeButton}>
      <div className={styles.sedeInfo}>
        <h3 className={styles.sedeName}>{place}</h3>
        <p className={styles.sedeAddress}>
          <strong>📍 Dirección:</strong> {adress}
        </p>
        <p className={styles.sedeDetails}>
          <strong>🏢 Tipo:</strong> {localidad}
        </p>
        {responsable && (
          <p className={styles.sedeDetails}>
            <strong>👨‍💼 Responsable:</strong> {responsable}
          </p>
        )}
        {mesero && (
          <p className={styles.sedeDetails}>
            <strong>🍽️ Mesero:</strong> {mesero}
          </p>
        )}
      </div>
      <button className={styles.selectButton}>
        Seleccionar Sede
      </button>
    </div>
  );
}