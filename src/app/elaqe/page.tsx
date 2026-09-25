import { fetchPage } from "@/lib/data";

export default async function Page() {
  const page = await fetchPage('elaqe');
  
  return (
    <div className="w-full bg-gray-50 animate-fade-in py-12 min-h-[60vh]">
      <div className="max-w-[1000px] mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 uppercase tracking-wider mb-4">{page?.title || 'Bizimlə Əlaqə'}</h1>
          <div className="h-[3px] w-24 bg-[#f97316] mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Sol Tərəf: Əlaqə Məlumatları */}
          <div className="flex flex-col space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Əlaqə Vasitələrimiz</h2>
            </div>

            <div className="space-y-6">
              <a href="https://wa.me/994709201855" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">WhatsApp / Zəng</p>
                  <p className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">+994 70 920 18 55</p>
                </div>
              </a>

              <a href="mailto:info@parafraz.site" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-orange-100 text-[#f97316] rounded-full flex items-center justify-center group-hover:bg-[#f97316] group-hover:text-white transition-colors duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">E-poçt ünvanı</p>
                  <p className="text-lg font-bold text-gray-800 group-hover:text-[#f97316] transition-colors">info@parafraz.site</p>
                </div>
              </a>
              
              <a href="tel:+994554791602" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Əlavə Nömrə</p>
                  <p className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">+994 55 479 16 02</p>
                </div>
              </a>
            </div>
          </div>

          {/* Sağ Tərəf: Form */}
          <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bizə Mesaj Göndərin</h2>
            <p className="text-gray-500 text-sm mb-6">Təklif, irad və ya suallarınızı bizə yaza bilərsiniz.</p>
            
            <form action="https://formsubmit.co/info@parafraz.site" method="POST" className="flex flex-col gap-4">
              {/* FormSubmit configurations */}
              <input type="hidden" name="_subject" value="Parafraz.site - Yeni Mesaj!" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Adınız və Soyadınız</label>
                <input type="text" name="name" required className="w-full px-4 py-3 rounded border border-gray-300 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all" placeholder="Məs: Əli Əliyev" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">E-poçt ünvanınız</label>
                <input type="email" name="email" required className="w-full px-4 py-3 rounded border border-gray-300 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all" placeholder="Məs: ali@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mesajınız</label>
                <textarea name="message" required rows={4} className="w-full px-4 py-3 rounded border border-gray-300 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all resize-none" placeholder="Mesajınızı buraya yazın..."></textarea>
              </div>
              
              <button type="submit" className="mt-2 w-full bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded transition-colors duration-300 flex justify-center items-center gap-2">
                Mesajı Göndər
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
