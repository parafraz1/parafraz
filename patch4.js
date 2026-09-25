const fs = require('fs');
let code = fs.readFileSync('src/components/PdfUploader.tsx', 'utf8');

const oldSave = `  const saveToDb = async (newCatalogs: CatalogBook[]) => {
    const { data: exist } = await supabase.from('pages').select('id').eq('slug', 'catalogs_data').maybeSingle();
    let err = null;
    if (exist) {
      const { error } = await supabase.from('pages').update({ content: JSON.stringify(newCatalogs) }).eq('slug', 'catalogs_data');
      err = error;
    } else {
      const { error } = await supabase.from('pages').insert({ slug: 'catalogs_data', title: 'Catalogs List', content: JSON.stringify(newCatalogs) });
      err = error;
    }
    if (err) {
      console.error(err);
      alert("Bazada yadda saxlamaq mümkün olmadı: " + err.message);
      throw err;
    }
  };`;

const newSave = `  const saveToDb = async (newCatalogs: CatalogBook[]) => {
    const { data: exist } = await supabase.from('pages').select('id').eq('slug', 'catalogs_data').maybeSingle();
    let err = null;
    if (exist) {
      const { error } = await supabase.from('pages').update({ content: JSON.stringify(newCatalogs) }).eq('slug', 'catalogs_data');
      err = error;
    } else {
      // Use a random large ID to avoid sequence conflicts (pages_pkey violation)
      const randomId = Math.floor(Math.random() * 900000) + 100000;
      const { error } = await supabase.from('pages').insert({ id: randomId, slug: 'catalogs_data', title: 'Catalogs List', content: JSON.stringify(newCatalogs) });
      err = error;
    }
    if (err) {
      console.error(err);
      alert("Bazada yadda saxlamaq mümkün olmadı: " + err.message);
      throw err;
    }
  };`;

code = code.replace(oldSave, newSave);
fs.writeFileSync('src/components/PdfUploader.tsx', code);
