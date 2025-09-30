import * as net from "net";

const host = "127.0.0.1"; // alterar para porta processador
const port = 7000;

// Tipos
interface Dado {
  bairro: string;
  temperatura: string;
  umidade: string;
  insolacao: string;
}
interface Medias {
  temperatura: number;
  umidade: number;
  insolacao: number;
}

// Função de cálculo
function calcularMedias(dados: Dado[]): Record<string, Medias> {
  const grupos: Record<string, { t: number[]; u: number[]; i: number[] }> = {};

  dados.forEach((d) => {
    if (!grupos[d.bairro]) {
      grupos[d.bairro] = { t: [], u: [], i: [] };
    }
    grupos[d.bairro].t.push(Number(d.temperatura));
    grupos[d.bairro].u.push(Number(d.umidade));
    grupos[d.bairro].i.push(Number(d.insolacao));
  });

  const resultado: Record<string, Medias> = {};
  for (const bairro in grupos) {
    resultado[bairro] = {
      temperatura:
        grupos[bairro].t.reduce((a, b) => a + b, 0) / grupos[bairro].t.length,
      umidade:
        grupos[bairro].u.reduce((a, b) => a + b, 0) / grupos[bairro].u.length,
      insolacao:
        grupos[bairro].i.reduce((a, b) => a + b, 0) / grupos[bairro].i.length,
    };
  }
  return resultado;
}

// Servidor do Processador
const server = net.createServer((socket) => {
  console.log("Cloud conectado ao Processador");

  socket.on("data", (data: Buffer) => {
    try {
      const recebidos: { porta: number; dados: Dado }[] = JSON.parse(
        data.toString()
      );
      const dados: Dado[] = recebidos.map((r) => r.dados); // extrai só os dados dos sensores

      const medias = calcularMedias(dados);
      console.log("Processador calculou:", medias);
      socket.write(JSON.stringify(medias));
    } catch (err) {
      console.error("Erro ao processar dados:", err);
    }
  });

});

server.listen(port, host, () => {
  console.log(`Processador aguardando Cloud em ${host}:${port}`);
});
