'use client';

import Navigation from './Navigation';

interface SidebarProps {
  currentPage?: string;
}

export default function Sidebar({ currentPage }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 glass-effect border-r border-white/20 flex flex-col p-4 animate-enter" style={{animationDelay: '50ms'}}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <svg className="text-white" fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c-.5-.1-.96.3-.96.8v2.2c0 .4.3.7.7.7c2.5 0 4.6 2.1 4.6 4.6s-2.1 4.6-4.6 4.6-4.6-2.1-4.6-4.6c0-.2 0-.4.1-.6"></path>
          <path d="m9.5 2.84c.2-.08.4-.14.6-.2"></path>
          <path d="M4.91 4.91a9.94 9.94 0 0 0-1.07 7.09c0 .2 0 .4.1.6"></path>
          <path d="M14.5 21.16c-.2.08-.4.14-.6.2"></path>
          <path d="M19.09 19.09a9.94 9.94 0 0 0 1.07-7.09c0-.2 0-.4-.1-.6"></path>
          <path d="m14.2 12.4-1.7 1.7-1.7-1.7-1.7 1.7-1.7-1.7"></path>
        </svg>
        <span className="text-xl font-bold text-white">STITCH</span>
      </div>
      
      <Navigation currentPage={currentPage} />
      
      <div className="mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
          <img alt="User" className="rounded-full size-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpupqkQmJxj_bMedSJmdAMWAHtS4edFiDkEWKHBmAFfhZ2RalJfO4fbMsDLiDQv9tBLe_qigHPr43hW5r7R0IAjqubzylinVsDC6UiIaaZKxP_GB46wGzu9EKfsxbe3LBt2vlyuDda0sn0iAihGn3LWmfmyzfYo6RWHvuLZAbFif5z6UU82dCwZc1hRCtPGTqUxsDPZTnanT8FaW-vTZbkZcq61oMHucloUn5JYvX_cD0gTyMwU5wpp7tQti-TrSN8pgWdkW_ccoE"/>
          <div>
            <p className="font-semibold text-sm text-white">Olivia Martin</p>
            <p className="text-xs text-white/60">olivia.martin@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
