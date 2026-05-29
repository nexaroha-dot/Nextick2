"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, CheckCircle2, Loader2, MapPin, Image as ImageIcon, Video, Calendar, Clock, AlertCircle } from 'lucide-react';
import { submitResponse } from '@/actions/fill';
import Link from 'next/link';

export default function FillClient({ template, type }: { template: any; type: "ticksheet" | "form" }) {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationLoading, setLocationLoading] = useState<Record<string, boolean>>({});

  const schema = Array.isArray(template.schema) ? template.schema : [];
  // Sort nodes vertically based on y position so form makes sense
  const nodes = [...schema].sort((a, b) => a.position.y - b.position.y);

  const handleInputChange = (nodeId: string, value: any) => {
    setResponses(prev => ({ ...prev, [nodeId]: value }));
    // Clear error
    if (errors[nodeId]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[nodeId];
        return newErr;
      });
    }
  };

  const handleMultiOptionToggle = (nodeId: string, optionLabel: string) => {
    setResponses(prev => {
      const current = prev[nodeId] || [];
      const newValues = current.includes(optionLabel)
        ? current.filter((v: string) => v !== optionLabel)
        : [...current, optionLabel];
      return { ...prev, [nodeId]: newValues };
    });
    if (errors[nodeId]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[nodeId];
        return newErr;
      });
    }
  };

  const handleGetLocation = (nodeId: string) => {
    setLocationLoading(prev => ({ ...prev, [nodeId]: true }));
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLocationLoading(prev => ({ ...prev, [nodeId]: false }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const val = `${position.coords.latitude}, ${position.coords.longitude}`;
        handleInputChange(nodeId, val);
        setLocationLoading(prev => ({ ...prev, [nodeId]: false }));
      },
      (error) => {
        alert('Unable to retrieve your location');
        setLocationLoading(prev => ({ ...prev, [nodeId]: false }));
      }
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    nodes.forEach(node => {
      if (node.data?.required) {
        const val = responses[node.id];
        if (val === undefined || val === null || val === '') {
          newErrors[node.id] = 'This field is required';
          isValid = false;
        }
        if (node.data.type === 'Multiple Option' && Array.isArray(val) && val.length === 0) {
          newErrors[node.id] = 'Please select at least one option';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const result = await submitResponse(type, template.id, responses);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      alert(result.error || "Something went wrong while submitting.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-3">Submitted!</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Your responses have been securely saved.</p>
          <Link href={`/${type === 'ticksheet' ? 'tick-sheet' : 'forms'}`}
            className="w-full inline-flex items-center justify-center py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-xl transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center gap-4">
        <Link href={`/${type === 'ticksheet' ? 'tick-sheet' : 'forms'}`} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white truncate">{template.title}</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Response Form</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl w-full mx-auto p-4 md:p-8 space-y-6 pb-32">
        {nodes.length === 0 ? (
          <div className="text-center py-20 text-slate-400">This form has no questions configured.</div>
        ) : (
          nodes.map((node: any, idx: number) => {
            const data = node.data;
            const qType = data.type || 'Short Text';
            const val = responses[node.id] || '';
            const error = errors[node.id];

            return (
              <div key={node.id} className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 md:p-6 transition-colors shadow-sm ${error ? 'border-red-300 dark:border-red-900/50 bg-red-50/30' : 'border-slate-200 dark:border-slate-700'}`}>
                
                {/* Question Label */}
                <label className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 shrink-0 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center text-[11px] font-extrabold mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {data.label || 'Untitled Question'}
                    </span>
                    {data.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                    {data.description && (
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">{data.description}</p>
                    )}
                  </div>
                </label>

                {/* Input Area */}
                <div className="ml-9">
                  {qType === 'Short Text' && (
                    <input type="text" value={val} onChange={(e) => handleInputChange(node.id, e.target.value)} 
                      className={`w-full p-3 rounded-xl border text-sm font-medium focus:ring-2 focus:outline-none transition-all ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/30'} dark:text-white`}
                      placeholder="Type your answer here..."
                    />
                  )}

                  {qType === 'Number' && (
                    <input type="number" value={val} onChange={(e) => handleInputChange(node.id, e.target.value)} 
                      className={`w-full p-3 rounded-xl border text-sm font-medium focus:ring-2 focus:outline-none transition-all ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/30'} dark:text-white`}
                      placeholder="Enter a number..."
                    />
                  )}

                  {qType === 'Long Text' && (
                    <textarea value={val} onChange={(e) => handleInputChange(node.id, e.target.value)} rows={4}
                      className={`w-full p-3 rounded-xl border text-sm font-medium focus:ring-2 focus:outline-none transition-all resize-none ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/30'} dark:text-white`}
                      placeholder="Type your detailed answer here..."
                    />
                  )}

                  {qType === 'Dropdown' && (
                    <select value={val} onChange={(e) => handleInputChange(node.id, e.target.value)}
                      className={`w-full p-3 rounded-xl border text-sm font-medium focus:ring-2 focus:outline-none transition-all ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/30'} dark:text-white appearance-none`}>
                      <option value="" disabled>Select an option...</option>
                      {(data.options || []).map((opt: any) => (
                        <option key={opt.id} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                  )}

                  {qType === 'Multiple Option' && (
                    <div className="flex flex-col gap-2">
                      {(data.options || []).map((opt: any) => {
                        const isChecked = Array.isArray(val) && val.includes(opt.label);
                        return (
                          <label key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                            <input type="checkbox" checked={isChecked} onChange={() => handleMultiOptionToggle(node.id, opt.label)}
                              className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {(qType === 'Date' || qType === 'Date & Time' || qType === 'Time') && (
                    <div className="relative">
                      {qType === 'Time' ? <Clock className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" /> : <Calendar className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />}
                      <input 
                        type={qType === 'Date' ? 'date' : qType === 'Time' ? 'time' : 'datetime-local'} 
                        value={val} onChange={(e) => handleInputChange(node.id, e.target.value)} 
                        className={`w-full p-3 pl-10 rounded-xl border text-sm font-medium focus:ring-2 focus:outline-none transition-all ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/30'} dark:text-white`}
                      />
                    </div>
                  )}

                  {qType === 'Location' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input type="text" readOnly value={val} placeholder="Location coordinates will appear here"
                          className={`flex-1 p-3 rounded-xl border text-sm font-medium focus:outline-none bg-slate-100 dark:bg-slate-800 dark:text-slate-400 ${error ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'}`} />
                        <button type="button" onClick={() => handleGetLocation(node.id)} disabled={locationLoading[node.id]}
                          className="px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold rounded-xl flex items-center gap-2 hover:bg-blue-200 transition-colors disabled:opacity-50">
                          {locationLoading[node.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                          Get Location
                        </button>
                      </div>
                    </div>
                  )}

                  {(qType === 'Image Attach' || qType === 'Video Attach') && (
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/50">
                      {qType === 'Image Attach' ? <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-400" /> : <Video className="w-8 h-8 mx-auto mb-2 text-slate-400" />}
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">File Upload Pending Setup</p>
                      <p className="text-[11px] text-slate-500">Storage bucket integration is planned for later. This field is disabled for the MVP.</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-1.5 mt-2 text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">{error}</span>
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Submit Action */}
      {nodes.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto flex justify-end">
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-5 h-5" /> Submit Response</>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
