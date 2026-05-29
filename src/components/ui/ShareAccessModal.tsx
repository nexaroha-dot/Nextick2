"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { getBranches, getDepartments } from "@/actions/settings";
import { getCompanyUsers } from "@/actions/users";
import { updateAccessList } from "@/actions/builder";
import { Globe, Users, Building2, Layers, Check, Search, X } from "lucide-react";

interface ShareAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  templateType: 'ticksheet' | 'form';
  initialAccessType?: string;
  initialAccessList?: {
    departments: number[];
    branches: number[];
    users: number[];
    isPublic: boolean;
  };
  onSuccess: () => void;
}

export default function ShareAccessModal({
  isOpen,
  onClose,
  templateId,
  templateType,
  initialAccessType = 'restricted',
  initialAccessList,
  onSuccess
}: ShareAccessModalProps) {
  const [accessType, setAccessType] = useState(initialAccessType);
  const [selectedDepts, setSelectedDepts] = useState<number[]>(initialAccessList?.departments || []);
  const [selectedBranches, setSelectedBranches] = useState<number[]>(initialAccessList?.branches || []);
  const [selectedUsers, setSelectedUsers] = useState<number[]>(initialAccessList?.users || []);
  const [isPublic, setIsPublic] = useState<boolean>(initialAccessList?.isPublic || false);

  const [departments, setDepartments] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'departments' | 'branches' | 'users'>('departments');

  useEffect(() => {
    if (isOpen) {
      setAccessType(initialAccessType);
      setSelectedDepts(initialAccessList?.departments || []);
      setSelectedBranches(initialAccessList?.branches || []);
      setSelectedUsers(initialAccessList?.users || []);
      setIsPublic(initialAccessList?.isPublic || false);
      fetchData();
    }
  }, [isOpen, initialAccessType, initialAccessList]);

  const fetchData = async () => {
    setIsLoading(true);
    const [dRes, bRes, uRes] = await Promise.all([
      getDepartments(),
      getBranches(),
      getCompanyUsers()
    ]);
    
    // getDepartments and getBranches return an array directly
    setDepartments(Array.isArray(dRes) ? dRes : []);
    setBranches(Array.isArray(bRes) ? bRes : []);
    
    // getCompanyUsers returns { users: any[] } | { error: string }
    if (uRes && 'users' in uRes && Array.isArray(uRes.users)) {
      setUsers(uRes.users);
    }
    
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const accessList = {
      departments: selectedDepts,
      branches: selectedBranches,
      users: selectedUsers,
      isPublic: accessType === 'public'
    };
    
    const res = await updateAccessList(templateType, templateId, accessType, accessList);
    setIsSaving(false);
    
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      alert("Failed to update access: " + res.error);
    }
  };

  const toggleSelection = (id: number, type: 'dept' | 'branch' | 'user') => {
    if (type === 'dept') {
      setSelectedDepts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else if (type === 'branch') {
      setSelectedBranches(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }
  };

  const clearAll = () => {
    setSelectedDepts([]);
    setSelectedBranches([]);
    setSelectedUsers([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Access">
      <div className="flex flex-col gap-6">
        
        {/* Access Type Toggle */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setAccessType('restricted')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              accessType === 'restricted' 
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-6 h-6 mb-2" />
            <span className="font-bold text-sm">Restricted Access</span>
            <span className="text-xs opacity-70 mt-1">Only selected internal users</span>
          </button>
          
          <button
            onClick={() => setAccessType('public')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              accessType === 'public' 
                ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-6 h-6 mb-2" />
            <span className="font-bold text-sm">Public Link</span>
            <span className="text-xs opacity-70 mt-1">Anyone with the link can fill</span>
          </button>
        </div>

        {accessType === 'public' && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-amber-800 dark:text-amber-300 text-sm">
            <strong>Warning:</strong> This form will be accessible to anyone outside your organization who has the URL. No login will be required to submit answers.
          </div>
        )}

        {accessType === 'restricted' && (
          <div className="flex flex-col h-[400px] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <button 
                onClick={() => setActiveTab('departments')}
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'departments' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Layers className="w-4 h-4" /> Departments
                {selectedDepts.length > 0 && <span className="bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-[10px]">{selectedDepts.length}</span>}
              </button>
              <button 
                onClick={() => setActiveTab('branches')}
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'branches' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Building2 className="w-4 h-4" /> Branches
                {selectedBranches.length > 0 && <span className="bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-[10px]">{selectedBranches.length}</span>}
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Users className="w-4 h-4" /> Users
                {selectedUsers.length > 0 && <span className="bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-[10px]">{selectedUsers.length}</span>}
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50 dark:bg-slate-900/50">
              {isLoading ? (
                <div className="flex justify-center items-center h-full text-slate-400">Loading...</div>
              ) : (
                <div className="space-y-1">
                  
                  {activeTab === 'departments' && departments.map(d => (
                    <div key={d.id} onClick={() => toggleSelection(d.id, 'dept')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedDepts.includes(d.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                        {selectedDepts.includes(d.id) && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{d.department}</span>
                    </div>
                  ))}

                  {activeTab === 'branches' && branches.map(b => (
                    <div key={b.id} onClick={() => toggleSelection(b.id, 'branch')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedBranches.includes(b.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                        {selectedBranches.includes(b.id) && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{b.branch}</span>
                    </div>
                  ))}

                  {activeTab === 'users' && users.map(u => (
                    <div key={u.id} onClick={() => toggleSelection(u.id, 'user')} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedUsers.includes(u.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                        {selectedUsers.includes(u.id) && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{u.name}</span>
                        <span className="text-[11px] text-slate-500">{u.role}</span>
                      </div>
                    </div>
                  ))}

                  {((activeTab === 'departments' && departments.length === 0) || 
                    (activeTab === 'branches' && branches.length === 0) || 
                    (activeTab === 'users' && users.length === 0)) && (
                    <div className="text-center p-8 text-slate-400 text-sm">No items found.</div>
                  )}

                </div>
              )}
            </div>
            
            {/* Clear All Footer */}
            {(selectedDepts.length > 0 || selectedBranches.length > 0 || selectedUsers.length > 0) && (
              <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <button onClick={clearAll} className="text-[12px] text-red-500 hover:text-red-600 font-bold px-2 py-1">
                  Clear all selections
                </button>
              </div>
            )}
            
          </div>
        )}

      </div>
      
      {/* Modal Actions */}
      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? "Saving..." : "Save Access Rules"}
        </button>
      </div>
    </Modal>
  );
}
