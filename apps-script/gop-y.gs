/**
 * WGo – Góp ý & đánh giá cộng đồng (Google Apps Script)
 * Hướng dẫn đầy đủ: docs/09-cong-dong.md
 *
 * Cài một lần:
 *   1. Mở https://script.google.com → Dự án mới → xóa hết code mẫu → dán toàn bộ file này → bấm Lưu.
 *   2. Ở thanh trên, chọn hàm "caiDat" → bấm Chạy → cho phép quyền.
 *   3. Bấm "Nhật ký thực thi", copy đoạn sau dòng "DÁN CHO CLAUDE".
 *
 * Script tạo ra:
 *   - Form "WGo – Đánh giá quán" và Form "WGo – Góp ý" (không cần đăng nhập Google).
 *   - Google Sheet "WGo – Góp ý chờ duyệt (riêng tư)": nơi câu trả lời đổ về, chỉ bạn xem được.
 *   - Tab "danh-gia" trong Sheet dữ liệu WGo: chỉ chứa đánh giá bạn đã duyệt (web đọc từ đây).
 *
 * Duyệt: tick ô "Duyệt ✅" ở Sheet chờ duyệt.
 *   - Đánh giá: tick = lên web, bỏ tick = gỡ khỏi web. Sửa chữ trong dòng đã duyệt thì bản trên web cũng được sửa.
 *   - Góp ý "Gợi ý quán mới": tick = thêm một dòng nháp (đang ẩn) vào tab dia-diem để bạn điền nốt.
 */

const WGO = {
  SHEET_DU_LIEU: '1ricr-8XcL58OSaPFGEcQccu2pV1QMT8fLpOOU7IWeGo',
  THANH_PHO: 'hue',
  MUI_GIO: 'Asia/Ho_Chi_Minh',
};

// Question titles are also the column headers in the response sheets. Don't rename them in the Forms.
const H = {
  MA_QUAN: 'Mã quán',
  TEN_QUAN: 'Tên quán',
  SAO: 'Bạn chấm mấy sao?',
  NHAN_XET: 'Nhận xét',
  TEN: 'Tên hiển thị',
  HIEN_TEN: 'Hiện tên bạn trên WGo?',
  LOAI: 'Bạn muốn góp ý gì?',
  DIA_CHI: 'Địa chỉ hoặc link Google Maps',
  NOI_DUNG: 'Nội dung',
  LIEN_HE: 'Cách liên hệ bạn (không bắt buộc)',
  DUYET: 'Duyệt ✅',
  MA: 'Mã (tự tạo)',
  GHI_CHU: 'Ghi chú WGo',
};
const HIEN_TEN = 'Hiện tên tôi';
const AN_DANH = 'Ẩn danh';
const QUAN_MOI = 'Gợi ý quán mới';
const SHEET_DANH_GIA = 'Đánh giá chờ duyệt';
const SHEET_GOP_Y = 'Góp ý chờ duyệt';
const TAB_DANH_GIA = 'danh-gia';
const COT_DANH_GIA = ['ma', 'quan', 'sao', 'nhan_xet', 'ten', 'ngay'];
const MAX_NHAN_XET = 600;
const MAX_TEN = 40;

// ---------------------------------------------------------------------------
// Cài đặt
// ---------------------------------------------------------------------------

function caiDat() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('SHEET_RIENG')) {
    Logger.log('Đã cài đặt từ trước, không tạo lại. Dưới đây là các link:');
    xemLink();
    return;
  }

  const duLieu = SpreadsheetApp.openById(WGO.SHEET_DU_LIEU);
  if (!duLieu.getSheetByName(TAB_DANH_GIA)) {
    const tab = duLieu.insertSheet(TAB_DANH_GIA);
    tab.getRange('A:F').setNumberFormat('@');
    tab.getRange(1, 1, 1, COT_DANH_GIA.length).setValues([COT_DANH_GIA]).setFontWeight('bold').setBackground('#F2B01E');
    tab.setFrozenRows(1);
  }

  const rieng = SpreadsheetApp.create('WGo – Góp ý chờ duyệt (riêng tư)');
  const formDanhGia = taoFormDanhGia();
  const formGopY = taoFormGopY();
  formDanhGia.setDestination(FormApp.DestinationType.SPREADSHEET, rieng.getId());
  formGopY.setDestination(FormApp.DestinationType.SPREADSHEET, rieng.getId());
  SpreadsheetApp.flush();

  const sheetDanhGia = timSheetCuaForm(rieng.getId(), formDanhGia);
  sheetDanhGia.setName(SHEET_DANH_GIA);
  const sheetGopY = timSheetCuaForm(rieng.getId(), formGopY);
  sheetGopY.setName(SHEET_GOP_Y);
  [sheetDanhGia, sheetGopY].forEach(themCotDuyet);

  const ss = SpreadsheetApp.openById(rieng.getId());
  ss.getSheets().filter((s) => !s.getFormUrl()).forEach((s) => ss.deleteSheet(s));

  props.setProperties({
    SHEET_RIENG: rieng.getId(),
    FORM_DANH_GIA: formDanhGia.getId(),
    FORM_GOP_Y: formGopY.getId(),
  });
  caiLaiTrigger();
  xemLink();
}

