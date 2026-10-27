/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx'

// Logo SVG (FDnet style â€” inline so no external file needed)
export const FDnetLogo = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="52" height="52" rx="10" fill="white"/>
    <rect x="1" y="1" width="50" height="50" rx="9" stroke="#e53e3e" stroke-width="2"/>
    {/* F letter */}
    <text x="5" y="32" font-family="Arial Black, sans-serif" font-size="22" font-weight="900" fill="#e53e3e">FD</text>
    {/* net below */}
    <text x="5" y="44" font-family="Arial, sans-serif" font-size="9" font-weight="700" fill="#1a202c">net</text>
    {/* rays on right */}
    <line x1="36" y1="26" x2="50" y2="10" stroke="#e53e3e" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="36" y1="26" x2="50" y2="18" stroke="#e53e3e" stroke-width="2" stroke-linecap="round"/>
    <line x1="36" y1="26" x2="50" y2="26" stroke="#e53e3e" stroke-width="2" stroke-linecap="round"/>
    <line x1="36" y1="26" x2="48" y2="34" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="36" y1="26" x2="44" y2="40" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
)

export const Layout: FC<{ title?: string }> = ({ children, title }) => (
  <html lang="th">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title || 'FDnet Â· à¸£à¸°à¸šà¸šà¸‚à¸­à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¹‚à¸—à¸£à¸¨à¸±à¸žà¸—à¹Œà¸ à¸²à¸¢à¹ƒà¸™'}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red:         #ef4444;
          --red-dark:    #dc2626;
          --red-pale:    #fef2f2;
          --primary:     #3b82f6;
          --primary-dk:  #1d4ed8;
          --primary-pale:#eff6ff;
          --accent:      #8b5cf6;
          --accent-pale: #f5f3ff;
          --text:        #0f172a;
          --text-muted:  #475569;
          --text-light:  #94a3b8;
          --bg:          #f8fafc;
          --surface:     #ffffff;
          --border:      #e2e8f0;
          --border-focus:#93c5fd;
          --success:     #10b981;
          --success-bg:  #ecfdf5;
          --warn:        #f59e0b;
          --warn-bg:     #fffbeb;
          --danger:      #ef4444;
          --danger-bg:   #fef2f2;
          --r-sm: 8px; --r-md: 14px; --r-lg: 20px; --r-xl: 28px;
          --sh-sm: 0 1px 3px rgba(15,23,42,.05);
          --sh-md: 0 4px 20px -2px rgba(15,23,42,.07), 0 2px 6px -1px rgba(15,23,42,.04);
          --sh-lg: 0 20px 40px -4px rgba(15,23,42,.08), 0 8px 16px -4px rgba(15,23,42,.04);
        }

        html { font-family:'Sarabun',sans-serif; font-size:16px; background:var(--bg); color:var(--text); }

        body {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center;
          padding: 36px 16px 56px;
          background-color: #f1f5f9;
          background-image:
            radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.28) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.28) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.25) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(245, 158, 11, 0.22) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.16) 0px, transparent 55%),
            linear-gradient(135deg, #f8fafc 0%, #edf2f7 50%, #e2e8f0 100%);
          background-attachment: fixed;
          background-size: 100% 100%;
        }

        /* â”€â”€ Topbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .topbar {
          width:100%; max-width:920px;
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:28px;
          padding:16px 22px;
          background:rgba(255,255,255,.92);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,.85);
          border-radius:var(--r-lg);
          box-shadow:0 10px 25px -5px rgba(15,23,42,.06);
        }
        .topbar-brand { display:flex; align-items:center; gap:14px; }
        .topbar-name { font-size:1.05rem; font-weight:800; color:var(--text); letter-spacing:-.01em; }
        .topbar-sub { font-size:.76rem; color:var(--text-light); margin-top:2px; }
        .topbar-user { display:flex; align-items:center; gap:12px; }
        .topbar-avatar {
          width:40px; height:40px; border-radius:50%; object-fit:cover;
          border:2px solid #fff; box-shadow:0 0 0 2px var(--border);
        }
        .topbar-avatar-ph {
          width:40px; height:40px; border-radius:50%;
          background:linear-gradient(135deg,var(--primary) 0%,var(--accent) 100%);
          display:flex; align-items:center; justify-content:center;
          color:#fff; font-size:.85rem; font-weight:700;
          box-shadow:0 2px 8px rgba(59,130,246,.3);
        }
        .topbar-uname { font-size:.88rem; font-weight:700; color:var(--text); }
        .topbar-pos { font-size:.74rem; color:var(--text-muted); }
        .btn-sm-logout {
          display:inline-flex; align-items:center; gap:5px;
          padding:7px 14px; border-radius:var(--r-sm);
          border:1px solid var(--border); background:#fff;
          font-family:inherit; font-size:.8rem; font-weight:600; color:var(--danger);
          cursor:pointer; text-decoration:none; transition:all .2s;
        }
        .btn-sm-logout:hover { background:var(--danger-bg); border-color:var(--red); transform:translateY(-1px); }

        /* â”€â”€ Login page (Unified Card Design) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .login-center {
          display:flex; flex-direction:column; align-items:center;
          width:100%; max-width:420px; margin:auto 0;
        }

        .login-card-unified {
          width:100%; background:rgba(255,255,255,.95);
          backdrop-filter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
          border-radius:var(--r-xl);
          box-shadow:0 25px 50px -12px rgba(15,23,42,.18), 0 0 0 1px rgba(255,255,255,.9);
          padding:40px 32px 32px;
          border:1px solid rgba(226,232,240,.8);
          text-align:center;
          position:relative;
          overflow:hidden;
        }

        .login-card-unified::before {
          content:''; position:absolute; top:0; left:0; right:0; height:6px;
          background:linear-gradient(90deg, #ef4444, #f59e0b, #3b82f6, #8b5cf6);
        }

        .login-logo-wrap {
          width:80px; height:80px; border-radius:22px;
          background:#fff;
          border:1.5px solid #e2e8f0;
          box-shadow:0 8px 24px -4px rgba(239,68,68,.15), 0 2px 6px -1px rgba(0,0,0,.04);
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 18px;
          overflow:hidden;
          transition:transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .login-logo-wrap:hover { transform:scale(1.06) rotate(-2deg); }

        .login-title { font-size:1.55rem; font-weight:800; color:var(--text); letter-spacing:-.025em; line-height:1.2; }
        .login-subtitle { font-size:.88rem; color:var(--text-muted); margin-top:6px; font-weight:500; }

        .login-divider {
          height:1px; background:linear-gradient(90deg, transparent, #e2e8f0, transparent);
          margin:24px 0;
        }

        .login-card-unified h2 { font-size:1.1rem; font-weight:700; margin-bottom:6px; color:var(--text); }
        .login-card-unified p.login-desc { font-size:.85rem; color:var(--text-light); margin-bottom:24px; line-height:1.5; }

        .btn-login {
          display:flex; align-items:center; justify-content:center; gap:10px;
          width:100%; padding:14px;
          background:linear-gradient(135deg,#ef4444 0%,#b91c1c 100%);
          color:#fff; border:none; border-radius:var(--r-md);
          font-family:inherit; font-size:.98rem; font-weight:700;
          cursor:pointer; text-decoration:none; transition:all .2s;
          box-shadow:0 6px 20px -2px rgba(239,68,68,.38);
        }
        .btn-login:hover { transform:translateY(-2px); box-shadow:0 10px 26px -2px rgba(239,68,68,.48); }

        .login-footer-note { font-size:.74rem; color:var(--text-light); margin-top:24px; font-weight:500; }

        /* â”€â”€ Badges / Pills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .badge {
          display:inline-flex; align-items:center; gap:5px;
          padding:3px 10px; border-radius:20px; font-size:.72rem; font-weight:600;
        }
        .badge-blue { background:var(--primary-pale); color:var(--primary-dk); }
        .badge-red  { background:var(--red-pale); color:var(--red-dark); }
        .badge-success { background:var(--success-bg); color:var(--success); }
        .badge-warn    { background:var(--warn-bg); color:var(--warn); }
        .badge-danger  { background:var(--danger-bg); color:var(--danger); }
        .badge-gray  { background:#edf2f7; color:var(--text-muted); }
        .badge-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

        /* â”€â”€ Main layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .main { width:100%; max-width:900px; display:flex; flex-direction:column; gap:20px; }

        /* â”€â”€ Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .card {
          background:rgba(255,255,255,.95);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border-radius:var(--r-lg);
          box-shadow:0 10px 25px -5px rgba(15,23,42,.08), 0 4px 10px -2px rgba(15,23,42,.04);
          border:1px solid rgba(255,255,255,.8);
          padding:24px 28px;
        }
        .card-title {
          font-size: 1.18rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.015em;
          margin-bottom: 22px;
          padding-bottom: 16px;
          border-bottom: 1.5px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .card-title-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #fef2f2;
          color: #ef4444;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.12);
          flex-shrink: 0;
        }

        #upload_prompt * { pointer-events: none; }
        .dropzone-active { border-color: #2563eb !important; background: #eff6ff !important; }

        /* â”€â”€ Image Lightbox Modal â”€â”€ */
        .modal-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          z-index: 9999;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-overlay.active { display: flex; }
        .modal-card {
          background: #fff;
          border-radius: 16px;
          max-width: 820px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35);
          animation: popIn .2s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes popIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .modal-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
        .modal-close {
          background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #64748b; line-height: 1; padding: 4px;
        }
        .modal-close:hover { color: #ef4444; }
        .modal-body {
          padding: 16px; display: flex; align-items: center; justify-content: center; background: #0f172a; min-height: 300px; max-height: 72vh; overflow: auto;
        }
        .modal-img { max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 6px; }

        /* â”€â”€ Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px 24px; }
        .form-group { display:flex; flex-direction:column; gap:8px; }
        .form-group.full { grid-column:1/-1; }
        label {
          font-size: 0.94rem;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 4px;
          letter-spacing: -0.01em;
        }
        .required::after { content:' *'; color:#ef4444; font-weight:800; }
        input[type=text], input[type=tel], textarea, select {
          width:100%; padding:11px 14px;
          border:1.5px solid #cbd5e1; border-radius:var(--r-sm);
          font-family:inherit; font-size:.92rem; color:#0f172a;
          background:#fff; transition:border-color .15s, box-shadow .15s;
          outline:none;
        }
        input:disabled {
          background:#f8fafc !important;
          color:#334155 !important;
          border-color:#e2e8f0 !important;
          font-weight:500;
          cursor:not-allowed;
        }
        input:focus, textarea:focus, select:focus {
          border-color:var(--primary);
          box-shadow:0 0 0 3px rgba(43,108,176,.12);
        }
        textarea { resize:vertical; min-height:95px; line-height:1.6; }
        .form-hint { font-size:.78rem; color:#64748b; margin-top:2px; }

        .btn-submit {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          padding:12px 28px; border-radius:var(--r-md);
          background:linear-gradient(135deg,var(--red) 0%,var(--red-dark) 100%);
          color:#fff; border:none; font-family:inherit; font-size:.95rem; font-weight:700;
          cursor:pointer; transition:all .2s;
          box-shadow:0 4px 12px rgba(229,62,62,.3);
        }
        .btn-submit:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(229,62,62,.38); }
        .btn-submit:disabled { opacity:.5; cursor:not-allowed; transform:none; }

        /* â”€â”€ Table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .table-wrap { overflow-x:auto; }
        table { width:100%; border-collapse:collapse; font-size:.86rem; }
        thead { background:#f8fafc; }
        th { text-align:left; padding:12px 14px; font-size:.82rem; font-weight:700; color:#334155; letter-spacing:.02em; border-bottom:2px solid #e2e8f0; }
        td { padding:13px 14px; border-bottom:1px solid #f1f5f9; vertical-align:middle; }
        tr:last-child td { border-bottom:none; }
        tr:hover td { background:#fafcff; }
        .td-ref { font-family:monospace; font-size:.82rem; font-weight:600; color:#334155; }
        .td-main { font-weight:600; color:#0f172a; }
        .td-sub { font-size:.78rem; color:#64748b; margin-top:2px; }
        .empty-state { text-align:center; padding:48px 20px; color:var(--text-light); }
        .empty-icon { font-size:2.5rem; margin-bottom:12px; }
        .empty-text { font-size:.9rem; }

        /* â”€â”€ Alert boxes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .alert {
          border-radius:var(--r-md); padding:16px 20px;
          font-size:.9rem; line-height:1.7; border:1px solid transparent;
        }
        .alert-success { background:var(--success-bg); border-color:#9ae6b4; color:var(--success); }
        .alert-warn    { background:var(--warn-bg); border-color:#f6e05e; color:var(--warn); }
        .alert-danger  { background:var(--danger-bg); border-color:#fc8181; color:var(--danger); }
        .alert-title   { font-weight:700; font-size:1rem; margin-bottom:6px; }

        /* â”€â”€ Callback page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        .callback-center { display:flex; justify-content:center; width:100%; }
        .callback-card {
          background:var(--surface); border-radius:var(--r-xl);
          box-shadow:var(--sh-lg); border:1px solid var(--border);
          padding:40px; max-width:500px; width:100%; text-align:center;
        }
        .cb-icon { font-size:3rem; margin-bottom:16px; }
        .cb-title { font-size:1.25rem; font-weight:800; margin-bottom:8px; }
        .cb-sub { font-size:.9rem; color:var(--text-muted); margin-bottom:24px; line-height:1.7; }

        .btn-back {
          display:inline-flex; align-items:center; gap:6px;
          padding:10px 20px; border-radius:var(--r-md);
          background:var(--primary); color:#fff;
          border:none; font-family:inherit; font-size:.9rem; font-weight:600;
          text-decoration:none; cursor:pointer; transition:all .15s;
        }
        .btn-back:hover { background:var(--primary-dk); }

        /* â”€â”€ Responsive â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
        @media (max-width:600px) {
          body { padding:20px 12px 40px; }
          .form-grid { grid-template-columns:1fr; }
          .form-group.full { grid-column:1; }
          .login-card { padding:24px 18px; }
          .topbar { flex-wrap:wrap; gap:12px; }
        }
        @media (prefers-reduced-motion:reduce) { * { transition:none !important; animation:none !important; } }
      `}</style>
    </head>
    <body>
      {children}
      {/* Lightbox Modal */}
      <div id="img_modal" class="modal-overlay" onclick="closeLightbox(event)">
        <div class="modal-card" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div id="modal_title" class="modal-title">à¸£à¸¹à¸›à¸ à¸²à¸žà¸ªà¸–à¸²à¸™à¸—à¸µà¹ˆà¸•à¸´à¸”à¸•à¸±à¹‰à¸‡</div>
            <div style="display:flex; align-items:center; gap:12px;">
              <a id="modal_tab_link" href="#" target="_blank" rel="noreferrer" style="font-size:0.8rem; color:#2563eb; text-decoration:none; font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                ðŸ”— à¹€à¸›à¸´à¸”à¹ƒà¸™à¹à¸—à¹‡à¸šà¹ƒà¸«à¸¡à¹ˆ
              </a>
              <button type="button" class="modal-close" onclick="closeLightbox()">âœ•</button>
            </div>
          </div>
          <div class="modal-body">
            <img id="modal_img" class="modal-img" src="" alt="à¸ à¸²à¸žà¸ªà¸–à¸²à¸™à¸—à¸µà¹ˆà¸•à¸´à¸”à¸•à¸±à¹‰à¸‡" />
          </div>
        </div>
      </div>
    </body>
  </html>
)

// Official FDnet Logo image in base64 format
export const FDNET_LOGO_B64 = "data:image/jpeg;base64,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"

export const AppLogo = ({ size = 52 }: { size?: number }) => (
  <div style={width: + "px;height:px;border-radius:10px;background:#fff;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.06);flex-shrink:0;}>" + @"
    <img src={FDNET_LOGO_B64} alt="FDnet Logo" style={width:100%;height:100%;object-fit:contain;display:block;} />
  </div>
)