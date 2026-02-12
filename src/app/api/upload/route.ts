import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // FALLBACK: If Supabase admin is not available, save locally
        if (!supabase) {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');

            try {
                await mkdir(uploadDir, { recursive: true });
                const fullPath = path.join(uploadDir, fileName);
                await writeFile(fullPath, buffer);
                return NextResponse.json({ url: `/uploads/${fileName}` });
            } catch (fsError) {
                console.error('Local upload error:', fsError);
                return NextResponse.json({ error: 'Local upload failed' }, { status: 500 });
            }
        }

        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (error) {
            console.error('Supabase storage error:', error);
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