// Chạy lại nếu việc duyệt không còn tự đẩy lên Sheet dữ liệu.
function caiLaiTrigger() {
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_RIENG');
  ScriptApp.newTrigger('khiCoTraLoi').forSpreadsheet(id).onFormSubmit().create();
  ScriptApp.newTrigger('khiSua').forSpreadsheet(id).onEdit().create();
  Logger.log('Đã cài trigger cho Sheet chờ duyệt.');
}

function xemLink() {
  const p = PropertiesService.getScriptProperties();
  const danhGia = FormApp.openById(p.getProperty('FORM_DANH_GIA'));
  const gopY = FormApp.openById(p.getProperty('FORM_GOP_Y'));
  Logger.log('Sheet chờ duyệt (riêng tư): ' + SpreadsheetApp.openById(p.getProperty('SHEET_RIENG')).getUrl());
  Logger.log('Form đánh giá (sửa): ' + danhGia.getEditUrl());
  Logger.log('Form góp ý (sửa): ' + gopY.getEditUrl());
  Logger.log('===== DÁN CHO CLAUDE =====\n' + JSON.stringify({
    danhGiaForm: linkDienSan(danhGia),
    gopYForm: linkDienSan(gopY),
  }));
}

function taoFormDanhGia() {
  const f = FormApp.create('WGo – Đánh giá quán');
  f.setDescription('Chấm điểm và nhận xét chỗ bạn đã ghé. WGo đọc và duyệt trước khi hiện trên web. Không cần đăng nhập.');
  f.setCollectEmail(false);
  f.setAllowResponseEdits(false);
  f.setConfirmationMessage('Cảm ơn bạn! WGo sẽ duyệt và đưa đánh giá lên web trong 1–2 ngày.');
  f.addTextItem().setTitle(H.MA_QUAN).setHelpText('WGo tự điền khi bạn bấm từ trang quán. Đừng sửa ô này.').setRequired(true);
  f.addTextItem().setTitle(H.TEN_QUAN).setRequired(true);
  f.addScaleItem().setTitle(H.SAO).setBounds(1, 5).setLabels('Không thích', 'Rất thích').setRequired(true);
  const nhanXet = f.addParagraphTextItem().setTitle(H.NHAN_XET)
    .setHelpText('Món nào ngon, giá có hợp lý không, có mẹo gì… (tối đa ' + MAX_NHAN_XET + ' ký tự)');
  gioiHanDoDai(nhanXet, FormApp.createParagraphTextValidation(), MAX_NHAN_XET);
  const ten = f.addTextItem().setTitle(H.TEN).setHelpText('Tên hoặc biệt danh (tối đa ' + MAX_TEN + ' ký tự).');
  gioiHanDoDai(ten, FormApp.createTextValidation(), MAX_TEN);
  f.addMultipleChoiceItem().setTitle(H.HIEN_TEN)
    .setHelpText('Chọn "Ẩn danh" thì tên bạn không hiện trên web.')
    .setChoiceValues([HIEN_TEN, AN_DANH]).setRequired(true);
  return f;
}

function taoFormGopY() {
  const f = FormApp.create('WGo – Góp ý');
  f.setDescription('Gợi ý quán mới, báo thông tin sai hoặc quán đã đóng. WGo đọc mọi góp ý. Không cần đăng nhập.');
  f.setCollectEmail(false);
  f.setAllowResponseEdits(false);
  f.setConfirmationMessage('Cảm ơn bạn đã góp ý cho WGo!');
  f.addMultipleChoiceItem().setTitle(H.LOAI)
    .setChoiceValues([QUAN_MOI, 'Thông tin quán bị sai', 'Quán đã đóng cửa hoặc chuyển chỗ', 'Góp ý khác cho WGo'])
    .setRequired(true);
  f.addTextItem().setTitle(H.MA_QUAN).setHelpText('WGo tự điền khi bạn bấm từ trang quán. Gợi ý quán mới thì để trống.');
  f.addTextItem().setTitle(H.TEN_QUAN).setHelpText('Gợi ý quán mới: ghi tên quán.');
  f.addTextItem().setTitle(H.DIA_CHI);
  const noiDung = f.addParagraphTextItem().setTitle(H.NOI_DUNG)
    .setHelpText('Quán mới: bán món gì, giờ mở cửa, giá. Thông tin sai: sai chỗ nào, đúng là gì.')
    .setRequired(true);
  gioiHanDoDai(noiDung, FormApp.createParagraphTextValidation(), 1500);
  f.addTextItem().setTitle(H.LIEN_HE).setHelpText('Email hoặc số điện thoại nếu bạn muốn WGo hỏi thêm. Chỉ WGo thấy.');
  return f;
}

