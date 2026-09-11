import React, { useState } from 'react';
import {
  Stethoscope,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Languages,
  Filter,
  Search,
  CreditCard,
  Check,
  ShieldCheck,
  Award,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Consultation, Doctor, LanguageCode, User } from '../types';
import { SEED_DOCTORS } from '../data/seedData';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translations';

interface DoctorConsultationViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  onConsultationBooked: (consultation: Consultation) => void;
  onOpenAuth: () => void;
}

export const DoctorConsultationView: React.FC<DoctorConsultationViewProps> = ({
  currentUser,
  currentLanguage,
  onConsultationBooked,
  onOpenAuth,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>(SEED_DOCTORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('all');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('all');

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-08-25');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultationMode, setConsultationMode] = useState<'video' | 'audio' | 'chat'>('video');
  const [chiefComplaint, setChiefComplaint] = useState('Irregular cycles and suspected PCOS features');
  const [shareScreeningConsent, setShareScreeningConsent] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<Consultation | null>(null);

  const t = (key: string) => getTranslation(currentLanguage, key);

  // Filter Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.hospitalClinic || doc.hospitalAffiliation || '').toLowerCase().includes(searchQuery.toLowerCase());

    const docLangs = doc.languagesSpoken || doc.languages || [];
    const matchesLanguage =
      selectedLanguageFilter === 'all' || docLangs.includes(selectedLanguageFilter as any);

    const matchesSpecialty =
      selectedSpecialtyFilter === 'all' || doc.specialty.toLowerCase().includes(selectedSpecialtyFilter.toLowerCase());

    return matchesSearch && matchesLanguage && matchesSpecialty;
  });

  const handleStartBooking = (doc: Doctor) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setSelectedDoctor(doc);
    setSelectedSlot((doc.availableSlots && doc.availableSlots[0]) || '10:00 AM');
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedSlot) return;

    setIsProcessingPayment(true);

    setTimeout(() => {
      const newConsultation: Consultation = {
        id: 'cns_' + Date.now(),
        userId: currentUser?.id || 'usr_guest',
        patientName: currentUser?.fullName || 'Patient',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.fullName,
        scheduledAt: `${selectedDate}T${selectedSlot.split(' ')[0]}:00:00Z`,
        status: 'scheduled',
        mode: consultationMode,
        consultationFeeInr: selectedDoctor.consultationFeeInr,
        sharedScreeningSummary: shareScreeningConsent ? 'Level 2 Orange Screening - Delayed cycles' : undefined,
        meetingLink: `https://meet.streesure.org/cns-${Date.now().toString(36)}`,
        notes: chiefComplaint,
      };

      setIsProcessingPayment(false);
      setSelectedDoctor(null);
      setBookingSuccessModal(newConsultation);
      onConsultationBooked(newConsultation);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-bold mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{t('gynecologyNetworkBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t('gynecologyTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            {t('gynecologySubtitle')}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-teal-200 block">
            {t('subsidizedCareTag')}
          </span>
          <span className="text-2xl font-black text-white">₹149 – ₹199</span>
          <span className="text-[10px] text-teal-100 block">{t('perSessionRate')}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchDoctorPlaceholder')}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedLanguageFilter}
            onChange={(e) => setSelectedLanguageFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 cursor-pointer"
          >
            <option value="all">{t('allLanguages')}</option>
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeLabel} ({l.label})
              </option>
            ))}
          </select>

          <select
            value={selectedSpecialtyFilter}
            onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 cursor-pointer"
          >
            <option value="all">{t('allSpecialties')}</option>
            <option value="Obstetrics">{t('specObstetrics')}</option>
            <option value="Endocrinology">{t('specEndocrinology')}</option>
            <option value="Reproductive">{t('specReproductive')}</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={doc.photoUrl}
                  alt={doc.fullName}
                  className="w-16 h-16 rounded-2xl object-cover shadow-xs border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{doc.fullName}</h3>
                    {doc.isVerified && (
                      <span title={t('verifiedSpecialistBadge')}>
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-teal-700">{doc.qualifications}</p>
                  <p className="text-[11px] text-slate-500">{doc.specialty}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                {doc.bio}
              </p>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('experienceLabel')}</span>
                  <span className="font-semibold text-slate-800">{doc.yearsOfExperience} {t('yearsExperience')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('ratingLabel')}</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{doc.rating} ({doc.reviewsCount} {t('reviewsCountSuffix')})</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('languagesLabel')}</span>
                  <span className="font-medium text-slate-800 capitalize">
                    {(doc.languagesSpoken || doc.languages || []).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">{t('consultationFeeLabel')}</span>
                <span className="text-base font-extrabold text-slate-900">
                  ₹{doc.consultationFeeInr}
                </span>
              </div>

              <button
                type="button"
                id={`btn-book-doc-${doc.id}`}
                onClick={() => handleStartBooking(doc)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md shadow-teal-200 transition hover:scale-105"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('bookSlotBtn')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctor.photoUrl}
                  alt={selectedDoctor.fullName}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedDoctor.fullName}</h3>
                  <p className="text-xs text-teal-600">{selectedDoctor.qualifications}</p>
                </div>
              </div>
              <span className="text-base font-bold text-slate-900">
                ₹{selectedDoctor.consultationFeeInr}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('selectDateLabel')}</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('selectSlotLabel')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(selectedDoctor.availableSlots || ['10:00 AM', '02:00 PM', '05:00 PM']).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-xl border font-bold text-xs transition ${
                        selectedSlot === slot
                          ? 'bg-teal-50 border-teal-600 text-teal-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('consultationModeLabel')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'video', label: t('modeVideo'), icon: Video },
                    { key: 'audio', label: t('modeAudio'), icon: Phone },
                    { key: 'chat', label: t('modeChat'), icon: Clock },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setConsultationMode(m.key as any)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold ${
                          consultationMode === m.key
                            ? 'bg-teal-50 border-teal-600 text-teal-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('chiefComplaintLabel')}
                </label>
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <label className="flex items-start gap-2 p-3 rounded-xl bg-teal-50/50 border border-teal-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareScreeningConsent}
                  onChange={(e) => setShareScreeningConsent(e.target.checked)}
                  className="rounded-sm text-teal-600 focus:ring-teal-500 mt-0.5"
                />
                <span className="text-[11px] text-teal-900">
                  {t('consentScreeningLabel')}
                </span>
              </label>

              {/* Simulated UPI Payment Prototype */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>{t('cartTotalLabel')}:</span>
                  <span className="text-slate-900 text-sm">
                    ₹{selectedDoctor.consultationFeeInr}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t('subsidizedRateNote')}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  {t('btnCancel')}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-md shadow-teal-200 flex items-center gap-2 transition"
                >
                  {isProcessingPayment ? (
                    <span>{t('processingBookingText')}</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t('payAndConfirmBtn')} (₹{selectedDoctor.consultationFeeInr})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Success Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-emerald-100 space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">{t('bookingSuccessTitle')}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {t('bookingSuccessSubtitle')} ({bookingSuccessModal.doctorName})
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('appointmentTimeLabel')}:</span>
                <span className="font-bold text-slate-900">
                  {new Date(bookingSuccessModal.scheduledAt).toLocaleDateString()} at{' '}
                  {bookingSuccessModal.scheduledAt.split('T')[1].substring(0, 5)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('appointmentModeLabel')}:</span>
                <span className="font-bold text-slate-900 capitalize">
                  {bookingSuccessModal.mode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Video Link:</span>
                <a
                  href={bookingSuccessModal.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-teal-700 underline"
                >
                  {t('joinMeetingBtn')} ↗
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBookingSuccessModal(null)}
              className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              {t('doneBtn')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
