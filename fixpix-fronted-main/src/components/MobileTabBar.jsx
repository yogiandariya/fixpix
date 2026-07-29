import React from 'react';
import { Edit3 as EditIcon, LayoutGrid as AppsIcon, Folder as FolderIcon } from 'lucide-react';

export default function MobileTabBar({ activeTab, onTabChange, onToolsOpen }) {
  return (
    <div className="mobile-tab-bar">
      <button 
        className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
        onClick={() => onTabChange('edit')}
      >
        <EditIcon size={20} />
        <span>Edit</span>
      </button>
      
      <button 
        className="tab-btn tools-btn"
        onClick={onToolsOpen}
      >
        <div className="tools-fab">
          <AppsIcon size={22} />
        </div>
        <span>Tools</span>
      </button>
      
      <button 
        className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
        onClick={() => onTabChange('projects')}
      >
        <FolderIcon size={20} />
        <span>Projects</span>
      </button>
    </div>
  )
}
