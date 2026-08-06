const { google } = require('googleapis');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * ============================================
 * Campus Tech Academy — Google Drive API Layer
 * ============================================
 */

class DriveAPIService {
  constructor() {
    this.auth = null;
    this.drive = null;
    
    this.FILES = {
      HORARIO: process.env.DRIVE_FILE_HORARIO || '12oCTRDVPkGvIkbxCeMojeyomgkgiDZue',
      MODULOS: process.env.DRIVE_FILE_MODULOS || '1kGGEbXZIlnAp3U43LPq5nIUJ0lSuly0-'
    };

    this.DATA_PATH = path.join(__dirname, 'data');
  }

  /** Inicializa a API do Google */
  async init() {
    try {
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
      const privateKey = process.env.GOOGLE_PRIVATE_KEY;

      console.log('[DriveAPI] A verificar configuração...');
      
      if (credentialsPath) {
        const absolutePath = path.resolve(credentialsPath);
        console.log(`[DriveAPI] A tentar carregar ficheiro: ${absolutePath}`);
        if (fs.existsSync(absolutePath)) {
          this.auth = new google.auth.GoogleAuth({
            keyFile: absolutePath,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
          });
          console.log('[DriveAPI] Autenticação via ficheiro JSON configurada.');
        } else {
          console.error(`[DriveAPI] Erro: Ficheiro ${absolutePath} não encontrado.`);
          return false;
        }
      } else if (clientEmail && privateKey) {
        console.log('[DriveAPI] A configurar autenticação via variáveis de ambiente (JWT).');
        this.auth = new google.auth.JWT(
          clientEmail,
          null,
          privateKey.replace(/\\n/g, '\n'),
          ['https://www.googleapis.com/auth/drive.readonly']
        );
      } else {
        console.warn('[DriveAPI] Erro: Nenhuma credencial encontrada (GOOGLE_APPLICATION_CREDENTIALS ou GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY).');
        return false;
      }

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      return true;
    } catch (error) {
      console.error('[DriveAPI] Erro na inicialização:', error.message);
      return false;
    }
  }

  /** Download do ficheiro */
  async downloadFile(fileId) {
    if (!this.drive) throw new Error('Drive API não inicializada');
    const response = await this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(response.data);
  }

