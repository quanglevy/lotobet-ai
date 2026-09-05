import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical React Error Caught by Boundary:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('lotobet_data');
    } catch(e) {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0b0e1d',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '10px' }}>⚠️ Ứng dụng gặp sự cố dữ liệu</h1>
          <p style={{ color: '#9ca3af', maxWidth: '400px', marginBottom: '20px', fontSize: '0.9rem' }}>
            Hệ thống phát hiện dữ liệu nhập trước đó chưa chuẩn hoặc bị gián đoạn. Bấm nút dưới đây để khôi phục và tiếp tục sử dụng ngay:
          </p>
          <button
            onClick={this.handleReset}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}
          >
            🔄 KHÔI PHỤC & TẢI LẠI TRANG
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

