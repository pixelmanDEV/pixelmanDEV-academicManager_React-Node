const { google } = require('googleapis');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * ============================================
 * Campus Tech Academy — Google Drive API Layer
 * ============================================
 *
 * Implementação da Fase 2: Integração com Google Drive
 */

class DriveAPIService {
  constructor() {
    this.auth = null;
    this.drive = null;
    
    // IDs fornecidos pelo utilizador
    this.FILES = {
      HORARIO: '12oCTRDVPkGvIkbxCeMojeyomgkgiDZue',
      MODULOS: '1kGGEbXZIlnAp3U43LPq5nIUJ0lSuly0-'
    };

    this.DATA_PATH = path.join(__dirname, 'data');
  }

  /** Inicializa a API do Google usando Service Account ou credenciais do ambiente */
  async init() {
    try {
      // Tenta carregar credenciais de um ficheiro ou variáveis de ambiente
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      
      if (credentialsPath && fs.existsSync(credentialsPath)) {
        this.auth = new google.auth.GoogleAuth({
          keyFile: credentialsPath,
          scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });
      } else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        this.auth = new google.auth.JWT(
          process.env.GOOGLE_CLIENT_EMAIL,
          null,
          process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          ['https://www.googleapis.com/auth/drive.readonly']
        );
      } else {
        console.warn('[DriveAPI] Credenciais não configuradas. A usar modo offline.');
        return false;
      }

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      console.log('[DriveAPI] Inicializado com sucesso.');
      return true;
    } catch (error) {
      console.error('[DriveAPI] Erro na inicialização:', error.message);
      return false;
    }
  }

  /**
   * Faz download de um ficheiro do Drive e converte para Buffer
   */
  async downloadFile(fileId) {
    if (!this.drive) throw new Error('Drive API não inicializada');
    
    const response = await this.drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(response.data);
  }

  /**
   * Obtém metadados do ficheiro (ex: modifiedTime)
   */
  async getFileMetadata(fileId) {
    if (!this.drive) throw new Error('Drive API não inicializada');
    
    const response = await this.drive.files.get({
      fileId,
      fields: 'id, name, modifiedTime'
    });
    return response.data;
  }

  /**
   * Lê um Buffer de Excel e converte para JSON
   */
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
   * Sincroniza os dados do Drive com os ficheiros locais JSON
   */
  async sync() {
    console.log('[DriveAPI] A iniciar sincronização...');
    
    if (!this.drive) {
      const initialized = await this.init();
      if (!initialized) return { success: false, message: 'Não foi possível inicializar a API' };
    }

    try {
      // 1. Sincronizar Horários e Docentes (Ficheiro 1)
      console.log(`[DriveAPI] A descarregar Horário: ${this.FILES.HORARIO}`);
      const horarioBuffer = await this.downloadFile(this.FILES.HORARIO);
      const horarioData = this.parseExcel(horarioBuffer);
      
      // 2. Sincronizar Módulos (Ficheiro 2)
      console.log(`[DriveAPI] A descarregar Módulos: ${this.FILES.MODULOS}`);
      const modulosBuffer = await this.downloadFile(this.FILES.MODULOS);
      const modulosData = this.parseExcel(modulosBuffer);

      // 3. Guardar fallbacks locais e processar dados
      // NOTA: A estrutura exata depende das colunas dos ficheiros Excel fornecidos.
      // Esta secção deve ser adaptada para mapear as colunas do Excel para o schema JSON da app.
      
      fs.writeFileSync(path.join(this.DATA_PATH, 'raw_horario.json'), JSON.stringify(horarioData, null, 2));
      fs.writeFileSync(path.join(this.DATA_PATH, 'raw_modulos.json'), JSON.stringify(modulosData, null, 2));

      // Exemplo de mapeamento futuro:
      // const docentes = transformToDocentes(horarioData, modulosData);
      // fs.writeFileSync(path.join(this.DATA_PATH, 'docentes.json'), JSON.stringify(docentes, null, 2));

      console.log('[DriveAPI] Sincronização concluída.');
      return { success: true, data: { horarioData, modulosData } };
    } catch (error) {
      console.error('[DriveAPI] Erro na sincronização:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new DriveAPIService();