  /** Parse do Excel para JSON */
  parseExcel(buffer) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const result = {};
    workbook.SheetNames.forEach(sheetName => {
      const roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (roa.length) result[sheetName] = roa;
    });
    return result;
  }

  /** 
   * Transforma os dados brutos do Excel no formato esperado pela App
   */
  transformData(horarioRaw, modulosRaw) {
    console.log('[DriveAPI] A transformar dados...');
    
    const docentes = {};
    const turmas = {};
    const horarios = [];

    // 1. Processar Horários (Geralmente a primeira folha do ficheiro HORARIO)
    const sheetName = Object.keys(horarioRaw)[0];
    const rows = horarioRaw[sheetName] || [];

    rows.forEach(row => {
      // Mapeamento flexível de colunas (tenta encontrar nomes comuns)
      const docenteId = row['Docente'] || row['DOCENTE'] || row['Sigla'] || row['ID'];
      const turmaId = row['Turma'] || row['TURMA'] || row['Grupo'];
      const data = row['Data'] || row['DATA'] || row['Dia'];
      const diaSemana = row['Dia'] || row['DIA'] || row['Semana'];
      const inicio = row['Início'] || row['Inicio'] || row['Hora Início'];
      const fim = row['Fim'] || row['FIM'] || row['Hora Fim'];
      const modulo = row['Módulo'] || row['Modulo'] || row['UC'];
      const obs = row['Observações'] || row['Obs'] || '';

      if (docenteId && turmaId) {
        // Adicionar ao array de horários
        const h = {
          docente: docenteId,
          turma: turmaId,
          data: data,
          dia: diaSemana,
          inicio: inicio,
          fim: fim,
          modulo: modulo,
          obs: obs
        };
        horarios.push(h);

        // Inicializar docente se não existir
        if (!docentes[docenteId]) {
          docentes[docenteId] = {
            id: docenteId,
            nome: docenteId, // Pode ser atualizado se houver uma folha de nomes
            email: '',
            telefone: '',
            turmas: [],
            modulos: [],
            horarios: []
          };
        }

        // Adicionar turma e módulo ao docente (sem duplicados)
        if (!docentes[docenteId].turmas.includes(turmaId)) {
          docentes[docenteId].turmas.push(turmaId);
        }
        if (modulo && !docentes[docenteId].modulos.includes(modulo)) {
          docentes[docenteId].modulos.push(modulo);
        }
        docentes[docenteId].horarios.push(h);

        // Inicializar turma se não existir
        if (!turmas[turmaId]) {
          turmas[turmaId] = {
            id: turmaId,
            nome: turmaId.replace('CET_TSI_ONL_', 'TSI0'),
            nome_completo: turmaId,
            docentes: [],
            modulos: [],
            aulas_count: 0
          };
        }

        // Adicionar docente e módulo à turma (sem duplicados)
        if (!turmas[turmaId].docentes.includes(docenteId)) {
          turmas[turmaId].docentes.push(docenteId);
        }
        if (modulo && !turmas[turmaId].modulos.includes(modulo)) {
          turmas[turmaId].modulos.push(modulo);
        }
        turmas[turmaId].aulas_count++;
      }
    });

    return { docentes, turmas, horarios };
  }

  /** Sincronização completa e persistência */
  async sync() {
    const initialized = await this.init();
    if (!initialized) return { success: false, message: 'API não configurada. Verifique o ficheiro .env e credentials.json' };

    try {
      console.log('[DriveAPI] A descarregar ficheiros...');
      const horarioBuffer = await this.downloadFile(this.FILES.HORARIO);
      const modulosBuffer = await this.downloadFile(this.FILES.MODULOS);
      
      const horarioRaw = this.parseExcel(horarioBuffer);
      const modulosRaw = this.parseExcel(modulosBuffer);

      // Guardar backups brutos para depuração
      if (!fs.existsSync(this.DATA_PATH)) fs.mkdirSync(this.DATA_PATH, { recursive: true });
      fs.writeFileSync(path.join(this.DATA_PATH, 'raw_horario.json'), JSON.stringify(horarioRaw, null, 2));
      fs.writeFileSync(path.join(this.DATA_PATH, 'raw_modulos.json'), JSON.stringify(modulosRaw, null, 2));

      // Processar dados
      const processed = this.transformData(horarioRaw, modulosRaw);

      // Persistir dados finais que a App consome
      fs.writeFileSync(path.join(this.DATA_PATH, 'docentes.json'), JSON.stringify(processed.docentes, null, 2));
      fs.writeFileSync(path.join(this.DATA_PATH, 'turmas.json'), JSON.stringify(processed.turmas, null, 2));
      fs.writeFileSync(path.join(this.DATA_PATH, 'horarios.json'), JSON.stringify(processed.horarios, null, 2));

      console.log('[DriveAPI] Sincronização e persistência concluídas.');
      return { 
        success: true, 
        message: 'Dados sincronizados com sucesso do Google Drive!',
        stats: {
          docentes: Object.keys(processed.docentes).length,
          turmas: Object.keys(processed.turmas).length,
          horarios: processed.horarios.length
        }
      };
    } catch (error) {
      console.error('[DriveAPI] Erro no sync:', error.message);
      
      let userMessage = 'Erro ao processar ficheiros: ' + error.message;
      if (error.code === 403 || (error.response && error.response.status === 403)) {
        userMessage = 'Erro 403: Acesso Negado. Certifique-se de que partilhou os ficheiros Excel com o email da Service Account (com permissão de Editor/Leitor).';
      } else if (error.code === 404 || (error.response && error.response.status === 404)) {
        userMessage = 'Erro 404: Ficheiro não encontrado. Verifique se os IDs dos Excels no ficheiro .env estão corretos.';
      }
      
      return { success: false, message: userMessage };
    }
  }
}

module.exports = new DriveAPIService();
