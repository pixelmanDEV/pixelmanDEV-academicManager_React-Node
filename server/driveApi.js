/**
 * ============================================
 * Campus Tech Academy — Google Drive API Layer
 * ============================================
 *
 * FUTURE: Integração com Google Drive para leitura em tempo real
 * dos ficheiros Excel, a partir do backend Node.
 *
 * Requer:
 * 1. Google Cloud Console project com Drive API enabled
 * 2. Credenciais de serviço (service account) ou OAuth 2.0
 * 3. Biblioteca googleapis (npm install googleapis)
 */

class DriveAPIService {
  constructor() {
    this.API_KEY = process.env.DRIVE_API_KEY || null; // TODO: Configurar
    this.CLIENT_ID = process.env.DRIVE_CLIENT_ID || null; // TODO: Configurar
    this.SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
    this.isInitialized = false;
  }

  /** Inicializa a API do Google */
  async init() {
    // TODO: const { google } = require('googleapis'); ...
    console.log('[DriveAPI] Inicialização pendente — requer credenciais Google');
    this.isInitialized = true;
  }

  /** Autentica o serviço (service account / OAuth2 flow) */
  async authenticate() {
    // TODO: Implementar autenticação
  }

  /**
   * Lista ficheiros numa pasta do Drive
   * @param {string} folderId - ID da pasta no Google Drive
   */
  async listFiles(folderId) {
    // TODO: Implementar com googleapis
    return [];
  }

  /**
   * Lê um ficheiro Excel e converte para JSON
   * @param {string} fileId - ID do ficheiro no Drive
   */
  async readExcel(fileId) {
    // TODO: Download + parse (ex: biblioteca 'xlsx')
    return null;
  }

  /** Sincroniza dados locais com o Drive */
  async sync() {
    // TODO: Verificar modifiedTime e re-sincronizar dados/*.json
    console.log('[DriveAPI] Sincronização pendente');
  }
}

module.exports = new DriveAPIService();
