import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Dispute {
  id: string;
  title: string;
  status: 'pending' | 'resolved';
}

export function DisputeResolution() {
  const [disputes, setDisputes] = useState<Dispute[]>([
    { id: '1', title: 'Payment issue for design gig', status: 'pending' },
    { id: '2', title: 'Work not delivered', status: 'pending' },
  ]);

  const resolveDispute = (id: string) => {
    setDisputes(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'resolved' } : d
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Disputes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {disputes.length === 0 ? (
          <p className="text-gray-500">No active disputes.</p>
        ) : (
          disputes.map(dispute => (
            <div key={dispute.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{dispute.title}</h3>
                <span className={`text-sm ${dispute.status === 'resolved' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {dispute.status.toUpperCase()}
                </span>
              </div>
              {dispute.status === 'pending' && (
                <Button onClick={() => resolveDispute(dispute.id)} variant="outline">
                  Mark Resolved
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
