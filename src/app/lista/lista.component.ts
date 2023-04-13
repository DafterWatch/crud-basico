import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router,) {}

  ngOnInit(): void {
    this.getUsuarios()
  }
  elementos: ElementoLista[] = [];
  onDelete(id: number) {
    this.http.delete('http://localhost:3000/usuarios/' + id).subscribe(
      () => {
        alert('Datos eliminados exitosamente en la base de datos');
        this.getUsuarios()
      },
      (error) => console.error(error)
    );
  }
  getUsuarios(){
    this.http.get('http://localhost:3000/usuarios').subscribe(
      (response: any) => {
        // Manejar la respuesta del servidor
        this.elementos = response; // Aquí puedes hacer algo con la respuesta del servidor, como mostrarla en la UI o procesarla de alguna manera
      },
      (error) => {
        console.error(error); // Manejar el error en caso de que ocurra
      }
    );
  }
}
export interface ElementoLista {
  nombre: string;
  id: number;
  edad: number;
  fechaNac: string;
  fechaIns: string;
  costo: number;
}
