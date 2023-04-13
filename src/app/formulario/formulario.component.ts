import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  nuevo: boolean = true;
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.nuevo = false;
      this.http.get('http://localhost:3000/usuarios/' + id).subscribe(
        (response: any) => {
          // Manejar la respuesta del servidor
          this.formData = response; // Aquí puedes hacer algo con la respuesta del servidor, como mostrarla en la UI o procesarla de alguna manera
        },
        (error) => {
          console.error(error); // Manejar el error en caso de que ocurra
        }
      );
    }
  }
  formData = {
    nombre: '',
    id: null,
    edad: null,
    fechaNacimiento: '',
    fechaInscripcion: '',
    costo: null,
  };
  submitForm() {
    if (this.nuevo) {
      // Validar que todos los campos esten completos
      if (
        !this.formData.nombre ||
        !this.formData.edad ||
        !this.formData.fechaNacimiento ||
        !this.formData.fechaInscripcion ||
        !this.formData.costo
      ) {
        alert('Todos los campos deben estar completos');
        return;
      }
      // Controlar que la fecha de inscripción sea mayor que la de nacimiento
      if (
        new Date(this.formData.fechaInscripcion) <=
        new Date(this.formData.fechaNacimiento)
      ) {
        alert('La fecha de inscripción debe ser mayor que la de nacimiento');
        return;
      }

      // Controlar que la persona tenga más de 18 años
      const fechaNacimiento = new Date(this.formData.fechaNacimiento);
      const edad = this.calcularEdad(fechaNacimiento);
      console.log(edad);
      if (edad < 18) {
        alert('La persona debe tener más de 18 años');
        return;
      }

      // Controlar que la edad coincida con la fecha de nacimiento
      if (edad !== this.formData.edad) {
        alert('La edad no coincide con la fecha de nacimiento');
        return;
      }

      // Calcular el costo proporcional a la fecha de inscripción
      const fechaInscripcion = new Date(this.formData.fechaInscripcion);
      const costo =
        (fechaNacimiento.getFullYear() - fechaInscripcion.getFullYear()) * 100;
      this.formData.costo = costo;

      // Controlar que se ingresen al menos dos nombres con 4 caracteres cada uno
      const nombres = this.formData.nombre.split(' ');
      let count = 0;
      for (const nombre of nombres) {
        if (nombre.length >= 4) {
          count++;
        }
      }
      if (count < 2) {
        alert('Debe ingresar al menos dos nombres con 4 caracteres cada uno');
        return;
      }

      // Enviar los datos al servidor para grabar en la base de datos
      this.http.post('http://localhost:3000/usuarios', this.formData).subscribe(
        () => {
          alert('Datos grabados exitosamente en la base de datos');
          // Reiniciar el formulario
          this.formData = {
            nombre: '',
            id: null,
            edad: null,
            fechaNacimiento: '',
            fechaInscripcion: '',
            costo: null,
          };
        },
        (error) => console.error(error)
      );
    } else {
      this.http.put('http://localhost:3000/usuarios/'+this.formData.id, this.formData).subscribe(
        () => {
          alert('Datos grabados exitosamente en la base de datos');
        },
        (error) => console.error(error)
      );
    }
  }
  calcularEdad(fechaNacimiento: Date): number {
    // Convertir la fecha de nacimiento en un objeto de tipo Date
    const fechaNacimientoDate = new Date(fechaNacimiento);

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Calcular la diferencia entre la fecha actual y la fecha de nacimiento en milisegundos
    const diferenciaMilisegundos =
      fechaActual.getTime() - fechaNacimientoDate.getTime();

    // Calcular la edad en años
    const edad = Math.floor(
      diferenciaMilisegundos / (1000 * 60 * 60 * 24 * 365.25)
    );

    return edad;
  }
}
