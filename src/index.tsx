/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import { raw } from 'hono/html'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import { Layout, AppLogo } from './ui'

type Bindings = {
  OAUTH_BASE_URI: string
  OAUTH_CLIENT_ID: string
  OAUTH_CLIENT_SECRET: string
  OAUTH_REDIRECT_URI: string
  SESSION_SECRET: string
  CAS_REQUEST_URL: string
  CAS_STATUS_URL: string
  CAS_CLIENT_ID: string
  CAS_CLIENT_SECRET: string
  DB: D1Database
}

type UserProfile = {
  id: number
  username: string
  name?: string
  display_name?: string
  email?: string
  phone?: string
  tel?: string
  telephone_number?: string
  mobile?: string
  line_picture?: string
  line_name?: string
  offices?: { position: string; kong: string; section: string; samnak: string }[]
  exp?: number
}

type CasRequest = {
  id: number
  ref_id: string
  username: string
  display_name: string
  kong: string | null
  section: string | null
  samnak: string | null
  position_title: string | null
  install_location: string
  phone_ext: string | null
  purpose: string
  install_date: string
  requester_phone?: string | null
  location_image?: string | null
  note: string | null
  cas_request_key: string | null
  approver_ad: string | null
  approver_name: string | null
  approver_email: string | null
  approve_type: number
  status: string
  status_updated_at: string | null
  created_at: string
  updated_at: string
}

const app = new Hono<{ Bindings: Bindings }>()
const getSecret = (c: any): string => c.env.SESSION_SECRET || 'dev-fallback-secret'

app.onError((err, c) => {
  console.error('Unhandled App Error:', err)
  return c.html(
    <Layout title="เกิดข้อผิดพลาด">
      <div style="max-width:600px; margin:40px auto; background:#fff; padding:32px; border-radius:16px; border:1px solid #fee2e2;">
        <h2 style="color:#dc2626; margin-bottom:12px;">⚠️ เกิดข้อผิดพลาดในระบบ</h2>
        <pre style="background:#fef2f2; padding:16px; border-radius:8px; color:#991b1b; white-space:pre-wrap; font-size:0.85rem;">
          {err.stack || err.message || String(err)}
        </pre>
        <div style="margin-top:20px;">
          <a href="/" class="btn-back">กลับหน้าหลัก</a>
        </div>
      </div>
    </Layout>,
    500
  )
})

function randomState(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('')
}

function genRefId(): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `PHN${yy}${mm}${dd}${rand}`
}

// ── Auth Middleware & Admin Helpers ───────────────────────────────────────────
async function getUser(c: any): Promise<UserProfile | null> {
  const token = getCookie(c, 'session')
  if (!token) return null
  try {
    return await verify(token, getSecret(c), 'HS256') as UserProfile
  } catch {
    deleteCookie(c, 'session', { path: '/' })
    return null
  }
}

async function checkIsAdmin(c: any, username: string): Promise<boolean> {
  if (username === 'vthaweeboon') return true
  try {
    const admin = await c.env.DB.prepare(
      'SELECT id FROM app_admins WHERE username = ? LIMIT 1'
    ).bind(username).first()
    return !!admin
  } catch {
    return false
  }
}

