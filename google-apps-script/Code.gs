const LEADS_SHEET_NAME = 'Leads';
const HEADERS = [
  'Lead ID',
  'Submitted At',
  'Last Submitted At',
  'First Name',
  'Email',
  'Normalized Email',
  'Phone',
  'Coaching Interest',
  'Goals',
  'Source',
  'Lead Status',
  'Auto Reply Status',
  'Auto Reply Sent At',
  'Marie Notification Status',
  'Marie Notified At',
  'Submission Count',
  'Last Contacted At',
  'Consultation Date',
  'Internal Notes',
];

const INTEREST_LABELS = {
  'personal-training': 'Personal Training',
  'group-training': 'Group Training',
  'online-coaching': 'Online Coaching',
  'not-sure': "I'm not sure yet",
};

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const properties = PropertiesService.getScriptProperties();

    if (!properties.getProperty('SIGNUP_SHARED_SECRET') || payload.secret !== properties.getProperty('SIGNUP_SHARED_SECRET')) {
      return jsonResponse_({ status: 'error' });
    }

    const lead = normalizeLead_(payload);
    if (!isValidLead_(lead)) {
      return jsonResponse_({ status: 'error' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);

    try {
      const sheet = getLeadsSheet_();
      const existingRow = findLeadRow_(sheet, lead.email);

      if (existingRow) {
        sheet.getRange(existingRow, 3).setValue(new Date());
        const countCell = sheet.getRange(existingRow, 16);
        countCell.setValue((Number(countCell.getValue()) || 1) + 1);
        return jsonResponse_({ status: 'duplicate' });
      }

      const now = new Date();
      const row = [
        Utilities.getUuid(),
        now,
        now,
        lead.firstName,
        lead.email,
        lead.email,
        lead.phone,
        lead.coachingInterestLabel,
        lead.goals,
        lead.source,
        'New',
        'Pending',
        '',
        'Pending',
        '',
        1,
        '',
        '',
        '',
      ];

      sheet.appendRow(row);
      const rowNumber = sheet.getLastRow();
      const delivery = sendLeadEmails_(lead, sheet.getParent().getUrl(), properties);

      sheet.getRange(rowNumber, 12, 1, 4).setValues([[
        delivery.autoReplySent ? 'Sent' : 'Failed',
        delivery.autoReplySent ? new Date() : '',
        delivery.notificationSent ? 'Sent' : 'Failed',
        delivery.notificationSent ? new Date() : '',
      ]]);

      if (!delivery.autoReplySent || !delivery.notificationSent) {
        console.error(JSON.stringify(delivery.errors));
        return jsonResponse_({ status: 'error' });
      }

      return jsonResponse_({ status: 'subscribed' });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonResponse_({ status: 'error' });
  }
}

function setupLeadsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('Open this bound script from the lead spreadsheet before running setupLeadsSheet.');
  }

  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheet.getId());
  const sheet = getLeadsSheet_();
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#3a3430').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, HEADERS.length);
}

function getLeadsSheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID is not configured. Run setupLeadsSheet first.');
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName(LEADS_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(LEADS_SHEET_NAME);
  }

  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (currentHeaders.join('|') !== HEADERS.join('|')) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  return sheet;
}

function findLeadRow_(sheet, normalizedEmail) {
  if (sheet.getLastRow() < 2) {
    return null;
  }

  const match = sheet
    .getRange(2, 6, sheet.getLastRow() - 1, 1)
    .createTextFinder(normalizedEmail)
    .matchEntireCell(true)
    .findNext();

  return match ? match.getRow() : null;
}

function normalizeLead_(payload) {
  const coachingInterest = cleanString_(payload.coachingInterest, 40);
  return {
    firstName: cleanString_(payload.firstName, 80),
    email: cleanString_(payload.email, 254).toLowerCase(),
    phone: cleanString_(payload.phone, 30),
    coachingInterest,
    coachingInterestLabel: INTEREST_LABELS[coachingInterest] || '',
    goals: cleanString_(payload.goals, 1000),
    source: cleanString_(payload.source, 100) || 'buildtoburn.com',
  };
}

function isValidLead_(lead) {
  return Boolean(
    lead.firstName
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)
    && lead.coachingInterestLabel
  );
}