// Length limit is a nicety: the web trims long text anyway, so skip it if the builder differs.
function gioiHanDoDai(item, builder, n) {
  try {
    const fn = builder.requireTextLengthLessThanOrEqualTo || builder.requireTextLengthLessThanOrEqual;
    if (fn) item.setValidation(fn.call(builder, n).build());
  } catch (err) {
    Logger.log('Bỏ qua giới hạn độ dài: ' + err);
  }
}

function timSheetCuaForm(ssId, form) {
  for (let lan = 0; lan < 10; lan++) {
    const sheet = SpreadsheetApp.openById(ssId).getSheets().find((s) => {
      const url = s.getFormUrl();
      if (!url) return false;
      if (url.indexOf(form.getId()) !== -1) return true;
      try {
        return FormApp.openByUrl(url).getId() === form.getId();
      } catch (err) {
        return false;
      }
    });
    if (sheet) return sheet;
    Utilities.sleep(1500);
  }
  throw new Error('Không tìm thấy trang trả lời của form "' + form.getTitle() + '". Thử chạy lại caiDat.');
}

function themCotDuyet(sheet) {
  const cot = sheet.getLastColumn() + 1;
  sheet.getRange(1, cot, 1, 3).setValues([[H.DUYET, H.MA, H.GHI_CHU]]).setFontWeight('bold').setBackground('#F2B01E');
  sheet.setFrozenRows(1);
}

function linkDienSan(form) {
  const items = form.getItems();
  const oChu = (tieuDe) => items.find((i) => i.getTitle() === tieuDe).asTextItem();
  return form.createResponse()
    .withItemResponse(oChu(H.MA_QUAN).createResponse('__MA__'))
    .withItemResponse(oChu(H.TEN_QUAN).createResponse('__TEN__'))
    .toPrefilledUrl();
}

// ---------------------------------------------------------------------------
// Tự chạy khi có câu trả lời mới hoặc khi bạn tick duyệt
// ---------------------------------------------------------------------------

function khiCoTraLoi(e) {
  const sheet = e.range.getSheet();
  const dong = docDong(sheet, e.range.getRow());
  sheet.getRange(e.range.getRow(), dong.cot(H.DUYET)).insertCheckboxes();
  sheet.getRange(e.range.getRow(), dong.cot(H.MA)).setValue(maMoi());
}

function khiSua(e) {
  const sheet = e.range.getSheet();
  const tenSheet = sheet.getName();
  if (tenSheet !== SHEET_DANH_GIA && tenSheet !== SHEET_GOP_Y) return;

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    for (let r = Math.max(2, e.range.getRow()); r <= e.range.getLastRow(); r++) {
      const dong = docDong(sheet, r);
      const cotDuyet = dong.cot(H.DUYET);
      const suaCotDuyet = e.range.getColumn() <= cotDuyet && cotDuyet <= e.range.getLastColumn();
      const daDuyet = dong.get(H.DUYET) === true;
      try {
        if (tenSheet === SHEET_DANH_GIA) {
          if (daDuyet) dongBoDanhGia(sheet, r, dong);
          else if (suaCotDuyet) goDanhGia(sheet, r, dong);
        } else if (daDuyet && suaCotDuyet) {
          xuLyGopY(sheet, r, dong);
        }
      } catch (err) {
        ghiChu(sheet, r, dong, '⚠️ Lỗi: ' + err.message);
      }
    }
  } finally {
    lock.releaseLock();
  }
}

function dongBoDanhGia(sheet, r, dong) {
  const ma = layMa(sheet, r, dong);
  const quan = String(dong.get(H.MA_QUAN)).trim();
  const sao = Number(dong.get(H.SAO));
  if (!quan || !(sao >= 1 && sao <= 5)) {
    ghiChu(sheet, r, dong, '⚠️ Thiếu mã quán hoặc số sao, chưa đưa lên web');
    return;
  }
  const hienTen = String(dong.get(H.HIEN_TEN)) === HIEN_TEN;
  const thoiGian = sheet.getRange(r, 1).getValue();
  const giaTri = [
    ma,
    quan,
    String(sao),
    String(dong.get(H.NHAN_XET)).trim().slice(0, MAX_NHAN_XET),
    hienTen ? String(dong.get(H.TEN)).trim().slice(0, MAX_TEN) : '',
    thoiGian instanceof Date ? Utilities.formatDate(thoiGian, WGO.MUI_GIO, 'yyyy-MM-dd') : '',
  ].map(anToan);

  const tab = SpreadsheetApp.openById(WGO.SHEET_DU_LIEU).getSheetByName(TAB_DANH_GIA);
  const viTri = timDong(tab, ma);
  if (viTri) tab.getRange(viTri, 1, 1, giaTri.length).setValues([giaTri]);
  else tab.appendRow(giaTri);
  ghiChu(sheet, r, dong, '✅ Đã duyệt, lên web ở lần cập nhật tới');
}

