document.addEventListener("DOMContentLoaded", function () {
  const selectContainer = document.querySelector("#sintomas");
  const selectContainer2 = document.querySelector("#sintomas2");
  const tablaSintoma = document.querySelector("#tablasintoma");
  const modalContainer = document.querySelector("#modal-container");

  // con esta funcion fetch se obtiene la lista de enfermedades y se pinta en el select
  fetch("https://expert-system-1.fly.dev/enfermedades", { method: "GET" })
    .then((response) => response.json()) // aqui se convierte la respuesta en un json
    .then((data) => {
      const { enfermedades } = data;

      const listaDeSintomas = [];
      enfermedades.forEach((enfermedad) => {
        const { sintomas } = enfermedad;
        listaDeSintomas.push(...sintomas);
      });

      listaDeSintomas.forEach((sintoma) => {
        const option = document.createElement("option");
        option.value = sintoma;
        option.textContent = sintoma;
        selectContainer.appendChild(option);
      });
    });

  selectContainer.addEventListener("change", (event) => {
    const value = event.target.value;

    fetch("https://expert-system-1.fly.dev/tratamiento", {
      method: "POST",
      body: JSON.stringify({ sintoma: value }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        const {
          result: {
            diagnostic: { matches },
          },
        } = responseJSON;

        const listaDeSintomasTotales = [];
        matches.forEach((match) => {
          const { sintomas = [] } = match;
          listaDeSintomasTotales.push(...sintomas);
        });

        listaDeSintomasTotales.forEach((sintoma) => {
          const option = document.createElement("option");
          option.value = sintoma;
          option.textContent = sintoma;
          selectContainer2.appendChild(option);
        });
      });

    console.log({ value });
  });

  selectContainer2.addEventListener("change", (event) => {
    const value = event.target.value;

    fetch("https://expert-system-1.fly.dev/tratamiento", {
      method: "POST",
      body: JSON.stringify({ sintoma: value }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        const {
          result: {
            diagnostic: { matches },
          },
        } = responseJSON;

        // insert matches into the table
        matches.forEach((match) => {
          const { name: enfermedad, sintomas = [], tratamientos } = match;
          const tr = document.createElement("tr");
          const td1 = document.createElement("td");
          td1.textContent = enfermedad;
          const td2 = document.createElement("td");
          td2.innerHTML = sintomas.join(".<br>");
          const td3 = document.createElement("td");

          const button = document.createElement("button");
          button.textContent = "Ver tratamiento";
          button.classList.add("btn");

          button.addEventListener("click", () => {
            modalContainer.innerHTML = `
                <div class="modal">
                    <h2>Tratamiento para ${enfermedad}</h2>
                    <p>Este es el tratamiento para ${enfermedad}</p>
                    <p>${tratamientos.join(".<br>")}</p>
                    <button id="close-button">Cerrar</button>
                </div>
            `;

            const closeButton = document.querySelector("#close-button");
            closeButton.addEventListener("click", () => {
              modalContainer.innerHTML = "";
            });
          });

          td3.appendChild(button);

          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tablaSintoma.appendChild(tr);
        });
      });
  });
});
