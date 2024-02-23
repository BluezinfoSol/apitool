"use client";
import { useState } from 'react';
import { Nav } from './ui/nav';
import { ChevronLeft, ChevronRight, Grid, Inbox, LayoutDashboard, MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/button';

export interface SidebarNavProps {
}

export function SidebarNav (props: SidebarNavProps) {

  const [isCollapsed, setisCollapsed] = useState<boolean>(false);

  function togleSidebar() {
    setisCollapsed(!isCollapsed);
  }
    
  return (
    <div className='relative min-w-[80px] border-r px-3 pb-10 pt-24'>
        <div className='absolute right-[-24px] top-5'>
            <Button onClick={togleSidebar} variant={'secondary'} className='rounded-full p-2 '>
                {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
        </div>
        <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Cave 1",
                label: "",
                icon: LayoutDashboard,
                variant: "default",
                href: "/cave1"
              },
              {
                title: "Cave 2",
                label: "",
                icon: LayoutDashboard,
                variant: "default",
                href: "/cave2"
              },
              {
                title: "Cave 3",
                label: "",
                icon: LayoutDashboard,
                variant: "default",
                href: "/cave3"
              },
              {
                title: "Cave 4",
                label: "",
                icon: LayoutDashboard,
                variant: "default",
                href: "/cave4"
              },
            ]}
        />
    </div>
  );
}
