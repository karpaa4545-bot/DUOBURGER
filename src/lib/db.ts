import { INITIAL_DATA } from './data';
import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), 'data.json');

export async function getData() {
    const GIST_ID = process.env.GIST_ID || "4cdc654edf75789f83b9793cbfa59a4e";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // 1. Tenta pegar do Gist se configurado (Prioridade para Nuvem)
    if (GIST_ID && GITHUB_TOKEN) {
        try {
            const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
                cache: 'no-store'
            });

            if (response.ok) {
                const gist = await response.json();
                const file = gist.files['data.json'];
                if (file && file.content) {
                    const gistData = JSON.parse(file.content);
                    if (gistData.products && gistData.store) {
                        // Salva no localStorage como backup
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('duo_burger_backup', JSON.stringify(gistData));
                        }
                        return { ...INITIAL_DATA, ...gistData };
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao buscar do Gist:", error);
        }
    }

    // 2. Fallback: Tenta pegar do localStorage (backup offline)
    if (typeof window !== 'undefined') {
        try {
            const localBackup = localStorage.getItem('duo_burger_backup');
            if (localBackup) {
                const backupData = JSON.parse(localBackup);
                console.log("📦 Usando backup local (modo offline)");
                return { ...INITIAL_DATA, ...backupData };
            }
        } catch (error) {
            console.error("Erro ao ler backup local:", error);
        }
    }

    // 3. Fallback: Tenta pegar do arquivo local data.json (apenas em dev)
    if (fs.existsSync(DB_FILE_PATH)) {
        try {
            const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
            const localData = JSON.parse(fileContent);
            return { ...INITIAL_DATA, ...localData };
        } catch (error) {
            console.error("Erro ao ler banco local:", error);
        }
    }

    // 4. Se nada existir, retorna dados iniciais
    return INITIAL_DATA;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveData(newData: any): Promise<{ success: boolean; message: string }> {
    const GIST_ID = process.env.GIST_ID || "4cdc654edf75789f83b9793cbfa59a4e";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    // Sincroniza sempre com localStorage primeiro (Garante persistência local imediata)
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('duo_burger_backup', JSON.stringify(newData));
        } catch (e) {
            console.error("Erro ao salvar no localStorage:", e);
        }
    }

    // Se estiver em produção e não tiver GITHUB_TOKEN, retorna erro informando que o salvamento na nuvem falhou
    if (process.env.NODE_ENV === 'production' && !GITHUB_TOKEN) {
        return {
            success: false,
            message: "Configuração incompleta: GITHUB_TOKEN não definido. O pedido foi salvo apenas Localmente no seu navegador."
        };
    }

    let gistError = null;

    // 1. Tenta salvar no Gist se configurado (Prioridade para Nuvem)
    if (GIST_ID && GITHUB_TOKEN) {
        try {
            const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    files: {
                        'data.json': {
                            content: JSON.stringify(newData, null, 2)
                        }
                    }
                })
            });

            if (response.ok) {
                // Sincroniza também com o arquivo local para manter o fallback atualizado (apenas em dev)
                if (process.env.NODE_ENV !== 'production') {
                    try {
                        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(newData, null, 2));
                    } catch (e) {
                        console.error("Erro ao atualizar backup local durante sincronia:", e);
                    }
                }
                return { success: true, message: "Salvo na Nuvem com sucesso!" };
            } else {
                gistError = `Erro Gist (${response.status})`;
            }
        } catch (error: any) {
            console.error("Erro ao salvar no Gist:", error);
            gistError = `Sem Conexão Cloud: ${error.message}`;
        }
    }

    // 2. Fallback: Se o Gist falhar ou não estiver configurado, salva localmente em data.json (APENAS EM DEV)
    if (process.env.NODE_ENV !== 'production') {
        try {
            fs.writeFileSync(DB_FILE_PATH, JSON.stringify(newData, null, 2));
            return {
                success: true,
                message: gistError ? `Modo Offline: ${gistError}. Salvo Localmente!` : "Salvo localmente com sucesso!"
            };
        } catch (error: any) {
            console.error("Erro ao salvar localmente:", error);
            return { success: false, message: `Erro fatal ao salvar: ${error.message}` };
        }
    }

    // Se chegou aqui, é produção e o Gist falhou, mas já salvamos no localStorage acima
    return {
        success: true,
        message: `Aviso: Falha ao sincronizar com a nuvem (${gistError}). O pedido foi salvo LOCALMENTE no navegador.`
    };
}
