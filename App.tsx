
import React, { useState } from 'react';
import { TRANSLATIONS } from './constants';
import { Language, FormData, Program, SupportType } from './types';
import { CheckCircle, Globe, Phone, User, BookOpen, Utensils, Clock, Layout, MessageSquare, ShieldCheck } from 'lucide-react';

// คัดลอก URL ที่ได้จากการ Deploy Google Apps Script มาวางที่นี่
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx84PXbX9HCCyTceMwG9azNmwiyixST4AOkt9dzz5G0Z1Wy8nb1hXDbywaa73tH7D2l/exec";

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('TH');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    phone: '',
    lineId: '',
    email: '',
    studentName: '',
    grade: '',
    program: Program.THAI,
    supportType: [],
    itemName: '',
    quantity: '',
    cookOnSite: false,
    setupTime: '12:30',
    needTable: true,
    notes: ''
  });

  const t = TRANSLATIONS[lang];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSupportTypeToggle = (type: SupportType) => {
    setFormData(prev => {
      const currentTypes = prev.supportType;
      const isSelected = currentTypes.includes(type);
      return {
        ...prev,
        supportType: isSelected 
          ? currentTypes.filter(t => t !== type) 
          : [...currentTypes, type]
      };
    });
  };

  const handleToggleLang = () => {
    setLang(prev => prev === 'TH' ? 'EN' : 'TH');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.supportType.length === 0) {
      alert(lang === 'TH' ? 'กรุณาเลือกประเภทการสนับสนุนอย่างน้อย 1 รายการ' : 'Please select at least one support category.');
      return;
    }

    setIsSubmitting(true);

    try {
      // ตรวจสอบว่าได้แก้ URL หรือยัง
      if (SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT_URL")) {
        // หากยังไม่แก้ ให้จำลองการทำงานเหมือนเดิม (เพื่อการทดสอบ UI)
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.warn("Using simulated submission. Please set SCRIPT_URL in App.tsx to save data to Google Sheets.");
      } else {
        // ส่งข้อมูลไปยัง Google Apps Script จริง
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Google Apps Script มักต้องการโหมดนี้สำหรับการส่งข้ามโดเมนแบบง่าย
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        // เนื่องจากใช้ no-cors เราจะไม่สามารถอ่าน response body ได้ 
        // แต่ถ้าไม่มี error ขว้างออกมา แสดงว่าการส่งสำเร็จ (สถานะ 200)
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Submission error:", error);
      alert(lang === 'TH' ? 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง' : 'An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-8 border-[#002B5B]">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-[#002B5B] mb-4">{t.success}</h2>
          <p className="text-gray-600 mb-8">{lang === 'TH' ? 'ข้อมูลถูกบันทึกลงในระบบเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการติดต่อประสานงานในลำดับต่อไป' : 'Your registration has been recorded. Our staff will contact you shortly.'}</p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                parentName: '',
                phone: '',
                lineId: '',
                email: '',
                studentName: '',
                grade: '',
                program: Program.THAI,
                supportType: [],
                itemName: '',
                quantity: '',
                cookOnSite: false,
                setupTime: '12:00',
                needTable: true,
                notes: ''
              });
            }}
            className="w-full py-3 px-6 bg-[#002B5B] text-white font-semibold rounded-lg hover:bg-[#003d82] transition-colors"
          >
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-[#002B5B] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-bold text-base md:text-xl leading-tight">{t.schoolName}</h1>
            <p className="text-xs text-blue-100 block">Satit Udomseuksa School (Bilingual)</p>
          </div>
          <button
            type="button"
            onClick={handleToggleLang}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-white/30 text-xs md:text-sm"
          >
            <Globe size={16} />
            <span>{lang === 'TH' ? 'English' : 'ภาษาไทย'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8 border border-gray-100">
          <div className="bg-[#002B5B] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100 text-sm md:text-base">
                <div className="flex items-center space-x-2">
                  <Clock size={18} />
                  <span>{t.eventDate} | {t.eventTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Layout size={18} />
                  <span>{t.setupInfo}</span>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          <div className="p-6 bg-blue-50/50 border-b border-gray-100">
            <p className="text-[#002B5B] text-sm leading-relaxed">
              {lang === 'TH' 
                ? 'ทางโรงเรียนขอเชิญชวนท่านผู้ปกครองที่มีความประสงค์จะร่วมแบ่งปันความสุขให้กับนักเรียน เนื่องในวันเด็กแห่งชาติ โดยการ "จัดบูทแจกจ่ายด้วยตนเอง" (สามารถสนับสนุนอาหาร ขนม หรือเครื่องดื่มได้มากกว่า 1 ประเภท)'
                : 'The school cordially invites parents to share happiness with students on National Children\'s Day by "Setting up a distribution booth" (You can support multiple categories of food, dessert, or drinks).'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4">
              <div className="p-2 bg-blue-100 text-[#002B5B] rounded-lg">
                <User size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#002B5B]">{t.parentInfo}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t.labelParentName} <span className="text-red-500">{t.required}</span>
                </label>
                <input
                  required
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  placeholder={t.placeholderName}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t.labelPhone} <span className="text-red-500">{t.required}</span>
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t.placeholderPhone}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t.labelLineId} <span className="text-gray-400 font-normal">{t.optional}</span>
                </label>
                <input
                  type="text"
                  name="lineId"
                  value={formData.lineId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t.labelEmail} <span className="text-gray-400 font-normal">{t.optional}</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4">
              <div className="p-2 bg-blue-100 text-[#002B5B] rounded-lg">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#002B5B]">{t.studentInfo}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t.labelStudentName} <span className="text-red-500">{t.required}</span>
                </label>
                <input
                  required
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder={t.placeholderName}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t.labelGrade} <span className="text-red-500">{t.required}</span>
                </label>
                <input
                  required
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  placeholder={lang === 'TH' ? 'เช่น P.1A, ป.1A' : 'P.1A, ป.1A'}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t.labelProgram} <span className="text-red-500">{t.required}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.program === Program.THAI ? 'border-[#002B5B] bg-blue-50 ring-1 ring-[#002B5B]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="program"
                      value={Program.THAI}
                      checked={formData.program === Program.THAI}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#002B5B]"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">{t.optThaiProg}</span>
                  </label>
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.program === Program.ENGLISH ? 'border-[#002B5B] bg-blue-50 ring-1 ring-[#002B5B]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="program"
                      value={Program.ENGLISH}
                      checked={formData.program === Program.ENGLISH}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#002B5B]"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">{t.optEngProg}</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4">
              <div className="p-2 bg-blue-100 text-[#002B5B] rounded-lg">
                <Utensils size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#002B5B]">{t.supportDetails}</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {t.labelSupportType} <span className="text-red-500">{t.required}</span> <span className="text-xs text-gray-400 font-normal">({lang === 'TH' ? 'เลือกได้หลายรายการ' : 'Select all that apply'})</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[SupportType.FOOD, SupportType.DESSERT, SupportType.SNACK, SupportType.DRINK].map((type) => {
                    const isSelected = formData.supportType.includes(type);
                    return (
                      <label 
                        key={type}
                        className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all h-24 ${isSelected ? 'border-[#002B5B] bg-blue-50 ring-1 ring-[#002B5B]' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSupportTypeToggle(type)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 mb-2 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#002B5B] border-[#002B5B]' : 'bg-white border-gray-300'}`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-sm font-bold text-center text-gray-700">
                          {type === SupportType.FOOD ? t.optFood : type === SupportType.DESSERT ? t.optDessert : type === SupportType.SNACK ? t.optSnack : t.optDrink}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {t.labelItemName} <span className="text-red-500">{t.required}</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    placeholder={t.placeholderItem}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {t.labelQuantity} <span className="text-red-500">{t.required}</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder={t.placeholderQty}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{t.labelCookOnSite}</p>
                </div>
                <div className="flex space-x-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="cookOnSite"
                      value="true"
                      checked={formData.cookOnSite === true}
                      onChange={() => setFormData(prev => ({ ...prev, cookOnSite: true }))}
                      className="w-4 h-4 text-[#002B5B]"
                    />
                    <span className="ml-2 text-sm">{t.optYes}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="cookOnSite"
                      value="false"
                      checked={formData.cookOnSite === false}
                      onChange={() => setFormData(prev => ({ ...prev, cookOnSite: false }))}
                      className="w-4 h-4 text-[#002B5B]"
                    />
                    <span className="ml-2 text-sm">{t.optNo}</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4">
              <div className="p-2 bg-blue-100 text-[#002B5B] rounded-lg">
                <Layout size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#002B5B]">{t.logistics}</h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                <p className="text-[#002B5B] font-bold text-sm mb-1">{t.labelParticipationMode}</p>
                <p className="text-gray-700 text-sm">{t.optSelf}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {t.labelSetupTime}
                  </label>
                  <input
                    type="time"
                    name="setupTime"
                    min="12:00"
                    max="14:00"
                    value={formData.setupTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none bg-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">
                    {t.labelNeedTable}
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="needTable"
                        value="true"
                        checked={formData.needTable === true}
                        onChange={() => setFormData(prev => ({ ...prev, needTable: true }))}
                        className="w-4 h-4 text-[#002B5B]"
                      />
                      <span className="ml-2 text-sm">{t.optYes}</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="needTable"
                        value="false"
                        checked={formData.needTable === false}
                        onChange={() => setFormData(prev => ({ ...prev, needTable: false }))}
                        className="w-4 h-4 text-[#002B5B]"
                      />
                      <span className="ml-2 text-sm">{t.optNo}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6 border-b pb-4">
              <div className="p-2 bg-blue-100 text-[#002B5B] rounded-lg">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#002B5B]">{t.others}</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {t.labelNotes} <span className="text-gray-400 font-normal">{t.optional}</span>
              </label>
              <textarea
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#002B5B] focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>
          </section>

          <div className="flex items-start space-x-3 p-4 bg-gray-100 rounded-lg">
            <ShieldCheck className="text-gray-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-gray-500 leading-relaxed">
              {lang === 'TH' 
                ? 'ข้อมูลที่ท่านให้ไว้จะถูกใช้เพื่อวัตถุประสงค์ในการประสานงานกิจกรรมวันเด็กแห่งชาติของโรงเรียนเท่านั้น และจะเป็นความลับตามนโยบายคุ้มครองข้อมูลส่วนบุคคลของทางโรงเรียน'
                : 'The information provided will be used solely for the purpose of coordinating the National Children\'s Day activities and will be kept confidential in accordance with the school\'s privacy policy.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 bg-[#002B5B] text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003d82] transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t.submitting}</span>
              </>
            ) : (
              <span>{t.submit}</span>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default App;
