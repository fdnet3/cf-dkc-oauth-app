/** @jsxImportSource hono/jsx */
import type { FC } from 'hono/jsx'

// Logo SVG (FDnet style — inline so no external file needed)
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
      <title>{title || 'FDnet · ระบบขอติดตั้งโทรศัพท์ภายใน'}</title>
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

        /* ── Topbar ──────────────────────── */
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

        /* ── Login page (Unified Card Design) ──────────────────── */
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

        /* ── Badges / Pills ──────────────── */
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

        /* ── Main layout ─────────────────── */
        .main { width:100%; max-width:900px; display:flex; flex-direction:column; gap:20px; }

        /* ── Cards ───────────────────────── */
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

        /* ── Image Lightbox Modal ── */
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

        /* ── Form ────────────────────────── */
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

        /* ── Table ───────────────────────── */
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

        /* ── Alert boxes ─────────────────── */
        .alert {
          border-radius:var(--r-md); padding:16px 20px;
          font-size:.9rem; line-height:1.7; border:1px solid transparent;
        }
        .alert-success { background:var(--success-bg); border-color:#9ae6b4; color:var(--success); }
        .alert-warn    { background:var(--warn-bg); border-color:#f6e05e; color:var(--warn); }
        .alert-danger  { background:var(--danger-bg); border-color:#fc8181; color:var(--danger); }
        .alert-title   { font-weight:700; font-size:1rem; margin-bottom:6px; }

        /* ── Callback page ───────────────── */
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

        /* ── Responsive ──────────────────── */
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
            <div id="modal_title" class="modal-title">รูปภาพสถานที่ติดตั้ง</div>
            <div style="display:flex; align-items:center; gap:12px;">
              <a id="modal_tab_link" href="#" target="_blank" rel="noreferrer" style="font-size:0.8rem; color:#2563eb; text-decoration:none; font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                🔗 เปิดในแท็บใหม่
              </a>
              <button type="button" class="modal-close" onclick="closeLightbox()">✕</button>
            </div>
          </div>
          <div class="modal-body">
            <img id="modal_img" class="modal-img" src="" alt="ภาพสถานที่ติดตั้ง" />
          </div>
        </div>
      </div>
    </body>
  </html>
)

// The FDnet logo as an inline base64 image placeholder — will use SVG
export const AppLogo = ({ size = 52 }: { size?: number }) => (
  <div style={`width:${size}px;height:${size}px;border-radius:12px;background:#fff;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;overflow:hidden;`}>
    <svg width={size - 8} height={size - 8} viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" fill="white"/>
      {/* FD */}
      <text x="2" y="26" font-family="'Arial Black',sans-serif" font-size="18" font-weight="900" fill="#e53e3e">FD</text>
      {/* net */}
      <text x="2" y="37" font-family="Arial,sans-serif" font-size="8" font-weight="700" fill="#2b6cb0">net</text>
      {/* rays */}
      <line x1="30" y1="22" x2="43" y2="8" stroke="#e53e3e" stroke-width="2" stroke-linecap="round"/>
      <line x1="30" y1="22" x2="43" y2="16" stroke="#e53e3e" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="30" y1="22" x2="43" y2="22" stroke="#e53e3e" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="30" y1="22" x2="41" y2="29" stroke="#e53e3e" stroke-width="1.4" stroke-linecap="round"/>
      <line x1="30" y1="22" x2="38" y2="36" stroke="#e53e3e" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  </div>
)
