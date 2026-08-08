import { useState, useEffect } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { StatsDashboard } from './components/StatsDashboard';
import { UrlInput } from './components/UrlInput';
import { UrlList } from './components/UrlList';
import type { UrlItemType } from './components/UrlList';
import { EditModal } from './components/EditModal';
import { NotificationContainer } from './components/Notification';
import type { ToastMessage } from './components/Notification';

//中央 API configuration from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
// Direct redirects are served at the backend root (e.g., http://localhost:3000)
const REDIRECT_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '') || 'http://localhost:3000';

function App() {
  const [links, setLinks] = useState<UrlItemType[]>(() => {
    const saved = localStorage.getItem('shortened_urls');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [editingLink, setEditingLink] = useState<UrlItemType | null>(null);

  // Add notification toast
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString().substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync click stats from the backend when the app mounts
  useEffect(() => {
    const fetchLatestStats = async () => {
      const saved = localStorage.getItem('shortened_urls');
      const currentLinks: UrlItemType[] = saved ? JSON.parse(saved) : [];
      
      if (currentLinks.length === 0) return;
      
      const updatedLinks = await Promise.all(
        currentLinks.map(async (link) => {
          try {
            const res = await fetch(`${API_BASE_URL}/urls/${link.shortCode}/stats`);
            if (res.ok) {
              const data = await res.json();
              return {
                ...link,
                url: data.url ?? link.url,
                accessCount: data.accessCount ?? 0,
                updatedAt: data.updatedAt ?? link.updatedAt,
              };
            }
          } catch (e) {
            console.error(`Failed to fetch stats for ${link.shortCode}:`, e);
          }
          return link;
        })
      );
      
      setLinks(updatedLinks);
      localStorage.setItem('shortened_urls', JSON.stringify(updatedLinks));
    };

    fetchLatestStats();
  }, []);

  // Update links locally and in localStorage
  const updateLinksState = (newLinks: UrlItemType[]) => {
    setLinks(newLinks);
    localStorage.setItem('shortened_urls', JSON.stringify(newLinks));
  };

  // 1. CREATE short link
  const handleShorten = async (originalUrl: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: originalUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to shorten URL');
      }

      const data = await res.json();
      const newLink: UrlItemType = {
        id: data.id,
        url: data.url,
        shortCode: data.shortCode,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        accessCount: 0,
      };

      updateLinksState([newLink, ...links]);
      addToast('success', 'URL shortened successfully!');
    } catch (err: any) {
      console.error(err);
      addToast('error', err.message || 'Server error. Failed to shorten URL.');
      throw err;
    }
  };

  // 2. UPDATE short link destination URL
  const handleSaveEdit = async (shortCode: string, newUrl: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/urls/${shortCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update URL');
      }

      const data = await res.json();
      const updated = links.map((link) => {
        if (link.shortCode === shortCode) {
          return {
            ...link,
            url: data.url,
            updatedAt: data.updatedAt,
          };
        }
        return link;
      });

      updateLinksState(updated);
      addToast('success', `Redirect URL for /${shortCode} updated successfully!`);
    } catch (err: any) {
      console.error(err);
      addToast('error', err.message || 'Failed to update link destination.');
      throw err;
    }
  };

  // 3. DELETE short link
  const handleDelete = async (shortCode: string) => {
    if (!window.confirm(`Are you sure you want to delete the short link /${shortCode}?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/urls/${shortCode}`, {
        method: 'DELETE',
      });

      if (!res.ok && res.status !== 404) {
        throw new Error('Failed to delete URL from backend server');
      }

      const updated = links.filter((link) => link.shortCode !== shortCode);
      updateLinksState(updated);
      addToast('success', `Short link /${shortCode} deleted successfully.`);
    } catch (err: any) {
      console.error(err);
      addToast('error', err.message || 'Failed to delete link.');
    }
  };

  // Compute stats metrics
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.accessCount ?? 0), 0);
  
  // Find most active link
  let mostActiveCode: string | null = null;
  let mostActiveClicks = 0;
  
  links.forEach((link) => {
    const clicks = link.accessCount ?? 0;
    if (clicks > mostActiveClicks) {
      mostActiveClicks = clicks;
      mostActiveCode = link.shortCode;
    }
  });

  return (
    <>
      {/* Navigation Header */}
      <Navbar />

      {/* Main Body */}
      <main className="app-main">
        {/* Welcome Section */}
        <Hero />

        {/* Input Form Section */}
        <UrlInput onShorten={handleShorten} addToast={addToast} />

        {/* Recent Links Dashboard Table */}
        <UrlList
          items={links}
          onEdit={setEditingLink}
          onDelete={handleDelete}
          addToast={addToast}
          redirectBaseUrl={REDIRECT_BASE_URL}
        />

        {/* Analytics Widgets Section */}
        <StatsDashboard
          totalLinks={totalLinks}
          totalClicks={totalClicks}
          mostActiveCode={mostActiveCode}
          mostActiveClicks={mostActiveClicks}
        />
      </main>

      {/* Footer Info */}
      <Footer />

      {/* Overlays and Toasts */}
      <EditModal
        isOpen={editingLink !== null}
        shortCode={editingLink?.shortCode || ''}
        currentUrl={editingLink?.url || ''}
        onClose={() => setEditingLink(null)}
        onSave={handleSaveEdit}
        addToast={addToast}
      />

      <NotificationContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}

export default App;
