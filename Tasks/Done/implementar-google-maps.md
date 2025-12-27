# 🗺️ [EM ANDAMENTO] Implementar Google Maps Satélite

**Status:** 🔄 IN PROGRESS
**Iniciado:** 2025-12-26
**API Key:** ✅ Configurada no .env

---

## ✅ Progresso

- [x] API Key obtida e salva no .env
- [ ] Implementar `gerar_minimapa_google()` em `map_generator.py`
- [ ] Adicionar suporte a variáveis de ambiente (dotenv)
- [ ] Fallback para OpenStreetMap se API falhar
- [ ] Atualizar docker-compose.yml para passar GOOGLE_MAPS_API_KEY
- [ ] Rebuild do container
- [ ] Testar com foto real

---

## 🎯 Próximos Passos

1. Modificar `map_generator.py` na branch principal
2. Adicionar `python-dotenv` no `requirements.txt`
3. Implementar lógica Google Maps com maptype=satellite
4. Rebuild container: `docker-compose build`
5. Restart: `docker-compose up -d`
6. Testar upload de foto com GPS

---

**Arquivo alvo:** `.worktrees/001-criar-sistema-photo-report-completo/src/python/map_generator.py`
**Container:** `photo-processor`
