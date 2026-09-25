const fs = require('fs');
let code = fs.readFileSync('src/components/PdfUploader.tsx', 'utf8');

const oldDelete = `  const handleDelete = async (id: string) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    const newCatalogs = catalogs.filter(c => c.id !== id);
    await saveToDb(newCatalogs);
    setCatalogs(newCatalogs);
  };`;

const newDelete = `  const handleDelete = async (id: string) => {
    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    const newCatalogs = catalogs.filter(c => c.id !== id);
    try {
      await saveToDb(newCatalogs);
      setCatalogs(newCatalogs);
    } catch (e) {
      // alert is handled in saveToDb
    }
  };`;

code = code.replace(oldDelete, newDelete);
fs.writeFileSync('src/components/PdfUploader.tsx', code);
