// getStateNumber devuelve un número del 1 al 8 según la ubicación y el estado de las habitaciones.
function getStateNumber(location, statusA, statusB) {
    const states = [
        [1, 2, 3, 4], // Aspiradora en la habitación A.
        [5, 6, 7, 8]  // Aspiradora en la habitación B.
    ];

    let row = location === "A" ? 0 : 1; // Fila 0 = A, Fila 1 = B
    let column = (statusA === "Dirty" ? 0 : 1) * 2 + (statusB === "Dirty" ? 0 : 1);

    return states[row][column]; // Retorna el número del estado
}

// exploreRooms explora ambas habitaciones con la intención de descubrir nuevos estados. No ocurre limpieza al explorar.
function exploreRooms(output, location, statusA, statusB) {
    output.innerHTML += `<p>Explorando habitación ${location}, Estado: ${getStateNumber(location, statusA, statusB)}</p>`;
    location = location === "A" ? "B" : "A";
    output.innerHTML += `<p>Explorando habitación ${location}, Estado: ${getStateNumber(location, statusA, statusB)}</p>`;

    console.log("Exploración completada. Iniciando limpieza...\n");

    return location;
}

// reflexVacuumAgent le dice al agente qué acción tomar en función de la ubicación y el estado de la habitación.
function reflexVacuumAgent(location, status) {
    if (status === "Dirty") {
        return "Suck";
    } else if (location === "A") {
        return "Right";
    } else if (location === "B") {
        return "Left";
    }
}

// randomizeRoomDirtiness ensucia una habitación aleatoriamente luego de que hayan pasado 12 turnos.
function randomizeRoomDirtiness(turn, statusA, statusB) {
    if (turn < 12) {
        let random = Math.random();

        if (random < 0.5) {
            statusA = "Dirty";
            console.log("¡Ha aparecido suciedad en la habitación A!");
        } else {
            statusB = "Dirty";
            console.log("¡Ha aparecido suciedad en la habitación B!");
        }
    }

    return {statusA, statusB};
}

// startSimulation inicia la simulación de la aspiradora. Esta funcionará durante 16 turnos.
function startSimulation() {
    let location = document.getElementById("startLocation").value;
    let statusA = document.getElementById("statusA").value;
    let statusB = document.getElementById("statusB").value;

    let output = document.getElementById("output");
    output.innerHTML = "<h2>Resultado de la Simulación:</h2>";

    console.log("Inicio de la exploración...");

    location = exploreRooms(output, location, statusA, statusB);

    for (let i = 0; i < 12; i++) {
        let status = location === "A" ? statusA : statusB;
        let action = reflexVacuumAgent(location, status);

        // Obtener el número del estado actual
        let stateId = getStateNumber(location, statusA, statusB);
        output.innerHTML += `<p>Paso ${i + 1}: Estado: ${stateId} | Ubicación: ${location} | Acción: ${action}</p>`;

        if (action === "Suck") {
            if (location === "A") statusA = "Clean";
            if (location === "B") statusB = "Clean";
        } else if (action === "Right") {
            location = "B";
        } else if (action === "Left") {
            location = "A";
        }

        // Después del turno 8, se ensuciará una habitación aleatoriamente.
        if (i >= 8) {
            let result = randomizeRoomDirtiness(i, statusA, statusB);

            statusA = result.statusA;
            statusB = result.statusB;

            // Obtener el nuevo número del estado después del evento de suciedad
            let newStateId = getStateNumber(location, statusA, statusB);
            output.innerHTML += `<p><strong>Después del evento de suciedad:</strong> Estado: ${newStateId} | A: ${statusA}, B: ${statusB}</p>`;
        }
    }

    // Obtener el número del estado final
    let finalStateId = getStateNumber(location, statusA, statusB);
    output.innerHTML += `<p><strong>Estado Final:</strong> ${finalStateId} | A: ${statusA}, B: ${statusB}</p>`;
}