function goDanhGia(sheet, r, dong) {
  const ma = String(dong.get(H.MA)).trim();
  const tab = SpreadsheetApp.openById(WGO.SHEET_DU_LIEU).getSheetByName(TAB_DANH_GIA);
  const viTri = ma ? timDong(tab, ma) : 0;
  if (viTri) tab.deleteRow(viTri);
  ghiChu(sheet, r, dong, viTri ? 'Đã gỡ khỏi web' : '');
}

function xuLyGopY(sheet, r, dong) {
  if (String(dong.get(H.GHI_CHU)).indexOf('Đã thêm') === 0) return;
  if (String(dong.get(H.LOAI)) !== QUAN_MOI) {
    ghiChu(sheet, r, dong, '✅ Đã xử lý');
    return;
  }
  const tenQuan = String(dong.get(H.TEN_QUAN)).trim();
  if (!tenQuan) {
    ghiChu(sheet, r, dong, '⚠️ Thiếu tên quán, hãy tự thêm vào dia-diem');
    return;
  }

  const tab = SpreadsheetApp.openById(WGO.SHEET_DU_LIEU).getSheetByName('dia-diem');
  const tieuDe = tab.getRange(1, 1, 1, tab.getLastColumn()).getValues()[0].map(String);
  const id = taoId(tenQuan, tab, tieuDe);
  const diaChi = String(dong.get(H.DIA_CHI)).trim();
  const laLink = /^https?:\/\//i.test(diaChi);
  const giaTri = {
    id,
    trang_thai: 'an',
    ten: tenQuan,
    thanh_pho: WGO.THANH_PHO,
    dia_chi: laLink ? '' : diaChi,
    link_google_maps: laLink ? diaChi : '',
    kiem_chung: 'chua',
    nguon: 'Góp ý cộng đồng',
    cap_nhat: Utilities.formatDate(new Date(), WGO.MUI_GIO, 'yyyy-MM-dd'),
  };
  tab.appendRow(tieuDe.map((cot) => anToan(giaTri[cot] || '')));
  const noiDung = String(dong.get(H.NOI_DUNG)).trim();
  if (noiDung) tab.getRange(tab.getLastRow(), tieuDe.indexOf('ten') + 1).setNote('Góp ý: ' + noiDung);
  ghiChu(sheet, r, dong, 'Đã thêm dòng nháp "' + id + '" (đang ẩn) vào dia-diem');
}

// ---------------------------------------------------------------------------
// Tiện ích
// ---------------------------------------------------------------------------

function docDong(sheet, r) {
  const tieuDe = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const giaTri = sheet.getRange(r, 1, 1, tieuDe.length).getValues()[0];
  return {
    cot: (ten) => {
      const i = tieuDe.indexOf(ten);
      if (i === -1) throw new Error('Không thấy cột "' + ten + '". Đừng đổi tên câu hỏi hoặc tiêu đề cột.');
      return i + 1;
    },
    get: (ten) => {
      const i = tieuDe.indexOf(ten);
      return i === -1 ? '' : giaTri[i];
    },
  };
}

function layMa(sheet, r, dong) {
  let ma = String(dong.get(H.MA)).trim();
  if (!ma) {
    ma = maMoi();
    sheet.getRange(r, dong.cot(H.MA)).setValue(ma);
  }
  return ma;
}

const maMoi = () => Utilities.getUuid().slice(0, 8);

function ghiChu(sheet, r, dong, text) {
  sheet.getRange(r, dong.cot(H.GHI_CHU)).setValue(text);
}

function timDong(tab, ma) {
  const cuoi = tab.getLastRow();
  if (cuoi < 2) return 0;
  const i = tab.getRange(2, 1, cuoi - 1, 1).getValues().findIndex((x) => String(x[0]) === ma);
  return i === -1 ? 0 : i + 2;
}

function taoId(ten, tab, tieuDe) {
  const goc = ten.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'quan-moi';
  const cot = tieuDe.indexOf('id') + 1;
  const cuoi = tab.getLastRow();
  const daCo = new Set(cuoi > 1 ? tab.getRange(2, cot, cuoi - 1, 1).getValues().map((x) => String(x[0])) : []);
  let id = goc;
  for (let n = 2; daCo.has(id); n++) id = goc + '-' + n;
  return id;
}

// Answers starting with = + - @ would become spreadsheet formulas; keep them as plain text.
function anToan(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}
