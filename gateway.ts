import * as net from "net";

const host = "127.0.0.1";
const gatewayPort = 6000; // servidor do gateway

// Lista de sensores (cada um escuta em uma porta diferente)
const sensores = [5000, 5001, 5002, 5003, 5004]; // pode adicionar quantos quiser

// Servidor do Gateway (escuta Cloud)
const server = net.createServer((socket) => {
  console.log("Cloud conectado ao Gateway");

  socket.on("data", async (msg: Buffer) => {
    const command = msg.toString().trim();

    if (command === "GET_DADOS") {
      console.log("Cloud requisitou dados -> consultando sensores...");

      // Para cada sensor, abrir conexão e pedir dados
      sensores.forEach((porta) => {
        const clientSensor = new net.Socket();

        clientSensor.connect(porta, host, () => {
          console.log(`Solicitando dados do Sensor na porta ${porta}`);
        });

        clientSensor.on("data", (data) => {
          try {
            // Tenta interpretar o JSON vindo do sensor
            const sensorData = JSON.parse(data.toString());

            // Cria pacote padronizado
            const payload = {
              porta: porta,
              dados: sensorData,
            };

            console.log(`Gateway recebeu do Sensor ${porta}:`, payload);

            // Repassa para a Cloud como JSON
            socket.write(JSON.stringify(payload) + "\n");
          } catch (err) {
            console.error(`Erro ao processar dados do Sensor ${porta}:`, err);
          }

          clientSensor.end();
        });

        clientSensor.on("error", (err) => {
          console.error(`Erro ao conectar no Sensor ${porta}:`, err.message);
        });
      });
    }
  });

  socket.on("close", () => console.log("Cloud desconectou do Gateway"));
});

server.listen(gatewayPort, host, () => {
  console.log(`Gateway aguardando Cloud em ${host}:${gatewayPort}`);
});
