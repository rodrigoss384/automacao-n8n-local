# Agente de IA para Suporte Técnico com n8n e WhatsApp

Este repositório contém o MVP de um agente de IA para automação de suporte técnico, utilizando n8n como plataforma de workflow, a Evolution API para integração com o WhatsApp e outras ferramentas para compor a infraestrutura.

## 🏛️ Arquitetura da Solução

O projeto é dividido em dois componentes principais, cada um com seu próprio ambiente Docker:

1.  **`./infra`**: Contém a infraestrutura de base para exposição e gerenciamento dos serviços.
    * **Traefik**: Um reverse proxy moderno que expõe os serviços de forma segura (com HTTPS) e gerencia os domínios.
    * **Portainer**: Uma interface gráfica para gerenciar os contêineres Docker.

2.  **`./automation`**: Contém a aplicação principal do agente de IA.
    * **n8n**: O coração da automação, onde os fluxos de trabalho (`workflows`) do agente são executados.
    * **Evolution API**: Faz a ponte entre o n8n e o WhatsApp, permitindo o envio e recebimento de mensagens.
    * **PostgreSQL**: O banco de dados utilizado pelo n8n e pela Evolution API para persistir dados.
    * **Redis**: Utilizado para gerenciar a memória e o cache das conversas do agente.

## ✨ Funcionalidades

* **Atendimento via WhatsApp**: Recebe e responde mensagens de usuários.
* **Gestão de Fluxo de Conversa**: Controla o estado da conversa, permitindo que o usuário inicie ou pare a interação com o bot.
* **Processamento de Mídia**: Capaz de receber e interpretar mensagens de texto, áudio e imagem.
* **Integração com Sistema de Chamados (Milvus)**: Possui ferramentas para criar, listar e consultar chamados na plataforma Milvus.
* **Memória Persistente**: Utiliza Redis e PostgreSQL para manter o histórico e o contexto das conversas.

## 🚀 Como Começar

Siga os passos abaixo para executar o projeto localmente.

### Pré-requisitos

* [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.
* Um domínio configurado para apontar para o seu IP local (ex: `n8n.meudominio.com`).
* Certificados SSL/TLS para seus domínios (você pode gerá-los localmente ou usar serviços como o Let's Encrypt).
* Dentro da pasta `./infra`, acesse o diretório `certs` e armazene seu certificado SSL juntamente com a Chave privada(key).
* Ainda dentro da pasta `.infra` acesse o diretório `dynamic` e crie dois arquivos: `certificates.yml` e `middlewares.yml`, que devem seguir os exemplos dos arquivos
   `certificates.yml.example` e `middlewares.yml.example`.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/sa-altiagent/automacao_n8n.git
    cd automacao_n8n
    ```

2.  **Configure as variáveis de ambiente:**
    Na pasta `./automation`, crie um arquivo chamado `.env` a partir do exemplo `.env.example` e preencha com suas credenciais e configurações.

3.  **Inicie a infraestrutura base:**
    ```bash
    cd infra
    docker-compose up -d
    ```

4.  **Inicie a aplicação de automação:**
    ```bash
    cd ../automation
    docker-compose up -d
    ```

## ⚙️ Configuração

As principais configurações do projeto são gerenciadas através de variáveis de ambiente no arquivo `.env` da pasta `automation`. É crucial configurar corretamente as URLs, tokens de API e credenciais do banco de dados.


##  Workflows

O projeto inclui dois workflows principais:

* `Agente_Suporte.json`: O fluxo principal que gerencia a conversa com o usuário, aciona as ferramentas e responde às solicitações.
* `Teste_API_Milvus.json`: Um fluxo para testes de integração com a API da Milvus.

Para importá-los, acesse sua instância do n8n, vá em "Workflows" e clique em "Import from File".