// ── Topbar component ──────────────────────────────────────────────────────────
const Topbar = ({ user, isAdmin }: { user: UserProfile; isAdmin: boolean }) => {
  const initials = (user.display_name || user.username || '?').split(' ').map((w: string) => w[0]).slice(0, 2).join('')
  const pos = user.offices?.[0]
  return (
    <div class="topbar">
      <div class="topbar-brand">
        <AppLogo size={44} />
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="topbar-name">FDnet · Call 4141</div>
            {isAdmin && <span class="badge badge-red" style="font-size:0.68rem; font-weight:800;">ADMIN</span>}
          </div>
          <div class="topbar-sub">ระบบขอติดตั้งโทรศัพท์ภายใน</div>
        </div>
      </div>
      <div class="topbar-user">
        <div>
          <div class="topbar-uname">{user.display_name || user.username}</div>
          {pos && <div class="topbar-pos">{pos.position} · {pos.kong}</div>}
        </div>
        {user.line_picture
          ? <img src={decodeURIComponent(user.line_picture)} class="topbar-avatar" alt="avatar" />
          : <div class="topbar-avatar-ph">{initials}</div>
        }
        <a href="/logout" class="btn-sm-logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          ออกจากระบบ
        </a>
      </div>
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, [string, string]> = {
    PENDING:           ['badge badge-warn', '⏳ รออนุมัติ'],
    APPROVE:           ['badge badge-success', '✅ อนุมัติแล้ว'],
    REJECT:            ['badge badge-danger', '❌ ปฏิเสธ'],
    'รอดำเนินการ':      ['badge badge-blue', '⚙️ รอดำเนินการ'],
    'ไม่สามารถดำเนินการได้': ['badge badge-danger', '⛔ ไม่สามารถดำเนินการได้'],
    'เสร็จสิ้น':         ['badge badge-success', '🎉 เสร็จสิ้น'],
  }
  const [cls, label] = map[status] || ['badge badge-gray', status]
  return <span class={cls}>{label}</span>
}

// ── HOME / FORM + HISTORY ─────────────────────────────────────────────────────
app.get('/', async (c) => {
  const user = await getUser(c)
  if (!user) return c.redirect('/login-page')

  const isAdmin = await checkIsAdmin(c, user.username)

  // ดึงประวัติคำขอจาก D1: ถ้าเป็น Admin ดึงคำขอทั้งหมด, ถ้าเป็น user ปกติ ดึงเฉพาะของตนเอง
  const queryStr = isAdmin
    ? 'SELECT * FROM cas_requests ORDER BY created_at DESC LIMIT 100'
    : 'SELECT * FROM cas_requests WHERE username = ? ORDER BY created_at DESC LIMIT 50'
  
  const queryStmt = isAdmin
    ? c.env.DB.prepare(queryStr)
    : c.env.DB.prepare(queryStr).bind(user.username)

  const { results } = await queryStmt.all<CasRequest>()

  // ถ้าเป็น Admin ดึงรายชื่อ Admin ทั้งหมดมาแสดงและจัดการ
  let adminList: { id: number; username: string; added_by: string; created_at: string }[] = []
  if (isAdmin) {
    try {
      const adminRows = await c.env.DB.prepare('SELECT * FROM app_admins ORDER BY id ASC').all<{ id: number; username: string; added_by: string; created_at: string }>()
      adminList = adminRows.results || []
    } catch (e) {
      console.error('Fetch admins error:', e)
    }
  }

  const flash = c.req.query('msg')
  const flashType = c.req.query('type') || 'success'

  const kong = user.offices?.[0]?.kong || ''
  const samnak = user.offices?.[0]?.samnak || ''

  return c.html(
    <Layout>
      <Topbar user={user} isAdmin={isAdmin} />

      <div class="main">
        {/* Flash message */}
        {flash && (
          <div class={`alert alert-${flashType}`}>
            {flash}
          </div>
        )}

        {/* Form Card */}
        <div class="card">
          <div class="card-title">
            <span class="card-title-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91A16 16 0 0 0 16 17l.97-.97a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <span>แบบฟอร์มขอติดตั้งโทรศัพท์ภายใน</span>
          </div>

          <form method="POST" action="/submit">
            <div class="form-grid">
              {/* ผู้ขอ */}
              <div class="form-group">
                <label>ชื่อผู้ขอ</label>
                <input type="text" value={user.display_name || user.username} disabled />
              </div>
              <div class="form-group">
                <label>หน่วยงาน / กอง</label>
                <input type="text" value={kong || '—'} disabled />
              </div>

              {/* สำนัก */}
              <div class="form-group">
                <label>สำนัก</label>
                <input type="text" value={samnak || '—'} disabled />
              </div>

              {/* เบอร์โทรศัพท์ผู้ขอ */}
              <div class="form-group">
                <label>เบอร์โทรศัพท์ผู้ขอ</label>
                <input
                  type="tel"
                  id="input_phone"
                  name="requester_phone"
                  value={user.phone || user.tel || user.telephone_number || user.mobile || ''}
                  placeholder="เช่น 081-234-5678"
                />
              </div>

              {/* สถานที่ติดตั้ง */}
              <div class="form-group full">
                <label class="required">สถานที่ติดตั้ง / ห้อง</label>
                <input type="text" name="phone_location" placeholder="เช่น อาคาร A ห้อง 301" required />
              </div>

              {/* แนบรูปภาพ สถานที่ติดตั้ง / ห้อง */}
              <div class="form-group full">
                <label>
                  แนบรูปภาพ สถานที่ติดตั้ง / ห้อง
                  <span style="font-size:0.8rem; font-weight:500; color:#64748b; margin-left:6px;">(ไม่บังคับ — แนบได้สูงสุด 3 ภาพ)</span>
                </label>
                <input type="hidden" id="location_image_base64" name="location_image" />
                <input type="file" id="location_image_file" accept="image/*" multiple style="display:none;" />
                <div id="upload_dropzone" style="border:2px dashed #cbd5e1; border-radius:12px; padding:20px; text-align:center; background:#f8fafc; transition:all .2s;">
                  <label for="location_image_file" id="upload_prompt" style="display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer; width:100%;">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <div style="font-size:0.95rem; font-weight:700; color:#1e293b;">
                      คลิกเพื่อเลือกรูปภาพ หรือ ลากไฟล์รูปมาวางที่นี่
                    </div>
                    <div style="font-size:0.78rem; color:#64748b;">
                      รองรับไฟล์ภาพ JPG, PNG (สามารถเลือกพร้อมกันได้สูงสุด 3 ภาพ)
                    </div>
                  </label>
                  <div id="upload_preview_wrap" style="display:none; flex-direction:column; align-items:center; gap:16px;">
                    <div id="preview_grid" style="display:flex; flex-wrap:wrap; gap:14px; justify-content:center; width:100%;">
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                      <label for="location_image_file" id="btn_add_more" style="display:inline-flex; align-items:center; gap:5px; padding:7px 14px; font-size:0.82rem; font-weight:600; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; cursor:pointer;">
                        + เพิ่มรูปภาพ
                      </label>
                      <button type="button" id="btn_remove_all" style="display:inline-flex; align-items:center; gap:5px; padding:7px 14px; font-size:0.82rem; font-weight:600; color:#ef4444; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; cursor:pointer;">
                        ✕ ลบรูปทั้งหมด
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* เหตุผล */}
              <div class="form-group full">
                <label class="required">เหตุผล / วัตถุประสงค์</label>
                <textarea id="input_reason" name="phone_reason" placeholder="ระบุเหตุผลในการขอติดตั้งโทรศัพท์ภายใน..." required />
                <span class="form-hint">อธิบายเหตุผลให้ชัดเจนเพื่อความสะดวกในการพิจารณาอนุมัติ</span>
              </div>
            </div>

            {/* Preview Box สำหรับแสดงข้อความที่จะส่งให้หัวหน้า */}
            <div style="margin-top:20px; background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:12px; padding:18px;">
              <div style="display:flex; align-items:center; gap:8px; font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:10px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                ตัวอย่างข้อความที่จะส่งแจ้งหัวหน้าหน่วยงาน (ผ่าน LINE / อีเมล)
              </div>
              <pre id="preview_text" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px; font-family:'Sarabun',sans-serif; font-size:0.85rem; color:#1e293b; line-height:1.6; white-space:pre-wrap; margin:0;">
{`คำขอติดตั้งโทรศัพท์ภายใน

เลขที่อ้างอิง:   PHN...
ผู้ขอ:          ${user.display_name || user.username}
กอง / สำนัก:    ${kong} / ${samnak}
สถานที่ติดตั้ง:   (กรุณากรอกสถานที่ติดตั้งด้านบน)
เหตุผล:         (กรุณากรอกเหตุผลด้านบน)`}
              </pre>
            </div>

            <div style="margin-top:20px; display:flex; justify-content:flex-end;">
              <button type="submit" class="btn-submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                ส่งขออนุมัติ
              </button>
            </div>
          </form>

          <script>{raw(`
            var locInput = document.querySelector('input[name="phone_location"]');
            var reasonInput = document.getElementById('input_reason');
            var previewBox = document.getElementById('preview_text');
            var userName = ${JSON.stringify(user.display_name || user.username)};
            var orgText = ${JSON.stringify(`${kong} / ${samnak}`)};

            function updatePreview() {
              if (!locInput || !previewBox) return;
              var loc = locInput.value.trim() || '(กรุณากรอกสถานที่ติดตั้งด้านบน)';
              var reason = reasonInput ? (reasonInput.value.trim() || '(กรุณากรอกเหตุผลด้านบน)') : '';
              previewBox.textContent = "คำขอติดตั้งโทรศัพท์ภายใน\\n\\n" +
                "เลขที่อ้างอิง:   PHN...\\n" +
                "ผู้ขอ:          " + userName + "\\n" +
                "กอง / สำนัก:    " + orgText + "\\n" +
                "สถานที่ติดตั้ง:   " + loc + "\\n" +
                "เหตุผล:         " + reason;
            }

            if (locInput) {
              locInput.addEventListener('input', updatePreview);
            }
            if (reasonInput) {
              reasonInput.addEventListener('input', updatePreview);
            }

            // Prevent browser from opening files dropped anywhere on page
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(evt) {
              window.addEventListener(evt, function(e) {
                e.preventDefault();
              }, false);
            });

            // Image Upload Handler (Up to 3 images)
            var dropzone = document.getElementById('upload_dropzone');
            var fileInput = document.getElementById('location_image_file');
            var base64Input = document.getElementById('location_image_base64');
            var promptEl = document.getElementById('upload_prompt');
            var previewWrap = document.getElementById('upload_preview_wrap');
            var previewGrid = document.getElementById('preview_grid');
            var btnAddMore = document.getElementById('btn_add_more');
            var btnRemoveAll = document.getElementById('btn_remove_all');

            var imageList = []; // { previewUrl, base64 }

            function renderPreviews() {
              if (imageList.length === 0) {
                promptEl.style.display = 'flex';
                previewWrap.style.display = 'none';
                base64Input.value = '';
                return;
              }

              promptEl.style.display = 'none';
              previewWrap.style.display = 'flex';

              if (btnAddMore) {
                btnAddMore.style.display = imageList.length >= 3 ? 'none' : 'inline-flex';
              }

              var base64Array = imageList.map(function(item) { return item.base64; }).filter(Boolean);
              base64Input.value = base64Array.length > 0 ? JSON.stringify(base64Array) : '';

              previewGrid.innerHTML = '';
              imageList.forEach(function(item, index) {
                var card = document.createElement('div');
                card.style.cssText = 'position:relative; width:150px; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:6px; box-shadow:0 4px 10px rgba(0,0,0,0.06); text-align:center;';

                var img = document.createElement('img');
                img.src = item.previewUrl;
                img.alt = 'ภาพที่ ' + (index + 1);
                img.style.cssText = 'width:100%; height:110px; object-fit:cover; border-radius:6px; display:block;';

                var footer = document.createElement('div');
                footer.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-top:6px; padding:0 2px;';

                var title = document.createElement('span');
                title.style.cssText = 'font-size:0.75rem; font-weight:700; color:#334155;';
                title.textContent = 'ภาพที่ ' + (index + 1);

                var delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.textContent = '✕ ลบ';
                delBtn.style.cssText = 'padding:2px 8px; font-size:0.72rem; color:#ef4444; background:#fef2f2; border:1px solid #fecaca; border-radius:4px; cursor:pointer; font-weight:600;';
                delBtn.onclick = function() {
                  removeImage(index);
                };

                footer.appendChild(title);
                footer.appendChild(delBtn);
                card.appendChild(img);
                card.appendChild(footer);
                previewGrid.appendChild(card);
              });
            }

            function removeImage(index) {
              imageList.splice(index, 1);
              renderPreviews();
            }

            if (btnRemoveAll) {
              btnRemoveAll.addEventListener('click', function(e) {
                e.preventDefault();
                imageList = [];
                fileInput.value = '';
                renderPreviews();
              });
            }

            function processFiles(files) {
              if (!files || files.length === 0) return;
              var availableSlots = 3 - imageList.length;
              if (availableSlots <= 0) {
                alert('ท่านสามารถแนบรูปภาพได้สูงสุด 3 ภาพเท่านั้น');
                return;
              }

              var filesToProcess = Array.from(files).slice(0, availableSlots);
              if (files.length > availableSlots) {
                alert('แนบรูปได้สูงสุด 3 ภาพ (ระบบจะนำเข้าเฉพาะ ' + availableSlots + ' ภาพแรก)');
              }

              filesToProcess.forEach(function(file) {
                var isImage = (file.type && file.type.startsWith('image/')) || /\\.(jpe?g|png|gif|webp|bmp|heic|jfif)$/i.test(file.name);
                if (!isImage) return;

                var previewUrl = URL.createObjectURL(file);
                var item = { previewUrl: previewUrl, base64: '' };
                imageList.push(item);
                renderPreviews();

                var reader = new FileReader();
                reader.onload = function(event) {
                  var rawData = event.target.result;
                  var img = new Image();
                  img.onload = function() {
                    try {
                      var maxDim = 1000;
                      var w = img.width;
                      var h = img.height;
                      if (w > maxDim || h > maxDim) {
                        if (w > h) {
                          h = Math.round((h * maxDim) / w);
                          w = maxDim;
                        } else {
                          w = Math.round((w * maxDim) / h);
                          h = maxDim;
                        }
                      }
                      var canvas = document.createElement('canvas');
                      canvas.width = w;
                      canvas.height = h;
                      var ctx = canvas.getContext('2d');
                      ctx.drawImage(img, 0, 0, w, h);
                      item.base64 = canvas.toDataURL('image/jpeg', 0.75);
                    } catch (cErr) {
                      item.base64 = rawData;
                    }
                    renderPreviews();
                  };
                  img.onerror = function() {
                    item.base64 = rawData;
                    renderPreviews();
                  };
                  img.src = rawData;
                };
                reader.readAsDataURL(file);
              });

              fileInput.value = '';
            }

            if (dropzone && fileInput) {
              dropzone.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('dropzone-active');
              });

              dropzone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('dropzone-active');
              });

              dropzone.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('dropzone-active');
                if (e.dataTransfer && e.dataTransfer.files) {
                  processFiles(e.dataTransfer.files);
                }
              });

              fileInput.addEventListener('change', function() {
                if (fileInput.files) {
                  processFiles(fileInput.files);
                }
              });
            }

            window.openLightbox = function(e, src, title, tabUrl) {
              if (e) e.preventDefault();
              var modal = document.getElementById('img_modal');
              var mImg = document.getElementById('modal_img');
              var mTitle = document.getElementById('modal_title');
              var mLink = document.getElementById('modal_tab_link');
              if (modal && mImg) {
                mImg.src = src;
                if (mTitle) mTitle.textContent = title || 'รูปภาพสถานที่ติดตั้ง';
                if (mLink) mLink.href = tabUrl || src;
                modal.classList.add('active');
              }
            };

            window.closeLightbox = function() {
              var modal = document.getElementById('img_modal');
              if (modal) modal.classList.remove('active');
            };

            document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') window.closeLightbox();
            });
          `)}</script>
        </div>

        {/* Admin Card: จัดการสิทธิ์ผู้ดูแลระบบ (เฉพาะ Admin) */}
        {isAdmin && (
          <div class="card" style="border-left:4px solid #ef4444;">
            <div class="card-title">
              <span class="card-title-icon" style="background:#fee2e2; color:#dc2626;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <span>จัดการสิทธิ์ผู้ดูแลระบบ (Admin Management)</span>
            </div>

            {/* เพิ่ม Admin ใหม่ */}
            <form method="POST" action="/admin/add-admin" style="display:flex; flex-wrap:wrap; gap:10px; align-items:flex-end; margin-bottom:20px; background:#f8fafc; padding:14px; border-radius:10px; border:1px solid #e2e8f0;">
              <div style="flex:1; min-width:200px;">
                <label style="font-size:0.8rem; font-weight:700; color:#334155; margin-bottom:4px; display:block;">
                  เพิ่มสิทธิ์ Admin ด้วย Username DKC:
                </label>
                <input type="text" name="new_admin_username" placeholder="เช่น somchai_k" required style="padding:8px 12px; font-size:0.88rem;" />
              </div>
              <button type="submit" style="padding:9px 18px; font-size:0.85rem; font-weight:700; background:#0f172a; color:#fff; border:none; border-radius:8px; cursor:pointer;">
                + เพิ่มสิทธิ์
              </button>
            </form>

            {/* รายชื่อ Admin ปัจจุบัน */}
            <div style="font-size:0.85rem; font-weight:700; color:#475569; margin-bottom:8px;">
              รายชื่อผู้มีสิทธิ์ Admin ในระบบ:
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              {adminList.map((a) => (
                <div style="display:inline-flex; align-items:center; gap:8px; background:#f1f5f9; padding:6px 12px; border-radius:20px; font-size:0.82rem; font-weight:600; color:#1e293b; border:1px solid #cbd5e1;">
                  <span>👤 @{a.username}</span>
                  {a.username === 'vthaweeboon' ? (
                    <span style="font-size:0.7rem; color:#94a3b8;">(Super Admin)</span>
                  ) : (
                    <form method="POST" action="/admin/remove-admin" style="margin:0; display:inline;">
                      <input type="hidden" name="remove_username" value={a.username} />
                      <button type="submit" title="ลบสิทธิ์" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.9rem; padding:0 2px; line-height:1;">
                        ✕
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Table */}
        <div class="card">
          <div class="card-title">
            <span class="card-title-icon" style="background:#eff6ff; color:#2563eb;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </span>
            <span>{isAdmin ? 'ประวัติคำขอทั้งหมด (มุมมองผู้ดูแลระบบ)' : 'ประวัติคำขอของฉัน'}</span>
          </div>

          {results && results.length > 0 ? (
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>เลขที่อ้างอิง</th>
                    {isAdmin && <th>ผู้ขอ</th>}
                    <th>สถานที่</th>
                    <th>หน่วยงาน / สำนัก</th>
                    <th>สถานะ</th>
                    <th>ผู้อนุมัติ</th>
                    <th>วันที่ยื่น</th>
                    {isAdmin && <th>จัดการสถานะ (Admin)</th>}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => {
                    const canAdminEdit = isAdmin && ['APPROVE', 'รอดำเนินการ', 'ไม่สามารถดำเนินการได้', 'เสร็จสิ้น'].includes(r.status)
                    return (
                      <tr>
                        <td class="td-ref">{r.ref_id}</td>
                        {isAdmin && (
                          <td>
                            <div class="td-main" style="font-size:0.85rem;">{r.display_name || r.username}</div>
                            <div class="td-sub">@{r.username}{r.requester_phone ? ` · 📞 ${r.requester_phone}` : ''}</div>
                          </td>
                        )}
                        <td>
                          <div class="td-main">{r.install_location}</div>
                          <div class="td-sub">{r.purpose.slice(0, 50)}{r.purpose.length > 50 ? '…' : ''}</div>
                          {!isAdmin && r.requester_phone && (
                            <div class="td-sub" style="font-size:0.75rem; color:#64748b; margin-top:2px;">
                              📞 {r.requester_phone}
                            </div>
                          )}
                          {(() => {
                            if (!r.location_image) return null
                            let imgs: string[] = []
                            try {
                              if (r.location_image.startsWith('[')) {
                                imgs = JSON.parse(r.location_image)
                              } else {
                                imgs = [r.location_image]
                              }
                            } catch {
                              imgs = [r.location_image]
                            }
                            return (
                              <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">
                                {imgs.map((src, idx) => {
                                  const imgUrl = `/image/${encodeURIComponent(r.ref_id)}/${idx}`
                                  return (
                                    <a
                                      href={imgUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      onclick={`openLightbox(event, ${JSON.stringify(src)}, 'รูปภาพสถานที่ ${r.ref_id} (รูปที่ ${idx + 1})', '${imgUrl}')`}
                                      style="display:inline-flex; align-items:center; gap:3px; font-size:0.75rem; color:#2563eb; text-decoration:none; background:#eff6ff; padding:3px 8px; border-radius:6px; border:1px solid #bfdbfe; font-weight:600; cursor:pointer;"
                                    >
                                      📷 รูปที่ {idx + 1}
                                    </a>
                                  )
                                })}
                              </div>
                            )
                          })()}
                        </td>
                        <td>
                          <div class="td-main" style="font-size:0.82rem;">{r.kong || '—'}</div>
                          <div class="td-sub" style="font-size:0.75rem;">{r.samnak || '—'}</div>
                        </td>
                        <td><StatusBadge status={r.status} /></td>
                        <td class="td-sub">{r.approver_name || r.approver_ad || '—'}</td>
                        <td class="td-sub">{r.created_at ? r.created_at.slice(0, 10) : '—'}</td>
                        {isAdmin && (
                          <td>
                            {canAdminEdit ? (
                              <form method="POST" action="/admin/update-status" style="display:flex; align-items:center; gap:6px; margin:0;">
                                <input type="hidden" name="ref_id" value={r.ref_id} />
                                <select name="status" style="padding:4px 8px; font-size:0.78rem; border-radius:4px; border:1px solid #cbd5e1; background:#fff;">
                                  <option value="APPROVE" selected={r.status === 'APPROVE'}>อนุมัติแล้ว</option>
                                  <option value="รอดำเนินการ" selected={r.status === 'รอดำเนินการ'}>รอดำเนินการ</option>
                                  <option value="ไม่สามารถดำเนินการได้" selected={r.status === 'ไม่สามารถดำเนินการได้'}>ไม่สามารถดำเนินการได้</option>
                                  <option value="เสร็จสิ้น" selected={r.status === 'เสร็จสิ้น'}>เสร็จสิ้น</option>
                                </select>
                                <button type="submit" style="padding:4px 8px; font-size:0.75rem; background:#2563eb; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:600;">
                                  บันทึก
                                </button>
                              </form>
                            ) : (
                              <span style="font-size:0.75rem; color:#94a3b8;">
                                {r.status === 'PENDING' ? '(รอหัวหน้าอนุมัติ)' : '(ปฏิเสธแล้ว)'}
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div class="empty-state">
              <div class="empty-icon">📋</div>
              <div class="empty-text">ยังไม่มีประวัติคำขอ<br/>กรอกแบบฟอร์มด้านบนเพื่อยื่นคำขอแรกของคุณ</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
})

// ── Serve Raw Image by Ref ID & Index ─────────────────────────────────────────
app.get('/image/:ref_id/:index', async (c) => {
  const refId = c.req.param('ref_id')
  const idx = parseInt(c.req.param('index') || '0', 10)
  try {
    const row = await c.env.DB.prepare(
      'SELECT location_image FROM cas_requests WHERE ref_id = ? LIMIT 1'
    ).bind(refId).first<{ location_image: string }>()

    if (!row || !row.location_image) {
      return c.text('Image not found', 404)
    }

    let imgs: string[] = []
    try {
      imgs = row.location_image.startsWith('[') ? JSON.parse(row.location_image) : [row.location_image]
    } catch {
      imgs = [row.location_image]
    }

    const imgDataUrl = imgs[idx] || imgs[0]
    if (!imgDataUrl || !imgDataUrl.startsWith('data:image/')) {
      return c.text('Invalid image format', 404)
    }

    const mimeMatch = imgDataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/)
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
    const base64Data = imgDataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '')

    const binStr = atob(base64Data)
    const len = binStr.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binStr.charCodeAt(i)
    }

    return new Response(bytes, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=86400',
        'Content-Disposition': 'inline'
      }
    })
  } catch (err: any) {
    console.error('Serve image error:', err)
    return c.text('Error serving image: ' + String(err), 500)
  }
})

// ── Admin Update Status ────────────────────────────────────────────────────────
app.post('/admin/update-status', async (c) => {
  const user = await getUser(c)
  if (!user || !(await checkIsAdmin(c, user.username))) {
    return c.redirect('/?msg=คุณไม่มีสิทธิ์ดำเนินการนี้&type=danger')
  }

  const body = await c.req.parseBody()
  const refId = String(body.ref_id || '').trim()
  const newStatus = String(body.status || '').trim()

  const allowedStatuses = ['APPROVE', 'รอดำเนินการ', 'ไม่สามารถดำเนินการได้', 'เสร็จสิ้น']
  if (!refId || !allowedStatuses.includes(newStatus)) {
    return c.redirect('/?msg=ข้อมูลไม่ถูกต้อง&type=danger')
  }

  try {
    await c.env.DB.prepare(`
      UPDATE cas_requests
      SET status=?, status_updated_at=datetime('now','localtime'), updated_at=datetime('now','localtime')
      WHERE ref_id=?
    `).bind(newStatus, refId).run()

    return c.redirect(`/?msg=${encodeURIComponent(`อัปเดตสถานะของ ${refId} เป็น "${newStatus}" เรียบร้อยแล้ว`)}&type=success`)
  } catch (err: any) {
    console.error('Admin update status error:', err)
    return c.redirect(`/?msg=${encodeURIComponent('เกิดข้อผิดพลาดในการอัปเดตสถานะ: ' + (err?.message || String(err)))}&type=danger`)
  }
})

// ── Admin: เพิ่มสิทธิ์ Admin ให้ user อื่น ──────────────────────────────────────
app.post('/admin/add-admin', async (c) => {
  const user = await getUser(c)
  if (!user || !(await checkIsAdmin(c, user.username))) {
    return c.redirect('/?msg=คุณไม่มีสิทธิ์จัดการ Admin&type=danger')
  }

  const body = await c.req.parseBody()
  const newAdmin = String(body.new_admin_username || '').trim().toLowerCase()

  if (!newAdmin) {
    return c.redirect('/?msg=กรุณาระบุ username ที่ต้องการเพิ่ม&type=danger')
  }

  try {
    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO app_admins (username, added_by, created_at)
      VALUES (?, ?, datetime('now', 'localtime'))
    `).bind(newAdmin, user.username).run()

    return c.redirect(`/?msg=${encodeURIComponent(`เพิ่มสิทธิ์ Admin ให้ @${newAdmin} เรียบร้อยแล้ว`)}&type=success`)
  } catch (err: any) {
    console.error('Add admin error:', err)
    return c.redirect(`/?msg=${encodeURIComponent('เกิดข้อผิดพลาดในการเพิ่ม Admin: ' + (err?.message || String(err)))}&type=danger`)
  }
})

// ── Admin: ลบสิทธิ์ Admin ──────────────────────────────────────────────────────
app.post('/admin/remove-admin', async (c) => {
  const user = await getUser(c)
  if (!user || !(await checkIsAdmin(c, user.username))) {
    return c.redirect('/?msg=คุณไม่มีสิทธิ์จัดการ Admin&type=danger')
  }

  const body = await c.req.parseBody()
  const targetUser = String(body.remove_username || '').trim()

  if (!targetUser || targetUser === 'vthaweeboon') {
    return c.redirect('/?msg=ไม่สามารถลบสิทธิ์ Super Admin ได้&type=danger')
  }

  try {
    await c.env.DB.prepare(`
      DELETE FROM app_admins WHERE username = ?
    `).bind(targetUser).run()

    return c.redirect(`/?msg=${encodeURIComponent(`ยกเลิกสิทธิ์ Admin ของ @${targetUser} เรียบร้อยแล้ว`)}&type=success`)
  } catch (err: any) {
    console.error('Remove admin error:', err)
    return c.redirect(`/?msg=${encodeURIComponent('เกิดข้อผิดพลาดในการลบ Admin: ' + (err?.message || String(err)))}&type=danger`)
  }
})

// ── Submit Form ───────────────────────────────────────────────────────────────
app.post('/submit', async (c) => {
  const user = await getUser(c)
  if (!user) return c.redirect('/login-page')

  const body = await c.req.parseBody()
  const phone_type     = String(body.phone_type || 'ภายใน').trim()
  const phone_location = String(body.phone_location || '').trim()
  const phone_reason   = String(body.phone_reason || '').trim()
  const req_phone      = String(body.requester_phone || user.phone || user.tel || '').trim()
  const location_image = String(body.location_image || '').trim()

  if (!phone_location || !phone_reason) {
    return c.redirect('/?msg=กรุณากรอกข้อมูลให้ครบถ้วน&type=danger')
  }

  const extRefId = genRefId()
  const kong     = user.offices?.[0]?.kong || ''
  const section  = user.offices?.[0]?.section || ''
  const samnak   = user.offices?.[0]?.samnak || ''
  const posTitle = user.offices?.[0]?.position || ''
  const todayStr = new Date().toISOString().slice(0, 10)
  const origin   = new URL(c.req.url).origin
  const callbackUrl = `${origin}/cas/callback`

  try {
    // 1. บันทึก D1 ก่อน (status=PENDING)
    await c.env.DB.prepare(`
      INSERT INTO cas_requests
        (ref_id, username, display_name, kong, section, samnak, position_title, install_location, purpose, install_date, requester_phone, location_image, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', datetime('now', 'localtime'), datetime('now', 'localtime'))
    `).bind(
      extRefId,
      user.username,
      user.display_name || user.username,
      kong,
      section,
      samnak,
      posTitle,
      phone_location,
      phone_reason,
      todayStr,
      req_phone,
      location_image || null
    ).run()
  } catch (dbErr: any) {
    console.error('D1 Insert Error:', dbErr)
    return c.redirect(`/?msg=${encodeURIComponent('ไม่สามารถบันทึกข้อมูลลงฐานข้อมูล D1 ได้: ' + (dbErr?.message || String(dbErr)))}&type=danger`)
  }

  // 2. ส่ง startApprove ไปยัง CAS (ครบถ้วนตามภาพ: เลขที่อ้างอิง, ผู้ขอ, กอง/สำนัก, สถานที่ติดตั้ง, เหตุผล)
  const requesterDisplay = user.display_name || user.username
  const orgDisplay = `${kong} / ${samnak}`
  const msgForHead = `คำขอติดตั้งโทรศัพท์ภายใน\nเลขที่อ้างอิง: ${extRefId}\nผู้ขอ: ${requesterDisplay}\nกอง / สำนัก: ${orgDisplay}\nสถานที่ติดตั้ง: ${phone_location}\nเหตุผล: ${phone_reason}`

  const msgHtml = `<div style="font-family:sans-serif;max-width:500px;background:#fff;padding:16px;border-radius:10px;border:1px solid #e2e8f0;">
    <h3 style="margin-top:0;color:#1e293b;">คำขอติดตั้งโทรศัพท์ภายใน</h3>
    <table style="border-collapse:collapse;width:100%;font-size:14px;">
      <tr><td style="padding:6px;color:#64748b;width:120px;">เลขที่อ้างอิง</td><td style="padding:6px;font-weight:bold;color:#0f172a;">${extRefId}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:6px;color:#64748b;">ผู้ขอ</td><td style="padding:6px;font-weight:600;color:#0f172a;">${requesterDisplay}</td></tr>
      <tr><td style="padding:6px;color:#64748b;">กอง / สำนัก</td><td style="padding:6px;color:#0f172a;">${orgDisplay}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:6px;color:#64748b;">สถานที่ติดตั้ง</td><td style="padding:6px;color:#0f172a;">${phone_location}</td></tr>
      <tr><td style="padding:6px;color:#64748b;">เหตุผล</td><td style="padding:6px;color:#0f172a;">${phone_reason}</td></tr>
    </table>
  </div>`

  const casClientId = Number(c.env.CAS_CLIENT_ID) || 0
  const casBody = {
    client_id:       casClientId,
    client_secret:   c.env.CAS_CLIENT_SECRET || '',
    ExternalRefID:   extRefId,
    ApproveType:     1,
    Requester_ADUser: user.username,
    CallbackURL:     callbackUrl,
    MsgSubject:      `ขอติดตั้งโทรศัพท์ภายใน — ${extRefId}`,
    MsgForHead:      msgForHead,
    MsgHTMLForHead:  msgHtml,
    MsgFlexForHead: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: `คำขอติดตั้งโทรศัพท์ภายใน`, weight: 'bold', size: 'lg', color: '#1e293b' },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'lg',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                { type: 'text', text: 'เลขที่อ้างอิง', size: 'sm', color: '#888888', flex: 3 },
                { type: 'text', text: extRefId, size: 'sm', weight: 'bold', color: '#111111', flex: 5 }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                { type: 'text', text: 'ผู้ขอ', size: 'sm', color: '#888888', flex: 3 },
                { type: 'text', text: requesterDisplay, size: 'sm', color: '#111111', flex: 5 }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                { type: 'text', text: 'กอง / สำนัก', size: 'sm', color: '#888888', flex: 3 },
                { type: 'text', text: orgDisplay, size: 'sm', color: '#111111', flex: 5, wrap: true }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                { type: 'text', text: 'สถานที่ติดตั้ง', size: 'sm', color: '#888888', flex: 3 },
                { type: 'text', text: phone_location, size: 'sm', color: '#111111', flex: 5, wrap: true }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                { type: 'text', text: 'เหตุผล', size: 'sm', color: '#888888', flex: 3 },
                { type: 'text', text: phone_reason, size: 'sm', color: '#111111', flex: 5, wrap: true }
              ]
            }
          ]
        }
      ]
    }
  }

  let approverName = ''
  try {
    const casRes = await fetch(c.env.CAS_REQUEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(casBody),
      signal: AbortSignal.timeout(10000),
    })

    let casData: any = null
    try {
      casData = await casRes.json()
    } catch {
      const rawText = await casRes.text()
      console.error('CAS non-json response:', rawText)
      return c.redirect(`/?msg=${encodeURIComponent('บันทึกคำขอ ' + extRefId + ' แล้ว แต่ CAS ตอบกลับผิดพลาด: ' + rawText.slice(0, 100))}&type=warn`)
    }

    if (casRes.ok && casData?.success) {
      const d = casData
      approverName = d.HeadFullName || d.ADApprover || ''
      const requestKey = d.RequestKey || ''
      const approverEmail = d.HeadShowEmail || ''

      try {
        await c.env.DB.prepare(`
          UPDATE cas_requests
          SET cas_request_key=?, approver_name=?, approver_email=?, updated_at=datetime('now', 'localtime')
          WHERE ref_id=?
        `).bind(requestKey, approverName, approverEmail, extRefId).run()
      } catch (updErr) {
        console.error('Update D1 error:', updErr)
      }

      const msg = `ส่งคำขอ ${extRefId} เรียบร้อยแล้ว — ผู้อนุมัติคือ ${approverName} (${d.Position || ''}, ${d.Organization || ''}) อีเมล ${d.HeadShowEmail || ''}`
      return c.redirect(`/?msg=${encodeURIComponent(msg)}&type=success`)
    } else {
      const errMsg = casData?.message || casData?.error || casData?.msg || 'CAS ปฏิเสธหรือไม่ตอบสนอง'
      console.error('CAS startApprove failed:', JSON.stringify(casData))
      return c.redirect(`/?msg=${encodeURIComponent('บันทึกคำขอเลขที่ ' + extRefId + ' แล้ว (แต่ CAS แจ้งเตือน: ' + errMsg + ')')}&type=warn`)
    }
  } catch (e: any) {
    console.error('CAS fetch error:', e?.message)
    return c.redirect(`/?msg=${encodeURIComponent('บันทึกคำขอ ' + extRefId + ' ในระบบแล้ว แต่เชื่อมต่อ CAS ไม่สำเร็จ: ' + (e?.message || ''))}&type=warn`)
  }
})

// ── CAS Callback ──────────────────────────────────────────────────────────────
app.get('/cas/callback', async (c) => {
  const extRefId   = c.req.query('ExternalRefID') || ''
  const rawStatus  = c.req.query('status') || ''

  // TODO(CAS): ยืนยัน callback auth scheme กับ IT Dev แล้ว verify signed token ก่อนอัปเดต DB
  // ปัจจุบัน: เรียก RequestStatus เพื่อดึงสถานะที่เชื่อถือได้จาก CAS โดยตรง

  if (!extRefId) {
    return c.html(
      <Layout title="Callback Error">
        <div class="callback-center">
          <div class="callback-card">
            <div class="cb-icon">⚠️</div>
            <div class="cb-title">ข้อมูลไม่ครบ</div>
            <div class="cb-sub">ไม่พบเลขที่อ้างอิงในคำร้อง</div>
          </div>
        </div>
      </Layout>
    )
  }

  // ค้นหาใน D1
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM cas_requests WHERE ref_id = ? LIMIT 1'
  ).bind(extRefId).all<CasRequest>()

  if (!results || results.length === 0) {
    return c.html(
      <Layout title="ไม่พบคำขอ">
        <div class="callback-center">
          <div class="callback-card">
            <div class="cb-icon">❓</div>
            <div class="cb-title">ไม่พบคำขอ</div>
            <div class="cb-sub">ไม่พบเลขที่อ้างอิง {extRefId} ในระบบ</div>
          </div>
        </div>
      </Layout>
    )
  }

  const req = results[0]

  // เรียก RequestStatus เพื่อดึงสถานะที่ authoritative จาก CAS
  let overallStatus = rawStatus
  let approverAD = ''
  let approverName = req.approver_name || ''

  try {
    const casClientId = Number(c.env.CAS_CLIENT_ID) || 0
    const statusRes = await fetch(c.env.CAS_STATUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ client_id: casClientId, ExternalRefID: extRefId }),
      signal: AbortSignal.timeout(10000),
    })
    const statusData: any = await statusRes.json()
    if (statusRes.ok && statusData?.data) {
      overallStatus = statusData.data.Status || overallStatus
      approverAD = statusData.data.Approver_ADUser || ''
    }
  } catch (e) {
    console.error('RequestStatus error:', e)
  }

  // อัปเดต D1 (idempotent — re-sync ปลอดภัย)
  await c.env.DB.prepare(`
    UPDATE cas_requests
    SET status=?, approver_ad=?, status_updated_at=datetime('now','localtime'), updated_at=datetime('now','localtime')
    WHERE ref_id=?
  `).bind(overallStatus, approverAD, extRefId).run()

  const isApprove = overallStatus === 'APPROVE'
  const isReject  = overallStatus === 'REJECT'
  const isPending = overallStatus === 'PENDING'

  return c.html(
    <Layout title={isPending ? 'รอการอนุมัติ' : isApprove ? 'อนุมัติแล้ว' : 'ถูกปฏิเสธ'}>
      <div class="callback-center">
        <div class="callback-card">
          <div class="cb-icon">
            {isPending ? '⏳' : isApprove ? '✅' : '❌'}
          </div>
          <div class="cb-title">
            {isPending ? 'รอการอนุมัติขั้นถัดไป' : isApprove ? 'อนุมัติแล้ว!' : 'ปฏิเสธคำขอ'}
          </div>
          <div class="cb-sub">
            <strong>เลขที่: {extRefId}</strong><br />
            {req.install_location}<br />
            ผู้ขอ: {req.display_name || req.username}<br />
            {approverAD && <>ผู้ดำเนินการ: {approverAD}<br /></>}
            {isPending && 'กำลังรอการพิจารณาจากหัวหน้าขั้นถัดไป'}
            {isApprove && 'คำขอได้รับการอนุมัติจากผู้มีอำนาจเรียบร้อยแล้ว'}
            {isReject  && 'คำขอถูกปฏิเสธ กรุณาติดต่อผู้บังคับบัญชาของท่านเพื่อสอบถามเพิ่มเติม'}
          </div>
          <a href="/" class="btn-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            กลับหน้าหลัก
          </a>
        </div>
      </div>
    </Layout>
  )
})

// ── OAuth Login Flow ──────────────────────────────────────────────────────────
app.get('/login-page', (c) => {
  return c.html(
    <Layout title="เข้าสู่ระบบ — FDnet">
      <div class="login-center">
        <div class="login-card-unified">
          <div class="login-logo-wrap">
            <AppLogo size={74} />
          </div>

          <div class="login-title">FDnet · Call 4141</div>
          <div class="login-subtitle">ระบบขอติดตั้งโทรศัพท์ภายใน</div>

          <div class="login-divider" />

          <h2>เข้าสู่ระบบ</h2>
          <p class="login-desc">เข้าสู่ระบบเพื่อยื่นคำขอและติดตามสถานะการดำเนินงาน</p>

          <a href="/login" class="btn-login">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            เข้าสู่ระบบด้วยบัญชีองค์กร
          </a>

          <div class="login-footer-note">
            Full of Service Mind · Dhammakaya Foundation
          </div>
        </div>
      </div>
    </Layout>
  )
})

app.get('/', async (c, next) => { await next() })

app.get('/login', (c) => {
  const state = randomState()
  setCookie(c, 'oauth_state', state, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 600, path: '/' })
  const { OAUTH_BASE_URI, OAUTH_CLIENT_ID, OAUTH_REDIRECT_URI } = c.env
  const params = new URLSearchParams({ client_id: OAUTH_CLIENT_ID, redirect_uri: OAUTH_REDIRECT_URI, response_type: 'code', state })
  return c.redirect(`${OAUTH_BASE_URI}/oauth/authorize?${params}`)
})

app.get('/callback', async (c) => {
  const code    = c.req.query('code')
  const state   = c.req.query('state')
  const error   = c.req.query('error')

  if (error) return c.redirect(`/login-page?err=${encodeURIComponent(error)}`)

  const storedState = getCookie(c, 'oauth_state')
  deleteCookie(c, 'oauth_state', { path: '/' })
  if (storedState && state && storedState !== state) return c.redirect('/login-page?err=state_mismatch')
  if (!code) return c.redirect('/login-page?err=no_code')

  const { OAUTH_BASE_URI, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI } = c.env

  try {
    const tokenRes = await fetch(`${OAUTH_BASE_URI}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: new URLSearchParams({ grant_type: 'authorization_code', client_id: OAUTH_CLIENT_ID, client_secret: OAUTH_CLIENT_SECRET, redirect_uri: OAUTH_REDIRECT_URI, code }).toString(),
    })
    if (!tokenRes.ok) return c.redirect('/login-page?err=token_error')
    const tokenData: any = await tokenRes.json()

    const userRes = await fetch(`${OAUTH_BASE_URI}/api/user`, {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}`, 'Accept': 'application/json' },
    })
    if (!userRes.ok) return c.redirect('/login-page?err=profile_error')
    const profile = await userRes.json() as UserProfile

    const sessionToken = await sign({ ...profile, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, getSecret(c))
    setCookie(c, 'session', sessionToken, { httpOnly: true, secure: true, sameSite: 'Lax', maxAge: 60 * 60 * 24, path: '/' })
    return c.redirect('/')
  } catch (e) {
    console.error('OAuth callback error:', e)
    return c.redirect('/login-page?err=server_error')
  }
})

app.get('/logout', (c) => {
  deleteCookie(c, 'session', { path: '/' })
  const { OAUTH_BASE_URI } = c.env
  const origin = new URL(c.req.url).origin
  return c.redirect(`${OAUTH_BASE_URI}/logout?redirect_url=${encodeURIComponent(origin + '/login-page')}`)
})

export default app
