import * as net from "net";
import * as fs from "fs";

const host = "127.0.0.1";
const gatewayPort = 6000;
const processadorPort = 7000;

// Cloud pede dados ao Gateway
function requisitarDados() {
  const clientGateway = new net.Socket();

  clientGateway.connect(gatewayPort, host, () => {
    console.log("Cloud conectado ao Gateway, requisitando dados...");
    clientGateway.write("GET_DADOS");
  });

  clientGateway.on("data", (data) => {
    console.log("Cloud recebeu do Gateway:", data.toString());

    // Quebra em linhas, remove vazias e converte cada uma em objeto
    const linhas = data.toString().trim().split("\n").filter(Boolean);
    const objetos = linhas.map((linha) => JSON.parse(linha));

    // Agora enviamos um array válido para o processador
    const clientProcessador = new net.Socket();
    clientProcessador.connect(processadorPort, host, () => {
      clientProcessador.write(JSON.stringify(objetos));
    });

    clientProcessador.on("data", (result) => {
      console.log("Cloud recebeu do Processador:", result.toString());
      fs.appendFileSync("dados_cloud.txt", result.toString() + "\n");
      clientProcessador.end();
    });

    clientGateway.end();
  });
}

// Executa a cada 5s
setInterval(requisitarDados, 5000);
