// app/components/people/PersonDetailPage.js
'use client';
import React from 'react';
import { formatTimestamp } from '../../lib/firebase';
import DetailPageWrapper from '../shared/DetailPageWrapper';
import DetailSection from '../shared/DetailSection';
import { User, Info, Link as LinkIcon } from 'lucide-react';

export default function PersonDetailPage({ item, onBack }) {
    return (
        <DetailPageWrapper title={`${item.firstName} ${item.lastName}`} onBack={onBack}>
            <DetailSection title="Profile Information" icon={<User size={20}/>}>
                <ul className="space-y-2">
                    <li><strong>Name:</strong> {item.firstName} {item.lastName}</li>
                    <li><strong>Type:</strong> {item.type}</li>
                    <li><strong>Date Added:</strong> {formatTimestamp(item.createdAt)}</li>
                </ul>
            </DetailSection>
            {item.notes && (
                <DetailSection title="Notes" icon={<Info size={20}/>}>
                    <p className="text-gray-300 whitespace-pre-wrap">{item.notes}</p>
                </DetailSection>
            )}
             <DetailSection title="Associated Cases" icon={<LinkIcon size={20}/>}>
                <p className="text-gray-400">Feature to link to cases coming soon.</p>
             </DetailSection>
        </DetailPageWrapper>
    );
};