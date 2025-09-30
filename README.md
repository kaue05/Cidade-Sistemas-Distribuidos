# 🌆 Desafio dos Sensores Urbanos

Projeto desenvolvido para a disciplina de **Sistemas Distribuídos**.  
O desafio simula o uso de sensores de **temperatura, umidade e insolação** espalhados em cinco bairros de uma cidade.  
Esses sensores enviam dados solicitados para um **gateway**, que depois escuta as solicitações da **cloud** e, por fim, repassa e recebe os dados tratados do **processador** e armazena em um "Banco de Dados".

---

## 📌 Objetivo
- Compreender a comunicação entre processos usando **Sockets em JavaScript (Node.js)**.  
- Criar uma arquitetura distribuída capaz de:
  1. Gerar dados simulados a partir de sensores (dados aleatórios).  
  2. Coletar dados dos sensores no gateway.
  3. Coletar dados do gateway no cloud.
  4. Repassar dados recebidos do cloud para o processador.
  5. Processar os dados no processador (cálculo de médias).  
  6. Receber dados do processador e armazenar em um Banco de Dados.

---

## 🏗️ Arquitetura da Solução

Sensores → Gateway ↔ Processador → Cloud

```yaml
- **Sensores:** (SERVIDOR) geram valores aleatórios de temperatura, umidade e insolação.  
- **Gateway:** (SERVIDOR/CLIENTE) recebe dados dos Sensores, agrega e envia ao cloud quando solicitado.    
- **Cloud:** (CLIENTE/CLIENTE) recebe dados do Gateway, envia para o Processador, e recebe os dados tratados do processador
- **Processador:** (SERVIDOR) calcula médias por bairro e devolve à Cloud.
```

---

## ⚙️ Tecnologias Utilizadas
- **Node.js** (JavaScript)  
- **Módulo `net`** para comunicação por sockets TCP  
- **Console** para simular a Cloud (sem banco de dados)  

---

## 📂 Estrutura do Projeto

```bash
/sensores-urbanos
├── sensor.js # Simula sensores de cada bairro
├── gateway.js # Agregador de dados (central)
├── processador.js # Calcula médias por bairro
├── cloud.js # Simulação da Cloud
└── README.md # Documentação do projeto
```

---

## ▶️ Como Executar

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/seu-usuario/sensores-urbanos.git
   cd sensores-urbanos
   ```
Abra 4 terminais diferentes e rode nessa ordem:

Gateway

```bash
npm run gateway
```

Processador
```bash
npm run processador
```

Cloud
```bash
npm run cloud
```

Sensores (um por bairro)
```bash
npx ts-node sensor.js Centro 5000
npx ts-node sensor.js Norte 5001
npx ts-node sensor.js Sul 5002
npx ts-node sensor.js Leste 5003
npx ts-node sensor.js Oeste 5004
```

🔍 Exemplo de Saída
Sensor
```bash
Sensor Centro rodando em 127.0.0.1:5000
Gateway conectado ao sensor do bairro Centro (porta 5000)`
```

Gateway
```bash
Gateway aguardando Cloud em 127.0.0.1:6000
Cloud conectado ao Gateway
Cloud requisitou dados -> consultando sensores...
Solicitando dados do Sensor na porta 5000
```

Processador
```bash
Processador aguardando Cloud em 127.0.0.1:7000
Cloud conectado ao Processador
Processador calculou::
{
  Centro: { temperatura: '23.0', umidade: '66.0', insolacao: '500.0' },
  Norte:  { temperatura: '20.5', umidade: '70.0', insolacao: '600.0' }
}
```

Cloud
```bash
Cloud recebeu do Gateway::
{
  Centro: { temperatura: '23.0', umidade: '66.0', insolacao: '500.0' },
}
Cloud recebeu do Processador:
{
  Centro: { temperatura: '23.0', umidade: '66.0', insolacao: '500.0' },
}
```