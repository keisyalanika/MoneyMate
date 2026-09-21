import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick: () => void;
}

export const AdminLayout: React.FC<Props> = ({ children, activeTab, setActiveTab, onAddClick }) => {
  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Navbar onAddClick={onAddClick} />
        <main>{children}</main>
      </div>
    </div>
  );
};
