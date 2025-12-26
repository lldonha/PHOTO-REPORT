# Task: Testar Frontend de Upload

## Prioridade
Alta

## Status
Queue

## Descricao
Testar a interface web do PHOTO-REPORT, verificando o fluxo completo de upload de fotos, extracao de EXIF, edicao de legendas e geracao de PDF.

## Pre-requisitos
- Container `photo-processor` rodando na porta 8002
- Navegador moderno (Chrome, Firefox ou Edge)
- Fotos de teste (preferencialmente com metadados EXIF e GPS)

## Passos

### 1. Abrir o frontend
```bash
start E:\Projetos\PHOTO-REPORT\src\frontend\index.html
```
Ou abrir diretamente no navegador: `file:///E:/Projetos/PHOTO-REPORT/src/frontend/index.html`

### 2. Verificar interface inicial
- [ ] Dropzone visivel com instrucoes
- [ ] Campos: Titulo, Obra, Responsavel
- [ ] Sem erros no console (F12 > Console)

### 3. Preencher configuracoes
- Titulo: "Relatorio de Teste"
- Obra: "Obra Teste 001"
- Responsavel: "Engenheiro Teste"

### 4. Fazer upload de fotos
- Arrastar 3-5 fotos para a zona de drop
- Ou clicar na dropzone e selecionar arquivos

### 5. Verificar processamento
- [ ] Loading overlay aparece durante processamento
- [ ] Cards de foto aparecem com thumbnail
- [ ] Metadados EXIF exibidos (data, GPS, bussola)
- [ ] Mini-mapa gerado para fotos com GPS
- [ ] Toast de sucesso/erro

### 6. Editar legendas
- Digitar legendas em cada textarea
- Verificar limite de 80 caracteres
- Verificar contador de caracteres

### 7. Gerar PDF
- Clicar no botao "Gerar Relatorio PDF"
- [ ] Loading aparece durante geracao
- [ ] PDF e baixado automaticamente
- [ ] Toast de sucesso

### 8. Verificar PDF gerado
- Abrir PDF baixado
- [ ] Cabecalho com titulo, obra, responsavel, data
- [ ] Layout 2x3 (6 fotos por pagina)
- [ ] Overlay com metadados em cada foto
- [ ] Legendas visiveis
- [ ] Numeracao de paginas

## Checklist de Verificacao

### Interface
- [ ] Design responsivo (testar em janela menor)
- [ ] Icones e emojis renderizando
- [ ] Cores corretas (azul para botoes, amarelo para legendas)
- [ ] Hover effects funcionando

### Funcionalidades
- [ ] Upload drag-and-drop funciona
- [ ] Upload via click funciona
- [ ] Remocao de foto individual funciona
- [ ] Botao "Limpar Tudo" funciona
- [ ] Preview em modal (clicar na foto) funciona
- [ ] Fechar modal com ESC funciona

### Metadados EXIF
- [ ] Data/hora formatada corretamente (DD/MM/YYYY HH:MM)
- [ ] Coordenadas GPS exibidas com 6 decimais
- [ ] Direcao da bussola com emoji de seta
- [ ] "-" exibido para campos ausentes

### Console (F12)
- [ ] Zero erros JavaScript
- [ ] Zero erros de CORS
- [ ] Zero erros de rede (exceto se API offline)

## Troubleshooting

### Erro: "Failed to fetch" ou CORS
Container nao esta rodando ou CORS nao configurado.
```bash
docker ps | findstr photo-processor
curl http://localhost:8002/health
```

### Erro: Fotos nao processam
Verificar logs do container:
```bash
docker logs photo-processor
```

### Erro: PDF nao baixa
Verificar se o navegador nao bloqueou o download automatico.

### Erro: Mini-mapa nao aparece
Verificar se a foto tem metadados GPS validos.

## Fotos de Teste Recomendadas
1. Foto de celular com GPS ativado
2. Foto de camera profissional (sem GPS)
3. Foto antiga digitalizada (sem EXIF)
4. Screenshot (sem EXIF)

## Arquivos Relacionados
- `src/frontend/index.html`
- `src/python/processor.py` (API)

## Tempo Estimado
15-20 minutos

## Dependencias
- 001-container-python.md (container deve estar rodando)
- 002-criar-tabelas-sql.md (opcional para MVP)

## Proxima Task
Nenhuma - esta e a ultima task da Queue do MVP
