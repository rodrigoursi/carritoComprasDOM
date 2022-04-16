let btnAumentar= document.querySelector(".btn-info");
let container= document.querySelector(".container");
//btnAumentar.addEventListener("click",aumentar);
let contador=0;

container.addEventListener("click",(c)=>{
  let span= document.getElementById("span");
  if(c.target.classList.contains("btn-danger")==true){  //USO EVENT DELEGATION DENTRO DE LA FUNCION PONGO UNA LETRA/VARIABLE
    contador--;                                     // Y SELECCIONO EL CONTENIDO DEL DIV UTILIZANDO CLASSLIST.

  }else if(c.target.classList.contains("btn-info")==true){contador++;}
  span.innerHTML= contador;
});


/*function aumentar() {
  let span= document.querySelector("span");
  contador++;
  span.textContent = contador;
};*/