function cleanString_(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function sendLeadEmails_(lead, spreadsheetUrl, properties) {
  const marieEmail = properties.getProperty('MARIE_NOTIFICATION_EMAIL') || 'mflemkul@gmail.com';
  const bookingUrl = properties.getProperty('CONSULTATION_BOOKING_URL') || '';
  const result = { autoReplySent: false, notificationSent: false, errors: [] };

  try {
    MailApp.sendEmail({
      to: lead.email,
      subject: 'Thanks for reaching out to Build to Burn',
      name: 'Marie at Build to Burn',
      replyTo: marieEmail,
      body: buildVisitorPlainText_(lead, bookingUrl),
      htmlBody: buildVisitorHtml_(lead, bookingUrl),
    });
    result.autoReplySent = true;
  } catch (error) {
    result.errors.push('Visitor email: ' + error.message);
  }

  try {
    MailApp.sendEmail({
      to: marieEmail,
      subject: 'New Build to Burn consultation request — ' + lead.firstName,
      name: 'Build to Burn Website',
      replyTo: lead.email,
      body: buildMarieNotification_(lead, spreadsheetUrl),
    });
    result.notificationSent = true;
  } catch (error) {
    result.errors.push('Marie notification: ' + error.message);
  }

  return result;
}

function buildVisitorPlainText_(lead, bookingUrl) {
  const booking = bookingUrl
    ? '\n\nSchedule your free consultation: ' + bookingUrl
    : '\n\nI’ll follow up personally to arrange your free introductory consultation.';

  return 'Hi ' + lead.firstName + ',\n\n'
    + 'Thank you for reaching out to Build to Burn. I’m excited to learn more about you, your goals, and the kind of support you’re looking for.\n\n'
    + 'My approach is centered on personalized, sustainable strength training that meets you where you are—whether you’re beginning your fitness journey, rebuilding strength, or working toward your next performance goal.\n\n'
    + 'I received your request and noted your interest in ' + lead.coachingInterestLabel + '.'
    + booking
    + '\n\nFeel free to reply directly to this email if there’s anything else you’d like me to know.\n\n'
    + 'Talk soon,\n\nMarie\nBuild to Burn\nSan Diego, CA\nhttps://www.build2burn.com';
}

function buildVisitorHtml_(lead, bookingUrl) {
  const safeName = escapeHtml_(lead.firstName);
  const safeInterest = escapeHtml_(lead.coachingInterestLabel);
  const booking = bookingUrl
    ? '<p style="margin:28px 0"><a href="' + escapeHtml_(bookingUrl) + '" style="background:#e85d1f;color:#fff;padding:14px 22px;text-decoration:none;font-weight:600">Schedule Your Free Consultation</a></p>'
    : '<p>I’ll follow up personally to arrange your free introductory consultation.</p>';

  return '<div style="max-width:620px;margin:0 auto;font-family:Arial,sans-serif;color:#3a3430;line-height:1.65">'
    + '<h1 style="font-size:28px;margin-bottom:24px">Thanks for reaching out, ' + safeName + '.</h1>'
    + '<p>Thank you for contacting Build to Burn. I’m excited to learn more about you, your goals, and the kind of support you’re looking for.</p>'
    + '<p>My approach is centered on personalized, sustainable strength training that meets you where you are—whether you’re beginning your fitness journey, rebuilding strength, or working toward your next performance goal.</p>'
    + '<p>I received your request and noted your interest in <strong>' + safeInterest + '</strong>.</p>'
    + booking
    + '<p>Feel free to reply directly to this email if there’s anything else you’d like me to know.</p>'
    + '<p style="margin-top:28px;margin-bottom:14px">Talk soon,<br><strong>Marie</strong><br>Build to Burn<br>San Diego, CA<br><a href="https://www.build2burn.com" style="color:#e85d1f">build2burn.com</a></p>'
    + '<a href="https://www.build2burn.com" style="display:inline-block;text-decoration:none">'
    + '<img src="https://www.build2burn.com/assets/build-to-burn-logo.jpg" alt="Build to Burn" width="130" style="display:block;width:130px;max-width:100%;height:auto;border:0">'
    + '</a>'
    + '</div>';
}

function buildMarieNotification_(lead, spreadsheetUrl) {
  return 'A new consultation request was submitted.\n\n'
    + 'Name: ' + lead.firstName + '\n'
    + 'Email: ' + lead.email + '\n'
    + 'Phone: ' + (lead.phone || 'Not provided') + '\n'
    + 'Coaching interest: ' + lead.coachingInterestLabel + '\n'
    + 'Goals: ' + (lead.goals || 'Not provided') + '\n'
    + 'Source: ' + lead.source + '\n\n'
    + 'Open the lead tracker: ' + spreadsheetUrl;
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
