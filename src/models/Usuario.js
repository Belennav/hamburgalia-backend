const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  perfilCompleto: { type: Boolean, default: false }
});

// Encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('usuario', usuarioSchema);
;

// Función para manejar el envío del formulario de creación de hamburguesas
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
      form.addEventListener('submit', (event) => {
          event.preventDefault(); // Evita el envío por defecto del formulario

          // Obtener datos del formulario
          const nombre = document.querySelector('#nombre').value;
          const descripcion = document.querySelector('#descripcion').value;
          const pan = document.querySelector('input[name="pan"]:checked').value;
          const proteina = document.querySelector('input[name="proteina"]:checked').value;
          const ingredientes = Array.from(document.querySelectorAll('input[name="ingredientes"]:checked'))
                                    .map(checkbox => checkbox.value);
          const disenos = document.querySelector('#disenos').value;

          // Crear objeto para la hamburguesa
          const hamburguesa = {
              nombre,
              descripcion,
              pan,
              proteina,
              ingredientes,
              disenos,
              puntuacion: 0, // Inicialmente, la puntuación es 0
              comentarios: []
          };

          // Enviar la hamburguesa al backend
          fetch('http://localhost:3000/hamburguesas', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(hamburguesa)
          })
          .then(response => response.json())
          .then(data => {
              alert('¡Hamburguesa creada con éxito!');
              form.reset();
              location.reload(); // Recargar para actualizar el ranking
          })
          .catch(error => console.error('Error al crear hamburguesa:', error));
      });
  }
});