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
            console.error('No file in request');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log('File received:', file.name, file.type, file.size);

        const supabase = getSupabaseAdmin();
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log('Buffer created, size:', buffer.length);

        // FALLBACK: If Supabase admin is not available, save locally
        if (!supabase) {
            console.log('Supabase not configured, using local storage');
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');

            try {
                await mkdir(uploadDir, { recursive: true });
                const fullPath = path.join(uploadDir, fileName);
                await writeFile(fullPath, buffer);
                console.log('File saved locally:', fullPath);
                return NextResponse.json({ url: `/uploads/${fileName}` });
            } catch (fsError) {
                console.error('Local upload error:', fsError);
                return NextResponse.json({
                    error: 'Local upload failed',
                    details: fsError instanceof Error ? fsError.message : 'Unknown error'
                }, { status: 500 });
            }
        }

        console.log('Uploading to Supabase storage');
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (error) {
            console.error('Supabase storage error:', error);
            // Fallback to local storage if Supabase fails
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            try {
                await mkdir(uploadDir, { recursive: true });
                const fullPath = path.join(uploadDir, fileName);
                await writeFile(fullPath, buffer);
                console.log('Supabase failed, saved locally instead:', fullPath);
                return NextResponse.json({ url: `/uploads/${fileName}` });
            } catch (fsError) {
                console.error('Fallback local upload also failed:', fsError);
                return NextResponse.json({ error: 'Upload failed completely' }, { status: 500 });
            }
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        console.log('Upload successful, URL:', publicUrl);
        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Upload failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
