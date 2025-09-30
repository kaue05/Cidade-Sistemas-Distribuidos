# 🌆 Desafio dos Sensores Urbanos

Projeto desenvolvido para a disciplina de **Sistemas Distribuídos**.  
O desafio simula o uso de sensores de **temperatura, umidade e insolação** espalhados em cinco bairros de uma cidade.  
Esses sensores enviam dados para um **gateway**, que depois comunica com um **processador** e, por fim, repassa os dados processados para a **Cloud**.

---

## 📌 Objetivo
- Compreender a comunicação entre processos usando **Sockets em JavaScript (Node.js)**.  
- Criar uma arquitetura distribuída capaz de:
  1. Gerar dados simulados a partir de sensores (dados aleatórios).  
  2. Coletar dados no gateway.  
  3. Processar os dados em outra máquina (cálculo de médias).  
  4. Retornar os resultados ao gateway.  
  5. Enviar dados finais para a "Cloud".  

---

## 🏗️ Arquitetura da Solução

Sensores → Gateway ↔ Processador → Cloud

```yaml
- **Sensores:** geram valores aleatórios de temperatura, umidade e insolação.  
- **Gateway:** recebe dados dos sensores, agrega e envia ao processador.  
- **Processador:** calcula médias por bairro e devolve ao gateway.  
- **Cloud:** simulação de destino final (pode ser apenas console.log).
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
node gateway.js
```

Processador
```bash
node processador.js
```

Cloud
```bash
node cloud.js
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
```css
Enviando dados do bairro Centro: { temperatura: '22.5', umidade: '65.2', insolacao: '450.0' }
Gateway
arduino
Dados recebidos do Centro
Encaminhando para processador...
```

Processador
```css
Médias calculadas:
{
  Centro: { temperatura: '23.0', umidade: '66.0', insolacao: '500.0' },
  Norte:  { temperatura: '20.5', umidade: '70.0', insolacao: '600.0' }
}
```

Cloud
```css
[Cloud] Dados finais recebidos:
{
  Centro: { temperatura: '23.0', umidade: '66.0', insolacao: '500.0' },
  Norte:  { temperatura: '20.5', umidade: '70.0', insolacao: '600.0' }
}
```