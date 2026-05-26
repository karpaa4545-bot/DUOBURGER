/**
 * Utilitário para compressão de imagens no navegador.
 * Redimensiona e comprime imagens antes do upload para evitar
 * o limite de 4.5MB da Vercel e reduzir uso de storage.
 */

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const JPEG_QUALITY = 0.75;

/**
 * Comprime uma imagem usando Canvas API.
 * - Redimensiona para no máximo 1200x1200px mantendo proporção
 * - Converte para JPEG com qualidade 0.75
 * - Resultado típico: 150KB-500KB
 */
export async function compressImage(file: File): Promise<File> {
    // Se o arquivo já for pequeno (<500KB), retorna sem comprimir
    if (file.size < 500 * 1024) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Canvas não suportado'));
            return;
        }

        img.onload = () => {
            let { width, height } = img;

            // Calcula novas dimensões mantendo proporção
            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            // Desenha a imagem redimensionada
            ctx.drawImage(img, 0, 0, width, height);

            // Converte para Blob JPEG
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Falha ao comprimir imagem'));
                        return;
                    }

                    // Cria novo File com o blob comprimido
                    const compressedFile = new File(
                        [blob],
                        file.name.replace(/\.[^.]+$/, '.jpg'),
                        { type: 'image/jpeg' }
                    );

                    console.log(
                        `📸 Imagem comprimida: ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB ` +
                        `(${width}x${height})`
                    );

                    resolve(compressedFile);
                },
                'image/jpeg',
                JPEG_QUALITY
            );
        };

        img.onerror = () => reject(new Error('Falha ao carregar imagem'));

        // Lê o arquivo como data URL para o Image element
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
        reader.readAsDataURL(file);
    });
}
