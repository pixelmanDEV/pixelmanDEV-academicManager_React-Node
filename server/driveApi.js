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
        console.warn('[DriveAPI] Credenciais não encontradas em .env ou ficheiro.');
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
   * Esta lógica deve ser ajustada conforme as colunas reais do seu Excel
   */
  transformData(horarioRaw, modulosRaw) {
    console.log('[DriveAPI] A transformar dados...');
    
    // Placeholder para a lógica de transformação real
    // Exemplo: horarioRaw['Folha1'].map(row => ({ ... }))
    
    const docentes = {};
    const turmas = {};
    const horarios = [];

    // Aqui entraria o mapeamento real baseado nas colunas do Excel
    // Ex: row['Nome Docente'], row['Data'], etc.

    return { docentes, turmas, horarios };
  }

  /** Sincronização completa */
  async sync() {
    const initialized = await this.init();
    if (!initialized) return { success: false, message: 'API não configurada. Verifique o ficheiro .env' };

    try {
      const horarioBuffer = await this.downloadFile(this.FILES.HORARIO);
      const modulosBuffer = await this.downloadFile(this.FILES.MODULOS);
      
      const horarioRaw = this.parseExcel(horarioBuffer);
      const modulosRaw = this.parseExcel(modulosBuffer);

      // Guardar backups brutos
      fs.writeFileSync(path.join(this.DATA_PATH, 'raw_horario.json'), JSON.stringify(horarioRaw, null, 2));
      fs.writeFileSync(path.join(this.DATA_PATH, 'raw_modulos.json'), JSON.stringify(modulosRaw, null, 2));

      // Processar e guardar dados finais (se a transformação estiver implementada)
      // const processed = this.transformData(horarioRaw, modulosRaw);
      // fs.writeFileSync(path.join(this.DATA_PATH, 'docentes.json'), JSON.stringify(processed.docentes, null, 2));
      // fs.writeFileSync(path.join(this.DATA_PATH, 'turmas.json'), JSON.stringify(processed.turmas, null, 2));
      // fs.writeFileSync(path.join(this.DATA_PATH, 'horarios.json'), JSON.stringify(processed.horarios, null, 2));

      return { 
        success: true, 
        message: 'Dados descarregados do Drive com sucesso. Verifique server/data/raw_*.json',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[DriveAPI] Erro no sync:', error.message);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new DriveAPIService();
