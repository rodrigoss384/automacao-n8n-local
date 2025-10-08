# Workflows de Automação (CI/CD)

Estes workflows foram desenhados seguindo os princípios de DevSecOps, integrando a segurança e a qualidade em cada etapa do ciclo de vida do desenvolvimento e da entrega do software.

O nosso processo está dividido em dois pipelines principais:

1.  **CI - Integração Contínua (`ci-pipeline.yml`):** Valida, protege e testa cada alteração no código.
2.  **CD - Entrega Contínua (`cd-pipeline.yml`):** Faz o deploy automático da aplicação diretamente no servidor local após a aprovação de todos os testes.

---

## **1. Pipeline de Integração Contínua (CI)**

**Ficheiro:** [`ci-pipeline.yml`](ci-pipeline.yml)

Este pipeline é acionado automaticamente a cada `push` para a branch `main` ou quando um Pull Request é mesclado.

### **Fases de Execução:**

#### **Job 1: `analise-yaml` (Verificar Formatação)**

* **Objetivo:** Garantir que todos os nossos ficheiros `docker-compose.yml` estão bem formatados e sem erros de sintaxe.
* **Importância:** Previne erros de deploy causados por má formatação. A padronização do código (`Linting`) é um pilar da automação de qualidade.

#### **Job 2: `scan-seguranca` (Scan de Vulnerabilidades)**

* **Objetivo:** Analisar todas as nossas imagens Docker (`n8n`, `postgres`, etc.) em busca de vulnerabilidades de segurança conhecidas (CVEs) usando a ferramenta **Trivy**.
* **Importância:** Esta é uma etapa de **"Shift-Left Security"**. Em vez de descobrirmos falhas em produção, nós detetamo-las proativamente durante o desenvolvimento. O pipeline falha se forem encontradas vulnerabilidades de severidade `HIGH` ou `CRITICAL`.

#### **Job 3: `validar-e-testar` (Teste de Inicialização)**

* **Objetivo:** Simular um arranque completo da nossa stack `automation` num ambiente de teste limpo para garantir que todos os serviços iniciam corretamente.
* **Importância:** Valida que as dependências entre os serviços (ex: a `evolution-api` a precisar do `postgres`) estão a funcionar como esperado e que as configurações são válidas.

#### **Job 4: `teste-carga` (Teste de Carga)**

* **Objetivo:** Submeter a aplicação a um stress simulado com a ferramenta **k6** para medir a sua performance e robustez.
* **Importância:** Garante que as novas alterações não degradaram a performance da aplicação e que ela está pronta para aguentar um alto volume de requisições em produção.

---

## **2. Pipeline de Entrega Contínua (CD)**

**Ficheiro:** [`cd-pipeline.yml`](cd-pipeline.yml)

Este pipeline é responsável por automatizar o deploy da aplicação no servidor local (SRVDEV-PORTAINER).

### **Como Funciona:**

* **Gatilho (`trigger`):** Ele é acionado automaticamente **apenas após a conclusão bem-sucedida de todos os jobs da pipeline de CI**. Isto garante que apenas código testado e seguro chegue à produção.
* **Executor (`runner`):** As tarefas deste pipeline são executadas por um **`self-hosted runner`**, um agente seguro que está instalado na máquina local.

### **Passos do Deploy:**

1.  **Checkout do Código:** O runner baixa a versão mais recente do código da branch `main`.
2.  **Download de Imagens:** Executa `docker compose pull` para baixar as versões mais recentes das imagens Docker.
3.  **Reiniciar a Stack:** Executa `docker compose up -d` usando o nome do projeto (`-p automation`) e o ficheiro `.env` correto para atualizar e reiniciar os serviços que foram modificados.
4.  **Limpeza:** Remove imagens Docker antigas e não utilizadas para manter o ambiente limpo.

---

## **Manutenção e Pré-requisitos**

* **`.yamllint.yml`:** Ficheiro de configuração para as regras de formatação do YAML.
* **`.trivyignore`:** Ficheiro onde estão documentadas as vulnerabilidades analisadas, permitindo que a pipeline de segurança prossiga.
* **Self-Hosted Runner:** O serviço do runner deve estar sempre ativo na máquina de produção para que o deploy automático funcione.
