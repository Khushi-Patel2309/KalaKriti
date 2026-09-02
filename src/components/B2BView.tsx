import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Package, Send, Check, ShieldCheck, Download, Sparkles, Phone, Mail } from 'lucide-react';

interface B2BViewProps {
  products: Product[];
  onOpenProduct: (p: Product) => void;
}

export const B2BView: React.FC<B2BViewProps> = ({ products, onOpenProduct }) => {
  const { language, t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.id || '');
  const [buyerName, setBuyerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [requirementNote, setRequirementNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !companyName || !phone) {
      alert(language === 'hi' ? 'कृपया नाम, कंपनी और फोन नंबर भरें।' : 'Please fill in Name, Company and Phone number.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setBuyerName('');
      setCompanyName('');
      setPhone('');
      setEmail('');
      setRequirementNote('');
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* B2B Hero Header */}
      <div className="p-8 sm:p-10 bg-[#3E2723] text-white rounded-3xl shadow-xl space-y-4 border border-[#8B5E34]/30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E6D5C3] border border-white/10">
          <Building2 className="w-3.5 h-3.5 text-[#E6D5C3]" /> {t.b2bTitle}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white">
          {t.b2bSubtitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#E6D5C3] max-w-2xl leading-relaxed">
          {t.b2bTagline}
        </p>
      </div>

      {/* Inquiry Form & Catalog Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Bulk RFQ / Inquiry Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#3E2723]">
              {language === 'hi' ? 'थोक मूल्य प्रस्ताव (RFQ) का अनुरोध करें' : 'Request Bulk Sourcing Quotation (RFQ)'}
            </h2>
            <p className="text-xs text-[#8C7355]">
              {language === 'hi'
                ? 'सत्यापित मास्टर कारीगरों से 24 घंटे के भीतर अनुकूलित नमूना विकल्पों के साथ उद्धरण प्राप्त करें।'
                : 'Receive verified artisan quotes within 24 hours with custom sampling options.'}
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#F5F1EE] border border-[#E6D5C3] rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#8B5E34] text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#3E2723]">
                {language === 'hi' ? 'थोक पूछताछ दर्ज हो गई है!' : 'Wholesale Inquiry Submitted!'}
              </h3>
              <p className="text-xs text-[#6D5843] max-w-md mx-auto">
                {language === 'hi'
                  ? `धन्यवाद, ${companyName}। हमारे शिल्प समन्वयक और मास्टर बुनकर आपके अनुरोध की समीक्षा करेंगे और ${phone} पर संपर्क करेंगे।`
                  : `Thank you, ${companyName}. Our KalaKriti artisan coordinator and master weavers will review your request and contact you at ${phone}.`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">{t.b2bBuyerName} *</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. विक्रम सिंघानिया' : 'e.g. Vikram Singhania'}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">{t.b2bCompanyName} *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. ताज हेरिटेज होटल्स / फैबइंडिया' : 'e.g. Taj Heritage Living / FabIndia'}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98111 22233"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">
                    {language === 'hi' ? 'व्यावसायिक ईमेल' : 'Work Email'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sourcing@company.com"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">
                    {language === 'hi' ? 'चयनित हस्तशिल्प उत्पाद' : 'Selected Craft Product'}
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({language === 'hi' ? 'कारीगर' : 'By'}: {p.artisanName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">{t.b2bQuantityReq}</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl font-bold font-mono text-[#3E2723]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8B5E34] block mb-1">
                    {language === 'hi' ? 'कस्टमाइज़ेशन / पैकेजिंग आवश्यकताएँ' : 'Customization / Packaging Requirements'}
                  </label>
                  <textarea
                    value={requirementNote}
                    onChange={(e) => setRequirementNote(e.target.value)}
                    placeholder={
                      language === 'hi'
                        ? 'उदा. अनुकूलित कॉर्पोरेट उपहार पैकेजिंग, पीतल के लोगो और विशेष हस्तनिर्मित ग्रीटिंग कार्ड...'
                        : 'e.g. Need customized corporate gift packaging with embossed brass logos and gift cards...'
                    }
                    rows={3}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-bold text-white bg-[#8B5E34] hover:bg-[#734B26] rounded-xl shadow-xs flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> {t.b2bSubmitRfq}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 1 Column: Bulk Sourcing Highlights */}
        <div className="space-y-4">
          <div className="p-6 bg-[#FAF9F7] border border-[#E6D5C3] rounded-3xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider">
              {language === 'hi' ? 'कलाकृति B2B के लाभ' : 'Why Partner with KalaKriti B2B?'}
            </h3>

            <div className="space-y-3 text-[#6D5843]">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#8B5E34] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723] block">
                    {language === 'hi' ? 'प्रत्यक्ष क्लस्टर मूल्य' : 'Direct Cluster Pricing'}
                  </strong>
                  <span>
                    {language === 'hi'
                      ? 'पारंपरिक बिचौलियों की तुलना में 40-60% की बचत, और कारीगरों को उचित पारिश्रमिक।'
                      : 'Save 40–60% vs traditional middlemen while paying artisans fair trade wages.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Package className="w-4 h-4 text-[#8B5E34] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723] block">
                    {language === 'hi' ? 'कस्टम ब्रांडिंग व पैकेजिंग' : 'Custom Branding & MOQs'}
                  </strong>
                  <span>
                    {language === 'hi'
                      ? 'कस्टम रंग, बुनाई पैटर्न, कॉर्पोरेट लोगो और पर्यावरण-अनुकूल हस्तनिर्मित पैकेजिंग।'
                      : 'Custom sizes, dyes, corporate logos, and sustainable handmade packaging.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#8B5E34] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723] block">
                    {language === 'hi' ? 'सत्यापित प्रामाणिकता' : 'Verified Authenticity'}
                  </strong>
                  <span>
                    {language === 'hi'
                      ? 'प्रत्येक ऑर्डर के साथ हस्तनिर्मित प्रामाणिकता प्रमाणपत्र और कारीगर की कहानी।'
                      : 'Each order comes with certificates of handmade authenticity and artisan bios.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
