-- ============================================================
-- PHOTO-REPORT: Schema SQL para Relatórios Fotográficos
-- Banco: cosmic (PostgreSQL)
-- ============================================================

-- Tabela: photo_reports
-- Armazena sessões/relatórios fotográficos
CREATE TABLE IF NOT EXISTS photo_reports (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    obra VARCHAR(255),
    responsavel VARCHAR(255),
    status VARCHAR(50) DEFAULT 'rascunho',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_geracao_pdf TIMESTAMP,
    pdf_path VARCHAR(500),
    observacoes TEXT
);

-- Tabela: photo_items
-- Armazena fotos individuais com EXIF e legenda
CREATE TABLE IF NOT EXISTS photo_items (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES photo_reports(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    ordem INTEGER DEFAULT 0,

    -- Dados EXIF extraídos
    data_hora TIMESTAMP,
    latitude DECIMAL(11, 8),
    longitude DECIMAL(11, 8),
    direcao_graus DECIMAL(6, 2),
    direcao_cardeal VARCHAR(10),

    -- Legenda customizável
    legenda VARCHAR(255),

    -- Imagens processadas (base64 ou path)
    imagem_original_path VARCHAR(500),
    imagem_processada_path VARCHAR(500),
    thumbnail_base64 TEXT,
    minimapa_base64 TEXT,

    -- Metadados
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processado BOOLEAN DEFAULT FALSE
);

-- Índice: idx_photo_items_report
-- Otimiza busca de fotos por relatório
CREATE INDEX IF NOT EXISTS idx_photo_items_report
ON photo_items(report_id);

-- Índice: idx_photo_reports_status
-- Otimiza filtro por status do relatório
CREATE INDEX IF NOT EXISTS idx_photo_reports_status
ON photo_reports(status);

-- View: photo_reports_summary
-- Resumo de relatórios com contagem de fotos
CREATE OR REPLACE VIEW photo_reports_summary AS
SELECT
    r.id,
    r.titulo,
    r.obra,
    r.responsavel,
    r.status,
    r.data_criacao,
    r.data_atualizacao,
    r.data_geracao_pdf,
    COUNT(p.id) AS total_fotos,
    COUNT(CASE WHEN p.processado = TRUE THEN 1 END) AS fotos_processadas
FROM photo_reports r
LEFT JOIN photo_items p ON r.id = p.report_id
GROUP BY r.id, r.titulo, r.obra, r.responsavel, r.status,
         r.data_criacao, r.data_atualizacao, r.data_geracao_pdf;

-- ============================================================
-- Comentários das tabelas para documentação
-- ============================================================

COMMENT ON TABLE photo_reports IS 'Sessões/relatórios fotográficos de obra';
COMMENT ON TABLE photo_items IS 'Fotos individuais com metadados EXIF e legenda';
COMMENT ON VIEW photo_reports_summary IS 'Resumo de relatórios com contagem de fotos';

COMMENT ON COLUMN photo_reports.status IS 'Status: rascunho, processando, concluido, erro';
COMMENT ON COLUMN photo_items.direcao_graus IS 'Direção da bússola em graus (0-360)';
COMMENT ON COLUMN photo_items.direcao_cardeal IS 'Direção cardeal (N, NE, E, SE, S, SW, W, NW)';
COMMENT ON COLUMN photo_items.legenda IS 'Legenda customizável (max 255 chars, truncada em 80 no overlay)';
