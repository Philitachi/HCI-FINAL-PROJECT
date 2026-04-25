import { useState, useEffect } from 'react';
import useDebugLoadingGate from '../../../hooks/useDebugLoadingGate';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase';

/**
 * Custom hook to fetch applications from Firestore for the current user.
 * @param {string|null} statusFilter - Filter by status (e.g. 'Completeness Check'). 
 *   Pass null or 'all' to fetch all non-draft submitted applications.
 */
const useApplications = (statusFilter = null) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const showLoading = useDebugLoadingGate(loading);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userEmail = session.email;

    if (!userEmail) {
      setApplications([]);
      setLoading(false);
      return;
    }

    // Build Firestore query — only filter by userEmail to avoid composite index requirements
    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, where('userEmail', '==', userEmail));

    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => {
        const data = doc.data();
        // Format the createdAt timestamp
        let dateStr = '';
        let timeStr = '';
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
          timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }

        // Build a location string from address fields
        const locationParts = [
          data.fireStation,
          data.barangay,
          data.city
        ].filter(Boolean);
        const location = locationParts.join(', ') || data.address || '---';

        return {
          id: doc.id,
          title: data.establishmentName || '---',
          date: dateStr,
          time: timeStr,
          type: data.applicationType || '---',
          location: location,
          status: data.status || 'Completeness Check',
          refNo: data.referenceNumber || '---',
          occupancyType: data.occupancyType || '---',
          isActive: false,
          rawData: data
        };
      });

      // Client-side filtering: exclude drafts and completed, then filter by status
      const excludedStatuses = ['draft', 'completed', 'cancelled', 'declined'];
      let filtered = apps.filter(app => !excludedStatuses.includes(app.status.trim().toLowerCase()));

      if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter(app => app.status.trim().toLowerCase() === statusFilter.trim().toLowerCase());
      }

      // Sort by date descending (newest first)
      filtered.sort((a, b) => {
        const dateA = a.rawData?.createdAt?.toDate?.() || new Date(0);
        const dateB = b.rawData?.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setApplications(filtered);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching applications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [statusFilter]);

  return { applications, loading: showLoading };
};

export default useApplications;
