// app/components/vehicles/VehicleDetailPage.js
'use client';
import React from 'react';
import { formatTimestamp } from '../../lib/firebase';
import DetailPageWrapper from '../shared/DetailPageWrapper';
import DetailSection from '../shared/DetailSection';
import { Car, Link as LinkIcon } from 'lucide-react';

export default function VehicleDetailPage({ item, onBack }) {
    return (
         <DetailPageWrapper title={`${item.make} ${item.model}`} onBack={onBack}>
             <DetailSection title="Vehicle Information" icon={<Car size={20}/>}>
                <ul className="space-y-2">
                    <li><strong>Make:</strong> {item.make}</li>
                    <li><strong>Model:</strong> {item.model}</li>
                    <li><strong>Plate:</strong> {item.plate}</li>
                    <li><strong>Status:</strong> {item.status}</li>
                    <li><strong>Date Added:</strong> {formatTimestamp(item.createdAt)}</li>
                </ul>
            </DetailSection>
            <DetailSection title="Associated Cases" icon={<LinkIcon size={20}/>}>
                <p className="text-gray-400">Feature to link to cases coming soon.</p>
             </DetailSection>
        </DetailPageWrapper>
    );
};