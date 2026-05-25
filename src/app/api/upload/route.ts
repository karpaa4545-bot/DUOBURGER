import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        // PRIORIDADE: Salvar localmente primeiro (mais confiável para desenvolvimento)
        try {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePathLocal = path.join(uploadDir, fileName);
            fs.writeFileSync(filePathLocal, buffer);

            const fileUrl = `/uploads/${fileName}`;
            console.log('✅ Imagem salva localmente:', fileUrl);
            return NextResponse.json({ url: fileUrl });
        } catch (localError: any) {
            console.error("Erro ao salvar localmente:", localError);
        }

        // FALLBACK: Tentar Supabase se local falhar
        if (supabase) {
            try {
                const filePath = `uploads/${fileName}`;
                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, buffer, {
                        contentType: file.type || 'image/jpeg',
                        upsert: true
                    });

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                console.log('✅ Imagem salva no Supabase:', publicUrl);
                return NextResponse.json({ url: publicUrl });
            } catch (supabaseError: any) {
                console.error("Erro Supabase:", supabaseError);
            }
        }

        return NextResponse.json({ error: 'Falha ao salvar imagem em todos os métodos disponíveis' }, { status: 500 });

    } catch (error: any) {
        console.error("Erro geral no upload:", error);
        return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
    }
}
