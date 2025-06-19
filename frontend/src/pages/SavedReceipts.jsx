import React, {useState, useEffect} from 'react';
import {Receipt, ArrowLeft, X, Eye, FileText} from 'lucide-react';

const SavedReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/saved-receipts`);

        const data = await response.json();
        setReceipts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching receipts:', error);
      }
    };

    fetchReceipts();
  }, []);

  const handleReceiptClick = (receipt) => {
    setSelectedReceipt(receipt);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedReceipt(null), 300);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    iconContainer: {
      padding: '8px',
      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      borderRadius: '12px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #1f2937, #6b7280)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '4px 0 0 0'
    },
    backButton: {
      display: 'flex',
      border: "1.5px solid #006aff",
      background: "transparent",
      color: "#006aff",
      fontWeight: "600",
      fontSize: "14px",
      borderRadius: "20px",
      padding: "6px 16px",
      textDecoration: "none",
      cursor: "pointer",
    },
    backButtonHover: {
      background: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px'
    },
    loadingCard: {
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '16px',
      padding: '24px',
      animation: 'pulse 2s infinite'
    },
    loadingBar: {
      height: '16px',
      background: '#e5e7eb',
      borderRadius: '4px',
      marginBottom: '16px'
    },
    loadingBarSmall: {
      height: '12px',
      background: '#e5e7eb',
      borderRadius: '4px',
      marginBottom: '8px'
    },
    loadingBarMedium: {
      height: '12px',
      background: '#e5e7eb',
      borderRadius: '4px',
      width: '66%'
    },
    emptyState: {
      textAlign: 'center',
      padding: '64px 0'
    },
    emptyIcon: {
      width: '96px',
      height: '96px',
      background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px'
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0 0 12px 0'
    },
    emptyText: {
      color: '#6b7280',
      maxWidth: '400px',
      margin: '0 auto'
    },
    card: {
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      overflow: 'hidden'
    },
    cardHover: {
      background: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)',
      transform: 'translateY(-8px)',
      borderColor: 'rgba(147, 197, 253, 0.5)'
    },
    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))',
      borderRadius: '16px',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    cardContent: {
      position: 'relative',
      zIndex: 10
    },
    cardTop: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    cardIcon: {
      padding: '12px',
      background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    },
    cardIconHover: {
      background: 'linear-gradient(135deg, #bfdbfe, #c7d2fe)'
    },
    eyeIcon: {
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    eyeIconVisible: {
      opacity: 1
    },
    cardTitle: {
      fontWeight: '600',
      color: '#1f2937',
      margin: '0 0 12px 0',
      transition: 'color 0.3s ease'
    },
    cardTitleHover: {
      color: '#1e3a8a'
    },
    cardMeta: {
      marginBottom: '16px'
    },
    cardDate: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px',
      gap: '8px'
    },
    cardAmount: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    cardFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    cardFooterText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      background: '#10b981',
      borderRadius: '50%'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      animation: open ? 'fadeIn 0.3s ease' : 'fadeOut 0.3s ease'
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '80vh',
      overflow: 'auto',
      position: 'relative',
      animation: open ? 'slideIn 0.3s ease' : 'slideOut 0.3s ease'
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e5e7eb'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0
    },
    closeButton: {
      padding: '8px',
      background: '#f3f4f6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    closeButtonHover: {
      background: '#e5e7eb',
      transform: 'scale(1.1)'
    }
  };

  // Add keyframes for animations
  const keyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideIn {
      from { transform: scale(0.95) translateY(20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: scale(1) translateY(0); opacity: 1; }
      to { transform: scale(0.95) translateY(20px); opacity: 0; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
              <div style={styles.iconContainer}>
                <Receipt size={24}/>
              </div>
              <div>
                <h1 style={styles.title}>Saved Receipts</h1>
                <p style={styles.subtitle}>{receipts.length} receipts saved</p>
              </div>
            </div>
            <button
              style={styles.backButton}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.backButtonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.backButton)}
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft size={16}/>
              Back to Home
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {loading ? (
            <div style={styles.grid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={styles.loadingCard}>
                  <div style={styles.loadingBar}></div>
                  <div style={styles.loadingBarSmall}></div>
                  <div style={styles.loadingBarMedium}></div>
                </div>
              ))}
            </div>
          ) : receipts.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Receipt size={48} color="#9ca3af"/>
              </div>
              <h3 style={styles.emptyTitle}>No receipts saved yet</h3>
              <p style={styles.emptyText}>
                Start saving your receipts to see them here. All your important documents in one place.
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {receipts.map((receipt, index) => (
                <div
                  key={index}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.cardHover);
                    const overlay = e.currentTarget.querySelector('.card-overlay');
                    const eyeIcon = e.currentTarget.querySelector('.eye-icon');
                    const cardIcon = e.currentTarget.querySelector('.card-icon');
                    const cardTitle = e.currentTarget.querySelector('.card-title');
                    if (overlay) overlay.style.opacity = '1';
                    if (eyeIcon) eyeIcon.style.opacity = '1';
                    if (cardIcon) Object.assign(cardIcon.style, styles.cardIconHover);
                    if (cardTitle) Object.assign(cardTitle.style, styles.cardTitleHover);
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, styles.card);
                    const overlay = e.currentTarget.querySelector('.card-overlay');
                    const eyeIcon = e.currentTarget.querySelector('.eye-icon');
                    const cardIcon = e.currentTarget.querySelector('.card-icon');
                    const cardTitle = e.currentTarget.querySelector('.card-title');
                    if (overlay) overlay.style.opacity = '0';
                    if (eyeIcon) eyeIcon.style.opacity = '0';
                    if (cardIcon) Object.assign(cardIcon.style, styles.cardIcon);
                    if (cardTitle) Object.assign(cardTitle.style, styles.cardTitle);
                  }}
                  onClick={() => handleReceiptClick(receipt)}
                >
                  <div className="card-overlay" style={styles.cardOverlay}></div>

                  <div style={styles.cardContent}>
                    <div style={styles.cardTop}>
                      <div className="card-icon" style={styles.cardIcon}>
                        <FileText size={24} color="#3b82f6"/>
                      </div>
                      <div className="eye-icon" style={styles.eyeIcon}>
                        <Eye size={20} color="#9ca3af"/>
                      </div>
                    </div>

                    <h3 className="card-title" style={styles.cardTitle}>
                      {receipt.name.split(".")[0]}
                    </h3>

                    <div style={styles.cardFooter}>
                      <span style={styles.cardFooterText}>Click to view</span>
                      <div style={styles.statusDot}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {open && (
          <div style={styles.modal} onClick={handleClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {selectedReceipt?.name || 'Receipt Details'}
                </h2>
                <button
                  style={styles.closeButton}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.closeButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, styles.closeButton)}
                  onClick={handleClose}
                >
                  <X size={20}/>
                </button>
              </div>
              {selectedReceipt && (
                <div dangerouslySetInnerHTML={{__html: selectedReceipt.content}}/>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SavedReceipts;