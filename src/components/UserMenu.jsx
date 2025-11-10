import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
          <User className="w-4 h-4 mr-2" />
          {currentUser?.name || 'User'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white">
        <DropdownMenuLabel className="text-gray-900">Akun Saya</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-gray-700 hover:bg-gray-100">
          <UserCircle className="w-4 h-4 mr-2" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
