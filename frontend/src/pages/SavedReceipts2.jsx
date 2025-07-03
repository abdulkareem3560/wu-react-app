import React, {useState, useEffect, useRef} from 'react';
import {Receipt, ArrowLeft, X, Eye, FileText, Edit, Trash} from 'lucide-react';
import {Editor} from '@tinymce/tinymce-react';

// You can set your own TinyMCE API key if you want cloud features, but for local editing it's not required.

const SavedReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editorHtml, setEditorHtml] = useState('');
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // For TinyMCE, you can use a ref if you want to access the editor instance
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/receipts`);
        const data = await response.json();
        setReceipts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching receipts:', error);
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const handleReceiptClick = (receipt) => {
    setSelectedReceipt(receipt);
    setOpen(true);
  };

  const handleEditClick = (receipt, e) => {
    e.stopPropagation();
    setEditingReceipt(receipt);
    setEditorHtml(receipt.content || '');
    setEditOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedReceipt(null), 300);
  };

  const handleDeleteClick = async (receipt, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${receipt.name}"?`)) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/receipts/delete`,
        {
          method: 'POST', // or 'DELETE' if your backend supports it
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({name: receipt.name}),
        }
      );
      if (!response.ok) throw new Error('Failed to delete receipt');
      setReceipts(prev => prev.filter(r => r.name !== receipt.name));
      if (selectedReceipt && selectedReceipt.name === receipt.name) setSelectedReceipt(null);
      alert(`Receipt "${receipt.name}" deleted successfully.`);
    } catch (error) {
      console.error('Error deleting receipt:', error);
      alert('Failed to delete receipt.');
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setTimeout(() => {
      setEditingReceipt(null);
      setEditorHtml('');
    }, 300);
  };

  const getNextVersion = (originalName) => {
    const baseName = originalName.split('.')[0].split('_v')[0];
    const existingVersions = receipts
      .map(receipt => receipt.name.split('.')[0])
      .filter(name => name.startsWith(baseName))
      .map(name => {
        const versionMatch = name.match(/_v(\d+)$/);
        return versionMatch ? parseInt(versionMatch[1]) : 1;
      });

    const nextVersion = existingVersions.length > 0 ? Math.max(...existingVersions) + 1 : 2;
    return `${baseName}_v${nextVersion}`;
  };

  const handleSaveEdit = async () => {
    try {
      // Get HTML from TinyMCE editor
      const htmlContent = editorRef.current ? editorRef.current.getContent() : editorHtml;

      const newReceiptName = getNextVersion(editingReceipt.name);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/receipts/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newReceiptName,
          html: htmlContent
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (response.ok) {
        const savedReceipt = {
          name: newReceiptName,
          content: htmlContent,
          originalName: editingReceipt.name.split('_v')[0].split('.')[0],
          createdAt: new Date().toISOString()
        };

        setReceipts(prev => [savedReceipt, ...prev]);
        handleEditClose();
        alert(`Receipt ${newReceiptName} saved successfully!`);
      } else {
        throw new Error('Failed to save receipt');
      }
    } catch (error) {
      console.error('Error saving edited receipt:', error);
      alert('Failed to save receipt.');
    }
  };

  // Styles (unchanged)
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '24px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
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
      padding: '12px',
      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      borderRadius: '12px',
      color: 'white'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      margin: '4px 0 0 0'
    },
    backButton: {
      border: "1.5px solid #006aff",
      background: "transparent",
      color: "#006aff",
      fontWeight: "600",
      fontSize: "14px",
      borderRadius: "20px",
      padding: "6px 16px",
      textDecoration: "none",
      cursor: "pointer",
      display: "flex",
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    cardHovered: {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      borderColor: '#3b82f6'
    },
    cardContent: {
      position: 'relative'
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
    actionIcons: {
      display: 'flex',
      gap: '8px',
      transition: 'opacity 0.3s ease'
    },
    actionIconsHidden: {
      opacity: 0,
      visibility: 'hidden'
    },
    actionIconsVisible: {
      opacity: 1,
      visibility: 'visible'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 12px 0'
    },
    cardFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '16px'
    },
    cardFooterText: {
      fontSize: '14px',
      color: '#64748b'
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
      backdropFilter: 'blur(4px)'
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '80vh',
      overflow: 'auto',
      position: 'relative'
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    closeButton: {
      padding: '8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#64748b',
      transition: 'all 0.2s ease'
    },
    editModal: {
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
      backdropFilter: 'blur(4px)'
    },
    editModalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      width: '95%',
      maxWidth: '1000px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative'
    },
    editorContainer: {
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      minHeight: '400px',
      marginBottom: '24px',
      overflow: 'hidden'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      paddingTop: '16px',
      borderTop: '1px solid #e2e8f0'
    },
    saveButton: {
      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    saveButtonHover: {
      // transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
    },
    cancelButton: {
      background: 'transparent',
      color: '#6b7280',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '12px 24px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    loadingCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0'
    },
    loadingBar: {
      height: '20px',
      background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
      borderRadius: '4px',
      marginBottom: '12px',
      animation: 'pulse 2s ease-in-out infinite'
    },
    loadingBarSmall: {
      height: '16px',
      background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
      borderRadius: '4px',
      marginBottom: '8px',
      width: '60%',
      animation: 'pulse 2s ease-in-out infinite'
    },
    loadingBarMedium: {
      height: '16px',
      background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
      borderRadius: '4px',
      width: '80%',
      animation: 'pulse 2s ease-in-out infinite'
    },
    emptyState: {
      textAlign: 'center',
      padding: '64px 24px'
    },
    emptyIcon: {
      marginBottom: '24px'
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px'
    },
    emptyText: {
      fontSize: '16px',
      color: '#64748b',
      maxWidth: '400px',
      margin: '0 auto'
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .tox-tinymce {
          border-radius: 12px !important;
        }
        .tox-promotion,
        .tox-promotion-button,
        .tox-statusbar__upgrade {
          display: none !important;
        }
        .actionIcon {
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .actionIcon:hover {
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>

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
                  style={{
                    ...styles.card,
                    ...(hoveredCard === index ? styles.cardHovered : {})
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleReceiptClick(receipt)}
                >
                  <div style={styles.cardContent}>
                    <div style={styles.cardTop}>
                      <div style={styles.cardIcon}>
                        <FileText size={24} color="#3b82f6"/>
                      </div>
                      <div
                        style={{
                          ...styles.actionIcons,
                          ...(hoveredCard === index ? styles.actionIconsVisible : styles.actionIconsHidden)
                        }}
                      >
                        <div
                          className="actionIcon"
                          style={styles.actionIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReceiptClick(receipt);
                          }}
                          title="View Receipt"
                        >
                          <Eye size={16} color="#6b7280"/>
                        </div>
                        <div
                          className="actionIcon"
                          style={styles.actionIcon}
                          onClick={(e) => handleEditClick(receipt, e)}
                          title="Edit Receipt"
                        >
                          <Edit size={16} color="#6b7280"/>
                        </div>
                        <div
                          className="actionIcon"
                          style={styles.actionIcon}
                          onClick={(e) => handleDeleteClick(receipt, e)}
                          title="Delete Receipt"
                        >
                          <Trash size={16} color="#ef4444"/>
                        </div>
                      </div>
                    </div>

                    <h3 style={styles.cardTitle}>
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

        {/* View Modal */}
        {open && (
          <div style={styles.modal} onClick={handleClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {selectedReceipt?.name || 'Receipt Details'}
                </h2>
                <button style={styles.closeButton} onClick={handleClose}>
                  <X size={20}/>
                </button>
              </div>
              {selectedReceipt && (
                <div style={{width: "277px", margin: "0 auto"}}
                     dangerouslySetInnerHTML={{__html: selectedReceipt.content}}/>
              )}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editOpen && (
          <div style={styles.editModal} onClick={handleEditClose}>
            <div style={styles.editModalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  Edit Receipt: {editingReceipt?.name.split('.')[0]}
                </h2>
                <button style={styles.closeButton} onClick={handleEditClose}>
                  <X size={20}/>
                </button>
              </div>

              <div style={styles.editorContainer}>
                <Editor

                  apiKey="yvxhm1ix3qy7xh8xrwcz8ry91sf4xzv7yn17b56np83iiey0" // Optional: add your TinyMCE API key for cloud features
                  onInit={(evt, editor) => editorRef.current = editor}
                  value={editorHtml}
                  onEditorChange={setEditorHtml}
                  init={{
                    branding: false,
                    statusbar: false,
                    promotion: false,
                    height: 400,
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | ' +
                      'bold italic underline backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help | fontsizeselect fontselect',
                    font_size_formats: '8px 9px 10px 11px 12px 14px 16px 18px 20px 24px 28px 32px 36px',
                    font_family_formats:
                      'Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Times New Roman=times new roman,times; Helvetica=helvetica; Sans Serif=sans-serif;',
                    content_style: 'body { font-family:Arial,Helvetica,sans-serif; font-size:10px }'
                  }}
                />
              </div>

              <div style={styles.buttonContainer}>
                <button
                  style={styles.saveButton}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.saveButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, styles.saveButton)}
                  onClick={handleSaveEdit}
                >
                  Save as New Version
                </button>
                <button
                  style={styles.cancelButton}
                  onClick={handleEditClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SavedReceipts;
