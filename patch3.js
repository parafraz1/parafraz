const fs = require('fs');
let code = fs.readFileSync('src/components/PdfUploader.tsx', 'utf8');

const oldAdd = `    await saveToDb(newCatalogs);
    setCatalogs(newCatalogs);
    setEditingCatId(null);
    setTitle(''); setImage(''); setDescription(''); setPdfAz(''); setPdfEn('');
    setIsSaving(false);`;

const newAdd = `    try {
      await saveToDb(newCatalogs);
      setCatalogs(newCatalogs);
      setEditingCatId(null);
      setTitle(''); setImage(''); setDescription(''); setPdfAz(''); setPdfEn('');
    } catch (e) {
      // alert handled
    } finally {
      setIsSaving(false);
    }`;

code = code.replace(oldAdd, newAdd);
fs.writeFileSync('src/components/PdfUploader.tsx', code);
