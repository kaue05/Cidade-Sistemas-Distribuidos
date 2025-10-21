import * as net from "net";
import * as fs from "fs";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const ipGateway = "127.0.0.1";
const gatewayPort = 6000;
const processadorAddress = "127.0.0.1:7000"; // gRPC agora

// Carrega o serviço gRPC
const packageDef = protoLoader.loadSync("./calculo.proto");
const calculoProto = grpc.loadPackageDefinition(packageDef).calculo as any;

const clientGRPC = new calculoProto.CalculoService(
  processadorAddress,
  grpc.credentials.createInsecure()
);

// Cloud continua requisitando dados via socket
function requisitarDados() {
  const clientGateway = new net.Socket();

  clientGateway.connect(gatewayPort, ipGateway, () => {
    console.log("Cloud conectado ao Gateway, requisitando dados...");
    clientGateway.write("GET_DADOS");
  });

  clientGateway.on("data", (data) => {
    console.log("Cloud recebeu do Gateway:", data.toString());

    // Converte os dados recebidos do Gateway para array de objetos
    const linhas = data.toString().trim().split("\n").filter(Boolean);
    const objetosBrutos = linhas.map((linha) => JSON.parse(linha));

    // Extrai apenas os dados dos sensores
    const dadosLimpos = objetosBrutos.map((obj) => obj.dados);

    // Invocação remota (gRPC) no Processador
    clientGRPC.CalculaMedias(
      { dados: dadosLimpos },
      (err: any, response: any) => {
        if (err) {
          console.error("Erro ao chamar gRPC:", err);
        } else {
          console.log(
            "Cloud recebeu do Processador (via gRPC):",
            response.medias
          );
          fs.appendFileSync(
            "dados_cloud.txt",
            JSON.stringify(response.medias) + "\n"
          );
        }
      }
    );

    clientGateway.end();
  });
}

setInterval(requisitarDados, 5000);
