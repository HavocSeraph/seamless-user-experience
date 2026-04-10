import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DisputeResolution } from '@/components/DisputeResolution';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'users' | 'disputes'>('users');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="flex gap-4 border-b pb-2">
        <Button 
          variant={activeTab === 'users' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </Button>
        <Button 
          variant={activeTab === 'disputes' ? 'default' : 'ghost'} 
          onClick={() => setActiveTab('disputes')}
        >
          Dispute Resolution
        </Button>
      </div>

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">List of users goes here...</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'disputes' && <DisputeResolution />}
    </div>
  );
}
