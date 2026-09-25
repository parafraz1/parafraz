import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Initialize the Google Drive API client
const getDriveService = () => {
  const credentials = {
    client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  return google.drive({ version: 'v3', auth });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'Fayl tapılmadı.' }, { status: 400 });
    }

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
      return NextResponse.json({ error: 'Server konfiqurasiyası əksikdir (Folder ID).' }, { status: 500 });
    }

    const drive = getDriveService();

    // Convert Web File to a Node.js Readable stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // Upload to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
      },
      media: {
        mimeType: file.type || 'application/pdf',
        body: stream,
      },
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = response.data.id;

    // Optional: Make it publicly accessible (if the folder isn't already set to "Anyone with the link")
    // If the user already shared the folder as "Anyone with the link", this might be redundant but safe.
    try {
      await drive.permissions.create({
        fileId: fileId!,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permError) {
      console.warn("Could not set permission explicitly. Folder might already be public.", permError);
    }

    return NextResponse.json({ 
      success: true, 
      id: fileId,
      url: response.data.webViewLink,
      downloadUrl: response.data.webContentLink
    });
  } catch (error: any) {
    console.error('Error uploading to Drive:', error);
    return NextResponse.json({ error: error.message || 'Fayl yüklənərkən xəta baş verdi.' }, { status: 500 });
  }
}
