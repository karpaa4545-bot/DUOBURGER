import { INITIAL_DATA } from './data';
import { supabase } from './supabase';

export async function getData() {
    try {
        if (!supabase) {
            console.warn("Supabase não configurado. Retornando dados iniciais.");
            return INITIAL_DATA;
        }

        const { data, error } = await supabase
            .from('app_state')
            .select('data')
            .eq('id', 1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Linha não encontrada (ID=1 não existe ainda)
                console.log("Nenhum dado encontrado no Supabase. Retornando e inicializando com dados padrão.");
                
                // Tenta inicializar
                await supabase.from('app_state').insert({ id: 1, data: INITIAL_DATA }).select();
                return INITIAL_DATA;
            }
            console.error("Erro ao buscar do Supabase:", error);
            return INITIAL_DATA;
        }

        if (data && data.data) {
            // Se o JSON estiver vazio, usa os dados iniciais, caso contrário, faz o merge
            if (Object.keys(data.data).length === 0) {
                 return INITIAL_DATA;
            }
            
            // Garantir que a estrutura base exista
            const mergedData = { ...INITIAL_DATA };
            
            // Fazer um merge profundo das propriedades principais para garantir que arrays não sejam substituídos por undefined
            if (data.data.store) mergedData.store = { ...INITIAL_DATA.store, ...data.data.store };
            if (data.data.categories) mergedData.categories = data.data.categories;
            if (data.data.products) mergedData.products = data.data.products;
            if (data.data.banners) mergedData.banners = data.data.banners;
            if (data.data.orders) mergedData.orders = data.data.orders;
            
            return mergedData;
        }

    } catch (error) {
        console.error("Exceção ao buscar do Supabase:", error);
    }

    return INITIAL_DATA;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveData(newData: any): Promise<{ success: boolean; message: string }> {
    try {
        if (!supabase) {
            return {
                success: false,
                message: "Configuração incompleta: Supabase não conectado."
            };
        }

        const { error } = await supabase
            .from('app_state')
            .upsert({ id: 1, data: newData, updated_at: new Date().toISOString() });

        if (error) {
            console.error("Erro do Supabase ao salvar:", error);
            return { success: false, message: `Erro ao salvar no banco: ${error.message}` };
        }

        return { success: true, message: "Salvo no banco de dados com sucesso!" };

    } catch (error: any) {
        console.error("Exceção ao salvar no Supabase:", error);
        return { success: false, message: `Erro fatal ao salvar: ${error.message}` };
    }
}
