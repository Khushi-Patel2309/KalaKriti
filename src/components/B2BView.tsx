import React, { useState } from 'react';
import { Product } from '../types';
import { Building2, Package, Send, Check, ShieldCheck, Download, Sparkles, Phone, Mail } from 'lucide-react';

interface B2BViewProps {
  products: Product[];
  onOpenProduct: (p: Product) => void;
}

export const B2BView: React.FC<B2BViewProps> = ({ products, onOpenProduct }) => {
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
      alert('Please fill in Name, Company and Phone number.');
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
          <Building2 className="w-3.5 h-3.5 text-[#E6D5C3]" /> KalaKriti Corporate & Export Wholesale
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white">
          Direct Artisan Sourcing for Luxury Retailers & Corporate Gifting
        </h1>
        <p className="text-xs sm:text-sm text-[#E6D5C3] max-w-2xl leading-relaxed">
          Source authentic GI-tagged and handmade Indian crafts directly from certified artisan clusters. Zero intermediaries, fair trade wages, customized bulk packaging, and export compliance.
        </p>
      </div>

      {/* Inquiry Form & Catalog Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Bulk RFQ / Inquiry Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 bg-white border border-[#E6D5C3] rounded-3xl shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#3E2723]">
              Request Bulk Sourcing Quotation (RFQ)
            </h2>
            <p className="text-xs text-[#8C7355]">
              Receive verified artisan quotes within 24 hours with custom sampling options.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#F5F1EE] border border-[#E6D5C3] rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#8B5E34] text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#3E2723]">Wholesale Inquiry Submitted!</h3>
              <p className="text-xs text-[#6D5843] max-w-md mx-auto">
                Thank you, <strong>{companyName}</strong>. Our KalaKriti artisan coordinator and master weavers will review your request and contact you at {phone}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">Buyer / Sourcing Contact *</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Vikram Singhania"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">Company / Brand / Hotel *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Taj Heritage Living / FabIndia"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">Phone Number *</label>
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
                  <label className="font-bold text-[#8B5E34] block mb-1">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sourcing@company.com"
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">Selected Craft Product</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E6D5C3] rounded-xl text-[#3E2723]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (By {p.artisanName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8B5E34] block mb-1">Estimated Quantity (Units)</label>
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
                  <label className="font-bold text-[#8B5E34] block mb-1">Customization / Packaging Requirements</label>
                  <textarea
                    value={requirementNote}
                    onChange={(e) => setRequirementNote(e.target.value)}
                    placeholder="e.g. Need customized corporate gift packaging with embossed brass logos and gift cards..."
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
                  <Send className="w-4 h-4" /> Submit Bulk Sourcing RFQ
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 1 Column: Bulk Sourcing Highlights */}
        <div className="space-y-4">
          <div className="p-6 bg-[#FAF9F7] border border-[#E6D5C3] rounded-3xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider">
              Why Partner with KalaKriti B2B?
            </h3>

            <div className="space-y-3 text-[#6D5843]">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#8B5E34] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723] block">Direct Cluster Pricing</strong>
                  <span>Save 40–60% vs traditional middlemen while paying artisans fair trade wages.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Package className="w-4 h-4 text-[#8B5E34] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723] block">Custom Branding & MOQs</strong>
                  <span>Custom sizes, dyes, corporate logos, and sustainable handmade packaging.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#8B5E34] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#3E2723] block">Verified Authenticity</strong>
                  <span>Each order comes with certificates of handmade authenticity and artisan bios.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
